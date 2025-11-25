import WebSocket from 'ws'

const WS_URL = 'wss://api-6-semestre-backend.onrender.com/wb/chatbot'

console.log('Connecting to', WS_URL)

const ws = new WebSocket(WS_URL)

ws.on('open', () => {
  console.log('WebSocket open')
  ws.send('Olá do teste do frontend')
})

ws.on('message', (data) => {
  try {
    const text = data.toString()
    console.log('Received:', text)
  } catch (err) {
    console.log('Received non-string data')
  }
  ws.close()
  process.exit(0)
})

ws.on('error', (err) => {
  console.error('WebSocket error:', err && err.message ? err.message : err)
  process.exit(1)
})

setTimeout(() => {
  console.error('No response within timeout; closing')
  try { ws.terminate() } catch (e) {}
  process.exit(2)
}, 8000)
