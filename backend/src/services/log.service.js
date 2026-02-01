const dbService = require('../db/db.service')

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

const LEVELS = ['error', 'warn', 'info', 'debug']
const REQUIRED_STRING_FIELDS = [
  'level',
  'message',
  'resourceId',
  'timestamp',
  'traceId',
  'spanId',
  'commit',
]

/**
 * Sorts an array of log objects by timestamp descending (most recent first).
 * @param {Array<object>} logs - Array of log objects with timestamp
 * @returns {Array<object>} New array sorted by timestamp desc
 */
function sortByTimestampDesc(logs) {
  return [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

/**
 * Validates a log object against the required schema.
 * @param {object} body - Request body to validate
 * @returns {object} Validated log object (with metadata default)
 * @throws {ValidationError} If validation fails, with message describing the failure
 */
function validateLogBody(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be a JSON object')
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (body[field] === undefined || body[field] === null) {
      throw new ValidationError(`Missing required field: ${field}`)
    }
    if (field !== 'metadata' && typeof body[field] !== 'string') {
      throw new ValidationError(`Field "${field}" must be a string`)
    }
  }

  const level = String(body.level).toLowerCase()
  if (!LEVELS.includes(level)) {
    throw new ValidationError(
      `Invalid level: must be one of ${LEVELS.join(', ')}`
    )
  }

  const timestamp = body.timestamp
  const tsDate = new Date(timestamp)
  if (Number.isNaN(tsDate.getTime())) {
    throw new ValidationError('Invalid timestamp: must be valid ISO 8601 date string')
  }

  if (body.metadata !== undefined && (typeof body.metadata !== 'object' || body.metadata === null || Array.isArray(body.metadata))) {
    throw new ValidationError('Field "metadata" must be an object')
  }

  return {
    level,
    message: String(body.message),
    resourceId: String(body.resourceId),
    timestamp: String(body.timestamp),
    traceId: String(body.traceId),
    spanId: String(body.spanId),
    commit: String(body.commit),
    metadata: body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata) ? body.metadata : {},
  }
}

/**
 * Ingests a single log entry: validates and appends to storage.
 * @param {object} body - Raw request body (log payload)
 * @returns {Promise<object>} The stored log object
 * @throws {Error} If validation fails
 */
async function ingest(body) {
  const log = validateLogBody(body)
  return dbService.appendLog(log)
}

/**
 * Applies a single filter to a log (AND logic). Returns true if log matches.
 * @param {object} log - Log entry
 * @param {string} key - Filter key (e.g. message, level)
 * @param {string} value - Filter value
 * @returns {boolean}
 */
function matchesFilter(log, key, value) {
  if (!value || (typeof value === 'string' && !value.trim())) return true

  const str = String(value).trim().toLowerCase()

  switch (key) {
    case 'message':
      return String(log.message || '').toLowerCase().includes(str)
    case 'level':
      return String(log.level || '').toLowerCase() === str
    case 'resourceId':
      return String(log.resourceId || '').toLowerCase().includes(str)
    case 'traceId':
      return String(log.traceId || '').toLowerCase().includes(str)
    case 'spanId':
      return String(log.spanId || '').toLowerCase().includes(str)
    case 'commit':
      return String(log.commit || '').toLowerCase().includes(str)
    case 'timestamp_start': {
      const logTime = new Date(log.timestamp).getTime()
      const startTime = new Date(value).getTime()
      if (Number.isNaN(startTime)) return true
      return logTime >= startTime
    }
    case 'timestamp_end': {
      const logTime = new Date(log.timestamp).getTime()
      const endTime = new Date(value).getTime()
      if (Number.isNaN(endTime)) return true
      return logTime <= endTime
    }
    default:
      return true
  }
}

/**
 * Queries logs with optional filters; all filters combined with AND.
 * Result sorted in reverse chronological order by timestamp.
 * @param {object} filters - Query params as object (e.g. { message, level, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit })
 * @returns {Promise<Array<object>>} Filtered and sorted array of log objects
 */
async function query(filters) {
  const logs = await dbService.readLogs()
  if (!filters || typeof filters !== 'object') {
    return sortByTimestampDesc(logs)
  }

  const filtered = logs.filter((log) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue
      if (!matchesFilter(log, key, value)) return false
    }
    return true
  })

  return sortByTimestampDesc(filtered)
}

module.exports = { ingest, query, validateLogBody }
