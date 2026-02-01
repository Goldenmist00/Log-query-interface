/**
 * WebSocket broadcast: holds the server reference and broadcasts new log to all connected clients.
 * Initialized from index.js with setWss(); controller calls broadcast(log) after successful ingest.
 */
let wss = null

/**
 * Sets the WebSocket server instance (called from index.js).
 * @param {import('ws').WebSocketServer} server - WebSocket server attached to HTTP server
 * @returns {void}
 */
function setWss(server) {
  wss = server
}

/**
 * Broadcasts a log object to all connected WebSocket clients.
 * No-op if server not set or no clients.
 * @param {object} log - Log object (same schema as GET /logs items)
 * @returns {void}
 */
function broadcast(log) {
  if (!wss || typeof log !== 'object') return
  const payload = JSON.stringify(log)
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload)
    }
  })
}

module.exports = { setWss, broadcast }
