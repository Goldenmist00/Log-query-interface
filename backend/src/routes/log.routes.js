/**
 * Log routes: POST /logs (ingest), GET /logs (query with filters).
 * Controllers handle HTTP only; business logic lives in services.
 */
const express = require('express')
const logController = require('../controllers/log.controller')

const router = express.Router()

router.post('/', logController.ingest)
router.get('/', logController.query)

module.exports = router
