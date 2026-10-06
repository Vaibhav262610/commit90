export type DayStatus = 'future' | 'today' | 'completed' | 'skipped' | 'rest'

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'calves' | 'abs'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  sets: number
  targetReps: number
  targetWeight?: number
  notes?: string
}

export interface WorkoutSet {
  setNumber: number
  weight: number
  reps: number
  completed: boolean
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
  skipped: boolean
}

export interface WorkoutSession {
  id: string
  dayNumber: number
  workoutPlanId: string
  workoutName: string
  date: string
  startTime?: string
  endTime?: string
  exercises: ExerciseLog[]
  completed: boolean
  totalVolume?: number
  notes?: string
}

export interface WorkoutPlan {
  id: string
  name: string
  exercises: Exercise[]
  dayOfWeek?: number // 0-6, Sunday-Saturday
}

export interface ChallengeDay {
  dayNumber: number
  date: string
  status: DayStatus
  plannedWorkoutId?: string
  completedWorkoutSessionId?: string
  notes?: string
  skipReason?: string
}

export interface Challenge {
  id: string
  startDate: string
  days: ChallengeDay[]
  workoutPlans: WorkoutPlan[]
  currentStreak: number
  bestStreak: number
  completedDays: number
  skippedDays: number
  restDays: number
  createdAt: string
  updatedAt: string
}

export interface ProgressMeasurement {
  id: string
  date: string
  weight?: number
  chest?: number
  waist?: number
  arms?: number
  thighs?: number
  notes?: string
}

export interface ProgressPhoto {
  id: string
  date: string
  imageUrl: string
  type: 'front' | 'side' | 'back'
}

export interface PersonalRecord {
  id: string
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  date: string
}

export interface GymAlarm {
  id: string
  dayOfWeek: number // 0-6
  time: string // HH:MM format
  enabled: boolean
  label?: string
}

export interface MusicLink {
  id: string
  name: string
  url: string
  type: 'youtube' | 'spotify' | 'soundcloud' | 'other'
}

export interface UserSettings {
  units: 'kg' | 'lb'
  notificationsEnabled: boolean
  theme: 'dark' | 'light'
  startOfWeek: 0 | 1 // 0 = Sunday, 1 = Monday
  gymAlarms: GymAlarm[]
  musicLinks: MusicLink[]
  spotifyConnected: boolean
  spotifyPlaylistUrl?: string
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: string
  // Body Measurements
  currentWeight?: number
  targetWeight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
  // Body measurements (in cm or inches based on settings)
  chest?: number
  waist?: number
  hips?: number
  biceps?: number
  forearms?: number
  thighs?: number
  calves?: number
  shoulders?: number
  neck?: number
  // Additional info
  fitnessGoal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'get_fit'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  // Measurement history
  measurementHistory?: ProgressMeasurement[]
}
