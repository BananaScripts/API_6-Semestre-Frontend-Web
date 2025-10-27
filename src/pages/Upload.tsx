import { useState } from "react";
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { UploadType } from "@/types/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface UploadResult {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  result?: any;
}

export default function Upload() {
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [forcedType, setForcedType] = useState<UploadType | ''>('');

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const startingIndex = uploads.length; // current length before adding
    const newUploads: UploadResult[] = Array.from(files).map(file => ({
      file,
      status: 'pending' as const,
      progress: 0
    }));

    // Add new uploads then immediately start them
    setUploads(prev => {
      const combined = [...prev, ...newUploads];
      // Kick off uploads in next microtask to ensure state applied
      queueMicrotask(() => {
        newUploads.forEach((u, offset) => {
          const absoluteIndex = startingIndex + offset;
            uploadFile(u, absoluteIndex);
        });
      });
      return combined;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const uploadFile = async (uploadResult: UploadResult, index: number) => {
    const tipo: UploadType = forcedType || (uploadResult.file.name.toLowerCase().includes('venda') ? 'vendas' : 'estoque');

    setUploads(prev => prev.map((u, i) =>
      i === index ? { ...u, status: 'uploading' as const, progress: 10 } : u
    ));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map((u, i) =>
          i === index && u.status === 'uploading'
            ? { ...u, progress: Math.min(u.progress + 10, 90) }
            : u
        ));
      }, 200);

  const result = await apiService.uploadFile(tipo, uploadResult.file);

      clearInterval(progressInterval);

      setUploads(prev => prev.map((u, i) =>
        i === index ? {
          ...u,
          status: 'success' as const,
          progress: 100,
          result
        } : u
      ));

      toast({
        title: "Upload realizado",
        description: `${uploadResult.file.name} (${tipo}) => ${result.status || 'sucesso'}`,
      });

    } catch (error: any) {
      const backendDetail = error?.response?.data?.detail || error?.detail;
      setUploads(prev => prev.map((u, i) =>
        i === index ? {
          ...u,
          status: 'error' as const,
          progress: 0,
          error: backendDetail || error.message || 'Erro desconhecido'
        } : u
      ));

      toast({
        title: "Erro no upload",
        description: `Falha ao processar ${uploadResult.file.name}. ${backendDetail ? 'Detalhe: ' + backendDetail : ''}`,
        variant: "destructive"
      });
    }
  };

  // Manual start no longer required (auto start on select)
  const startUploads = () => {
    // Kept for backwards compatibility / if needed in future
    uploads.forEach((upload, index) => {
      if (upload.status === 'pending') uploadFile(upload, index);
    });
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status !== 'success'));
  };

  const getStatusIcon = (status: UploadResult['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: UploadResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-700">Enviando</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-700">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
            Upload de Dados
          </h1>
          <p className="text-muted-foreground mt-1">
            Faça upload de arquivos CSV para vendas e estoque
          </p>
        </div>
        <div className="flex gap-2">
          {uploads.length > 0 && (
            <Button variant="outline" onClick={clearCompleted}>
              Limpar Concluídos
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <Card className="card-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5 text-golden" />
            Área de Upload
          </CardTitle>
          <CardDescription>
            Arraste e solte arquivos CSV ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-xs">
            <Select value={forcedType} onValueChange={(v: UploadType) => setForcedType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Detecção automática de tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendas">Forçar Vendas</SelectItem>
                <SelectItem value="estoque">Forçar Estoque</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground mt-1'>Opcional: defina manualmente o tipo antes de enviar.</p>
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-golden bg-golden/5'
                : 'border-muted-foreground/25 hover:border-golden/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Solte seus arquivos CSV aqui
            </p>
            <p className="text-muted-foreground mb-4">
              Suportamos arquivos de vendas e estoque em formato CSV
            </p>
            <input
              type="file"
              multiple
              accept=".csv"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Selecionar Arquivos
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <Card className="card-elevation">
          <CardHeader>
            <CardTitle>Fila de Upload</CardTitle>
            <CardDescription>
              Status dos arquivos selecionados para upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploads.map((upload, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  {getStatusIcon(upload.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{upload.file.name}</p>
                      {getStatusBadge(upload.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {(upload.file.size / 1024).toFixed(1)} KB
                    </p>
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-2" />
                    )}
                    {upload.error && (
                      <p className="text-sm text-red-600 mt-1">{upload.error}</p>
                    )}
                    {upload.status === 'success' && upload.result && (
                      <p className="text-xs text-green-600 mt-1">
                        Arquivo: {upload.result.arquivo || upload.file.name} | Tipo: {upload.result.tipo || '—'} | Status: {upload.result.status || 'sucesso'}
                        {upload.result.linhas && (
                          <> | Linhas: {upload.result.linhas}</>
                        )}
                      </p>
                    )}
                  </div>
                  {upload.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(index)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="card-elevation border-golden/20">
        <CardHeader>
          <CardTitle className="text-golden">Instruções de Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Formatos aceitos:</strong> Apenas arquivos CSV (.csv)
          </div>
          <div>
            <strong>Tipos de arquivo:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Arquivos contendo "venda" no nome serão tratados como dados de vendas</li>
              <li>Outros arquivos CSV serão tratados como dados de estoque</li>
            </ul>
          </div>
          <div>
            <strong>Formato esperado:</strong> Os arquivos devem seguir o formato padrão do sistema
          </div>
        </CardContent>
      </Card>
    </div>
  );
}