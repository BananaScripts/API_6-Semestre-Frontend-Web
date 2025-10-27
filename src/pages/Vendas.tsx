import { useState } from 'react';
import { useVendas } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export default function VendasPage() {
  const [page, setPage] = useState(0);
  const limit = 25;
  const { data, isLoading, isError } = useVendas({ skip: page * limit, limit });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">Vendas</h1>
        <p className="text-muted-foreground mt-1">Lista de registros de vendas importados</p>
      </div>
      <Card className="card-elevation">
        <CardHeader>
          <CardTitle>Registros</CardTitle>
          <CardDescription>Últimos itens (máx 100)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-32 text-muted-foreground"><Loader2 className='h-5 w-5 animate-spin mr-2'/> Carregando...</div>
          )}
          {isError && (
            <div className="text-red-500">Erro ao carregar vendas.</div>
          )}
          {data && data.length === 0 && !isLoading && (
            <div className="text-muted-foreground">Nenhum dado.</div>
          )}
          {data && data.length > 0 && (
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
                  {data.map(v => (
                    <TableRow key={v.id_venda}>
                      <TableCell>{new Date(v.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{v.cod_cliente}</TableCell>
                      <TableCell>{v.produto || v.cod_produto}</TableCell>
                      <TableCell>{v.zs_peso_liquido ?? 'N/A'}</TableCell>
                      <TableCell>{v.zs_centro ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4 text-sm">
                <div>
                  Página <span className="font-medium">{page + 1}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || isLoading}
                    className="px-3 py-1 rounded border bg-background disabled:opacity-40"
                  >Anterior</button>
                  <button
                    onClick={() => setPage(p => (data.length < limit ? p : p + 1))}
                    disabled={isLoading || data.length < limit}
                    className="px-3 py-1 rounded border bg-background disabled:opacity-40"
                  >Próxima</button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
