import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Exported helper types
export type DatasetType = 'sales' | 'inventory'

export interface EmailForm {
  recipient: string
  subject: string
  message: string
}

export interface FileMetadata {
  name: string
  size: number // bytes
  type: string
}

export function getFileMetadata(file: File): FileMetadata {
  return { name: file.name, size: file.size, type: file.type }
}

// Format timestamp to readable date
function formatTimestamp(timestamp: string | number): string {
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return String(timestamp)
    
    const month = date.toLocaleString('pt-BR', { month: 'short' })
    const year = date.getFullYear()
    return `${month.charAt(0).toUpperCase() + month.slice(1)}/${year}`
  } catch {
    return String(timestamp)
  }
}

// API Base URL and endpoints from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-6-semestre-backend.onrender.com'
const RELATORIOS_ENDPOINT = import.meta.env.VITE_RELATORIOS_ENDPOINT || '/relatorios/enviar'
const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || '/upload'
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'
const DASH_TOP_PRODUTOS = import.meta.env.VITE_DASH_TOP_PRODUTOS || '/dash/top-produtos'
const DASH_VENDAS_MENSAIS = import.meta.env.VITE_DASH_VENDAS_MENSAIS || '/dash/vendas-mensais'
const DASH_ESTOQUE_CLIENTES = import.meta.env.VITE_DASH_ESTOQUE_CLIENTES || '/dash/estoque-clientes'

// Fetch dashboard data
async function fetchDashboardData<T>(endpoint: string): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`)
  }
  return response.json()
}

// Send report email to backend (improved error extraction)
export async function sendReportEmail(form: EmailForm): Promise<string> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  const url = new URL(RELATORIOS_ENDPOINT, API_BASE_URL)
  url.searchParams.append('assunto', form.subject)
  if (form.message) {
    url.searchParams.append('corpo', form.message)
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ email: form.recipient })
  })

  if (!response.ok) {
    let errMsg = response.statusText
    try {
      const data = await response.json()
      if (data && data.detail) errMsg = data.detail
      else if (data && data.msg) errMsg = data.msg
    } catch (e) {
      // ignore parse errors
    }
    throw new Error(`Falha ao enviar relatório: ${errMsg}`)
  }

  // parse success response and return message when available
  try {
    const data = await response.json()
    if (data && (data.msg || data.status)) return data.msg || data.status
  } catch (e) {
    // ignore parse errors and fallthrough to default message
  }
  return 'Relatório enviado com sucesso.'
}
// Upload file to backend
export async function uploadFile(type: DatasetType, file: File, onProgress?: (p: number) => void): Promise<void> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const tipoMap: Record<DatasetType, string> = { sales: 'vendas', inventory: 'estoque' }
  const tipo = tipoMap[type] || 'vendas'

  const url = `${API_BASE_URL}${UPLOAD_ENDPOINT}/${tipo}`

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return
      const percent = Math.round((ev.loaded / ev.total) * 100)
      if (onProgress) onProgress(percent)
    }

    xhr.onload = () => {
      const status = xhr.status
      if (status >= 200 && status < 300) {
        if (onProgress) onProgress(100)
        resolve()
      } else {
        let msg = xhr.statusText || `HTTP ${status}`
        try {
          const json = xhr.response && typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.responseText || '{}')
          if (json && json.detail) msg = json.detail
        } catch (e) {
          // ignore parse errors
        }
        reject(new Error(`Upload failed: ${msg}`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.onabort = () => reject(new Error('Upload aborted'))

    const formData = new FormData()
    formData.append('file', file)
    try {
      xhr.send(formData)
    } catch (err) {
      reject(err)
    }
  })
}

export default function Dashboard(): JSX.Element {
  // Email form state
  const [form, setForm] = useState<EmailForm>({ recipient: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof EmailForm, string>>>({})
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  // Upload state
  const [dataset, setDataset] = useState<DatasetType>('sales')
  const [file, setFile] = useState<File | null>(null)
  const [fileMeta, setFileMeta] = useState<FileMetadata | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<string | null>(null)

  // Dashboard data state
  const [topProdutos, setTopProdutos] = useState<any[]>([])
  const [vendasMensais, setVendasMensais] = useState<any[]>([])
  const [estoqueClientes, setEstoqueClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load dashboard data on mount
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      
      // Mock data as fallback
      const mockProdutos = [
        { produto: 'Produto A', quantidade: 150 },
        { produto: 'Produto B', quantidade: 120 },
        { produto: 'Produto C', quantidade: 95 },
        { produto: 'Produto D', quantidade: 80 },
        { produto: 'Produto E', quantidade: 65 }
      ]
      const mockVendas = [
        { mes: 'Jan', total: 15000 },
        { mes: 'Fev', total: 18000 },
        { mes: 'Mar', total: 22000 },
        { mes: 'Abr', total: 19500 },
        { mes: 'Mai', total: 25000 },
        { mes: 'Jun', total: 28000 }
      ]
      const mockEstoque = [
        { cliente: 'Cliente A', quantidade: 500 },
        { cliente: 'Cliente B', quantidade: 300 },
        { cliente: 'Cliente C', quantidade: 250 },
        { cliente: 'Cliente D', quantidade: 180 },
        { cliente: 'Cliente E', quantidade: 120 }
      ]

      try {
        // Fetch all endpoints in parallel
        const [produtos, vendas, estoque] = await Promise.all([
          fetchDashboardData<any>(DASH_TOP_PRODUTOS + '?limit=5').catch(() => null),
          fetchDashboardData<any>(DASH_VENDAS_MENSAIS).catch(() => null),
          fetchDashboardData<any>(DASH_ESTOQUE_CLIENTES).catch(() => null)
        ])
        
        console.log('📊 Top Produtos (raw):', produtos)
        console.log('📈 Vendas Mensais (raw):', vendas)
        console.log('🏢 Estoque Clientes (raw):', estoque)
        
        // Parse top produtos - normalize property names
        let produtosData = mockProdutos
        if (produtos) {
          const rawData = produtos.value || produtos.data || (Array.isArray(produtos) ? produtos : [])
          if (rawData.length > 0) {
            produtosData = rawData.map((item: any) => ({
              produto: item.produto || item.name || item.product || 'Desconhecido',
              quantidade: item.total_vendido || item.quantidade || item.quantity || item.total || 0
            }))
          }
        }
        
        // Parse vendas mensais - format timestamps
        let vendasData = mockVendas
        if (vendas) {
          const rawData = vendas.value || vendas.data || (Array.isArray(vendas) ? vendas : [])
          if (rawData.length > 0) {
            vendasData = rawData.map((item: any) => ({
              mes: item.mes ? formatTimestamp(item.mes) : (item.month || item.date || 'N/A'),
              total: item.total_vendido || item.total || item.value || item.vendas || 0
            }))
          }
        }
        
        // Parse estoque por cliente - normalize
        let estoqueData = mockEstoque
        if (estoque) {
          const rawData = estoque.value || estoque.data || (Array.isArray(estoque) ? estoque : [])
          if (rawData.length > 0) {
            estoqueData = rawData.map((item: any) => ({
              cliente: String(item.cliente || item.client || item.customer || item.id || 'ID'),
              quantidade: item.total_estoque || item.quantidade || item.quantity || item.stock || 0
            }))
          }
        }
        
        console.log('📊 Top Produtos (parsed):', produtosData)
        console.log('📈 Vendas Mensais (parsed):', vendasData)
        console.log('🏢 Estoque Clientes (parsed):', estoqueData)
        
        setTopProdutos(produtosData)
        setVendasMensais(vendasData)
        setEstoqueClientes(estoqueData)
        
      } catch (err) {
        console.error('❌ Erro crítico ao carregar dashboard:', err)
        // Use mock data on critical error
        setTopProdutos(mockProdutos)
        setVendasMensais(mockVendas)
        setEstoqueClientes(mockEstoque)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // Basic email regex for client-side check (simple, not RFC-complete)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSendResult(null)
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    // client-side validation
    const nextErrors: Partial<Record<keyof EmailForm, string>> = {}
    if (!form.recipient) nextErrors.recipient = 'O e-mail do destinatário é obrigatório.'
    else if (!emailRegex.test(form.recipient)) nextErrors.recipient = 'Formato de e-mail inválido.'
    if (!form.subject) nextErrors.subject = 'O assunto é obrigatório.'
    if (!form.message) nextErrors.message = 'A mensagem é obrigatória.'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSending(true)
    setSendResult(null)
    try {
        const serverMsg = await sendReportEmail(form)
        setSendResult(serverMsg || 'Relatório enviado com sucesso.')
      setForm({ recipient: '', subject: '', message: '' })
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        setSendResult(errMsg || 'Falha ao enviar relatório.')
    } finally {
      setSending(false)
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      setFile(null)
      setFileMeta(null)
      return
    }
    // Accept CSV or JSON
    const allowed = ['text/csv', 'application/json', 'text/plain']
    // Some CSVs may come as text/plain; allow by extension check as fallback
    if (!allowed.includes(f.type) && !/\.csv$/i.test(f.name) && !/\.json$/i.test(f.name)) {
      setUploadResult('Apenas arquivos CSV ou JSON são aceitos.')
      setFile(null)
      setFileMeta(null)
      return
    }
    setFile(f)
    setFileMeta(getFileMetadata(f))
    setUploadResult(null)
  }

  async function handleUpload(e?: FormEvent) {
    e?.preventDefault()
    if (!file) {
      setUploadResult('Por favor, selecione um arquivo primeiro.')
      return
    }
    setUploading(true)
    setProgress(0)
    setUploadResult(null)
    try {
      await uploadFile(dataset, file, (p) => setProgress(p))
      setUploadResult('Upload completo')
      setFile(null)
      setFileMeta(null)
    } catch (err) {
      setUploadResult('Falha no upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        marginBottom: '8px',
        color: '#f1f5f9'
      }}>
        Dashboard
      </h1>
      <p style={{ 
        color: '#94a3b8', 
        marginBottom: '32px',
        fontSize: '16px'
      }}>
        Visualize métricas, envie relatórios e faça upload de dados
      </p>

      {/* Charts Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          Carregando gráficos...
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Top Produtos */}
          <section 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#f1f5f9' }}>
              📊 Top Produtos
            </h3>
            {topProdutos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                Nenhum dado disponível
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProdutos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="produto" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
            )}
          </section>

          {/* Vendas Mensais */}
          <section 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#f1f5f9' }}>
              📈 Vendas Mensais
            </h3>
            {vendasMensais.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                Nenhum dado disponível
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vendasMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total de Vendas" />
              </LineChart>
            </ResponsiveContainer>
            )}
          </section>

          {/* Estoque por Cliente */}
          <section 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#f1f5f9' }}>
              🏢 Estoque por Cliente
            </h3>
            {estoqueClientes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                Nenhum dado disponível
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={estoqueClientes.slice(0, 8)}
                  dataKey="quantidade"
                  nameKey="cliente"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  label
                >
                  {estoqueClientes.slice(0, 8).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'][index % 8]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
            )}
          </section>
        </div>
      )}

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        flex: 1
      }}>
        {/* Section A: Send Report (Email) */}
        <section 
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          aria-labelledby="send-report-title"
        >
          <h2 
            id="send-report-title"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              color: '#f1f5f9'
            }}
          >
            📧 Enviar Relatório
          </h2>
          <form onSubmit={handleSend}>
            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#374151'
              }}>
                E-mail do destinatário
              </div>
              <input
                name="recipient"
                value={form.recipient}
                onChange={handleFormChange}
                type="email"
                aria-invalid={!!errors.recipient}
                aria-describedby={errors.recipient ? 'recipient-error' : undefined}
                required
                placeholder="destinatario@exemplo.com"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000000'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </label>
            {errors.recipient && (
              <div id="recipient-error" style={{ color: '#dc2626', marginBottom: '12px', fontSize: '13px' }} role="alert">
                {errors.recipient}
              </div>
            )}

            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Assunto
              </div>
              <input
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                required
                placeholder="Assunto do e-mail"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000000'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </label>
            {errors.subject && <div style={{ color: '#dc2626', marginBottom: '12px', fontSize: '13px' }}>{errors.subject}</div>}

            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#cbd5e1'
              }}>
                Mensagem
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleFormChange}
                required
                rows={5}
                placeholder="Digite sua mensagem..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000000'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </label>
            {errors.message && <div style={{ color: '#dc2626', marginBottom: '12px', fontSize: '13px' }}>{errors.message}</div>}

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                type="submit" 
                disabled={sending} 
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: '10px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!sending) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!sending) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                {sending ? 'Enviando…' : 'Enviar Relatório'}
              </button>
              {sendResult && (
                <span style={{ 
                  fontSize: 14,
                  color: sendResult.includes('sucesso') ? '#059669' : '#dc2626'
                }}>
                  {sendResult}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Section B: Upload Data */}
        <section 
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          aria-labelledby="upload-data-title"
        >
          <h2 
            id="upload-data-title"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              color: '#f1f5f9'
            }}
          >
            📤 Upload de Dados
          </h2>
          <form onSubmit={handleUpload}>
            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#cbd5e1'
              }}>
                Tipo de conjunto de dados
              </div>
              <select 
                value={dataset} 
                onChange={(e) => setDataset(e.target.value as DatasetType)} 
                style={{ 
                  width: '100%',
                  padding: '12px', 
                  borderRadius: '10px',
                  border: '1px solid #475569',
                  fontSize: '14px',
                  backgroundColor: '#0f172a',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#64748b'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#475569'
                }}
              >
                <option value="sales">Vendas</option>
                <option value="inventory">Estoque</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#cbd5e1'
              }}>
                Arquivo (CSV ou JSON)
              </div>
              <input 
                type="file" 
                accept=".csv,application/json,text/csv" 
                onChange={handleFileChange} 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            </label>

            {fileMeta && (
              <div style={{ 
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#0f172a',
                borderRadius: '10px',
                border: '1px solid #475569'
              }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '6px', color: '#f1f5f9' }}>
                  Arquivo selecionado
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                  <strong>{fileMeta.name}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: '4px' }}>
                  {(fileMeta.size / 1024).toFixed(1)} KB • {fileMeta.type || 'desconhecido'}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                height: 8, 
                backgroundColor: '#334155', 
                borderRadius: 999, 
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: '#3b82f6', 
                  width: `${progress}%`,
                  transition: 'width 0.3s'
                }} />
              </div>
              <div style={{ fontSize: 13, marginTop: '8px', color: '#94a3b8' }}>
                {uploading ? `Enviando… ${progress}%` : uploadResult ? uploadResult : ''}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                disabled={uploading} 
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: '10px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!uploading) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!uploading) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                {uploading ? 'Enviando…' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setFileMeta(null)
                  setUploadResult(null)
                  setProgress(0)
                }}
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: '#cbd5e1',
                  border: '1px solid #475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Limpar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
