import { useState, useEffect, useMemo } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Activity, AlertTriangle, Upload, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiService } from "@/services/api";
import { Venda, Estoque } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// NOTA: Insights agora gerados dinamicamente a partir dos dados carregados (até 50 registros cada)
// Heurísticas simples (não IA real) mas úteis para sinalizar padrões imediatos.

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalStock: 0,
    activeClients: 0,
    prevRevenue: 0,
    prevProducts: 0,
    prevActiveClients: 0,
    stockCoverageDays: 0,
    prevStockCoverageDays: 0
  });
  const [health, setHealth] = useState<'ok' | 'erro' | 'carregando'>('carregando');

  // ---- Derivações e Insights Dinâmicos ----
  const computedInsights = useMemo(() => {
    const list: { title: string; description: string; priority: 'high' | 'medium' | 'low'; }[] = [];

    if (!vendas.length && !estoque.length) return list;

    // Helper: agrupar por chave
    const groupSum = <T,>(arr: T[], key: (t: T) => string, value: (t: T) => number) => {
      const map = new Map<string, number>();
      arr.forEach(item => {
        const k = key(item);
        map.set(k, (map.get(k) || 0) + value(item));
      });
      return map;
    };

    // 1. Crescimento de vendas (últimos 7 dias vs 7 dias anteriores)
    if (vendas.length) {
      const byDate = groupSum(vendas, v => v.data, v => v.zs_peso_liquido || 0);
      const dates = Array.from(byDate.keys()).sort();
      const recent = dates.slice(-7);
      const prev = dates.slice(-14, -7);
      const sumRecent = recent.reduce((s, d) => s + (byDate.get(d) || 0), 0);
      const sumPrev = prev.reduce((s, d) => s + (byDate.get(d) || 0), 0);
      if (sumRecent > 0 && sumPrev > 0) {
        const growth = ((sumRecent - sumPrev) / sumPrev) * 100;
        const direction = growth >= 0 ? 'crescimento' : 'queda';
        const absGrowth = Math.abs(growth).toFixed(1);
        list.push({
          title: growth >= 0 ? 'Aceleração de Vendas' : 'Queda Recente em Vendas',
            description: `Volume (peso líquido) ${direction} de ${absGrowth}% comparando últimos ${recent.length} dias vs período anterior. (Recente: ${sumRecent.toFixed(1)} vs Prev: ${sumPrev.toFixed(1)})`,
          priority: Math.abs(growth) > 20 ? 'high' : Math.abs(growth) > 10 ? 'medium' : 'low'
        });
      }
    }

    // 2. Envelhecimento de estoque (itens com dias_em_estoque > 20)
    if (estoque.length) {
      const agingThreshold = 20;
      const agingItems = estoque.filter(e => (e.dias_em_estoque || 0) > agingThreshold);
      const ratio = agingItems.length / estoque.length;
      list.push({
        title: 'Envelhecimento de Estoque',
        description: `${agingItems.length} de ${estoque.length} itens (${(ratio * 100).toFixed(1)}%) acima de ${agingThreshold} dias em estoque.`,
        priority: ratio > 0.5 ? 'high' : ratio > 0.25 ? 'medium' : 'low'
      });
    }

    // 3. Concentração de produto em vendas
    if (vendas.length) {
      const byProduct = groupSum(vendas, v => v.cod_produto, v => v.zs_peso_liquido || 0);
      const total = Array.from(byProduct.values()).reduce((a, b) => a + b, 0);
      if (total > 0) {
        const sorted = Array.from(byProduct.entries()).sort((a, b) => b[1] - a[1]);
        const [topProd, topVal] = sorted[0];
        const share = topVal / total;
        list.push({
          title: 'Concentração de Produto',
          description: `Produto ${topProd} responde por ${(share * 100).toFixed(1)}% do volume de vendas (peso líquido).`,
          priority: share > 0.6 ? 'high' : share > 0.4 ? 'medium' : 'low'
        });
      }
    }

    // 4. Risco de baixa cobertura de estoque (estoque vs vendas recentes)
    if (vendas.length && estoque.length) {
      // Estimar demanda média diária dos últimos N dias (N = distinct dates)
      const datesSet = new Set(vendas.map(v => v.data));
      const days = datesSet.size || 1;
      const totalDemand = vendas.reduce((s, v) => s + (v.zs_peso_liquido || 0), 0);
      const daily = totalDemand / days;
      const totalStock = estoque.reduce((s, e) => s + (e.es_totalestoque || 0), 0);
      if (daily > 0) {
        const coverageDays = totalStock / daily;
        list.push({
          title: 'Cobertura de Estoque',
          description: `Cobertura estimada de ${(coverageDays).toFixed(1)} dias (Estoque: ${totalStock.toFixed(1)} / Demanda diária: ${daily.toFixed(1)}).`,
          priority: coverageDays < 5 ? 'high' : coverageDays < 10 ? 'medium' : 'low'
        });
      }
    }

    // 5. Diversidade de clientes
    if (vendas.length) {
      const byClient = groupSum(vendas, v => v.cod_cliente, v => v.zs_peso_liquido || 0);
      const total = Array.from(byClient.values()).reduce((a, b) => a + b, 0) || 1;
      const sorted = Array.from(byClient.entries()).sort((a, b) => b[1] - a[1]);
      const [topClient, topVal] = sorted[0];
      const share = topVal / total;
      list.push({
        title: 'Concentração de Cliente',
        description: `Cliente ${topClient} responde por ${(share * 100).toFixed(1)}% do volume. Total clientes: ${byClient.size}.`,
        priority: share > 0.5 ? 'high' : share > 0.35 ? 'medium' : 'low'
      });
    }

    return list.slice(0, 5);
  }, [vendas, estoque]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch vendas and estoque data
      const [vendasData, estoqueData, healthResp] = await Promise.all([
        apiService.getVendas({ limit: 50 }),
        apiService.getEstoque({ limit: 50 }),
        apiService.healthCheck().catch(() => null)
      ]);

      setVendas(vendasData);
      setEstoque(estoqueData);

      // Calculate statistics + period comparison (split by date half)
      const totalRevenue = vendasData.reduce((sum, venda) => sum + (venda.zs_peso_liquido || 0), 0);
      const totalProducts = new Set(vendasData.map(v => v.cod_produto)).size;
      const totalStock = estoqueData.reduce((sum, item) => sum + (item.es_totalestoque || 0), 0);
      const activeClients = new Set(vendasData.map(v => v.cod_cliente)).size;

      const dateList = Array.from(new Set(vendasData.map(v => v.data))).sort();
      const half = Math.max(1, Math.floor(dateList.length / 2));
      const prevDateSet = new Set(dateList.slice(0, half));
      const recentDateSet = new Set(dateList.slice(half));
      const prevRevenue = vendasData.filter(v => prevDateSet.has(v.data)).reduce((s, v) => s + (v.zs_peso_liquido || 0), 0);
      const prevProducts = new Set(vendasData.filter(v => prevDateSet.has(v.data)).map(v => v.cod_produto)).size;
      const prevActiveClients = new Set(vendasData.filter(v => prevDateSet.has(v.data)).map(v => v.cod_cliente)).size;

      // Stock coverage (current only)
      const distinctDays = new Set(vendasData.map(v => v.data)).size || 1;
      const dailyDemand = totalRevenue / distinctDays || 0;
      const stockCoverageDays = dailyDemand ? totalStock / dailyDemand : 0;

      setStats({
        totalRevenue,
        totalProducts,
        totalStock,
        activeClients,
        prevRevenue: prevRevenue || totalRevenue,
        prevProducts: prevProducts || totalProducts,
        prevActiveClients: prevActiveClients || activeClients,
        stockCoverageDays,
        prevStockCoverageDays: stockCoverageDays // sem histórico anterior real
      });
      setHealth(healthResp && healthResp.status === 'ok' ? 'ok' : 'erro');

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setHealth('erro');
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pct = (now: number, prev: number) => {
    if (prev === 0) return now > 0 ? 100 : 0;
    return ((now - prev) / prev) * 100;
  };
  const formatChange = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;

  const revenueChange = pct(stats.totalRevenue, stats.prevRevenue);
  const productChange = pct(stats.totalProducts, stats.prevProducts);
  const clientChange = pct(stats.activeClients, stats.prevActiveClients);
  const coverageChange = pct(stats.stockCoverageDays, stats.prevStockCoverageDays);

  const statsCards = [
    {
      title: "Volume (Peso Líquido)",
      value: `${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} kg`,
      change: formatChange(revenueChange),
      changeType: revenueChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      description: "metade recente vs anterior"
    },
    {
      title: "Produtos Únicos",
      value: stats.totalProducts.toString(),
      change: formatChange(productChange),
      changeType: productChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: BarChart3,
      description: "diversidade no período"
    },
    {
      title: "Cobertura Estoque",
      value: `${stats.stockCoverageDays.toFixed(1)} dias`,
      change: formatChange(coverageChange),
      changeType: coverageChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: Activity,
      description: "estoque / demanda"
    },
    {
      title: "Clientes Únicos",
      value: stats.activeClients.toString(),
      change: formatChange(clientChange),
      changeType: clientChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: Users,
      description: "base clientes"
    }
  ];
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
            Dashboard Executivo
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights em tempo real dos seus dados de negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Exportar Relatório
          </Button>
          <Button variant="golden" size="sm">
            Configurar Alertas
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="card-elevation hover:shadow-lg smooth-transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-8 w-8 bg-gradient-to-br from-golden/20 to-blue-dark/20 rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-golden" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                {stat.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendas Table */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-golden" />
                Dados de Vendas Recentes
              </CardTitle>
              <CardDescription>
                Últimas vendas registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando dados...</div>
                </div>
              ) : vendas.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Peso Líquido</TableHead>
                        <TableHead>Centro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendas.slice(0, 10).map((venda) => (
                        <TableRow key={venda.id_venda}>
                          <TableCell>{new Date(venda.data).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{venda.cod_cliente}</TableCell>
                          <TableCell>{venda.produto || venda.cod_produto}</TableCell>
                          <TableCell>{venda.zs_peso_liquido?.toLocaleString('pt-BR') || 'N/A'}</TableCell>
                          <TableCell>{venda.zs_centro || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum dado de vendas encontrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estoque Table */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-golden" />
                Dados de Estoque
              </CardTitle>
              <CardDescription>
                Status atual do estoque por produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando dados...</div>
                </div>
              ) : estoque.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Estoque Total</TableHead>
                        <TableHead>Dias em Estoque</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estoque.slice(0, 10).map((item) => (
                        <TableRow key={item.id_estoque}>
                          <TableCell>{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{item.cod_cliente}</TableCell>
                          <TableCell>{item.produto || item.cod_produto}</TableCell>
                          <TableCell>{item.es_totalestoque?.toLocaleString('pt-BR') || 'N/A'}</TableCell>
                          <TableCell>{item.dias_em_estoque || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum dado de estoque encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dynamic Insights */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="text-base">Insights da IA</CardTitle>
              <CardDescription>
                Análises heurísticas em cima dos dados carregados (máx 50 registros). Indicativas, não preditivas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {computedInsights.length === 0 && (
                <div className="text-xs text-muted-foreground">Sem dados suficientes para gerar insights.</div>
              )}
              {computedInsights.map((insight, index) => (
                <div key={index} className="p-3 rounded-lg border bg-card/50 hover:bg-accent/50 smooth-transition">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge 
                      variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => navigate('/upload')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV (Vendas/Estoque)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => navigate('/reports')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório por Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => fetchDashboardData()}
                disabled={isLoading}
              >
                <Activity className="mr-2 h-4 w-4" />
                Atualizar Dados
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="card-elevation border-golden/20">
            <CardHeader>
              <CardTitle className="text-base text-golden">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>API Backend</span>
                  {health === 'carregando' && <Badge className="bg-muted text-foreground">...</Badge>}
                  {health === 'ok' && <Badge className="bg-green-100 text-green-700 border-green-200">OK</Badge>}
                  {health === 'erro' && <Badge className="bg-red-100 text-red-700 border-red-200">Falha</Badge>}
                </div>
                <div className="flex items-center justify-between">
                  <span>Vendas Carregadas</span>
                  <Badge variant="outline">{vendas.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estoque Carregado</span>
                  <Badge variant="outline">{estoque.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}