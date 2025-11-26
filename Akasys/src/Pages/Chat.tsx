import React, { useEffect, useRef, useState } from 'react'

/**
 * ChatMessage interface used across the component and helpers
 */
export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'system'
  ts: number
}

// WebSocket URL from environment variables
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api-6-semestre-backend.onrender.com/wb/chatbot'

/**
 * Minimal WebSocket wrapper with simple reconnection logic.
 * - connect(): opens the socket and returns when opened
 * - disconnect(): closes the socket
 * - sendMessage(text): sends a text message (JSON) over socket
 *
 * TODO: attach auth token (e.g., ?token= or Authorization header via subprotocols) when integrating.
 */
function createWsWrapper(onMessage: (msg: ChatMessage) => void) {
  let ws: WebSocket | null = null
  let reconnectAttempts = 0
  const MAX_RECONNECT = 5
  let isManuallyClosed = false

  function open() {
    isManuallyClosed = false
    return new Promise<void>((resolve, reject) => {
      try {
        ws = new WebSocket(WS_URL)

        ws.onopen = () => {
          reconnectAttempts = 0
          console.log('[WS] Conectado a:', WS_URL)
          resolve()
        }

        ws.onmessage = (ev) => {
          try {
            let raw = ev.data

            // remove BOM + espaços + quebras
            if (typeof raw === 'string') {
              raw = raw.trim().replace(/^\uFEFF/, '')
            }

            let data
            try {
              data = JSON.parse(raw)
              if (typeof data === 'string' && data.startsWith('{') && data.endsWith('}')) {
                data = JSON.parse(data)
              }
            } catch {
              // Não é JSON → tratar como texto simples
              onMessage({
                id: String(Math.random()),
                text: String(raw),
                sender: 'system',
                ts: Date.now()
              })
              return
            }

            let text = ''
            if (data.answer && data.answer.erro) {
              text = String(data.answer.erro);
            }
            else if (typeof data === 'string') {
              text = data

            } else if (data.answer) {
              if (data.answer.resposta) {
                if (Array.isArray(data.answer.resposta)) {
                  text = data.answer.resposta.join('\n')
                } else {
                  text = String(data.answer.resposta)
                }
              } else {
                text = JSON.stringify(data.answer)
              }

            } else if (data.erro) {
              text = String(data.erro)

            } else if (data.text) {
              text = data.text

            } else {
              text = JSON.stringify(data)
            }

            onMessage({
              id: data.id || String(Date.now()) + Math.random().toString(36).slice(2),
              text,
              sender: 'system',
              ts: data.ts || Date.now()
            })

          } catch {
            onMessage({
              id: String(Math.random()),
              text: String(ev.data),
              sender: 'system',
              ts: Date.now()
            })
          }
        }


      } catch (err) {
        reject(err)
      }
    })
  }


  function close() {
    isManuallyClosed = true
    if (ws) {
      ws.close()
      ws = null
    }
  }

  function send(text: string): ChatMessage {
    if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('Socket not open')
    // Backend expects plain text, not a wrapped JSON message.
    ws.send(String(text))
    const msg: ChatMessage = { id: String(Date.now()) + Math.random().toString(36).slice(2), text, sender: 'user', ts: Date.now() }
    return msg
  }

  return { open, close, send }
}

export default function Chat(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<ReturnType<typeof createWsWrapper> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Append message helper
  function pushMessage(msg: ChatMessage) {
    setMessages((m) => [...m, msg])
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    setError(null)
    const wrapper = createWsWrapper((msg) => pushMessage(msg))
    wsRef.current = wrapper
    let mounted = true

    wrapper
      .open()
      .then(() => {
        if (!mounted) return
        setConnected(true)
      })
      .catch((err) => {
        setError('Failed to connect')
        setConnected(false)
      })

    return () => {
      mounted = false
      try {
        wrapper.close()
      } catch (err) {
        // ignore
      }
      setConnected(false)
    }
    // Note: intentionally run once on mount/unmount. If you need to re-open on auth changes, add deps.
  }, [])

  function formatTs(ts: number) {
    const d = new Date(ts)
    return d.toLocaleTimeString()
  }

  function sendCurrent() {
    if (!input.trim()) return
    try {
      const msg = wsRef.current?.send(input)
      if (msg) pushMessage(msg)
      setInput('')
    } catch (err) {
      setError('Not connected')
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
        Chat
      </h1>
      <p style={{
        color: '#94a3b8',
        marginBottom: '32px',
        fontSize: '16px'
      }}>
        Converse com o assistente
      </p>

      <div
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
        }}
        role="region"
        aria-label="Chat"
        aria-live="polite"
      >
        <div
          role="log"
          aria-live="polite"
          aria-atomic="false"
          ref={containerRef}
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {messages.length === 0 && (
            <div style={{
              color: '#64748b',
              textAlign: 'center',
              paddingTop: '40px',
              fontSize: '14px'
            }}>
              Nenhuma mensagem ainda. Comece a conversa!
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
              aria-label={`mensagem de ${m.sender === 'user' ? 'você' : 'sistema'}`}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px'
              }}>
                <strong style={{
                  fontSize: '14px',
                  color: m.sender === 'user' ? '#f1f5f9' : '#94a3b8'
                }}>
                  {m.sender === 'user' ? 'Você' : 'Sistema'}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {formatTs(m.ts)}
                </span>
              </div>
              <div style={{
                backgroundColor: m.sender === 'user' ? '#3b82f6' : '#334155',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '12px',
                maxWidth: '70%',
                wordWrap: 'break-word',
                fontSize: '14px'
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '20px',
          borderTop: '1px solid #334155'
        }}>
          <input
            type="text"
            aria-label="Digite uma mensagem"
            placeholder={connected ? 'Digite uma mensagem e pressione Enter' : 'Conectando...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendCurrent()
              }
            }}
            disabled={!connected}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #475569',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: '#0f172a',
              color: '#f1f5f9'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#64748b'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100, 116, 139, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#475569'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={sendCurrent}
            disabled={!connected || !input.trim()}
            aria-disabled={!connected}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: (!connected || !input.trim()) ? 'not-allowed' : 'pointer',
              opacity: (!connected || !input.trim()) ? 0.4 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (connected && input.trim()) {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }
            }}
            onMouseLeave={(e) => {
              if (connected && input.trim()) {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }
            }}
          >
            Enviar
          </button>
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        fontSize: '13px',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connected ? '#10b981' : '#ef4444'
          }} />
          {connected ? 'Conectado' : 'Desconectado'}
        </span>
        {error && <span style={{ color: '#dc2626' }}>Erro: {error}</span>}
      </div>
    </div>
  )
}
