import { LogEntry, LogEntryData } from './LogEntry'
import { AlertCircle, FileSearch, Loader2 } from 'lucide-react'

interface LogResultsProps {
  logs: LogEntryData[]
  loading: boolean
  error: string | null
}

/**
 * Renders the log results area: error state, loading spinner, empty state, or list of LogEntry components.
 * @param {LogResultsProps} props - logs array, loading flag, error message
 * @returns {JSX.Element} Error UI, loading UI, empty state, or list of log entries
 */
export function LogResults({ logs, loading, error }: LogResultsProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-800/60 dark:bg-red-950/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-red-800 dark:text-red-100">Error loading logs</p>
            <p className="mt-1.5 text-sm text-red-700 dark:text-red-200/90">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading logs...</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex animate-pulse gap-3 rounded-lg border border-border/60 bg-card/50 p-4"
              aria-hidden
            >
              <div className="h-6 w-16 shrink-0 rounded bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-full max-w-[80%] rounded bg-muted" />
                <div className="flex gap-4">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-3 w-28 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
            <FileSearch className="h-7 w-7" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No logs match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the search, level, resource, or time range.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {logs.length} {logs.length === 1 ? 'result' : 'results'}
      </p>
      <div className="space-y-1">
        {logs.map((log) => (
          <LogEntry
            key={`${log.traceId}-${log.spanId}-${log.timestamp}`}
            log={log}
          />
        ))}
      </div>
    </div>
  )
}
