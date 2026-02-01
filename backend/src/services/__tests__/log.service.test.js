const { ingest, query, validateLogBody } = require('../log.service')
const dbService = require('../../db/db.service')

jest.mock('../../db/db.service')

const validLog = {
  level: 'info',
  message: 'Test message',
  resourceId: 'server-1',
  timestamp: '2024-01-15T10:00:00.000Z',
  traceId: 'trace-1',
  spanId: 'span-1',
  commit: 'abc123',
  metadata: {},
}

describe('log.service - validateLogBody', () => {
  it('returns validated log with normalized level and default metadata', () => {
    const result = validateLogBody(validLog)
    expect(result.level).toBe('info')
    expect(result.message).toBe('Test message')
    expect(result.metadata).toEqual({})
  })

  it('normalizes level to lowercase', () => {
    expect(validateLogBody({ ...validLog, level: 'ERROR' }).level).toBe('error')
  })

  it('accepts metadata object', () => {
    const withMeta = { ...validLog, metadata: { key: 'value' } }
    expect(validateLogBody(withMeta).metadata).toEqual({ key: 'value' })
  })

  it('throws ValidationError when body is missing', () => {
    expect(() => validateLogBody(null)).toThrow('Request body must be a JSON object')
    expect(() => validateLogBody(undefined)).toThrow('Request body must be a JSON object')
  })

  it('throws ValidationError when required field is missing', () => {
    const { message, ...rest } = validLog
    expect(() => validateLogBody(rest)).toThrow('Missing required field: message')
  })

  it('throws ValidationError for invalid level', () => {
    expect(() => validateLogBody({ ...validLog, level: 'invalid' })).toThrow(
      /Invalid level: must be one of/
    )
  })

  it('throws ValidationError for invalid timestamp', () => {
    expect(() => validateLogBody({ ...validLog, timestamp: 'not-a-date' })).toThrow(
      'Invalid timestamp: must be valid ISO 8601 date string'
    )
  })

  it('throws ValidationError when metadata is not an object', () => {
    expect(() => validateLogBody({ ...validLog, metadata: 'string' })).toThrow(
      'Field "metadata" must be an object'
    )
    expect(() => validateLogBody({ ...validLog, metadata: [] })).toThrow(
      'Field "metadata" must be an object'
    )
  })
})

describe('log.service - query (filtering)', () => {
  const mockLogs = [
    {
      level: 'error',
      message: 'Database connection failed',
      resourceId: 'server-1234',
      timestamp: '2024-01-15T14:00:00.000Z',
      traceId: 't1',
      spanId: 's1',
      commit: 'c1',
      metadata: {},
    },
    {
      level: 'info',
      message: 'Request processed',
      resourceId: 'server-1234',
      timestamp: '2024-01-15T12:00:00.000Z',
      traceId: 't2',
      spanId: 's2',
      commit: 'c2',
      metadata: {},
    },
    {
      level: 'warn',
      message: 'High memory usage',
      resourceId: 'server-5678',
      timestamp: '2024-01-14T10:00:00.000Z',
      traceId: 't3',
      spanId: 's3',
      commit: 'c3',
      metadata: {},
    },
  ]

  beforeEach(() => {
    dbService.readLogs.mockResolvedValue([...mockLogs])
  })

  it('returns all logs sorted by timestamp desc when no filters', async () => {
    const result = await query({})
    expect(result).toHaveLength(3)
    expect(result[0].timestamp).toBe('2024-01-15T14:00:00.000Z')
    expect(result[2].timestamp).toBe('2024-01-14T10:00:00.000Z')
  })

  it('filters by level (exact match)', async () => {
    const result = await query({ level: 'error' })
    expect(result).toHaveLength(1)
    expect(result[0].level).toBe('error')
  })

  it('filters by message (case-insensitive substring)', async () => {
    const result = await query({ message: 'database' })
    expect(result).toHaveLength(1)
    expect(result[0].message).toContain('Database')
  })

  it('filters by resourceId (substring)', async () => {
    const result = await query({ resourceId: '1234' })
    expect(result).toHaveLength(2)
    expect(result.every((l) => l.resourceId.includes('1234'))).toBe(true)
  })

  it('filters by timestamp_start', async () => {
    const result = await query({ timestamp_start: '2024-01-15T11:00:00.000Z' })
    expect(result).toHaveLength(2)
    expect(result.every((l) => new Date(l.timestamp).getTime() >= new Date('2024-01-15T11:00:00.000Z').getTime())).toBe(true)
  })

  it('filters by timestamp_end', async () => {
    const result = await query({ timestamp_end: '2024-01-15T13:00:00.000Z' })
    expect(result).toHaveLength(2)
    expect(result.every((l) => new Date(l.timestamp).getTime() <= new Date('2024-01-15T13:00:00.000Z').getTime())).toBe(true)
  })

  it('combines filters with AND', async () => {
    const result = await query({
      level: 'info',
      resourceId: 'server-1234',
    })
    expect(result).toHaveLength(1)
    expect(result[0].level).toBe('info')
    expect(result[0].resourceId).toBe('server-1234')
  })

  it('returns empty array when no match', async () => {
    const result = await query({ level: 'debug' })
    expect(result).toHaveLength(0)
  })
})

describe('log.service - ingest', () => {
  beforeEach(() => {
    dbService.appendLog.mockClear()
  })

  it('validates and calls dbService.appendLog with validated log', async () => {
    const stored = { ...validLog }
    dbService.appendLog.mockResolvedValue(stored)
    const result = await ingest(validLog)
    expect(dbService.appendLog).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        message: 'Test message',
        resourceId: 'server-1',
      })
    )
    expect(result).toEqual(stored)
  })

  it('throws when validation fails', async () => {
    await expect(ingest({})).rejects.toThrow()
    expect(dbService.appendLog).not.toHaveBeenCalled()
  })
})
