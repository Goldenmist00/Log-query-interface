const fs = require('fs')
const path = require('path')
const { loadConfig } = require('../config/constants')

const config = loadConfig()

/**
 * Ensures the data directory and logs file exist. Creates empty array file if missing.
 * @returns {void}
 * @throws {Error} If directory or file cannot be created
 */
function ensureDataFile() {
  const dir = path.dirname(config.DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(config.DATA_FILE)) {
    fs.writeFileSync(config.DATA_FILE, '[]', 'utf8')
  }
}

/**
 * Reads all log entries from the JSON file.
 * @returns {Promise<Array<object>>} Array of log objects; empty array if file missing or empty
 * @throws {Error} If file read fails (e.g. invalid JSON)
 */
async function readLogs() {
  ensureDataFile()
  const raw = await fs.promises.readFile(config.DATA_FILE, 'utf8')
  const data = raw.trim() ? JSON.parse(raw) : []
  return Array.isArray(data) ? data : []
}

/**
 * Appends a single log entry to the JSON file (read-modify-write).
 * @param {object} log - Log object to append (must conform to schema)
 * @returns {Promise<object>} The same log object that was stored
 * @throws {Error} If read or write fails
 */
async function appendLog(log) {
  ensureDataFile()
  const logs = await readLogs()
  logs.push(log)
  await fs.promises.writeFile(
    config.DATA_FILE,
    JSON.stringify(logs, null, 2),
    'utf8'
  )
  return log
}

module.exports = { readLogs, appendLog }
