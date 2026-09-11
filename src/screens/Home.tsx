import { Settings, Flame, ChevronRight, Trophy, Calendar as CalendarIcon } from 'lucide-react'
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
      <header className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Project 90</h1>
            <p className="text-sm text-muted-foreground hidden lg:block">
              Your 90-day gym challenge
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Main Stats */}
          <div className="space-y-6">
            {/* Day Counter */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 lg:p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Current Day</span>
                </div>
                <h2 className="text-6xl lg:text-7xl font-bold">
                  {progress.currentDay}
                </h2>
                <p className="text-2xl lg:text-3xl text-muted-foreground font-light">
                  of 90 days
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Overall Progress</h3>
                <span className="text-2xl font-bold text-primary">{progress.percentage}%</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <StatBadge
                  label="Completed"
                  value={progress.completedDays}
                  color="text-primary"
                />
                <StatBadge
                  label="Remaining"
                  value={progress.daysRemaining}
                  color="text-blue-500"
                />
                <StatBadge
                  label="Skipped"
                  value={progress.skippedDays}
                  color="text-destructive"
                />
              </div>
            </div>

            {/* Streak Card */}
            {challenge.currentStreak > 0 && (
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-bold">
                      {challenge.currentStreak}
                    </div>
                    <div className="text-muted-foreground">day streak</div>
                  </div>
                  {challenge.bestStreak > challenge.currentStreak && (
                    <div className="ml-auto text-right">
                      <div className="text-sm text-muted-foreground">Best</div>
                      <div className="text-2xl font-bold text-orange-500/50">
                        {challenge.bestStreak}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Today's Workout */}
          <div className="space-y-6">
            {currentDay && (
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">TODAY</span>
                  </div>
                  
                  {todayWorkout ? (
                    <>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-3">{todayWorkout.name}</h3>
                      <p className="text-muted-foreground text-lg">
                        {todayWorkout.exercises.length} exercise{todayWorkout.exercises.length !== 1 ? 's' : ''}
                      </p>

                      {/* Exercise Preview */}
                      <div className="mt-6 space-y-2">
                        {todayWorkout.exercises.slice(0, 3).map((exercise, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {exercise.sets} × {exercise.targetReps}
                              </div>
                            </div>
                          </div>
                        ))}
                        {todayWorkout.exercises.length > 3 && (
                          <div className="text-sm text-center text-muted-foreground py-2">
                            +{todayWorkout.exercises.length - 3} more exercises
                          </div>
                        )}
                      </div>
                    </>
                  ) : currentDay.status === 'rest' ? (
                    <>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-3">Rest Day</h3>
                      <p className="text-muted-foreground text-lg">
                        Recovery is part of progress 💪
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-3">No workout planned</h3>
                      <p className="text-muted-foreground text-lg">
                        Add a workout in the planner
                      </p>
                    </>
                  )}
                </div>

                {canStartWorkout && (
                  <button
                    onClick={() => onNavigate('workout-preview')}
                    className="w-full h-14 lg:h-16 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                  >
                    START WORKOUT
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {currentDay.status === 'completed' && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold text-lg">Workout Completed</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('calendar')}
                className="h-24 bg-card border border-border rounded-xl hover:bg-card/80 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <CalendarIcon className="w-6 h-6 text-primary" />
                <span className="font-medium">View Calendar</span>
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className="h-24 bg-card border border-border rounded-xl hover:bg-card/80 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <Trophy className="w-6 h-6 text-primary" />
                <span className="font-medium">View Progress</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatBadgeProps {
  label: string
  value: number
  color?: string
}

function StatBadge({ label, value, color }: StatBadgeProps) {
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold", color)}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
