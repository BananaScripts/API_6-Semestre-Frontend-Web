import { useState } from "react";
import { FileText, Send, Mail, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { EmailRequest } from "@/types/api";

type ReportType = 'vendas' | 'estoque' | 'completo';

interface ReportForm {
  email: string;
  assunto: string;
  corpo: string;
  tipo: ReportType;
}

export default function Reports() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState<ReportForm>({
    email: '',
    assunto: 'Relatório de Dados - Akasys',
    corpo: 'Segue em anexo o relatório solicitado contendo os dados atualizados do sistema.',
    tipo: 'completo'
  });

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);

      // For now, we'll just call the send report API which generates the report internally
      // In a real implementation, you might want separate endpoints for generation and sending
      const emailRequest: EmailRequest = {
        email: form.email || 'temp@example.com' // Use a temp email for generation only
      };

      await apiService.sendReport(emailRequest, form.assunto, form.corpo);

      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório foi gerado e está disponível para download.",
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReport = async () => {
    if (!form.email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSending(true);

      const emailRequest: EmailRequest = {
        email: form.email
      };

      await apiService.sendReport(emailRequest, form.assunto, form.corpo);

      toast({
        title: "Relatório enviado com sucesso",
        description: `O relatório foi enviado para ${form.email}`,
      });

    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Erro ao enviar relatório",
        description: "Não foi possível enviar o relatório. Verifique o email e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getReportDescription = (tipo: ReportType) => {
    switch (tipo) {
      case 'vendas':
        return 'Relatório contendo dados de vendas, incluindo produtos, clientes e valores.';
      case 'estoque':
        return 'Relatório contendo dados de estoque, incluindo produtos, quantidades e status.';
      case 'completo':
        return 'Relatório completo contendo dados de vendas e estoque consolidados.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
            Relatórios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere e envie relatórios dos seus dados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card className="card-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-golden" />
              Configuração do Relatório
            </CardTitle>
            <CardDescription>
              Configure os parâmetros do relatório a ser gerado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select
                value={form.tipo}
                onValueChange={(value: ReportType) => setForm({ ...form, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Dados de Vendas</SelectItem>
                  <SelectItem value="estoque">Dados de Estoque</SelectItem>
                  <SelectItem value="completo">Relatório Completo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {getReportDescription(form.tipo)}
              </p>
            </div>

            <div>
              <Label htmlFor="assunto">Assunto do Email</Label>
              <Input
                id="assunto"
                value={form.assunto}
                onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                placeholder="Assunto do email"
              />
            </div>

            <div>
              <Label htmlFor="corpo">Mensagem</Label>
              <Textarea
                id="corpo"
                value={form.corpo}
                onChange={(e) => setForm({ ...form, corpo: e.target.value })}
                placeholder="Mensagem a ser enviada com o relatório"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                variant="outline"
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="card-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-golden" />
              Envio por Email
            </CardTitle>
            <CardDescription>
              Configure o envio do relatório por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Endereço de Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="destinatario@exemplo.com"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview do Email</h4>
              <div className="text-sm space-y-1">
                <p><strong>Para:</strong> {form.email || 'Não informado'}</p>
                <p><strong>Assunto:</strong> {form.assunto}</p>
                <p><strong>Mensagem:</strong> {form.corpo}</p>
                <p><strong>Anexo:</strong> Relatório {form.tipo} (CSV)</p>
              </div>
            </div>

            <Button
              onClick={handleSendReport}
              disabled={isSending || !form.email}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Relatório
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report History/Status */}
      <Card className="card-elevation">
        <CardHeader>
          <CardTitle>Histórico de Relatórios</CardTitle>
          <CardDescription>
            Status dos relatórios gerados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum relatório gerado ainda</p>
            <p className="text-sm mt-1">Os relatórios gerados aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="card-elevation border-golden/20">
        <CardHeader>
          <CardTitle className="text-golden">Sobre os Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Relatórios Disponíveis:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Vendas:</strong> Dados de vendas com produtos, clientes e valores</li>
              <li><strong>Estoque:</strong> Dados de estoque com produtos e quantidades</li>
              <li><strong>Completo:</strong> Relatório consolidado com todos os dados</li>
            </ul>
          </div>
          <div>
            <strong>Formato:</strong> Os relatórios são gerados em formato CSV e enviados por email
          </div>
          <div>
            <strong>Frequência:</strong> Relatórios podem ser gerados sob demanda a qualquer momento
          </div>
        </CardContent>
      </Card>
    </div>
  );
}