import type { Challenge, ChallengeDay, DayStatus } from '../types'

export function getCurrentDay(challenge: Challenge): ChallengeDay | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return challenge.days.find(day => {
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    return dayDate.getTime() === today.getTime()
  }) || null
}

export function getTodayDayNumber(challenge: Challenge): number {
  const currentDay = getCurrentDay(challenge)
  return currentDay?.dayNumber || 1
}

export function getDayByNumber(challenge: Challenge, dayNumber: number): ChallengeDay | undefined {
  return challenge.days.find(day => day.dayNumber === dayNumber)
}

export function calculateProgress(challenge: Challenge): {
  currentDay: number
  totalDays: number
  completedDays: number
  skippedDays: number
  restDays: number
  percentage: number
  daysRemaining: number
} {
  const currentDayNumber = getTodayDayNumber(challenge)
  const completedDays = challenge.days.filter(d => d.status === 'completed').length
  const skippedDays = challenge.days.filter(d => d.status === 'skipped').length
  const restDays = challenge.days.filter(d => d.status === 'rest').length
  const totalDays = 90
  const percentage = Math.round((completedDays / totalDays) * 100)
  const daysRemaining = totalDays - currentDayNumber + 1

  return {
    currentDay: currentDayNumber,
    totalDays,
    completedDays,
    skippedDays,
    restDays,
    percentage,
    daysRemaining,
  }
}

export function calculateStreak(challenge: Challenge): {
  currentStreak: number
  bestStreak: number
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Sort days by date descending
  const sortedDays = [...challenge.days].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let currentStreak = 0
  let tempStreak = 0
  let bestStreak = 0

  // Calculate current streak (from today backwards)
  for (const day of sortedDays) {
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    
    if (dayDate.getTime() > today.getTime()) {
      continue // Skip future days
    }

    if (day.status === 'completed') {
      if (currentStreak === 0 || dayDate.getTime() <= today.getTime()) {
        currentStreak++
      }
    } else if (day.status !== 'rest') {
      break // Streak broken
    }
  }

  // Calculate best streak
  tempStreak = 0
  for (const day of challenge.days) {
    if (day.status === 'completed') {
      tempStreak++
      bestStreak = Math.max(bestStreak, tempStreak)
    } else if (day.status !== 'rest') {
      tempStreak = 0
    }
  }

  return { currentStreak, bestStreak }
}

export function updateDayStatus(
  challenge: Challenge,
  dayNumber: number,
  status: DayStatus,
  workoutSessionId?: string
): Challenge {
  const updatedDays = challenge.days.map(day => {
    if (day.dayNumber === dayNumber) {
      return {
        ...day,
        status,
        completedWorkoutSessionId: status === 'completed' ? workoutSessionId : undefined,
      }
    }
    return day
  })

  const streaks = calculateStreak({ ...challenge, days: updatedDays })

  return {
    ...challenge,
    days: updatedDays,
    currentStreak: streaks.currentStreak,
    bestStreak: streaks.bestStreak,
    completedDays: updatedDays.filter(d => d.status === 'completed').length,
    skippedDays: updatedDays.filter(d => d.status === 'skipped').length,
    restDays: updatedDays.filter(d => d.status === 'rest').length,
  }
}

export function initializeChallengeDays(startDate: Date, workoutSchedule: Record<number, string>): ChallengeDay[] {
  const days: ChallengeDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 90; i++) {
    const dayDate = new Date(startDate)
    dayDate.setDate(startDate.getDate() + i)
    dayDate.setHours(0, 0, 0, 0)

    const dayOfWeek = dayDate.getDay()
    const plannedWorkoutId = workoutSchedule[dayOfWeek]

    let status: DayStatus
    if (dayDate.getTime() > today.getTime()) {
      status = 'future'
    } else if (dayDate.getTime() === today.getTime()) {
      status = 'today'
    } else if (!plannedWorkoutId) {
      status = 'rest'
    } else {
      status = 'future' // Will need to be manually set to completed/skipped
    }

    days.push({
      dayNumber: i + 1,
      date: dayDate.toISOString(),
      status,
      plannedWorkoutId: plannedWorkoutId || undefined,
    })
  }

  return days
}

export function getWorkoutForDay(challenge: Challenge, dayNumber: number) {
  const day = getDayByNumber(challenge, dayNumber)
  if (!day || !day.plannedWorkoutId) return null
  
  return challenge.workoutPlans.find(plan => plan.id === day.plannedWorkoutId) || null
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getWeekDayName(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}
