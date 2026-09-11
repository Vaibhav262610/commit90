import { useState, useEffect } from 'react'
import { ChevronLeft, AlertTriangle, Plus, Trash2, Bell, Clock, Calendar as CalendarIcon } from 'lucide-react'
import type { Challenge, WorkoutPlan } from '../types'
import type { Screen } from '../App'
import { storageService } from '../services/storage'
import { formatDate, initializeChallengeDays } from '../utils/challengeUtils'
import type { GymAlarm, UserSettings } from '../types'

interface SettingsProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
  onUpdate: () => void
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function Settings({ challenge, onNavigate, onUpdate }: SettingsProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [showAddAlarm, setShowAddAlarm] = useState(false)
  const [showChangeDate, setShowChangeDate] = useState(false)
  const [newAlarm, setNewAlarm] = useState({ dayOfWeek: 1, time: '06:00', label: '' })
  const [newStartDate, setNewStartDate] = useState(() => {
    const date = new Date(challenge.startDate)
    return date.toISOString().split('T')[0]
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const userSettings = await storageService.getSettings()
    setSettings(userSettings)
  }

  const handleAddAlarm = async () => {
    if (!settings) return

    const alarm: GymAlarm = {
      id: `alarm-${Date.now()}`,
      dayOfWeek: newAlarm.dayOfWeek,
      time: newAlarm.time,
      enabled: true,
      label: newAlarm.label || `Gym Time - ${DAYS_OF_WEEK[newAlarm.dayOfWeek]}`,
    }

    const updatedSettings = {
      ...settings,
      gymAlarms: [...(settings.gymAlarms || []), alarm],
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
    setNewAlarm({ dayOfWeek: 1, time: '06:00', label: '' })
    setShowAddAlarm(false)
  }

  const handleToggleAlarm = async (id: string) => {
    if (!settings) return

    const updatedSettings = {
      ...settings,
      gymAlarms: (settings.gymAlarms || []).map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      ),
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  const handleDeleteAlarm = async (id: string) => {
    if (!settings) return

    const updatedSettings = {
      ...settings,
      gymAlarms: (settings.gymAlarms || []).filter(alarm => alarm.id !== id),
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  const handleChangeStartDate = async () => {
    const confirmed = confirm(
      'Changing the start date will reset your challenge progress. Continue?'
    )

    if (!confirmed) return

    // Delete old challenge
    await storageService.deleteChallenge()

    // Create workout schedule
    const workoutSchedule: Record<number, string> = {
      1: 'chest-triceps',
      2: 'back-biceps',
      3: 'shoulders',
      5: 'legs',
    }

    const challengeStartDate = new Date(newStartDate)
    challengeStartDate.setHours(0, 0, 0, 0)

    const days = initializeChallengeDays(challengeStartDate, workoutSchedule)

    const updatedChallenge: Challenge = {
      ...challenge,
      startDate: challengeStartDate.toISOString(),
      days,
      currentStreak: 0,
      bestStreak: 0,
      completedDays: 0,
      skippedDays: 0,
      restDays: days.filter(d => d.status === 'rest').length,
      updatedAt: new Date().toISOString(),
    }

    await storageService.saveChallenge(updatedChallenge)
    setShowChangeDate(false)
    
    // Force reload to refresh everything
    window.location.reload()
  }

  const handleResetChallenge = async () => {
    const confirmed = confirm(
      'Are you sure you want to reset your challenge? This will delete all your progress and cannot be undone.'
    )

    if (confirmed) {
      const doubleCheck = confirm(
        'This action is permanent. Are you absolutely sure?'
      )

      if (doubleCheck) {
        await storageService.deleteChallenge()
        window.location.reload()
      }
    }
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-3 p-4 lg:p-6">
          <button
            onClick={() => onNavigate('home')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl lg:text-2xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Gym Alarms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gym Alarms</h3>
              <p className="text-sm text-muted-foreground">
                Set reminders for your workout days
              </p>
            </div>
            <button
              onClick={() => setShowAddAlarm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Alarm
            </button>
          </div>

          {settings?.gymAlarms && settings.gymAlarms.length > 0 ? (
            <div className="space-y-3">
              {settings.gymAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                >
                  <button
                    onClick={() => handleToggleAlarm(alarm.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      alarm.enabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="font-medium">{alarm.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {DAYS_OF_WEEK[alarm.dayOfWeek]} at {alarm.time}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No alarms set yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add reminders for your workout days
              </p>
            </div>
          )}
        </div>

        {/* Challenge Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-lg mb-4">Challenge Info</h3>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Start Date</span>
            <button
              onClick={() => setShowChangeDate(true)}
              className="flex items-center gap-2 font-medium text-primary hover:underline"
            >
              {formatDate(challenge.startDate)}
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
          
          <SettingRow 
            label="Created" 
            value={formatDate(challenge.createdAt)} 
          />
          <SettingRow 
            label="Total Days" 
            value="90" 
          />
          <SettingRow 
            label="Workout Plans" 
            value={challenge.workoutPlans.length.toString()} 
          />
        </div>

        {/* App Settings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-lg mb-4">App Settings</h3>
          
          <SettingRow 
            label="Units" 
            value={settings?.units === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'} 
          />
          <SettingRow 
            label="Theme" 
            value="Dark" 
          />
          
          <p className="text-xs text-muted-foreground mt-4">
            More settings coming soon
          </p>
        </div>

        {/* About */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-lg mb-4">About</h3>
          
          <SettingRow 
            label="Version" 
            value="0.2.0" 
          />
          <SettingRow 
            label="Build" 
            value="Responsive Web App" 
          />
        </div>

        {/* Danger Zone */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-lg text-destructive">Danger Zone</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Resetting your challenge will permanently delete all your progress, workout logs, and stats. This action cannot be undone.
          </p>

          <button
            onClick={handleResetChallenge}
            className="w-full h-12 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
          >
            Reset Challenge
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6">
          <p>Project 90</p>
          <p className="mt-1">Built for those who commit.</p>
        </div>
      </div>

      {/* Add Alarm Modal */}
      {showAddAlarm && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4"
          onClick={() => setShowAddAlarm(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Add Gym Alarm</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Day of Week
                </label>
                <select
                  value={newAlarm.dayOfWeek}
                  onChange={(e) => setNewAlarm({ ...newAlarm, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Label (optional)
                </label>
                <input
                  type="text"
                  placeholder="Morning workout"
                  value={newAlarm.label}
                  onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleAddAlarm}
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Add Alarm
              </button>

              <button
                onClick={() => setShowAddAlarm(false)}
                className="w-full h-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Start Date Modal */}
      {showChangeDate && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4"
          onClick={() => setShowChangeDate(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Change Start Date</h3>
            
            <div className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-sm text-orange-200">
                  ⚠️ Changing the start date will reset your progress. Your workout history will be cleared.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleChangeStartDate}
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Change Start Date
              </button>

              <button
                onClick={() => setShowChangeDate(false)}
                className="w-full h-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SettingRowProps {
  label: string
  value: string
}

function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

