import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { LogEntryData } from './LogEntry'
import { TrendingUp, AlertTriangle, Info, Bug, Zap } from 'lucide-react'

interface AnalyticsDashboardProps {
  logs: LogEntryData[]
  loading: boolean
}

interface LogLevelStats {
  level: string
  count: number
  percentage: number
  icon: React.ReactNode
  gradient: string
}

interface TimeSeriesData {
  time: string
  error: number
  warn: number
  info: number
  debug: number
}

const LEVEL_CONFIG = {
  error: { 
    color: '#ef4444', 
    lightColor: '#fef2f2',
    darkColor: '#7f1d1d',
    icon: <AlertTriangle className="w-4 h-4" />,
    gradient: 'from-red-500 to-red-600'
  },
  warn: { 
    color: '#f59e0b', 
    lightColor: '#fffbeb',
    darkColor: '#78350f',
    icon: <Zap className="w-4 h-4" />,
    gradient: 'from-amber-500 to-orange-500'
  },
  info: { 
    color: '#3b82f6', 
    lightColor: '#eff6ff',
    darkColor: '#1e3a8a',
    icon: <Info className="w-4 h-4" />,
    gradient: 'from-blue-500 to-blue-600'
  },
  debug: { 
    color: '#6b7280', 
    lightColor: '#f9fafb',
    darkColor: '#374151',
    icon: <Bug className="w-4 h-4" />,
    gradient: 'from-gray-500 to-gray-600'
  }
} as const

/**
 * Analytics dashboard showing log statistics by level.
 * Displays interactive charts, metrics cards, and trend analysis.
 */
export function AnalyticsDashboard({ logs, loading }: AnalyticsDashboardProps) {
  // Calculate log statistics by level with enhanced data
  const stats = useMemo(() => {
    if (!logs.length) return []

    const levelCounts = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const total = logs.length
    
    return Object.entries(levelCounts)
      .map(([level, count]) => {
        const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
        return {
          level: level.charAt(0).toUpperCase() + level.slice(1),
          count,
          percentage: Math.round((count / total) * 100),
          icon: config?.icon || <Info className="w-4 h-4" />,
          gradient: config?.gradient || 'from-gray-500 to-gray-600'
        }
      })
      .sort((a, b) => b.count - a.count) // Sort by count descending
  }, [logs])

  // Calculate time series data for trend analysis
  const timeSeriesData = useMemo(() => {
    if (!logs.length) return []

    // Group logs by hour for the last 24 hours or by day if span is longer
    const now = new Date()
    const timeGroups: Record<string, Record<string, number>> = {}
    
    logs.forEach(log => {
      const logDate = new Date(log.timestamp)
      const hourKey = `${logDate.getHours()}:00`
      
      if (!timeGroups[hourKey]) {
        timeGroups[hourKey] = { error: 0, warn: 0, info: 0, debug: 0 }
      }
      timeGroups[hourKey][log.level] = (timeGroups[hourKey][log.level] || 0) + 1
    })

    return Object.entries(timeGroups)
      .map(([time, counts]) => ({ time, ...counts }))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [logs])

  const totalLogs = logs.length
  const criticalLogs = logs.filter(log => log.level === 'error').length
  const warningLogs = logs.filter(log => log.level === 'warn').length
  
  const timeRange = useMemo(() => {
    if (!logs.length) return null
    
    const timestamps = logs.map(log => new Date(log.timestamp).getTime())
    const earliest = new Date(Math.min(...timestamps))
    const latest = new Date(Math.max(...timestamps))
    
    return {
      start: earliest.toLocaleDateString(),
      end: latest.toLocaleDateString()
    }
  }, [logs])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl border border-border/50 p-8 shadow-lg">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
            <div className="h-6 bg-muted rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-80 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!totalLogs) {
    return (
      <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl border border-border/50 p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Analytics Dashboard
          </h3>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No Data Available</h4>
          <p className="text-muted-foreground max-w-md mx-auto">
            No logs to analyze. Try adjusting your filters or ingesting some logs to see analytics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl border border-border/50 p-8 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Analytics Dashboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time insights from your log data
            </p>
          </div>
        </div>
        {timeRange && (
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{totalLogs} Total Logs</p>
            <p className="text-xs text-muted-foreground">
              {timeRange.start === timeRange.end ? timeRange.start : `${timeRange.start} - ${timeRange.end}`}
            </p>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/20 dark:border-blue-800/20 rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold text-foreground">{totalLogs.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-200/20 dark:border-red-800/20 rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical Errors</p>
              <p className="text-2xl font-bold text-foreground">{criticalLogs.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/20 dark:border-amber-800/20 rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-foreground">{warningLogs.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/20 dark:border-green-800/20 rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {totalLogs > 0 ? ((criticalLogs / totalLogs) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Info className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Enhanced Bar Chart */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 hover:shadow-lg transition-all duration-300">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Log Distribution by Level
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {stats.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${entry.level}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LEVEL_CONFIG[entry.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280'} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={LEVEL_CONFIG[entry.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280'} stopOpacity={0.3}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis 
                  dataKey="level" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`${value} logs`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {stats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${entry.level})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Donut Chart */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 hover:shadow-lg transition-all duration-300">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Percentage Breakdown
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {stats.map((entry, index) => (
                    <linearGradient key={`pie-gradient-${index}`} id={`pie-gradient-${entry.level}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={LEVEL_CONFIG[entry.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280'} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={LEVEL_CONFIG[entry.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280'} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ level, percentage }) => `${level}: ${percentage}%`}
                  labelLine={false}
                  fontSize={11}
                  className="font-medium"
                >
                  {stats.map((entry, index) => (
                    <Cell 
                      key={`pie-cell-${index}`} 
                      fill={`url(#pie-gradient-${entry.level})`}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} logs (${props.payload.percentage}%)`, 
                    props.payload.level
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Table */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 hover:shadow-lg transition-all duration-300">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          Detailed Statistics
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {stats.map((stat, index) => (
                <tr key={stat.level} className="hover:bg-muted/20 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ 
                          backgroundColor: LEVEL_CONFIG[stat.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280' 
                        }}
                      ></div>
                      <div className="flex items-center space-x-2">
                        {stat.icon}
                        <span className="text-sm font-medium text-foreground">
                          {stat.level}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-foreground">
                      {stat.count.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-foreground">
                      {stat.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted/30 rounded-full h-2 max-w-24">
                        <div 
                          className="h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${stat.percentage}%`,
                            backgroundColor: LEVEL_CONFIG[stat.level.toLowerCase() as keyof typeof LEVEL_CONFIG]?.color || '#6b7280'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}