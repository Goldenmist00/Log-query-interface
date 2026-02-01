const path = require('path')

/**
 * Supported log levels and query param keys (single source of truth).
 */
const QUERY_PARAM_KEYS = [
  'level',
  'message',
  'resourceId',
  'timestamp_start',
  'timestamp_end',
  'traceId',
  'spanId',
  'commit',
]

/**
 * Application configuration from environment variables.
 * @typedef {Object} AppConfig
 * @property {number} PORT - Server port
 * @property {string} CORS_ORIGIN - Allowed CORS origin
 * @property {string} DATA_FILE - Absolute path to logs JSON file
 */

/**
 * Loads configuration from process.env with defaults.
 * @returns {AppConfig} Configuration object
 */
function loadConfig() {
  const backendRoot = path.resolve(__dirname, '../..')
  const defaultDataFile = path.join(backendRoot, 'data', 'logs.json')

  return {
    PORT: Number(process.env.PORT) || 3001,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    DATA_FILE: process.env.DATA_FILE
      ? path.resolve(backendRoot, process.env.DATA_FILE)
      : defaultDataFile,
  }
}

module.exports = { loadConfig, QUERY_PARAM_KEYS }
