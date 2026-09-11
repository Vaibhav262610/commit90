import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Home } from './screens/Home'
import { Calendar } from './screens/Calendar'
import { WorkoutPlanner } from './screens/WorkoutPlanner'
import { Progress } from './screens/Progress'
import { Settings } from './screens/Settings'
import { WorkoutPreview } from './screens/WorkoutPreview'
import { ActiveWorkout } from './screens/ActiveWorkout'
import { Music } from './screens/Music'
import { storageService } from './services/storage'
import type { Challenge, WorkoutPlan } from './types'
import { initializeChallengeDays } from './utils/challengeUtils'

export type Screen = 'home' | 'calendar' | 'planner' | 'progress' | 'settings' | 'music' | 'workout-preview' | 'active-workout'

const defaultWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'chest-triceps',
    name: 'Chest + Triceps',
    exercises: [
      { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', sets: 3, targetReps: 10, targetWeight: 60 },
      { id: 'incline-db-press', name: 'Incline Dumbbell Press', muscleGroup: 'chest', sets: 3, targetReps: 10, targetWeight: 25 },
      { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'chest', sets: 3, targetReps: 12, targetWeight: 15 },
      { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'triceps', sets: 3, targetReps: 12, targetWeight: 30 },
      { id: 'overhead-extension', name: 'Overhead Extension', muscleGroup: 'triceps', sets: 3, targetReps: 12, targetWeight: 20 },
    ],
    dayOfWeek: 1,
  },
  {
    id: 'back-biceps',
    name: 'Back + Biceps',
    exercises: [
      { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', sets: 3, targetReps: 10, targetWeight: 50 },
      { id: 'seated-row', name: 'Seated Row', muscleGroup: 'back', sets: 3, targetReps: 10, targetWeight: 50 },
      { id: 'db-row', name: 'One Arm Dumbbell Row', muscleGroup: 'back', sets: 3, targetReps: 10, targetWeight: 30 },
      { id: 'db-curl', name: 'Dumbbell Curl', muscleGroup: 'biceps', sets: 3, targetReps: 10, targetWeight: 12 },
      { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'biceps', sets: 3, targetReps: 10, targetWeight: 12 },
    ],
    dayOfWeek: 2,
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    exercises: [
      { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', sets: 3, targetReps: 10, targetWeight: 40 },
      { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', sets: 3, targetReps: 12, targetWeight: 10 },
      { id: 'front-raise', name: 'Front Raise', muscleGroup: 'shoulders', sets: 3, targetReps: 12, targetWeight: 10 },
      { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscleGroup: 'shoulders', sets: 3, targetReps: 12, targetWeight: 8 },
    ],
    dayOfWeek: 3,
  },
  {
    id: 'legs',
    name: 'Legs',
    exercises: [
      { id: 'squat', name: 'Squat', muscleGroup: 'legs', sets: 3, targetReps: 10, targetWeight: 80 },
      { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', sets: 3, targetReps: 12, targetWeight: 100 },
      { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'legs', sets: 3, targetReps: 12, targetWeight: 40 },
      { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'legs', sets: 3, targetReps: 12, targetWeight: 40 },
      { id: 'calf-raise', name: 'Calf Raise', muscleGroup: 'calves', sets: 3, targetReps: 15, targetWeight: 60 },
    ],
    dayOfWeek: 5,
  },
]

function App() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')

  useEffect(() => {
    loadOrCreateChallenge()
  }, [])

  const loadOrCreateChallenge = async () => {
    try {
      let savedChallenge = await storageService.getChallenge()
      
      if (!savedChallenge) {
        // Auto-create challenge starting from today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const workoutSchedule: Record<number, string> = {
          1: 'chest-triceps',
          2: 'back-biceps',
          3: 'shoulders',
          5: 'legs',
        }

        const days = initializeChallengeDays(today, workoutSchedule)

        savedChallenge = {
          id: `challenge-${Date.now()}`,
          startDate: today.toISOString(),
          days,
          workoutPlans: defaultWorkoutPlans,
          currentStreak: 0,
          bestStreak: 0,
          completedDays: 0,
          skippedDays: 0,
          restDays: days.filter(d => d.status === 'rest').length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await storageService.saveChallenge(savedChallenge)
      }

      setChallenge(savedChallenge)
    } catch (error) {
      console.error('Failed to load challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshChallenge = async () => {
    await loadOrCreateChallenge()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Failed to load challenge</div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home challenge={challenge} onNavigate={setCurrentScreen} onRefresh={refreshChallenge} />
      case 'calendar':
        return <Calendar challenge={challenge} onNavigate={setCurrentScreen} onRefresh={refreshChallenge} />
      case 'planner':
        return <WorkoutPlanner challenge={challenge} onNavigate={setCurrentScreen} onUpdate={refreshChallenge} />
      case 'progress':
        return <Progress challenge={challenge} onNavigate={setCurrentScreen} />
      case 'settings':
        return <Settings challenge={challenge} onNavigate={setCurrentScreen} onUpdate={refreshChallenge} />
      case 'music':
        return <Music challenge={challenge} onNavigate={setCurrentScreen} />
      case 'workout-preview':
        return <WorkoutPreview challenge={challenge} onNavigate={setCurrentScreen} />
      case 'active-workout':
        return <ActiveWorkout challenge={challenge} onNavigate={setCurrentScreen} onComplete={refreshChallenge} />
      default:
        return <Home challenge={challenge} onNavigate={setCurrentScreen} onRefresh={refreshChallenge} />
    }
  }

  return (
    <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  )
}

export default App
