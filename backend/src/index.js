/**
 * Log Ingestion API entry point.
 * HTTP server with Express (CORS, JSON, /logs routes) and WebSocket server for real-time log push.
 * Config (PORT, CORS_ORIGIN, DATA_FILE) loaded from env via config/constants.
 */
const http = require('http')
const express = require('express')
const cors = require('cors')
const { WebSocketServer } = require('ws')
const { loadConfig } = require('./config/constants')
const logRoutes = require('./routes/log.routes')
const logger = require('./utils/logger')
const { setWss } = require('./ws/broadcast')

const config = loadConfig()
const app = express()

app.use(cors({ origin: config.CORS_ORIGIN }))
app.use(express.json())

app.use('/logs', logRoutes)

const server = http.createServer(app)
const wss = new WebSocketServer({ server })
setWss(wss)

wss.on('connection', () => {
  logger.info('WebSocket client connected')
})

server.listen(config.PORT, () => {
  logger.info(`Log ingestion API listening on port ${config.PORT} (HTTP + WebSocket)`)
})
