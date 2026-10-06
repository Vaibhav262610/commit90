# 🚀 Quick Setup Checklist

## ✅ Already Done

- [x] Supabase client installed
- [x] Environment variables configured
- [x] Auth context updated to use Supabase
- [x] User service updated for real database
- [x] Profile screen updated for Supabase
- [x] Dev server running at http://localhost:5173/

## 📋 You Need To Do (10 minutes total)

### 1. Create Database Tables (2 minutes)

1. Open: https://supabase.com/dashboard/project/jvcvnunmbxxejttioveu
2. Go to: **SQL Editor** (left sidebar)
3. Click: **+ New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste into SQL Editor
6. Click: **Run** button (or Ctrl+Enter)
7. ✅ Should see "Success. No rows returned"

### 2. Setup Google OAuth (5 minutes)

#### A. Get Google Credentials
1. Go to: https://console.cloud.google.com/
2. Create/Select project
3. Go to: **APIs & Services** → **OAuth consent screen**
4. Setup external app (app name: "Commit90")
5. Go to: **Credentials** → **Create Credentials** → **OAuth client ID**
6. Type: **Web application**
7. Add redirect URI:
   ```
   https://jvcvnunmbxxejttioveu.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy **Client ID** and **Client Secret**

#### B. Add to Supabase
1. Back to Supabase: **Authentication** → **Providers**
2. Enable **Google**
3. Paste **Client ID** and **Client Secret**
4. Click **Save**

### 3. Test Your App! (1 minute)

1. Open: http://localhost:5173/
2. Click: **"Continue with Google"**
3. **Real Google OAuth will appear!**
4. Sign in with your Google account
5. ✅ You're in!

### 4. Add Your Profile (2 minutes)

1. Click **Profile** (bottom nav)
2. Fill in your measurements
3. Click **Save Profile**
4. Click **Save as Measurement Entry**
5. ✅ Data saved to cloud!

## 🎯 What You Get

✅ Real Google authentication  
✅ PostgreSQL cloud database  
✅ Data synced across devices  
✅ Measurement history tracking  
✅ Secure row-level security  
✅ Production-ready app  

## 📝 Files Reference

- `supabase-schema.sql` - Database tables (run this first!)
- `SUPABASE_FINAL_SETUP.md` - Detailed instructions
- `.env` - Environment variables (already set up)

## ❓ Issues?

**Can't run SQL:**
- Make sure you're in the right project
- Use **SQL Editor** not Table Editor

**Google OAuth fails:**
- Check redirect URI is exactly right
- Make sure it ends with `/callback`

**Can't save data:**
- Make sure SQL schema ran successfully
- Check table policies are created

## 🎉 That's It!

Once these 3 steps are done, you have a fully functional app with:
- Real authentication
- Cloud database  
- Measurement tracking
- Multi-device sync

Total time: ~10 minutes
