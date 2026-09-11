import { ChevronLeft, Plus, Dumbbell } from 'lucide-react'
import type { Challenge } from '../types'
import type { Screen } from '../App'

interface WorkoutPlannerProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
  onUpdate: () => void
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function WorkoutPlanner({ challenge, onNavigate }: WorkoutPlannerProps) {
  // Get workout for each day of week
  const getWorkoutForDay = (dayOfWeek: number) => {
    return challenge.workoutPlans.find(plan => plan.dayOfWeek === dayOfWeek)
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Workout Plan</h1>
      </header>

      <div className="p-6 space-y-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Weekly Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Your workout routine repeats every week throughout the 90-day challenge.
          </p>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-3">
          {DAYS_OF_WEEK.map((dayName, index) => {
            const workout = getWorkoutForDay(index)
            
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      {dayName.toUpperCase()}
                    </div>
                    {workout ? (
                      <>
                        <div className="font-semibold text-lg mb-1">
                          {workout.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground">Rest Day</div>
                    )}
                  </div>
                  {workout && (
                    <Dumbbell className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Workout Details */}
        <div className="pt-6 space-y-6">
          <h2 className="text-lg font-semibold">Workout Details</h2>
          
          {challenge.workoutPlans
            .filter(plan => plan.dayOfWeek !== undefined)
            .sort((a, b) => (a.dayOfWeek || 0) - (b.dayOfWeek || 0))
            .map(plan => (
              <WorkoutCard key={plan.id} plan={plan} />
            ))}
        </div>

        {/* Add Workout Button */}
        <button
          className="w-full h-12 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <Plus className="w-5 h-5" />
          Add Custom Workout
        </button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Workout editing will be available in the next update
        </p>
      </div>
    </div>
  )
}

function WorkoutCard({ plan }: { plan: any }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">
          {plan.exercises.length} exercises
        </p>
      </div>

      <div className="space-y-3">
        {plan.exercises.map((exercise: any, index: number) => (
          <div
            key={exercise.id}
            className="flex items-start justify-between py-2"
          >
            <div className="flex-1">
              <div className="font-medium">{exercise.name}</div>
              <div className="text-sm text-muted-foreground">
                {exercise.sets} sets × {exercise.targetReps} reps
                {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
