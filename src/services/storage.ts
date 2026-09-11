import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  Challenge,
  WorkoutSession,
  ProgressMeasurement,
  ProgressPhoto,
  PersonalRecord,
  UserSettings,
} from '../types'

interface Project90DB extends DBSchema {
  challenge: {
    key: string
    value: Challenge
  }
  workoutSessions: {
    key: string
    value: WorkoutSession
    indexes: { 'by-day': number }
  }
  progressMeasurements: {
    key: string
    value: ProgressMeasurement
    indexes: { 'by-date': string }
  }
  progressPhotos: {
    key: string
    value: ProgressPhoto
    indexes: { 'by-date': string }
  }
  personalRecords: {
    key: string
    value: PersonalRecord
    indexes: { 'by-exercise': string }
  }
  settings: {
    key: string
    value: UserSettings
  }
}

class StorageService {
  private db: IDBPDatabase<Project90DB> | null = null

  async init() {
    if (this.db) return this.db

    this.db = await openDB<Project90DB>('project90-db', 1, {
      upgrade(db: IDBPDatabase<Project90DB>) {
        // Challenge store
        if (!db.objectStoreNames.contains('challenge')) {
          db.createObjectStore('challenge', { keyPath: 'id' })
        }

        // Workout sessions store
        if (!db.objectStoreNames.contains('workoutSessions')) {
          const sessionStore = db.createObjectStore('workoutSessions', {
            keyPath: 'id',
          })
          sessionStore.createIndex('by-day', 'dayNumber')
        }

        // Progress measurements store
        if (!db.objectStoreNames.contains('progressMeasurements')) {
          const measurementStore = db.createObjectStore('progressMeasurements', {
            keyPath: 'id',
          })
          measurementStore.createIndex('by-date', 'date')
        }

        // Progress photos store
        if (!db.objectStoreNames.contains('progressPhotos')) {
          const photoStore = db.createObjectStore('progressPhotos', {
            keyPath: 'id',
          })
          photoStore.createIndex('by-date', 'date')
        }

        // Personal records store
        if (!db.objectStoreNames.contains('personalRecords')) {
          const prStore = db.createObjectStore('personalRecords', {
            keyPath: 'id',
          })
          prStore.createIndex('by-exercise', 'exerciseId')
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' })
        }
      },
    })

    return this.db
  }

  // Challenge operations
  async getChallenge(): Promise<Challenge | null> {
    const db = await this.init()
    const challenges = await db.getAll('challenge')
    return challenges.length > 0 ? challenges[0] : null
  }

  async saveChallenge(challenge: Challenge): Promise<void> {
    const db = await this.init()
    challenge.updatedAt = new Date().toISOString()
    await db.put('challenge', challenge)
  }

  async deleteChallenge(): Promise<void> {
    const db = await this.init()
    const challenges = await db.getAll('challenge')
    for (const challenge of challenges) {
      await db.delete('challenge', challenge.id)
    }
  }

  // Workout session operations
  async getWorkoutSession(id: string): Promise<WorkoutSession | undefined> {
    const db = await this.init()
    return db.get('workoutSessions', id)
  }

  async getWorkoutSessionByDay(dayNumber: number): Promise<WorkoutSession | undefined> {
    const db = await this.init()
    const sessions = await db.getAllFromIndex('workoutSessions', 'by-day', dayNumber)
    return sessions.length > 0 ? sessions[0] : undefined
  }

  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    const db = await this.init()
    await db.put('workoutSessions', session)
  }

  async getAllWorkoutSessions(): Promise<WorkoutSession[]> {
    const db = await this.init()
    return db.getAll('workoutSessions')
  }

  // Progress measurement operations
  async getProgressMeasurements(): Promise<ProgressMeasurement[]> {
    const db = await this.init()
    return db.getAll('progressMeasurements')
  }

  async saveProgressMeasurement(measurement: ProgressMeasurement): Promise<void> {
    const db = await this.init()
    await db.put('progressMeasurements', measurement)
  }

  // Progress photo operations
  async getProgressPhotos(): Promise<ProgressPhoto[]> {
    const db = await this.init()
    return db.getAll('progressPhotos')
  }

  async saveProgressPhoto(photo: ProgressPhoto): Promise<void> {
    const db = await this.init()
    await db.put('progressPhotos', photo)
  }

  // Personal record operations
  async getPersonalRecords(): Promise<PersonalRecord[]> {
    const db = await this.init()
    return db.getAll('personalRecords')
  }

  async getPersonalRecordsByExercise(exerciseId: string): Promise<PersonalRecord[]> {
    const db = await this.init()
    return db.getAllFromIndex('personalRecords', 'by-exercise', exerciseId)
  }

  async savePersonalRecord(record: PersonalRecord): Promise<void> {
    const db = await this.init()
    await db.put('personalRecords', record)
  }

  // Settings operations
  async getSettings(): Promise<UserSettings> {
    const db = await this.init()
    const settings = await db.get('settings', 'user-settings')
    return settings || {
      units: 'kg',
      notificationsEnabled: false,
      theme: 'dark',
      startOfWeek: 1,
      gymAlarms: [],
      musicLinks: [],
      spotifyConnected: false,
    }
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const db = await this.init()
    await db.put('settings', { id: 'user-settings', ...settings } as any)
  }
}

export const storageService = new StorageService()
