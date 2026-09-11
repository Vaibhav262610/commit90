import { ChevronLeft, Trophy } from 'lucide-react'
import type { Challenge } from '../types'
import type { Screen } from '../App'
import { calculateProgress } from '../utils/challengeUtils'

interface ProgressProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
}

export function Progress({ challenge, onNavigate }: ProgressProps) {
  const progress = calculateProgress(challenge)

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
        <h1 className="text-xl font-bold">Your Progress</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Overall Progress */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">
              DAY {progress.currentDay} / 90
            </h2>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="text-center text-2xl font-bold text-primary">
              {progress.percentage}%
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Completed"
            value={progress.completedDays}
            className="bg-primary/10 text-primary"
          />
          <StatCard
            label="Skipped"
            value={progress.skippedDays}
            className="bg-destructive/10 text-destructive"
          />
          <StatCard
            label="Current Streak"
            value={challenge.currentStreak}
            icon="🔥"
          />
          <StatCard
            label="Best Streak"
            value={challenge.bestStreak}
            icon="⭐"
          />
        </div>

        {/* Challenge Stats */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-lg mb-4">Challenge Stats</h3>
          
          <StatRow label="Days Remaining" value={progress.daysRemaining} />
          <StatRow label="Rest Days" value={progress.restDays} />
          <StatRow label="Completion Rate" value={`${progress.completedDays > 0 ? Math.round((progress.completedDays / (progress.completedDays + progress.skippedDays)) * 100) : 0}%`} />
        </div>

        {/* Personal Records */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Personal Records</h3>
          </div>
          
          <div className="text-center py-8 text-muted-foreground">
            Complete workouts to track your personal records
          </div>
        </div>

        {/* Strength Progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Strength Progress</h3>
          
          <div className="text-center py-8 text-muted-foreground">
            Charts will appear as you log workouts
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  className?: string
  icon?: string
}

function StatCard({ label, value, className, icon }: StatCardProps) {
  return (
    <div className={`bg-secondary rounded-xl p-4 text-center ${className || ''}`}>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

interface StatRowProps {
  label: string
  value: string | number
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
