# Changelog

## v0.2.0 - Major Update: Responsive Web App + New Features

### 🎨 Responsive Design
- **Desktop Layout**: Added sidebar navigation for screens ≥ 1024px
- **Improved Home Dashboard**: 2-column responsive grid layout
- **Better UI**: Gradient cards, smooth animations, professional styling
- **Adaptive Layouts**: All screens now scale beautifully from mobile to desktop

### 🆕 New Features

#### Backdate Workouts
- Click any past day in the calendar to update its status
- Mark as Completed, Skipped, or Rest Day
- Perfect for catching up on missed workout logs
- Automatic streak recalculation

#### Gym Alarms
- Set reminder alarms for specific days of the week
- Customize time and label for each alarm
- Enable/disable individual alarms
- Manage all alarms from Settings

#### Music Integration
- **Spotify Connect**: Paste your playlist URL to connect
- **Custom Music Links**: Add YouTube, SoundCloud, or any other music link
- Quick access during workouts
- Organized music library

#### Auto-Start Challenge
- No more onboarding flow
- Challenge automatically starts from last Tuesday
- Matches your request to start from "this Tuesday"
- Instant access to your dashboard

### 🔧 Technical Improvements
- Enhanced TypeScript types for GymAlarm and MusicLink
- Updated storage service with new settings structure
- Improved CSS with animations and transitions
- Better modal components with backdrop blur
- Optimized build size and performance

### 🗑️ Removed
- Onboarding screen (replaced with auto-create)
- Unnecessary startup flow

### 📱 Mobile & Desktop
- Works perfectly on phones (375-430px)
- Tablet-optimized layouts
- Desktop sidebar navigation (≥ 1024px)
- Touch-optimized on mobile, hover states on desktop

---

## v0.1.0 - Initial Release

### Core Features
- 90-day challenge tracking
- Home dashboard with day counter and streak
- Calendar view of all 90 days
- Workout planner with weekly schedule
- Active workout mode with set logging
- Progress tracking
- Settings and challenge reset
- Onboarding flow
- IndexedDB persistence
- Offline-first functionality

### Pre-configured Workouts
- Monday: Chest + Triceps
- Tuesday: Back + Biceps
- Wednesday: Shoulders
- Friday: Legs
- Rest days: Thursday, Saturday, Sunday
