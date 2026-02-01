import { useState, useEffect } from 'react'
import { FilterBar, FilterState } from '@/components/FilterBar'
import { LogResults } from '@/components/LogResults'
import { useLogs } from '@/hooks/useLogs'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

const THEME_KEY = 'theme'

/**
 * Returns whether the document is in dark mode (has .dark on root).
 * @returns {boolean}
 */
function getIsDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

/**
 * Log Query Interface page: header, filter bar, and log results. Holds filter state and passes it to useLogs and FilterBar.
 * @returns {JSX.Element} Full-page layout with header, FilterBar, and LogResults
 */
function App() {
  const [filters, setFilters] = useState<FilterState>({
    message: '',
    level: 'All',
    resourceId: '',
    timestamp_start: '',
    timestamp_end: '',
  })

  const [isDark, setIsDark] = useState(() => getIsDark())

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem(THEME_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem(THEME_KEY, 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  const { logs, loading, error } = useLogs(filters)

  return (
    <div className="flex flex-col h-screen bg-background antialiased">
      <header className="shrink-0 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 py-4">
        <div className="max-w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Log Query</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Search and filter application logs</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <div className="shrink-0 sticky top-0 z-10 bg-background">
        <FilterBar onFiltersChange={setFilters} />
      </div>
      <main className="flex-1 min-h-0 overflow-y-auto">
        <LogResults logs={logs} loading={loading} error={error} />
      </main>
    </div>
  )
}

export default App
