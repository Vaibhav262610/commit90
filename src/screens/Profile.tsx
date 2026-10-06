import { useState, useEffect } from 'react'
import { ChevronLeft, User, Save, TrendingUp, Calendar as CalendarIcon, LogOut } from 'lucide-react'
import type { Screen } from '../App'
import type { UserProfile } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import { cn } from '../utils/cn'

interface ProfileProps {
  onNavigate: (screen: Screen) => void
}

export function Profile({ onNavigate }: ProfileProps) {
  const { currentUser, signOut } = useAuth()
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'measurements'>('info')

  useEffect(() => {
    if (currentUser) {
      loadProfile()
    }
  }, [currentUser])

  const loadProfile = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      let userProfile = await userService.getUserProfile(currentUser.id)
      
      if (!userProfile) {
        // Create profile on first login
        const newProfile: UserProfile = {
          uid: currentUser.id,
          email: currentUser.email || '',
          displayName: currentUser.user_metadata?.full_name || null,
          photoURL: currentUser.user_metadata?.avatar_url || null,
          createdAt: new Date().toISOString()
        }
        
        await userService.createUserProfile(newProfile)
        userProfile = newProfile
      }
      
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!currentUser) return

    try {
      setSaving(true)
      const existingProfile = await userService.getUserProfile(currentUser.id)
      
      if (existingProfile) {
        await userService.updateUserProfile(currentUser.id, profile)
      } else {
        await userService.createUserProfile(profile as UserProfile)
      }
      
      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddMeasurement = async () => {
    if (!currentUser) return

    try {
      setSaving(true)
      await userService.addMeasurement(currentUser.id, {
        date: new Date().toISOString(),
        weight: profile.currentWeight,
        chest: profile.chest,
        waist: profile.waist,
        hips: profile.hips,
        biceps: profile.biceps,
        forearms: profile.forearms,
        thighs: profile.thighs,
        calves: profile.calves,
        shoulders: profile.shoulders,
        neck: profile.neck,
        notes: 'Manual entry'
      })
      alert('Measurement saved to history successfully!')
    } catch (error) {
      console.error('Error saving measurement:', error)
      alert('Failed to save measurement. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-6 bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your info and measurements</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            {currentUser?.user_metadata?.avatar_url ? (
              <img 
                src={currentUser.user_metadata.avatar_url} 
                alt={currentUser.user_metadata?.full_name || 'User'} 
                className="w-20 h-20 rounded-full border-2 border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.user_metadata?.full_name || 'User'}</h2>
              <p className="text-muted-foreground text-sm">{currentUser?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border/40 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === 'info' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Basic Info
              {activeTab === 'info' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === 'measurements' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Measurements
              {activeTab === 'measurements' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Age"
                  type="number"
                  value={profile.age || ''}
                  onChange={(value) => setProfile({ ...profile, age: Number(value) })}
                  placeholder="25"
                />
                <SelectField
                  label="Gender"
                  value={profile.gender || ''}
                  onChange={(value) => setProfile({ ...profile, gender: value as 'male' | 'female' | 'other' })}
                  options={[
                    { value: '', label: 'Select' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
                <InputField
                  label="Height (cm)"
                  type="number"
                  value={profile.height || ''}
                  onChange={(value) => setProfile({ ...profile, height: Number(value) })}
                  placeholder="175"
                />
                <InputField
                  label="Target Weight (kg)"
                  type="number"
                  value={profile.targetWeight || ''}
                  onChange={(value) => setProfile({ ...profile, targetWeight: Number(value) })}
                  placeholder="75"
                />
              </div>

              <SelectField
                label="Fitness Goal"
                value={profile.fitnessGoal || ''}
                onChange={(value) => setProfile({ ...profile, fitnessGoal: value as any })}
                options={[
                  { value: '', label: 'Select your goal' },
                  { value: 'lose_weight', label: 'Lose Weight' },
                  { value: 'gain_muscle', label: 'Gain Muscle' },
                  { value: 'maintain', label: 'Maintain' },
                  { value: 'get_fit', label: 'Get Fit' }
                ]}
              />

              <SelectField
                label="Activity Level"
                value={profile.activityLevel || ''}
                onChange={(value) => setProfile({ ...profile, activityLevel: value as any })}
                options={[
                  { value: '', label: 'Select activity level' },
                  { value: 'sedentary', label: 'Sedentary (Little or no exercise)' },
                  { value: 'light', label: 'Light (Exercise 1-3 days/week)' },
                  { value: 'moderate', label: 'Moderate (Exercise 3-5 days/week)' },
                  { value: 'active', label: 'Active (Exercise 6-7 days/week)' },
                  { value: 'very_active', label: 'Very Active (Intense exercise daily)' }
                ]}
              />
            </div>
          )}

          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Weight (kg)"
                  type="number"
                  value={profile.currentWeight || ''}
                  onChange={(value) => setProfile({ ...profile, currentWeight: Number(value) })}
                  placeholder="70"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <InputField
                  label="Chest (cm)"
                  type="number"
                  value={profile.chest || ''}
                  onChange={(value) => setProfile({ ...profile, chest: Number(value) })}
                  placeholder="95"
                />
                <InputField
                  label="Waist (cm)"
                  type="number"
                  value={profile.waist || ''}
                  onChange={(value) => setProfile({ ...profile, waist: Number(value) })}
                  placeholder="80"
                />
                <InputField
                  label="Hips (cm)"
                  type="number"
                  value={profile.hips || ''}
                  onChange={(value) => setProfile({ ...profile, hips: Number(value) })}
                  placeholder="95"
                />
                <InputField
                  label="Biceps (cm)"
                  type="number"
                  value={profile.biceps || ''}
                  onChange={(value) => setProfile({ ...profile, biceps: Number(value) })}
                  placeholder="35"
                />
                <InputField
                  label="Forearms (cm)"
                  type="number"
                  value={profile.forearms || ''}
                  onChange={(value) => setProfile({ ...profile, forearms: Number(value) })}
                  placeholder="28"
                />
                <InputField
                  label="Thighs (cm)"
                  type="number"
                  value={profile.thighs || ''}
                  onChange={(value) => setProfile({ ...profile, thighs: Number(value) })}
                  placeholder="55"
                />
                <InputField
                  label="Calves (cm)"
                  type="number"
                  value={profile.calves || ''}
                  onChange={(value) => setProfile({ ...profile, calves: Number(value) })}
                  placeholder="38"
                />
                <InputField
                  label="Shoulders (cm)"
                  type="number"
                  value={profile.shoulders || ''}
                  onChange={(value) => setProfile({ ...profile, shoulders: Number(value) })}
                  placeholder="115"
                />
                <InputField
                  label="Neck (cm)"
                  type="number"
                  value={profile.neck || ''}
                  onChange={(value) => setProfile({ ...profile, neck: Number(value) })}
                  placeholder="38"
                />
              </div>

              <button
                onClick={handleAddMeasurement}
                disabled={saving}
                className="w-full h-12 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CalendarIcon className="w-5 h-5" />
                Save as Measurement Entry
              </button>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InputFieldProps {
  label: string
  type: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
}

function InputField({ label, type, value, onChange, placeholder, icon }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 bg-secondary/50 border border-border/40 rounded-xl px-4 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            icon && "pl-10"
          )}
        />
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-secondary/50 border border-border/40 rounded-xl px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
