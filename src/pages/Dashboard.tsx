import { BarChart3, TrendingUp, Users, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const statsCards = [
  {
    title: "Receita Total",
    value: "R$ 2,847,392",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs. mês anterior"
  },
  {
    title: "Usuários Ativos",
    value: "34,521",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
    description: "últimos 30 dias"
  },
  {
    title: "Conversões",
    value: "2,847",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: TrendingUp,
    description: "taxa de conversão"
  },
  {
    title: "Performance",
    value: "98.2%",
    change: "+0.8%",
    changeType: "positive" as const,
    icon: Activity,
    description: "uptime do sistema"
  }
];

const insights = [
  {
    title: "Pico de Vendas Identificado",
    description: "Vendas aumentaram 34% nas últimas 48 horas no segmento premium",
    type: "opportunity",
    priority: "high"
  },
  {
    title: "Anomalia no Tráfego",
    description: "Redução de 15% no tráfego orgânico detectada. Investigação recomendada",
    type: "warning",
    priority: "medium"
  },
  {
    title: "Novo Padrão Comportamental",
    description: "Usuários mobile passaram mais 23% de tempo na plataforma",
    type: "insight",
    priority: "low"
  }
];

export default function Dashboard() {
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
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-golden" />
                Análise de Tendências
              </CardTitle>
              <CardDescription>
                Evolução das métricas principais nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Gráfico interativo de tendências</p>
                  <p className="text-xs mt-1">Conecte ao Supabase para dados reais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>Indicadores chave de desempenho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Conversão</span>
                  <span className="font-medium">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfação do Cliente</span>
                  <span className="font-medium">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Eficiência Operacional</span>
                  <span className="font-medium">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="text-base">Insights da IA</CardTitle>
              <CardDescription>Análises automáticas dos seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight, index) => (
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
              <Button variant="outline" className="w-full justify-start" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Gerar Relatório Semanal
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Análise de Segmentação
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Configurar Alertas
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
                  <span>Processamento de Dados</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Externa</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Conectado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>IA Insights</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}