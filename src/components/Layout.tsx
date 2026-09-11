import { Home, Calendar, Dumbbell, TrendingUp, Music2 } from 'lucide-react'
import { cn } from '../utils/cn'
import type { Screen } from '../App'

interface LayoutProps {
  children: React.ReactNode
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function Layout({ children, currentScreen, onNavigate }: LayoutProps) {
  const showBottomNav = !['active-workout', 'workout-preview'].includes(currentScreen)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold">PROJECT 90</h1>
          <p className="text-sm text-muted-foreground mt-1">90 days. One goal.</p>
        </div>
        
        <nav className="flex-1 px-3">
          <div className="space-y-1">
            <NavItem
              icon={Home}
              label="Home"
              active={currentScreen === 'home'}
              onClick={() => onNavigate('home')}
            />
            <NavItem
              icon={Calendar}
              label="90 Days"
              active={currentScreen === 'calendar'}
              onClick={() => onNavigate('calendar')}
            />
            <NavItem
              icon={Dumbbell}
              label="Workouts"
              active={currentScreen === 'planner'}
              onClick={() => onNavigate('planner')}
            />
            <NavItem
              icon={TrendingUp}
              label="Progress"
              active={currentScreen === 'progress'}
              onClick={() => onNavigate('progress')}
            />
            <NavItem
              icon={Music2}
              label="Music"
              active={currentScreen === 'music'}
              onClick={() => onNavigate('music')}
            />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen",
        showBottomNav ? "pb-20 lg:pb-0" : "",
        "lg:pl-64"
      )}>
        <div className="mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
            <NavButton
              icon={Home}
              label="Home"
              active={currentScreen === 'home'}
              onClick={() => onNavigate('home')}
            />
            <NavButton
              icon={Calendar}
              label="Days"
              active={currentScreen === 'calendar'}
              onClick={() => onNavigate('calendar')}
            />
            <NavButton
              icon={Dumbbell}
              label="Workouts"
              active={currentScreen === 'planner'}
              onClick={() => onNavigate('planner')}
            />
            <NavButton
              icon={Music2}
              label="Music"
              active={currentScreen === 'music'}
              onClick={() => onNavigate('music')}
            />
          </div>
        </nav>
      )}
    </div>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )
}

interface NavButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}

function NavButton({ icon: Icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
