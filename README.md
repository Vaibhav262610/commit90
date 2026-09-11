# PROJECT 90

A **fully responsive** web app for tracking a personal 90-day gym challenge.

**90 days. One goal. Show up. Get stronger.**

---

## Overview

Project 90 is a **mobile-first, responsive fitness application** built to help you complete and track a 90-day gym challenge. The app works perfectly on phones (375-430px), tablets, and desktop browsers, with the eventual goal of packaging it into a native Android/iOS app using Capacitor.

### Core Loop

```
Open app → See today's day → See today's workout → Start workout 
→ Log sets → Finish workout → Day completed → Streak updates
```

---

## Features

### ✅ Fully Implemented

- **90-Day Challenge Tracking**
  - Visual calendar showing all 90 days
  - Day status: completed, skipped, rest, today, future
  - Automatic day progression
  - **Backdate workouts** - Click any past day to mark it as completed/skipped/rest

- **Responsive Design**
  - Mobile-first (375-430px phones)
  - Tablet-optimized layouts
  - Desktop sidebar navigation
  - Fluid grid layouts that adapt to screen size
  - Professional, modern UI with gradients and animations

- **Home Dashboard**
  - Current day counter (Day X / 90) with beautiful gradient card
  - Progress bar with percentage
  - Streak counter with fire emoji and best streak tracking
  - Today's workout card with exercise preview
  - Quick stats (completed, skipped, remaining)
  - Quick action buttons

- **Workout System**
  - Pre-configured workout plans (Chest+Triceps, Back+Biceps, Shoulders, Legs)
  - Weekly schedule (Mon-Sun)
  - Workout preview before starting
  - Full-screen active workout mode
  - Set-by-set logging (weight + reps)
  - 90-second rest timer between sets
  - Skip exercise option
  - Workout completion celebration

- **Progress Tracking**
  - Overall challenge progress
  - Completion percentage
  - Current streak and best streak
  - Days completed/skipped/remaining
  - Challenge statistics

- **Gym Alarms**
  - Set reminder alarms for specific days of the week
  - Customize time and label
  - Enable/disable individual alarms
  - Perfect for scheduling your gym time

- **Music Integration**
  - Connect Spotify playlists
  - Add YouTube, SoundCloud, or other music links
  - Quick access to your workout music
  - Open links directly during workouts

- **Settings**
  - Challenge information
  - Gym alarm management
  - Music link management
  - App settings (units, theme)
  - Reset challenge (with double confirmation)

- **Data Persistence**
  - IndexedDB for local storage
  - Offline-first functionality
  - No data loss on page reload

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: IndexedDB (via `idb` library)
- **Charts**: Recharts (ready for future use)

---

## Project Structure

```
project90/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Responsive app shell with sidebar + bottom nav
│   ├── screens/
│   │   ├── Home.tsx            # Main dashboard (responsive 2-column)
│   │   ├── Calendar.tsx        # 90-day calendar with backdate support
│   │   ├── WorkoutPlanner.tsx  # Weekly workout schedule
│   │   ├── WorkoutPreview.tsx  # Today's workout preview
│   │   ├── ActiveWorkout.tsx   # Live workout logging
│   │   ├── Progress.tsx        # Stats and progress
│   │   ├── Music.tsx           # Music links & Spotify integration
│   │   └── Settings.tsx        # App settings + gym alarms
│   ├── services/
│   │   └── storage.ts          # IndexedDB wrapper
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── challengeUtils.ts   # Challenge logic & calculations
│   │   └── cn.ts               # Tailwind class utility
│   ├── App.tsx                 # Main app component
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles & animations
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## Design Principles

### Responsive Layout
- **Mobile (< 1024px)**: Single column, bottom navigation, max-width container
- **Desktop (≥ 1024px)**: Sidebar navigation, multi-column grids, wider content
- All components scale intelligently
- Touch-optimized controls on mobile, hover states on desktop

### Visual Design
- Dark-first aesthetic with high-contrast text
- Primary green accent (#22c55e) for actions and success states
- Gradient cards for important metrics
- Smooth animations and transitions
- Large, bold typography for key numbers
- Status colors: green (completed), red (skipped), blue (today), gray (rest/future)

### UX Principles
- **Progressive disclosure**: Important info first, details on demand
- **Zero data loss**: All changes saved immediately to IndexedDB
- **Forgiving UI**: Easy to correct mistakes (backdate workouts)
- **Fast interactions**: No loading states for local operations
- **Clear feedback**: Visual confirmation for all actions

---

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Launch

The app automatically creates your challenge starting from the **most recent Tuesday**. This matches your request to start tracking from "this Tuesday".

### Default Workouts

The app comes with 4 pre-configured workouts:
1. **Monday** - Chest + Triceps (5 exercises)
2. **Tuesday** - Back + Biceps (5 exercises)  
3. **Wednesday** - Shoulders (4 exercises)
4. **Friday** - Legs (5 exercises)
5. **Thu/Sat/Sun** - Rest days

---

## Usage

### Starting a Workout

1. On the Home screen, tap **START WORKOUT**
2. Review today's exercises in the preview
3. Tap **START WORKOUT** again
4. Log each set:
   - Enter weight (kg)
   - Enter reps completed
   - Tap **Complete Set**
5. Rest timer appears automatically (90 seconds)
6. Continue to next exercise
7. Complete all exercises
8. Celebrate! 🎉

### Backdating Workouts

Missed logging a workout? No problem:

1. Go to **90 Days** calendar
2. Tap any **past day** (including Wednesday, Tuesday, etc.)
3. Choose:
   - **Mark as Completed** - You did the workout
   - **Mark as Skipped** - You missed it
   - **Mark as Rest Day** - It was a rest day
4. Your progress and streaks update automatically

### Changing Challenge Start Date

1. Go to **Settings**
2. Click on the **Start Date** (next to calendar icon)
3. Pick a new date
4. Confirm the change
5. Your challenge resets with the new start date

### Setting Gym Alarms

1. Go to **Settings**
2. Tap **Add Alarm**
3. Select day of week
4. Set time
5. Add optional label
6. Save

Alarms remind you when it's time to hit the gym!

### Playing Music In-App

The music player supports direct MP3 playback:

1. Go to **Music** tab
2. Click **Add** button
3. Enter track name (e.g., "Eye of the Tiger")
4. Paste a **direct MP3 URL** (see MUSIC_GUIDE.md)
5. Click **Add Track**
6. Click ▶️ to play in-app

**Controls:**
- ⏯️ Play/Pause
- ⏮️ Previous track
- ⏭️ Next track  
- 🔊 Volume slider

**For Spotify/YouTube:**
- Connect Spotify in the Spotify section
- YouTube/other links open in new tab

See [MUSIC_GUIDE.md](MUSIC_GUIDE.md) for detailed music setup instructions.

---

## Key User Flow

1. **Daily** → Open app → See Day X/90 → View streak → Tap "START WORKOUT"
2. **Workout** → See exercises → Start → Log each set (weight + reps) → Complete
3. **Completion** → 🔥 Streak updates → Day marked complete → Back to home
4. **Catch Up** → Go to calendar → Tap past days → Mark as completed/skipped

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 1024px  (bottom nav, single column)
Desktop: ≥ 1024px  (sidebar nav, multi-column)
```

---

## 🎨 Design Highlights

- **Dark theme** with high-contrast green accent
- **Gradient cards** for important metrics (day counter, streak, etc.)
- **Large typography** for key numbers (72px+ on desktop)
- **Status colors**: Green (completed), Red (skipped), Blue (today), Gray (rest/future)
- **Smooth animations** on hover and interactions
- **Modal overlays** with backdrop blur for forms
- **Sticky headers** for easy navigation
- **Celebration animation** on workout completion

---

## 📱 Ready for Capacitor

The app is structured to be wrapped with Capacitor for native iOS/Android deployment. It includes:
- Mobile-optimized viewport
- Safe-area support
- Offline-first architecture
- Touch-optimized controls
- No external dependencies required at runtime

---

## Browser Support

- **Recommended**: Chrome, Safari, Edge (latest)
- **Mobile**: iOS Safari 14+, Chrome Android
- **Requirements**: JavaScript, IndexedDB, modern CSS

---

## 🚀 New in v0.2.1

- ✅ **Change challenge start date** - Reset and pick a new start date from Settings
- ✅ **In-app music player** - Play MP3 files directly in the app
- ✅ **Music controls** - Play/pause, next/previous, volume control
- ✅ **Now Playing display** - See what's currently playing
- ✅ Previous day marking works perfectly (click any past day in calendar)

## 🚀 v0.2.0 Features

- ✅ Fully responsive desktop layout with sidebar
- ✅ Improved home dashboard with 2-column layout
- ✅ Backdate workouts feature (mark past days)
- ✅ Gym alarms and reminders
- ✅ Music integration (Spotify + custom links)
- ✅ Better UI with gradients and animations
- ✅ Auto-create challenge (no onboarding needed)
- ✅ Challenge starts from last Tuesday by default

---

## Contributing

This is a personal project, but suggestions and feedback are welcome!

---

## License

MIT License - feel free to use this as inspiration for your own projects.

---

## Credits

Built with:
- React & TypeScript
- Vite
- Tailwind CSS
- Lucide Icons
- IDB (IndexedDB wrapper)

Designed for mobile-first experiences and those who commit to their goals.

**Now go start your 90 days. 💪**
