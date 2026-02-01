import { useState, useCallback, useEffect } from 'react'
import { LogEntryData } from '@/components/LogEntry'

interface FilterState {
  message: string
  level: string
  resourceId: string
  timestamp_start: string
  timestamp_end: string
}

interface UseLogsReturn {
  logs: LogEntryData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Derives WebSocket URL from API URL (http -> ws, https -> wss).
 * @param {string} apiUrl - Base API URL (e.g. http://localhost:3001)
 * @returns {string} WebSocket URL (e.g. ws://localhost:3001)
 */
function getWsUrl(apiUrl: string): string {
  return apiUrl.replace(/^http/, 'ws')
}

/**
 * Fetches logs from the backend API and subscribes to WebSocket for real-time new logs.
 * Refetches when filters change; new logs from WS are prepended to the list.
 * @param {FilterState} filters - Current filter values (message, level, resourceId, timestamp_start, timestamp_end)
 * @returns {UseLogsReturn} { logs, loading, error, refetch }
 */
export function useLogs(filters: FilterState): UseLogsReturn {
  const [logs, setLogs] = useState<LogEntryData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.message.trim()) {
        params.append('message', filters.message)
      }
      if (filters.level !== 'All') {
        params.append('level', filters.level)
      }
      if (filters.resourceId.trim()) {
        params.append('resourceId', filters.resourceId)
      }
      if (filters.timestamp_start) {
        const startDate = new Date(filters.timestamp_start.trim())
        if (!Number.isNaN(startDate.getTime())) {
          params.append('timestamp_start', startDate.toISOString())
        }
      }
      if (filters.timestamp_end) {
        const endDate = new Date(filters.timestamp_end.trim())
        if (!Number.isNaN(endDate.getTime())) {
          params.append('timestamp_end', endDate.toISOString())
        }
      }

      const queryString = params.toString()
      const url = `${apiUrl}/logs${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setLogs(Array.isArray(data) ? data : data.logs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [filters, apiUrl])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    const wsUrl = getWsUrl(apiUrl)
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data) as LogEntryData
        if (log && typeof log === 'object' && log.level && log.message != null) {
          setLogs((prev) => [log, ...prev])
        }
      } catch {
        // ignore invalid JSON
      }
    }

    return () => {
      ws.close()
    }
  }, [apiUrl])

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  }
}
