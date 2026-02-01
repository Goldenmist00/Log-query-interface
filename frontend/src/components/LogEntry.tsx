import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface LogEntryData {
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  resourceId: string
  timestamp: string
  traceId: string
  spanId: string
  commit: string
  metadata?: Record<string, unknown>
}

interface LogEntryProps {
  log: LogEntryData
}

/* Border and badge colors: darker in light mode, softer in dark mode */
const levelBorderColors: Record<LogEntryData['level'], string> = {
  error: 'border-l-red-600 dark:border-l-red-500',
  warn: 'border-l-amber-600 dark:border-l-amber-500',
  info: 'border-l-blue-600 dark:border-l-blue-500',
  debug: 'border-l-zinc-600 dark:border-l-zinc-500',
}

const levelBadgeColors: Record<LogEntryData['level'], string> = {
  error: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
  warn: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
  info: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
  debug: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-500/15 dark:text-zinc-400 dark:border-zinc-500/30',
}

/**
 * Renders a single log entry with level badge, message, resourceId, timestamp, traceId, spanId, commit, and optional expandable metadata.
 * @param {LogEntryProps} props - log object conforming to LogEntryData
 * @returns {JSX.Element} Log row with level-based styling
 */
export function LogEntry({ log }: LogEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <div
      className={`group rounded-lg border border-border/70 border-l-4 bg-card/50 px-4 py-3 transition-colors hover:bg-card/80 ${levelBorderColors[log.level]}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${levelBadgeColors[log.level]}`}
        >
          {log.level}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm leading-snug text-foreground break-words">
            {log.message}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono text-foreground/90">{log.resourceId}</span>
            <span className="font-mono">{formatDate(log.timestamp)}</span>
            <span className="truncate font-mono" title={log.traceId}>
              trace: {log.traceId}
            </span>
            <span className="truncate font-mono" title={log.spanId}>
              span: {log.spanId}
            </span>
            {log.commit && (
              <span className="font-mono">
                commit: {log.commit}
              </span>
            )}
          </div>
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
                Metadata
              </button>
              {isExpanded && (
                <pre className="mt-2 rounded-md border border-border/60 bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
