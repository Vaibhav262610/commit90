import { useState } from 'react'
import { ChevronLeft, Check, X } from 'lucide-react'
import type { Challenge, ChallengeDay } from '../types'
import type { Screen } from '../App'
import { cn } from '../utils/cn'
import { updateDayStatus, getWorkoutForDay } from '../utils/challengeUtils'
import { storageService } from '../services/storage'

interface CalendarProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
  onRefresh: () => void
}

interface CalendarCell {
  date: number | null
  day: ChallengeDay | null
  isCurrentMonth: boolean
}

interface CalendarMonth {
  key: string
  name: string
  cells: CalendarCell[]
}

function buildCalendarMonths(days: ChallengeDay[]): CalendarMonth[] {
  if (days.length === 0) return []

  // Group days by month
  const daysByMonth = days.reduce((acc, day) => {
    const date = new Date(day.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(day)
    return acc
  }, {} as Record<string, ChallengeDay[]>)

  // Build calendar grid for each month
  return Object.entries(daysByMonth).map(([monthKey, monthDays]) => {
    const firstDay = new Date(monthDays[0].date)
    const year = firstDay.getFullYear()
    const month = firstDay.getMonth()
    
    const monthName = firstDay.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })

    // Get first day of month and last day of month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Get day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    
    // Create map of dates to challenge days
    const dayMap = new Map<string, ChallengeDay>()
    monthDays.forEach(day => {
      const date = new Date(day.date)
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      dayMap.set(dateKey, day)
    })

    // Build calendar cells
    const cells: CalendarCell[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ date: null, day: null, isCurrentMonth: false })
    }
    
    // Add cells for each day of the month
    for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
      const dateKey = `${year}-${month}-${date}`
      const challengeDay = dayMap.get(dateKey)
      
      cells.push({
        date,
        day: challengeDay || null,
        isCurrentMonth: true
      })
    }
    
    return {
      key: monthKey,
      name: monthName,
      cells
    }
  })
}

export function Calendar({ challenge, onNavigate, onRefresh }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null)

  // Group days by month and build proper calendar grid
  const calendarMonths = buildCalendarMonths(challenge.days)

  const handleDayClick = (day: ChallengeDay) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)

    // Allow interaction with today and all past days
    if (dayDate.getTime() <= today.getTime() && day.status !== 'future') {
      setSelectedDay(day)
    }
  }

  const handleMarkComplete = async () => {
    if (!selectedDay) return

    const updatedChallenge = updateDayStatus(challenge, selectedDay.dayNumber, 'completed')
    await storageService.saveChallenge(updatedChallenge)
    setSelectedDay(null)
    onRefresh()
  }

  const handleMarkSkipped = async () => {
    if (!selectedDay) return

    const updatedChallenge = updateDayStatus(challenge, selectedDay.dayNumber, 'skipped')
    await storageService.saveChallenge(updatedChallenge)
    setSelectedDay(null)
    onRefresh()
  }

  const handleMarkRest = async () => {
    if (!selectedDay) return

    const updatedChallenge = updateDayStatus(challenge, selectedDay.dayNumber, 'rest')
    await storageService.saveChallenge(updatedChallenge)
    setSelectedDay(null)
    onRefresh()
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-3 p-4 lg:p-6">
          <button
            onClick={() => onNavigate('home')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Calendar</h1>
            <p className="text-sm text-muted-foreground">Track your gym days and rest days</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Legend */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <LegendItem color="bg-primary" label="Gym Day (Completed)" icon="✓" />
            <LegendItem color="bg-destructive" label="Skipped" icon="✕" />
            <LegendItem color="bg-blue-500" label="Today" icon="●" />
            <LegendItem color="bg-muted" label="Rest Day" icon="○" />
            <LegendItem color="bg-secondary border border-border" label="Future / Not Set" />
          </div>
        </div>

        {/* Calendar Grid */}
        {calendarMonths.map((month) => (
          <div key={month.key} className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
            <h2 className="text-lg font-semibold">{month.name}</h2>
            
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 lg:gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                <div key={dayName} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {dayName}
                </div>
              ))}
            </div>
            
            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-2 lg:gap-3">
              {month.cells.map((cell, idx) => (
                <CalendarCell 
                  key={idx} 
                  cell={cell}
                  onClick={() => cell.day && handleDayClick(cell.day)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Day {selectedDay.dayNumber} of 90</p>
                <h3 className="text-2xl font-bold">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              {selectedDay.plannedWorkoutId && (
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Planned Workout</div>
                  <div className="font-semibold">
                    {getWorkoutForDay(challenge, selectedDay.dayNumber)?.name || 'Unknown'}
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Current status: <span className="font-medium text-foreground capitalize">{selectedDay.status}</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleMarkComplete}
                  className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Mark as Completed
                </button>
                <button
                  onClick={handleMarkSkipped}
                  className="w-full h-12 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Mark as Skipped
                </button>
                <button
                  onClick={handleMarkRest}
                  className="w-full h-12 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Mark as Rest Day
                </button>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="w-full h-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface LegendItemProps {
  color: string
  label: string
  icon?: string
}

function LegendItem({ color, label, icon }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-semibold", color)}>
        {icon || ''}
      </div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

interface CalendarCellProps {
  cell: CalendarCell
  onClick: () => void
}

function CalendarCell({ cell, onClick }: CalendarCellProps) {
  // Empty cell (padding for calendar grid)
  if (!cell.date || !cell.day) {
    return <div className="aspect-square" />
  }

  const { day, date } = cell

  const getStatusColor = () => {
    switch (day.status) {
      case 'completed':
        return 'bg-primary text-primary-foreground'
      case 'skipped':
        return 'bg-destructive text-destructive-foreground'
      case 'today':
        return 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-background'
      case 'rest':
        return 'bg-muted text-muted-foreground'
      case 'future':
      default:
        return 'bg-secondary text-muted-foreground border border-border'
    }
  }

  const getStatusEmoji = () => {
    switch (day.status) {
      case 'completed':
        return '✓'
      case 'skipped':
        return '✕'
      case 'today':
        return '●'
      case 'rest':
        return '○'
      default:
        return ''
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayDate = new Date(day.date)
  dayDate.setHours(0, 0, 0, 0)
  const isClickable = dayDate.getTime() <= today.getTime() && day.status !== 'future'

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "aspect-square rounded-lg font-semibold text-sm transition-all flex flex-col items-center justify-center gap-0.5 relative",
        getStatusColor(),
        isClickable ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed opacity-50"
      )}
    >
      <span className="text-base">{date}</span>
      {getStatusEmoji() && (
        <span className="text-xs leading-none opacity-80">{getStatusEmoji()}</span>
      )}
      {day.plannedWorkoutId && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-current rounded-full opacity-60" />
      )}
    </button>
  )
}
