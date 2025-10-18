import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Clock, Mail, Upload } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import apiClient from '@/services/apiClient';

export default function Dashboard() {
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const metrics = [
    { 
      title: 'Vendas Totais', 
      value: 'R$ 245.800', 
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true }
    },
    { 
      title: 'Usuários Ativos', 
      value: '1.234', 
      icon: Users,
      trend: { value: 8.2, isPositive: true }
    },
    { 
      title: 'Taxa de Conversão', 
      value: '3.45%', 
      icon: TrendingUp,
      trend: { value: -2.1, isPositive: false }
    },
    { 
      title: 'Tempo Médio', 
      value: '4m 32s', 
      icon: Clock,
      trend: { value: 5.3, isPositive: true }
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Nova venda processada', time: '2 min atrás', type: 'success' },
    { id: 2, action: 'Usuário cadastrado', time: '15 min atrás', type: 'info' },
    { id: 3, action: 'Relatório gerado', time: '1 hora atrás', type: 'info' },
    { id: 4, action: 'Atualização de estoque', time: '2 horas atrás', type: 'warning' },
  ];

  const stockData = [
    { id: 1, product: 'Produto A', quantity: 150, value: 'R$ 45.000', status: 'Em estoque' },
    { id: 2, product: 'Produto B', quantity: 87, value: 'R$ 26.100', status: 'Em estoque' },
    { id: 3, product: 'Produto C', quantity: 23, value: 'R$ 6.900', status: 'Baixo' },
    { id: 4, product: 'Produto D', quantity: 312, value: 'R$ 93.600', status: 'Em estoque' },
  ];

  const revenueData = [
    { id: 1, month: 'Janeiro', revenue: 'R$ 45.200', growth: '+12%' },
    { id: 2, month: 'Fevereiro', revenue: 'R$ 52.800', growth: '+15%' },
    { id: 3, month: 'Março', revenue: 'R$ 48.300', growth: '+8%' },
    { id: 4, month: 'Abril', revenue: 'R$ 61.500', growth: '+22%' },
  ];

  const handleSendReport = async () => {
    setIsLoadingReport(true);
    try {
      await apiClient.post('/reports/send');
      toast.success('Relatório enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar relatório');
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral dos seus negócios</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSendReport} disabled={isLoadingReport}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoadingReport ? 'Enviando...' : 'Enviar Relatório'}
            </Button>
            
            <label htmlFor="file-upload">
              <Button asChild disabled={isUploading}>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Enviando...' : 'Upload'}
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === 'success' ? 'bg-success' :
                      activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Últimos 4 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Crescimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.month}</TableCell>
                      <TableCell className="font-medium">{item.revenue}</TableCell>
                      <TableCell className="text-right text-success">{item.growth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Estoque</CardTitle>
            <CardDescription>Produtos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Baixo' 
                          ? 'bg-warning/20 text-warning' 
                          : 'bg-success/20 text-success'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
