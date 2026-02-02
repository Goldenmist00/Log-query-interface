/**
 * Vercel serverless API handler for log ingestion and querying.
 * Handles both POST /api/logs (ingestion) and GET /api/logs (querying).
 */
const cors = require('cors')
const { loadConfig } = require('../backend/src/config/constants')
const logService = require('../backend/src/services/log.service')
const { QUERY_PARAM_KEYS } = require('../backend/src/config/constants')

const config = loadConfig()

// CORS middleware for Vercel
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || config.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

/**
 * Builds filter object from query params (only non-empty string params).
 * @param {object} query - Request query parameters
 * @returns {object} Filters object for logService.query
 */
function filtersFromQuery(query) {
  const filters = {}
  for (const key of QUERY_PARAM_KEYS) {
    const value = query[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      filters[key] = String(value).trim()
    }
  }
  return filters
}

/**
 * Main API handler for Vercel serverless deployment
 */
export default async function handler(req, res) {
  // Handle CORS
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      // Log ingestion
      const body = req.body
      const log = await logService.ingest(body)
      
      // Note: WebSocket broadcasting is not available in serverless
      // Consider using Vercel's Edge Functions or external WebSocket service
      
      return res.status(201).json(log)
    } else if (req.method === 'GET') {
      // Log querying
      const filters = filtersFromQuery(req.query)
      const logs = await logService.query(filters)
      return res.status(200).json(logs)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed'
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: message })
    } else {
      console.error('API Error:', err)
      return res.status(500).json({ error: message })
    }
  }
}