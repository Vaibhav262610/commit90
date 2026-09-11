import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Challenge } from '../types'
import type { Screen } from '../App'
import { getCurrentDay, getWorkoutForDay } from '../utils/challengeUtils'

interface WorkoutPreviewProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
}

export function WorkoutPreview({ challenge, onNavigate }: WorkoutPreviewProps) {
  const currentDay = getCurrentDay(challenge)
  const workout = currentDay ? getWorkoutForDay(challenge, currentDay.dayNumber) : null

  if (!workout || !currentDay) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No workout found for today</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    )
  }

  // Group exercises by muscle group
  const exercisesByGroup = workout.exercises.reduce((acc, exercise) => {
    const group = exercise.muscleGroup.toUpperCase()
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(exercise)
    return acc
  }, {} as Record<string, typeof workout.exercises>)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{workout.name}</h1>
          <p className="text-sm text-muted-foreground">
            Day {currentDay.dayNumber} / 90
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 pb-24">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Exercise List */}
        <div className="space-y-6">
          {Object.entries(exercisesByGroup).map(([group, exercises]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-primary mb-3">
                {group}
              </h2>
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <h3 className="font-semibold mb-2">{exercise.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.targetReps} reps
                      {exercise.targetWeight && (
                        <span className="ml-2">@ {exercise.targetWeight}kg</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border max-w-md mx-auto">
        <button
          onClick={() => onNavigate('active-workout')}
          className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          START WORKOUT
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
