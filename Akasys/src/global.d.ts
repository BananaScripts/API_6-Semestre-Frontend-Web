declare module '*.svg'

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_LOGIN_ENDPOINT: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_USUARIO_ENDPOINT: string
  readonly VITE_VENDAS_ENDPOINT: string
  readonly VITE_ESTOQUE_ENDPOINT: string
  readonly VITE_UPLOAD_ENDPOINT: string
  readonly VITE_RELATORIOS_ENDPOINT: string
  readonly VITE_DEFAULT_SKIP: string
  readonly VITE_DEFAULT_LIMIT: string
  readonly VITE_MAX_LIMIT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
