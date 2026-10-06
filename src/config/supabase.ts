import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  }
})

// Helper types
export type User = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  photo_url: string | null
  created_at: string
  current_weight?: number
  target_weight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
  chest?: number
  waist?: number
  hips?: number
  biceps?: number
  forearms?: number
  thighs?: number
  calves?: number
  shoulders?: number
  neck?: number
  fitness_goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'get_fit'
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export type MeasurementHistory = {
  id: string
  user_id: string
  date: string
  weight?: number
  chest?: number
  waist?: number
  hips?: number
  biceps?: number
  forearms?: number
  thighs?: number
  calves?: number
  shoulders?: number
  neck?: number
  notes?: string
}
