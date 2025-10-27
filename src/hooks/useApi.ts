import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { CreateUsuario, UpdateUsuario, Usuario, Venda, Estoque, PaginationParams, EmailRequest, UploadType } from '@/types/api';

// Keys
const keys = {
  vendas: (params: PaginationParams) => ['vendas', params] as const,
  estoque: (params: PaginationParams) => ['estoque', params] as const,
  usuario: (id: number) => ['usuario', id] as const,
};

export function useVendas(params: PaginationParams = { limit: 50 }) {
  return useQuery({
    queryKey: keys.vendas(params),
    queryFn: () => apiService.getVendas(params),
  });
}

export function useEstoque(params: PaginationParams = { limit: 50 }) {
  return useQuery({
    queryKey: keys.estoque(params),
    queryFn: () => apiService.getEstoque(params),
  });
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: keys.usuario(id),
    queryFn: () => apiService.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUsuario) => apiService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });
}

export function useUpdateUsuario(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUsuario) => apiService.updateUser(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuario", userId] });
    }
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => apiService.deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ tipo, file }: { tipo: UploadType; file: File }) => apiService.uploadFile(tipo, file),
  });
}

export function useSendReport() {
  return useMutation({
    mutationFn: ({ emailData, assunto, corpo }: { emailData: EmailRequest; assunto: string; corpo: string }) =>
      apiService.sendReport(emailData, assunto, corpo),
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
  });
}
