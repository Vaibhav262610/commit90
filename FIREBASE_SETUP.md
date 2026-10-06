# Firebase Setup Instructions

## Step 1: Install Firebase

Run this command in your terminal (it may take a few minutes):

```bash
npm install firebase
```

## Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your support email
5. Click **Save**

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location closest to you
5. Click **Enable**

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Commit90")
5. Copy the `firebaseConfig` object

## Step 6: Update Firebase Config

Open `src/config/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 7: Update Firestore Rules (Optional but Recommended)

In Firebase Console → Firestore Database → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only read/write their own data.

## Step 8: Run Your App

```bash
npm run dev
```

## Features Now Available:

✅ **Google Authentication** - Sign in with Google account  
✅ **User Profiles** - Store user info and measurements  
✅ **Body Measurements** - Track:
  - Weight, Height, Age, Gender
  - Chest, Waist, Hips
  - Biceps, Forearms, Thighs, Calves
  - Shoulders, Neck
  - Fitness goals and activity level

✅ **Measurement History** - Track changes over time  
✅ **Cloud Database** - Data synced across devices  

## Troubleshooting

**Error: Firebase not installed**
- Run `npm install firebase` again
- Restart your development server

**Error: Firebase not configured**
- Make sure you've updated `src/config/firebase.ts` with your actual Firebase credentials

**Error: Authentication failed**
- Check that Google auth is enabled in Firebase Console
- Make sure your Firebase config is correct

**Error: Firestore permission denied**
- Update Firestore rules as shown in Step 7
- Make sure you're signed in
