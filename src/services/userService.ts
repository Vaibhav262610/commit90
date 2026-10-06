import { supabase, type Profile, type MeasurementHistory } from '../config/supabase'
import type { UserProfile } from '../types'

export const userService = {
  // Get user profile from Supabase
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet
          return null
        }
        throw error
      }

      // Convert snake_case to camelCase
      return data ? {
        uid: data.id,
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
        createdAt: data.created_at,
        currentWeight: data.current_weight,
        targetWeight: data.target_weight,
        height: data.height,
        age: data.age,
        gender: data.gender,
        chest: data.chest,
        waist: data.waist,
        hips: data.hips,
        biceps: data.biceps,
        forearms: data.forearms,
        thighs: data.thighs,
        calves: data.calves,
        shoulders: data.shoulders,
        neck: data.neck,
        fitnessGoal: data.fitness_goal,
        activityLevel: data.activity_level,
        measurementHistory: [] // Will fetch separately
      } : null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  // Create new user profile
  async createUserProfile(profile: UserProfile): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: profile.uid,
          email: profile.email,
          display_name: profile.displayName,
          photo_url: profile.photoURL,
          created_at: new Date().toISOString(),
          current_weight: profile.currentWeight,
          target_weight: profile.targetWeight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
          chest: profile.chest,
          waist: profile.waist,
          hips: profile.hips,
          biceps: profile.biceps,
          forearms: profile.forearms,
          thighs: profile.thighs,
          calves: profile.calves,
          shoulders: profile.shoulders,
          neck: profile.neck,
          fitness_goal: profile.fitnessGoal,
          activity_level: profile.activityLevel
        })

      if (error) throw error
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const updateData: any = {}

      // Convert camelCase to snake_case
      if (data.displayName !== undefined) updateData.display_name = data.displayName
      if (data.photoURL !== undefined) updateData.photo_url = data.photoURL
      if (data.currentWeight !== undefined) updateData.current_weight = data.currentWeight
      if (data.targetWeight !== undefined) updateData.target_weight = data.targetWeight
      if (data.height !== undefined) updateData.height = data.height
      if (data.age !== undefined) updateData.age = data.age
      if (data.gender !== undefined) updateData.gender = data.gender
      if (data.chest !== undefined) updateData.chest = data.chest
      if (data.waist !== undefined) updateData.waist = data.waist
      if (data.hips !== undefined) updateData.hips = data.hips
      if (data.biceps !== undefined) updateData.biceps = data.biceps
      if (data.forearms !== undefined) updateData.forearms = data.forearms
      if (data.thighs !== undefined) updateData.thighs = data.thighs
      if (data.calves !== undefined) updateData.calves = data.calves
      if (data.shoulders !== undefined) updateData.shoulders = data.shoulders
      if (data.neck !== undefined) updateData.neck = data.neck
      if (data.fitnessGoal !== undefined) updateData.fitness_goal = data.fitnessGoal
      if (data.activityLevel !== undefined) updateData.activity_level = data.activityLevel

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', uid)

      if (error) throw error
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // Add measurement to history
  async addMeasurement(uid: string, measurement: {
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
  }): Promise<void> {
    try {
      // Insert into measurement_history table
      const { error: historyError } = await supabase
        .from('measurement_history')
        .insert({
          user_id: uid,
          date: measurement.date,
          weight: measurement.weight,
          chest: measurement.chest,
          waist: measurement.waist,
          hips: measurement.hips,
          biceps: measurement.biceps,
          forearms: measurement.forearms,
          thighs: measurement.thighs,
          calves: measurement.calves,
          shoulders: measurement.shoulders,
          neck: measurement.neck,
          notes: measurement.notes
        })

      if (historyError) throw historyError

      // Update current measurements in profile
      const updateData: any = {}
      if (measurement.weight !== undefined) updateData.current_weight = measurement.weight
      if (measurement.chest !== undefined) updateData.chest = measurement.chest
      if (measurement.waist !== undefined) updateData.waist = measurement.waist
      if (measurement.hips !== undefined) updateData.hips = measurement.hips
      if (measurement.biceps !== undefined) updateData.biceps = measurement.biceps
      if (measurement.forearms !== undefined) updateData.forearms = measurement.forearms
      if (measurement.thighs !== undefined) updateData.thighs = measurement.thighs
      if (measurement.calves !== undefined) updateData.calves = measurement.calves
      if (measurement.shoulders !== undefined) updateData.shoulders = measurement.shoulders
      if (measurement.neck !== undefined) updateData.neck = measurement.neck

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', uid)

      if (profileError) throw profileError
    } catch (error) {
      console.error('Error adding measurement:', error)
      throw error
    }
  },

  // Get measurement history
  async getMeasurementHistory(uid: string): Promise<MeasurementHistory[]> {
    try {
      const { data, error } = await supabase
        .from('measurement_history')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching measurement history:', error)
      throw error
    }
  }
}
