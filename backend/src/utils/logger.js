/**
 * Minimal logger: writes to stdout (info) and stderr (error).
 * Avoids console.log in production paths per coding standards.
 */

/**
 * Logs an info message to stdout.
 * @param {string} message - Message to log
 * @param {object} [meta] - Optional metadata (not stringified to avoid noise)
 * @returns {void}
 */
function info(message, meta) {
  const line = meta ? `${message} ${JSON.stringify(meta)}` : message
  process.stdout.write(`${line}\n`)
}

/**
 * Logs an error message to stderr.
 * @param {string} message - Error message
 * @param {Error|object} [err] - Optional error or metadata
 * @returns {void}
 */
function error(message, err) {
  const detail = err instanceof Error ? err.message : (err ? JSON.stringify(err) : '')
  const line = detail ? `${message} ${detail}` : message
  process.stderr.write(`${line}\n`)
}

module.exports = { info, error }
