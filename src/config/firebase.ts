// Local mock authentication (Firebase alternative)
// This uses localStorage instead of Firebase for demo purposes
// To use real Firebase, install firebase package and replace this file

export interface MockUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

class MockAuth {
  private currentUser: MockUser | null = null
  private listeners: ((user: MockUser | null) => void)[] = []

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('mockUser')
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
    }
  }

  signInWithPopup() {
    return new Promise<void>((resolve, reject) => {
      // Show custom Google-like login modal
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(8px);
      `

      const dialog = document.createElement('div')
      dialog.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      `

      dialog.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <svg width="48" height="48" viewBox="0 0 48 48" style="margin: 0 auto 16px;">
            <path fill="#4285F4" d="M46.1,24.2c0-1.6-0.1-3.1-0.4-4.6H24v8.7h12.4c-0.5,2.8-2.1,5.2-4.5,6.8v5.7h7.3C43.8,36.7,46.1,31,46.1,24.2z"/>
            <path fill="#34A853" d="M24,47c6.1,0,11.2-2,14.9-5.4l-7.3-5.7c-2,1.3-4.5,2.1-7.6,2.1c-5.8,0-10.8-3.9-12.6-9.2H4.1v5.9C7.8,42.1,15.3,47,24,47z"/>
            <path fill="#FBBC05" d="M11.4,28.8c-0.9-2.8-0.9-5.8,0-8.6v-5.9H4.1c-3.1,6.2-3.1,13.5,0,19.7L11.4,28.8z"/>
            <path fill="#EA4335" d="M24,9.5c3.3,0,6.2,1.1,8.5,3.3l6.4-6.4C34.2,2.4,29.1,0,24,0C15.3,0,7.8,4.9,4.1,12.3l7.3,5.7C13.2,13.4,18.2,9.5,24,9.5z"/>
          </svg>
          <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px; color: #202124;">Sign in with Google</h2>
          <p style="color: #5f6368; font-size: 14px; margin: 0;">Choose an account to continue</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 16px; margin: 24px 0;">
          <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" id="userOption">
            <img src="https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff&size=40" 
                 style="width: 40px; height: 40px; border-radius: 50%;" />
            <div style="flex: 1; text-align: left;">
              <div style="font-weight: 500; font-size: 14px; color: #202124;">Demo User</div>
              <div style="font-size: 13px; color: #5f6368;">demo@example.com</div>
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button id="cancelBtn" style="
            flex: 1;
            padding: 10px;
            border: 1px solid #dadce0;
            background: white;
            color: #3c4043;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 14px;
          ">Cancel</button>
          <button id="confirmBtn" style="
            flex: 1;
            padding: 10px;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 14px;
          ">Continue</button>
        </div>
        
        <p style="font-size: 11px; color: #5f6368; margin-top: 24px; text-align: center; line-height: 1.5;">
          This is a demo authentication. No actual Google account is used.
        </p>
      `

      modal.appendChild(dialog)
      document.body.appendChild(modal)

      const cancelBtn = dialog.querySelector('#cancelBtn')
      const confirmBtn = dialog.querySelector('#confirmBtn')
      const userOption = dialog.querySelector('#userOption')

      // Hover effect for user option
      userOption?.addEventListener('mouseenter', () => {
        (userOption as HTMLElement).style.backgroundColor = '#e8f0fe'
          ; (userOption as HTMLElement).style.borderRadius = '8px'
      })
      userOption?.addEventListener('mouseleave', () => {
        (userOption as HTMLElement).style.backgroundColor = 'transparent'
      })

      const cleanup = () => document.body.removeChild(modal)

      cancelBtn?.addEventListener('click', () => {
        cleanup()
        reject(new Error('User cancelled'))
      })

      const doSignIn = () => {
        const mockUser: MockUser = {
          uid: 'user_' + Date.now(),
          email: 'demo@example.com',
          displayName: 'Demo User',
          photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff'
        }

        this.currentUser = mockUser
        localStorage.setItem('mockUser', JSON.stringify(mockUser))
        this.notifyListeners()
        cleanup()
        setTimeout(resolve, 300)
      }

      confirmBtn?.addEventListener('click', doSignIn)
      userOption?.addEventListener('click', doSignIn)

      // Click outside to cancel
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cleanup()
          reject(new Error('User cancelled'))
        }
      })
    })
  }

  signOut() {
    return new Promise<void>((resolve) => {
      this.currentUser = null
      localStorage.removeItem('mockUser')
      this.notifyListeners()
      setTimeout(resolve, 300)
    })
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback)
    // Immediately call with current state
    setTimeout(() => callback(this.currentUser), 0)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser))
  }
}

// Initialize mock auth
export const auth = new MockAuth()
export const googleProvider = {} // Not needed for mock

// Mock Firestore for local storage
class MockFirestore {
  async getDoc(docRef: any) {
    const key = `firestore_${docRef.collection}_${docRef.id}`
    const data = localStorage.getItem(key)
    return {
      exists: () => !!data,
      data: () => data ? JSON.parse(data) : null
    }
  }

  async setDoc(docRef: any, data: any) {
    const key = `firestore_${docRef.collection}_${docRef.id}`
    localStorage.setItem(key, JSON.stringify(data))
  }

  async updateDoc(docRef: any, data: any) {
    const key = `firestore_${docRef.collection}_${docRef.id}`
    const existing = localStorage.getItem(key)
    const existingData = existing ? JSON.parse(existing) : {}
    localStorage.setItem(key, JSON.stringify({ ...existingData, ...data }))
  }
}

export const db = new MockFirestore()

export function doc(db: any, collection: string, id: string) {
  return { collection, id }
}

export async function getDoc(ref: any) {
  return db.getDoc(ref)
}

export async function setDoc(ref: any, data: any) {
  return db.setDoc(ref, data)
}

export async function updateDoc(ref: any, data: any) {
  return db.updateDoc(ref, data)
}
