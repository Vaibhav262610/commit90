import { Settings, Flame, ChevronRight, Trophy, Calendar as CalendarIcon, Target } from 'lucide-react'
import type { Challenge } from '../types'
import type { Screen } from '../App'
import { calculateProgress, getCurrentDay, getWorkoutForDay } from '../utils/challengeUtils'
import { cn } from '../utils/cn'

interface HomeProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
  onRefresh: () => void
}

export function Home({ challenge, onNavigate }: HomeProps) {
  const progress = calculateProgress(challenge)
  const currentDay = getCurrentDay(challenge)
  const todayWorkout = currentDay ? getWorkoutForDay(challenge, currentDay.dayNumber) : null

  const canStartWorkout = currentDay && 
    currentDay.status === 'today' && 
    todayWorkout && 
    !currentDay.completedWorkoutSessionId

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-background">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-5">
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight">PROJECT 90</h1>
            <p className="text-xs text-muted-foreground hidden lg:block">
              90 days. No excuses.
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-5 space-y-4">
            {/* Day Counter */}
            <div className="bg-card border border-border/50 rounded-lg p-5 lg:p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl lg:text-5xl font-bold tabular-nums">
                  {progress.currentDay}
                </span>
                <span className="text-lg text-muted-foreground">/ 90</span>
              </div>
              <p className="text-sm text-muted-foreground">days into challenge</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-card border border-border/50 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-lg font-bold tabular-nums">{progress.percentage}%</span>
              </div>
              <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <div className="text-xl font-bold tabular-nums">{progress.completedDays}</div>
                  <div className="text-xs text-muted-foreground">done</div>
                </div>
                <div>
                  <div className="text-xl font-bold tabular-nums text-destructive">{progress.skippedDays}</div>
                  <div className="text-xs text-muted-foreground">skipped</div>
                </div>
                <div>
                  <div className="text-xl font-bold tabular-nums text-blue-400">{progress.daysRemaining}</div>
                  <div className="text-xs text-muted-foreground">left</div>
                </div>
              </div>
            </div>

            {/* Streak */}
            {challenge.currentStreak > 0 && (
              <div className="bg-card border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold tabular-nums">{challenge.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">day streak</div>
                    </div>
                  </div>
                  {challenge.bestStreak > challenge.currentStreak && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">best: {challenge.bestStreak}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Today's Workout */}
          <div className="lg:col-span-7 space-y-4">
            {currentDay && (
              <div className="bg-card border border-border/50 rounded-lg p-5 lg:p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</span>
                  <span className="text-xs text-muted-foreground">{new Date(currentDay.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                
                {todayWorkout ? (
                  <>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-1">{todayWorkout.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {todayWorkout.exercises.length} exercises
                      </p>
                    </div>

                    {/* Exercise Preview */}
                    <div className="space-y-2">
                      {todayWorkout.exercises.slice(0, 4).map((exercise, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                          <div className="w-6 h-6 rounded bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{exercise.name}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {exercise.sets}×{exercise.targetReps}
                          </div>
                        </div>
                      ))}
                      {todayWorkout.exercises.length > 4 && (
                        <div className="text-xs text-center text-muted-foreground py-1">
                          +{todayWorkout.exercises.length - 4} more
                        </div>
                      )}
                    </div>
                  </>
                ) : currentDay.status === 'rest' ? (
                  <div className="py-8 text-center">
                    <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold mb-1">Rest Day</h3>
                    <p className="text-sm text-muted-foreground">
                      Recovery builds strength
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <h3 className="text-2xl font-bold mb-1">No workout</h3>
                    <p className="text-sm text-muted-foreground">
                      Plan one in workouts
                    </p>
                  </div>
                )}

                {canStartWorkout && (
                  <button
                    onClick={() => onNavigate('workout-preview')}
                    className="w-full h-12 lg:h-14 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    START WORKOUT
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentDay.status === 'completed' && (
                  <div className="text-center py-4 mt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg">
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium text-sm">Completed</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('calendar')}
                className="h-20 bg-card border border-border/50 rounded-lg hover:border-border transition-colors flex flex-col items-center justify-center gap-1"
              >
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Calendar</span>
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className="h-20 bg-card border border-border/50 rounded-lg hover:border-border transition-colors flex flex-col items-center justify-center gap-1"
              >
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Progress</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
