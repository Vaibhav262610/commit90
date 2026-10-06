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

    // Allow interaction with today and all past days (not future)
    if (dayDate.getTime() <= today.getTime()) {
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
    <div className="min-h-screen pb-6 bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center gap-3 p-4 lg:p-6">
          <button
            onClick={() => onNavigate('home')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track your workout journey</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Calendar Grid */}
        {calendarMonths.map((month) => (
          <div key={month.key} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 lg:p-7 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 tracking-tight">{month.name}</h2>
            
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 lg:gap-3 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                <div key={dayName} className="text-center text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider py-2">
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
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end lg:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDay(null)}
        >
          <div 
            className="bg-card border border-border/50 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 lg:slide-in-from-bottom-0 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Day {selectedDay.dayNumber} of 90</p>
                <h3 className="text-2xl font-bold tracking-tight">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              {selectedDay.plannedWorkoutId && (
                <div className="p-4 bg-secondary/50 rounded-xl border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Planned Workout</div>
                  <div className="font-semibold text-foreground">
                    {getWorkoutForDay(challenge, selectedDay.dayNumber)?.name || 'Unknown'}
                  </div>
                </div>
              )}

              <div className="text-sm">
                <span className="text-muted-foreground">Current status: </span>
                <span className="font-semibold text-foreground capitalize">{selectedDay.status === 'future' ? 'not set' : selectedDay.status}</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleMarkComplete}
                  className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check className="w-5 h-5" />
                  Completed
                </button>
                <button
                  onClick={handleMarkSkipped}
                  className="w-full h-12 bg-destructive/10 text-destructive border border-destructive/30 rounded-xl font-semibold hover:bg-destructive/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Skipped
                </button>
                <button
                  onClick={handleMarkRest}
                  className="w-full h-12 bg-secondary/80 border border-border/40 text-foreground rounded-xl font-semibold hover:bg-secondary active:scale-[0.98] transition-all"
                >
                  Rest Day
                </button>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="w-full h-11 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
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
        return 'bg-primary/90 text-primary-foreground shadow-sm border-primary/20'
      case 'skipped':
        return 'bg-destructive/90 text-destructive-foreground shadow-sm border-destructive/20'
      case 'today':
        return 'bg-blue-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/50 ring-offset-2 ring-offset-background'
      case 'rest':
        return 'bg-muted/80 text-muted-foreground border-border/40'
      case 'future':
      default:
        return 'bg-secondary/60 text-muted-foreground/70 border-border/30'
    }
  }

  const getStatusIcon = () => {
    switch (day.status) {
      case 'completed':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="w-4 h-4 opacity-90" />
          </div>
        )
      case 'skipped':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <X className="w-4 h-4 opacity-90" />
          </div>
        )
      case 'today':
        return (
          <div className="absolute top-1 right-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
        )
      default:
        return null
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayDate = new Date(day.date)
  dayDate.setHours(0, 0, 0, 0)
  const isPast = dayDate.getTime() < today.getTime()
  const isToday = dayDate.getTime() === today.getTime()
  const isFuture = dayDate.getTime() > today.getTime()
  const isClickable = !isFuture

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "aspect-square rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center relative border group",
        getStatusColor(),
        isClickable 
          ? "hover:scale-105 hover:shadow-lg cursor-pointer active:scale-95" 
          : "cursor-not-allowed opacity-40"
      )}
    >
      <span className="text-base font-semibold relative z-10">{date}</span>
      {getStatusIcon()}
      {day.plannedWorkoutId && day.status === 'future' && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-50" />
      )}
    </button>
  )
}

