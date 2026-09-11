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

export function Calendar({ challenge, onNavigate, onRefresh }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null)

  // Group days by month
  const daysByMonth = challenge.days.reduce((acc, day) => {
    const date = new Date(day.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(day)
    return acc
  }, {} as Record<string, ChallengeDay[]>)

  const handleDayClick = (day: ChallengeDay) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)

    // Only allow interaction with past days and today
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
            <h1 className="text-xl lg:text-2xl font-bold">90 Days</h1>
            <p className="text-sm text-muted-foreground">Click any past day to update its status</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Legend */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <LegendItem color="bg-primary" label="Completed" />
            <LegendItem color="bg-destructive" label="Skipped" />
            <LegendItem color="bg-blue-500" label="Today" />
            <LegendItem color="bg-muted" label="Rest" />
            <LegendItem color="bg-secondary border border-border" label="Future" />
          </div>
        </div>

        {/* Calendar Grid */}
        {Object.entries(daysByMonth).map(([monthKey, days]) => {
          const monthDate = new Date(days[0].date)
          const monthName = monthDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })

          return (
            <div key={monthKey} className="space-y-4">
              <h2 className="text-lg font-semibold">{monthName}</h2>
              <div className="grid grid-cols-7 gap-2 lg:gap-3">
                {days.map((day) => (
                  <DayCell 
                    key={day.dayNumber} 
                    day={day} 
                    onClick={() => handleDayClick(day)}
                  />
                ))}
              </div>
            </div>
          )
        })}
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
                <h3 className="text-2xl font-bold">Day {selectedDay.dayNumber}</h3>
                <p className="text-muted-foreground">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
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
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded", color)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

interface DayCellProps {
  day: ChallengeDay
  onClick: () => void
}

function DayCell({ day, onClick }: DayCellProps) {
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
        return '◉'
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
  const isClickable = dayDate.getTime() <= today.getTime()

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "aspect-square rounded-lg font-semibold text-sm transition-all flex flex-col items-center justify-center gap-0.5",
        getStatusColor(),
        isClickable ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed opacity-50"
      )}
    >
      <span className="text-xs opacity-70">{day.dayNumber}</span>
      {getStatusEmoji() && (
        <span className="text-lg leading-none">{getStatusEmoji()}</span>
      )}
    </button>
  )
}
