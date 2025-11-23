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
        // TODO: attach token if required, e.g. `${WS_URL}?token=${authToken}`
        ws = new WebSocket(WS_URL)
        ws.onopen = () => {
          reconnectAttempts = 0
          resolve()
        }
        ws.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data)
            // Expect incoming messages to follow ChatMessage shape
            if (data && data.id && data.text) {
              onMessage({ ...data, ts: data.ts ?? Date.now() })
            }
          } catch (err) {
            // If message is plain text, wrap it
            onMessage({ id: String(Math.random()), text: ev.data, sender: 'system', ts: Date.now() })
          }
        }
        ws.onclose = () => {
          ws = null
          if (!isManuallyClosed) {
            // attempt reconnect
            if (reconnectAttempts < MAX_RECONNECT) {
              reconnectAttempts += 1
              const backoff = 500 * reconnectAttempts
              setTimeout(() => open().catch(() => {}), backoff)
            }
          }
        }
        ws.onerror = (err) => {
          // let the caller handle connection errors via component state
          // console.warn('ws error', err)
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
    const msg: ChatMessage = { id: String(Date.now()) + Math.random().toString(36).slice(2), text, sender: 'user', ts: Date.now() }
    ws.send(JSON.stringify(msg))
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
    <div style={{ padding: 12, maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        .chat-box { border:1px solid #e6e6e6; border-radius:8px; display:flex; flex-direction:column; height:400px }
        .messages { padding:12px; overflow:auto; flex:1 }
        .message { margin-bottom:8px; }
        .meta { font-size:12px; color:#666 }
        .controls { display:flex; gap:8px; padding:12px; border-top:1px solid #f1f1f1 }
        input[type="text"] { flex:1; padding:8px; border-radius:6px; border:1px solid #ddd }
        button { padding:8px 12px; border-radius:6px }
      `}</style>

      <h2>Chat</h2>
      <div className="chat-box" role="region" aria-label="Chat" aria-live="polite">
        <div
          className="messages"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          ref={containerRef}
        >
          {messages.length === 0 && <div className="muted">No messages yet.</div>}
          {messages.map((m) => (
            <div key={m.id} className="message" aria-label={`${m.sender} message`}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{m.sender === 'user' ? 'You' : 'System'}</strong>
                <span className="meta">{formatTs(m.ts)}</span>
              </div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="controls">
          <input
            type="text"
            aria-label="Type a message"
            placeholder={connected ? 'Type a message and press Enter' : 'Connecting...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendCurrent()
              }
            }}
            disabled={!connected}
          />
          <button onClick={sendCurrent} disabled={!connected || !input.trim()} aria-disabled={!connected}>
            Send
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: 13 }}>
        <span style={{ marginRight: 12 }}>{connected ? 'Connected' : 'Disconnected'}</span>
        {error && <span style={{ color: 'crimson' }}>Error: {error}</span>}
      </div>

      {/* TODO: Attach auth token to WS_URL or use a secure mechanism before production. */}
      {/* TODO: Wire incoming/outgoing messages format to your backend AI/chat system. */}
    </div>
  )
}
