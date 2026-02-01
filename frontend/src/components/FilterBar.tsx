import { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronDown, Clock, Search, RotateCcw, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const LEVEL_OPTIONS = [
  { value: 'All', label: 'All levels', dot: null },
  { value: 'error', label: 'Error', dot: 'bg-red-500' },
  { value: 'warn', label: 'Warning', dot: 'bg-amber-500' },
  { value: 'info', label: 'Info', dot: 'bg-blue-500' },
  { value: 'debug', label: 'Debug', dot: 'bg-zinc-500' },
] as const

const TIME_PRESETS = [
  { label: 'Last 1h', hours: 1 },
  { label: 'Last 24h', hours: 24 },
  { label: 'Last 7d', hours: 24 * 7 },
] as const

/** Format Date for display (e.g. hints). */
function toDatetimeLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

/** Format Date for datetime-local input value (YYYY-MM-DDTHH:mm). */
function toDatetimeLocalValue(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}`
}

function isValidDateString(value: string): boolean {
  if (!value.trim()) return false
  const d = new Date(value.trim())
  return !Number.isNaN(d.getTime())
}

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  message: string
  level: string
  resourceId: string
  timestamp_start: string
  timestamp_end: string
}

/**
 * Renders the filter bar for log query (message search, level, resourceId, timestamp range).
 * Notifies parent when filters change so the log list can refetch.
 * @param {FilterBarProps} props - onFiltersChange callback to update parent filter state
 * @returns {JSX.Element} Filter bar UI
 */
export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [levelOpen, setLevelOpen] = useState(false)
  const levelRef = useRef<HTMLDivElement>(null)
  const startPickerRef = useRef<HTMLInputElement>(null)
  const endPickerRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<FilterState>({
    message: '',
    level: 'All',
    resourceId: '',
    timestamp_start: '',
    timestamp_end: '',
  })

  const [debouncedMessage, setDebouncedMessage] = useState(filters.message)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMessage(filters.message)
    }, 350)
    return () => clearTimeout(timer)
  }, [filters.message])

  useEffect(() => {
    onFiltersChange({
      ...filters,
      message: debouncedMessage,
    })
  }, [debouncedMessage, filters.level, filters.resourceId, filters.timestamp_start, filters.timestamp_end, onFiltersChange])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (levelRef.current && !levelRef.current.contains(target)) {
        setLevelOpen(false)
      }
    }
    function handleFocusOutside(event: FocusEvent) {
      const target = event.target as Node
      if (levelRef.current && !levelRef.current.contains(target)) {
        setLevelOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setLevelOpen(false)
    }
    if (levelOpen) {
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('focusin', handleFocusOutside, true)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
        document.removeEventListener('focusin', handleFocusOutside, true)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [levelOpen])

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, message: e.target.value }))
  }

  const handleLevelSelect = (value: string) => {
    setFilters(prev => ({ ...prev, level: value }))
    setLevelOpen(false)
  }

  const selectedLevel = LEVEL_OPTIONS.find((o) => o.value === filters.level) ?? LEVEL_OPTIONS[0]

  const handleResourceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, resourceId: e.target.value }))
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, timestamp_start: e.target.value }))
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, timestamp_end: e.target.value }))
  }

  const handleStartPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) setFilters(prev => ({ ...prev, timestamp_start: toDatetimeLocal(new Date(value)) }))
  }

  const handleEndPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) setFilters(prev => ({ ...prev, timestamp_end: toDatetimeLocal(new Date(value)) }))
  }

  const openStartPicker = () => startPickerRef.current?.showPicker?.()
  const openEndPicker = () => endPickerRef.current?.showPicker?.()

  const clearStartTime = () => {
    setFilters(prev => ({ ...prev, timestamp_start: '' }))
  }
  const clearEndTime = () => {
    setFilters(prev => ({ ...prev, timestamp_end: '' }))
  }

  const handleTimePreset = (hours: number) => {
    const end = new Date()
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000)
    setFilters(prev => ({
      ...prev,
      timestamp_start: toDatetimeLocalValue(start),
      timestamp_end: toDatetimeLocalValue(end),
    }))
  }

  const handleClearFilters = () => {
    const cleared = {
      message: '',
      level: 'All',
      resourceId: '',
      timestamp_start: '',
      timestamp_end: '',
    }
    setFilters(cleared)
    setDebouncedMessage('')
    onFiltersChange(cleared)
  }

  return (
    <div className="w-full border-b border-border bg-card/80 px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Filters</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Search message</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Full-text search..."
                value={filters.message}
                onChange={handleMessageChange}
                className="h-9 pl-8 bg-secondary/80 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5" ref={levelRef}>
            <label className="text-xs font-medium text-muted-foreground">Level</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLevelOpen((o) => !o)}
                className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-secondary/80 px-3 text-left text-sm text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-offset-background"
                aria-haspopup="listbox"
                aria-expanded={levelOpen}
                aria-label="Select log level"
              >
                <span className="flex items-center gap-2 truncate">
                  {selectedLevel.dot && (
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${selectedLevel.dot}`}
                      aria-hidden
                    />
                  )}
                  {selectedLevel.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${levelOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {levelOpen && (
                <ul
                  className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full min-w-[10rem] overflow-auto rounded-md border border-border bg-card py-1 shadow-lg focus:outline-none"
                  role="listbox"
                >
                  {LEVEL_OPTIONS.map((option) => {
                    const isSelected = filters.level === option.value
                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleLevelSelect(option.value)}
                        className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/80 focus:outline-none ${isSelected ? 'bg-muted/60' : ''}`}
                      >
                      {option.dot ? (
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${option.dot}`}
                          aria-hidden
                        />
                      ) : (
                        <span className="h-2 w-2 shrink-0" aria-hidden />
                      )}
                      <span className="truncate">{option.label}</span>
                    </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Resource ID</label>
            <Input
              placeholder="e.g. server-1234"
              value={filters.resourceId}
              onChange={handleResourceIdChange}
              className="h-9 bg-secondary/80 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Time range
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {TIME_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTimePreset(preset.hours)}
                    className="rounded-md border border-border bg-secondary/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-offset-background"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Type date and time (e.g. 2024-01-15 14:30 or Jan 15, 2024 2:30 PM) or click the calendar to pick.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">From</span>
                  <div className="relative flex items-center gap-1">
                    <input
                      ref={startPickerRef}
                      type="datetime-local"
                      value={isValidDateString(filters.timestamp_start) ? toDatetimeLocalValue(new Date(filters.timestamp_start.trim())) : ''}
                      onChange={handleStartPickerChange}
                      className="absolute left-0 top-0 h-0 w-0 opacity-0 pointer-events-none"
                      aria-hidden
                      tabIndex={-1}
                    />
                    <button
                      type="button"
                      onClick={openStartPicker}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                      aria-label="Open calendar for start date and time"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <div className="relative flex flex-1 items-center min-w-0">
                      <input
                        type="text"
                        value={filters.timestamp_start}
                        onChange={handleStartDateChange}
                        className="h-9 w-full min-w-0 rounded-md border border-border bg-secondary/80 pl-2.5 pr-9 text-xs text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/50 focus:ring-offset-0 focus:ring-offset-background"
                        aria-label="Start date and time"
                        aria-invalid={filters.timestamp_start ? !isValidDateString(filters.timestamp_start) : undefined}
                        placeholder="e.g. 2024-01-15 14:30 or Jan 15, 2:30 PM"
                      />
                      {filters.timestamp_start && (
                        <button
                          type="button"
                          onClick={clearStartTime}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                          aria-label="Clear start time"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {filters.timestamp_start && !isValidDateString(filters.timestamp_start) && (
                    <span className="text-[10px] text-red-400">Invalid date — use e.g. 2024-01-15 14:30</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">To</span>
                  <div className="relative flex items-center gap-1">
                    <input
                      ref={endPickerRef}
                      type="datetime-local"
                      value={isValidDateString(filters.timestamp_end) ? toDatetimeLocalValue(new Date(filters.timestamp_end.trim())) : ''}
                      onChange={handleEndPickerChange}
                      className="absolute left-0 top-0 h-0 w-0 opacity-0 pointer-events-none"
                      aria-hidden
                      tabIndex={-1}
                    />
                    <button
                      type="button"
                      onClick={openEndPicker}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                      aria-label="Open calendar for end date and time"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <div className="relative flex flex-1 items-center min-w-0">
                      <input
                        type="text"
                        value={filters.timestamp_end}
                        onChange={handleEndDateChange}
                        className="h-9 w-full min-w-0 rounded-md border border-border bg-secondary/80 pl-2.5 pr-9 text-xs text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/50 focus:ring-offset-0 focus:ring-offset-background"
                        aria-label="End date and time"
                        aria-invalid={filters.timestamp_end ? !isValidDateString(filters.timestamp_end) : undefined}
                        placeholder="e.g. 2024-01-15 18:00 or Jan 15, 6:00 PM"
                      />
                      {filters.timestamp_end && (
                        <button
                          type="button"
                          onClick={clearEndTime}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                          aria-label="Clear end time"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {filters.timestamp_end && !isValidDateString(filters.timestamp_end) && (
                    <span className="text-[10px] text-red-400">Invalid date — use e.g. 2024-01-15 18:00</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
