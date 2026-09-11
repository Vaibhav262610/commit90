import { useState, useEffect } from 'react'
import { X, ChevronRight, Flame, Trophy } from 'lucide-react'
import type { Challenge, WorkoutSession, ExerciseLog } from '../types'
import type { Screen } from '../App'
import { getCurrentDay, getWorkoutForDay, updateDayStatus } from '../utils/challengeUtils'
import { storageService } from '../services/storage'
import { cn } from '../utils/cn'

interface ActiveWorkoutProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
  onComplete: () => void
}

export function ActiveWorkout({ challenge, onNavigate, onComplete }: ActiveWorkoutProps) {
  const currentDay = getCurrentDay(challenge)
  const workout = currentDay ? getWorkoutForDay(challenge, currentDay.dayNumber) : null

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    if (!workout) return

    // Initialize exercise logs
    const initialLogs: ExerciseLog[] = workout.exercises.map(exercise => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: exercise.targetWeight || 0,
        reps: exercise.targetReps,
        completed: false,
      })),
      skipped: false,
    }))
    setExerciseLogs(initialLogs)
  }, [workout])

  useEffect(() => {
    if (!isResting || restTimer <= 0) return

    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          setIsResting(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isResting, restTimer])

  if (!workout || !currentDay || exerciseLogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unable to start workout</p>
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

  const currentExercise = workout.exercises[currentExerciseIndex]
  const currentLog = exerciseLogs[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1
  const allSetsCompleted = currentLog.sets.every(set => set.completed)

  const handleSetComplete = (setIndex: number) => {
    const updatedLogs = [...exerciseLogs]
    updatedLogs[currentExerciseIndex].sets[setIndex].completed = true
    setExerciseLogs(updatedLogs)

    // Start rest timer (90 seconds)
    const isLastSet = setIndex === currentLog.sets.length - 1
    if (!isLastSet) {
      setRestTimer(90)
      setIsResting(true)
    }
  }

  const handleSetValueChange = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    const updatedLogs = [...exerciseLogs]
    updatedLogs[currentExerciseIndex].sets[setIndex][field] = value
    setExerciseLogs(updatedLogs)
  }

  const handleSkipExercise = () => {
    const updatedLogs = [...exerciseLogs]
    updatedLogs[currentExerciseIndex].skipped = true
    setExerciseLogs(updatedLogs)
    handleNextExercise()
  }

  const handleNextExercise = () => {
    if (isLastExercise) {
      handleWorkoutComplete()
    } else {
      setCurrentExerciseIndex(prev => prev + 1)
      setRestTimer(0)
      setIsResting(false)
    }
  }

  const handleWorkoutComplete = async () => {
    setShowCompletion(true)

    // Create workout session
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      dayNumber: currentDay.dayNumber,
      workoutPlanId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      exercises: exerciseLogs,
      completed: true,
    }

    await storageService.saveWorkoutSession(session)

    // Update challenge
    const updatedChallenge = updateDayStatus(challenge, currentDay.dayNumber, 'completed', session.id)
    await storageService.saveChallenge(updatedChallenge)

    // Wait a moment before refreshing
    setTimeout(() => {
      onComplete()
      onNavigate('home')
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">WORKOUT COMPLETE</h2>
            <p className="text-muted-foreground">
              Day {currentDay.dayNumber} completed
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xl">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="font-semibold">
              {(challenge.currentStreak || 0) + 1} day streak
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold">{workout.name}</h1>
            <p className="text-sm text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                onNavigate('home')
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` 
            }}
          />
        </div>
      </header>

      {/* Exercise Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="space-y-6">
          {/* Exercise Name */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
            <p className="text-muted-foreground">
              {currentExercise.muscleGroup.toUpperCase()}
            </p>
          </div>

          {/* Previous Best (placeholder) */}
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Previous</div>
            <div className="font-medium">
              {currentExercise.targetWeight}kg × {currentExercise.targetReps} reps
            </div>
          </div>

          {/* Sets */}
          <div className="space-y-4">
            {currentLog.sets.map((set, index) => (
              <div
                key={index}
                className={cn(
                  "bg-card border rounded-xl p-4 transition-all",
                  set.completed
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">SET {set.setNumber}</span>
                  {set.completed && (
                    <span className="text-primary text-xl">✓</span>
                  )}
                </div>

                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleSetValueChange(index, 'weight', parseFloat(e.target.value) || 0)}
                      disabled={set.completed}
                      className="w-full h-12 px-3 bg-secondary border border-border rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleSetValueChange(index, 'reps', parseInt(e.target.value) || 0)}
                      disabled={set.completed}
                      className="w-full h-12 px-3 bg-secondary border border-border rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>
                </div>

                {!set.completed && (
                  <button
                    onClick={() => handleSetComplete(index)}
                    className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Complete Set
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Rest Timer */}
          {isResting && restTimer > 0 && (
            <div className="bg-secondary rounded-xl p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">REST TIMER</div>
              <div className="text-5xl font-bold text-primary">
                {formatTime(restTimer)}
              </div>
              <button
                onClick={() => {
                  setIsResting(false)
                  setRestTimer(0)
                }}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground"
              >
                Skip rest
              </button>
            </div>
          )}

          {/* Skip Exercise */}
          <button
            onClick={handleSkipExercise}
            className="w-full h-10 text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Exercise
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      {allSetsCompleted && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border max-w-md mx-auto">
          <button
            onClick={handleNextExercise}
            className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {isLastExercise ? 'FINISH WORKOUT' : 'NEXT EXERCISE'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
