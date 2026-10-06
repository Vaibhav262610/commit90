# 🔑 Fix: Invalid API Key Error

## The Problem:
```
AuthApiError: Invalid API key
```

Your `.env` file has the wrong Supabase key. You need the **anon/public** key.

## Quick Fix (1 minute):

### Step 1: Get Your Real Anon Key

1. **Open this link:** https://supabase.com/dashboard/project/jvcvnunmbxxejttioveu/settings/api

2. **Look for "Project API keys" section**

3. **Find the `anon` `public` key:**
   - It should be labeled as **"anon public"**
   - It's a LONG string starting with `eyJhbGc...`
   - Click the **Copy** button next to it

### Step 2: Update Your .env File

1. **Open:** `d:\commit90\.env`

2. **Replace the entire contents with:**
```
VITE_SUPABASE_URL=https://jvcvnunmbxxejttioveu.supabase.co
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
```

3. **Paste** the anon key you copied (replace `PASTE_YOUR_ANON_KEY_HERE`)

4. **Save** the file

### Step 3: Restart Dev Server

1. **Stop the current server:** Press Ctrl+C in the terminal
2. **Start again:** `npm run dev`
3. **Open:** http://localhost:5173/ (or whatever port it says)

### Step 4: Test

1. **Click "Continue with Google"**
2. **Sign in with Google**
3. **Should redirect and log you in!** ✅

---

## What the .env Should Look Like:

```env
VITE_SUPABASE_URL=https://jvcvnunmbxxejttioveu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y3ZudW5tYnh4ZWp0dGlvdmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNTI1ODMsImV4cCI6MjA1MzcyODU4M30.HW-9RwQ5vJ3LqVZGYMJTOXaWyv-LRebJJo9Pd9J7VWo
```

(But use YOUR actual anon key, not this example!)

---

## Important Notes:

✅ **anon/public key** - This is what you need (safe for frontend)  
❌ **service_role key** - Don't use this (it's secret, backend only)  
❌ **publishable key** - Wrong type (that's what you had before)  

The anon key is:
- Safe to use in your frontend code
- Safe to commit to git (for public projects)
- Needed for all Supabase client operations

---

## After Fixing:

Once you have the correct anon key and restart:

1. **Authentication will work** ✅
2. **You'll stay logged in** ✅
3. **Profile data will save** ✅
4. **Everything will work!** 🎉

---

**Go get that anon key and update your .env file!** 🚀
