const logService = require('../services/log.service')
const { QUERY_PARAM_KEYS } = require('../config/constants')
const { broadcast } = require('../ws/broadcast')

/**
 * Handles POST /logs: ingest a single log entry and broadcast to WebSocket clients.
 * @param {import('express').Request} req - Express request (body = log payload)
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
async function ingest(req, res) {
  try {
    const body = req.body
    const log = await logService.ingest(body)
    broadcast(log)
    res.status(201).json(log)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed'
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: message })
    } else {
      res.status(500).json({ error: message })
    }
  }
}

/**
 * Builds filter object from query params (only non-empty string params).
 * Uses QUERY_PARAM_KEYS from config to avoid hardcoded keys.
 * @param {import('express').Request['query']} query - Express req.query
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
 * Handles GET /logs: query logs with optional filters.
 * @param {import('express').Request} req - Express request (query params = filters)
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
async function query(req, res) {
  try {
    const filters = filtersFromQuery(req.query)
    const logs = await logService.query(filters)
    res.status(200).json(logs)
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
    })
  }
}

module.exports = { ingest, query }
