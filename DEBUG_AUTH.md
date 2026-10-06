# 🔍 Debug Authentication Issues

## Current Issue:
You're stuck on the login page after Google OAuth redirects you back.

## Quick Fixes to Try:

### Fix 1: Clear Browser Data (Most Common Fix)
1. Open DevTools (F12)
2. Go to **Application** tab
3. Find **Storage** in left sidebar
4. Click **Clear site data**
5. Refresh the page
6. Try signing in again

### Fix 2: Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for any red errors
4. Look for "Auth state changed" message
5. Tell me what you see

### Fix 3: Try Different Port
The dev server is now on: **http://localhost:5174/**

Close all tabs with localhost:5173 and open http://localhost:5174/

### Fix 4: Update Supabase Redirect URI

The redirect URI might be wrong. Let's update it:

1. Go to: https://supabase.com/dashboard/project/jvcvnunmbxxejttioveu/auth/url-configuration
2. Look for **Redirect URLs**
3. Make sure these are listed:
   ```
   http://localhost:5173
   http://localhost:5174
   http://localhost:5173/
   http://localhost:5174/
   ```
4. Add any missing ones
5. Click **Save**
6. Try signing in again

### Fix 5: Check Google OAuth Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, make sure you have:
   ```
   https://jvcvnunmbxxejttioveu.supabase.co/auth/v1/callback
   ```
4. If not, add it and save
5. Try signing in again

## What Should Happen:

1. **Click "Continue with Google"**
2. **Google login page appears**
3. **Choose your account**
4. **Gets redirected to: http://localhost:5174/?code=xxx**
5. **Code exchanges for session automatically**
6. **URL cleans up**
7. **You see the home page!**

## Common Issues:

**Stuck on login with ?code= in URL:**
- Clear browser storage
- Check Supabase redirect URLs include localhost

**"Invalid redirect URL" error:**
- Add localhost URLs to Supabase URL configuration

**Nothing happens after Google redirect:**
- Check browser console for errors
- Make sure Supabase project is running
- Check that SQL tables are created

## Still Not Working?

Open browser console (F12 → Console) and copy any errors you see. The logs will tell us exactly what's failing.

## Quick Test:

Try this in the browser console:
```javascript
// Check if Supabase is loaded
console.log('Supabase loaded:', typeof window !== 'undefined')

// Check environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
```

Tell me what these print out!
