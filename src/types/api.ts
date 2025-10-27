// API Types based on Dom Rock Backend API Documentation

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string; // Only for creation/update
}

export interface CreateUsuario {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateUsuario {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Venda {
  id_venda: number;
  data: string; // Date in YYYY-MM-DD format
  cod_cliente: string;
  cod_produto: string;
  lote?: string;
  origem?: string;
  zs_gr_mercad?: string;
  produto?: string;
  zs_centro?: string;
  zs_cidade?: string;
  zs_uf?: string;
  sku?: string;
  zs_peso_liquido?: number;
  giro_sku_cliente?: number;
}

export interface Estoque {
  id_estoque: number;
  data: string; // Date in YYYY-MM-DD format
  cod_cliente: string;
  cod_produto: string;
  es_centro?: string;
  tipo_material?: string;
  origem?: string;
  lote?: string;
  dias_em_estoque?: number;
  produto?: string;
  grupo_mercadoria?: string;
  es_totalestoque?: number;
  sku?: string;
}

export interface EmailRequest {
  email: string;
}

export interface UploadResponse {
  status: string;
  arquivo: string;
  tipo: string;
}

export interface EmailResponse {
  status: string;
  msg: string;
}

export interface HealthResponse {
  status: string;
  msg: string;
}

export interface ApiError {
  detail: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export type UploadType = "vendas" | "estoque";