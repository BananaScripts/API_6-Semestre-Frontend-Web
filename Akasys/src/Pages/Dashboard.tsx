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

// Placeholder: implement real API call integration here
export async function sendReportEmail(form: EmailForm): Promise<void> {
  // TODO: implement API call to send email/report
  return new Promise((resolve) => setTimeout(resolve, 800))
}

// Placeholder: implement real upload integration here
export async function uploadFile(type: DatasetType, file: File, onProgress?: (p: number) => void): Promise<void> {
  // TODO: replace mock with real upload to backend / cloud storage
  return new Promise((resolve) => {
    let progress = 0
    const id = setInterval(() => {
      progress += 20
      if (onProgress) onProgress(Math.min(progress, 100))
      if (progress >= 100) {
        clearInterval(id)
        resolve()
      }
    }, 150)
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
    if (!form.recipient) nextErrors.recipient = 'Recipient email is required.'
    else if (!emailRegex.test(form.recipient)) nextErrors.recipient = 'Invalid email format.'
    if (!form.subject) nextErrors.subject = 'Subject is required.'
    if (!form.message) nextErrors.message = 'Message body is required.'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSending(true)
    setSendResult(null)
    try {
      await sendReportEmail(form) // TODO: wire to real API
      setSendResult('Report sent successfully.')
      setForm({ recipient: '', subject: '', message: '' })
    } catch (err) {
      setSendResult('Failed to send report.')
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
      setUploadResult('Only CSV or JSON files are accepted.')
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
      setUploadResult('Please select a file first.')
      return
    }
    setUploading(true)
    setProgress(0)
    setUploadResult(null)
    try {
      await uploadFile(dataset, file, (p) => setProgress(p)) // TODO: integrate with backend
      setUploadResult('Upload complete')
      setFile(null)
      setFileMeta(null)
    } catch (err) {
      setUploadResult('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        .dashboard-grid { display: flex; flex-direction: column; gap: 16px; }
        .card { border: 1px solid #e6e6e6; padding: 16px; border-radius: 8px; background: #fff; }
        .card h2 { margin: 0 0 8px 0; font-size: 16px; }
        .row { display:flex; gap:12px; align-items:center }
        .muted { color: #666; font-size: 14px }
        @media (min-width: 720px) {
          .dashboard-grid { flex-direction: row }
          .card { flex: 1 }
        }
        .progress { height: 8px; background: #f1f1f1; border-radius: 999px; overflow: hidden }
        .progress > i { display:block; height:100%; background: #4f46e5; width:0% }
      `}</style>

      <div className="dashboard-grid">
        {/* Section A: Send Report (Email) */}
        <section className="card" aria-labelledby="send-report-title">
          <h2 id="send-report-title">Send Report (Email)</h2>
          <form onSubmit={handleSend}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Recipient email</div>
              <input
                name="recipient"
                value={form.recipient}
                onChange={handleFormChange}
                type="email"
                aria-invalid={!!errors.recipient}
                aria-describedby={errors.recipient ? 'recipient-error' : undefined}
                required
                style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ddd' }}
              />
            </label>
            {errors.recipient && (
              <div id="recipient-error" style={{ color: 'crimson', marginBottom: 8 }} role="alert">
                {errors.recipient}
              </div>
            )}

            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Subject</div>
              <input
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ddd' }}
              />
            </label>
            {errors.subject && <div style={{ color: 'crimson' }}>{errors.subject}</div>}

            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Message</div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleFormChange}
                required
                rows={5}
                style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ddd' }}
              />
            </label>
            {errors.message && <div style={{ color: 'crimson' }}>{errors.message}</div>}

            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" disabled={sending} style={{ padding: '8px 12px', borderRadius: 6 }}>
                {sending ? 'Sending…' : 'Send Report'}
              </button>
              <div aria-live="polite" style={{ fontSize: 14 }}>
                {sendResult && <span className="muted">{sendResult}</span>}
              </div>
            </div>
          </form>
        </section>

        {/* Section B: Upload Data */}
        <section className="card" aria-labelledby="upload-data-title">
          <h2 id="upload-data-title">Upload Data</h2>
          <form onSubmit={handleUpload}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Dataset type</div>
              <select value={dataset} onChange={(e) => setDataset(e.target.value as DatasetType)} style={{ marginTop: 6, padding: 8, borderRadius: 6 }}>
                <option value="sales">Sales</option>
                <option value="inventory">Inventory</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>File (CSV or JSON)</div>
              <input type="file" accept=".csv,application/json,text/csv" onChange={handleFileChange} style={{ marginTop: 6 }} />
            </label>

            {fileMeta && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 14 }}>Selected file</div>
                <div className="row" style={{ marginTop: 6 }}>
                  <div>
                    <div><strong>{fileMeta.name}</strong></div>
                    <div className="muted">{(fileMeta.size / 1024).toFixed(1)} KB • {fileMeta.type || 'unknown'}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <div className="progress" aria-hidden>
                <i style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }} aria-live="polite">
                {uploading ? `Uploading… ${progress}%` : uploadResult ? uploadResult : ''}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={uploading} style={{ padding: '8px 12px', borderRadius: 6 }}>
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setFileMeta(null)
                  setUploadResult(null)
                  setProgress(0)
                }}
                style={{ padding: '8px 12px', borderRadius: 6 }}
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* TODO: Wire into shared notification system or form validation library as needed. */}
    </div>
  )
}
