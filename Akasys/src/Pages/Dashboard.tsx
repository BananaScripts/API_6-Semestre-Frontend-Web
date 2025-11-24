import React, { useState, ChangeEvent, FormEvent } from 'react'

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

// API Base URL and endpoints from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-6-semestre-backend.onrender.com'
const RELATORIOS_ENDPOINT = import.meta.env.VITE_RELATORIOS_ENDPOINT || '/relatorios/enviar'
const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || '/upload'
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        Envie relatórios e faça upload de dados
      </p>

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
