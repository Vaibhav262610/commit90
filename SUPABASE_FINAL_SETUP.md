# ✅ Supabase Setup - Final Steps

## Your Supabase is Almost Ready!

I've integrated Supabase into your app. Now you just need to:

### Step 1: Run the SQL Schema (2 minutes)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/jvcvnunmbxxejttioveu
2. Click **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Open the file `supabase-schema.sql` in your project root
5. Copy ALL the SQL code
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

You should see: "Success. No rows returned"

This creates:
- ✅ `profiles` table (user data)
- ✅ `measurement_history` table (body measurements over time)
- ✅ Row Level Security (users can only see their own data)
- ✅ All necessary indexes

### Step 2: Enable Google Authentication (5 minutes)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle it to **Enabled**
4. You'll see it needs Google OAuth credentials

#### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. In the sidebar, go to **APIs & Services** → **OAuth consent screen**
   - Choose **External**
   - Fill in app name: "Commit90"
   - Add your email as developer
   - Click **Save and Continue** through the steps
4. Go to **Credentials** (left sidebar)
5. Click **+ Create Credentials** → **OAuth client ID**
6. Choose **Web application**
7. Add **Authorized redirect URIs**:
   ```
   https://jvcvnunmbxxejttioveu.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. **Copy** the Client ID and Client Secret

#### Add to Supabase:

1. Go back to Supabase → Authentication → Providers → Google
2. Paste **Client ID** (Authorized Client IDs)
3. Paste **Client Secret** (Client Secret)
4. Click **Save**

### Step 3: Test It! 🎉

1. Your dev server is already running at: http://localhost:5173/
2. You'll see the login screen
3. Click **"Continue with Google"**
4. **You'll be redirected to real Google OAuth!**
5. Sign in with your actual Google account
6. You'll be redirected back to your app
7. You're signed in with your real Google account!

### Step 4: Add Your First Measurements

1. Click **Profile** (bottom nav on mobile, sidebar on desktop)
2. Fill in your info: age, height, weight, etc.
3. Add body measurements
4. Click **"Save Profile"**
5. Your data is now saved in Supabase! ✅
6. Click **"Save as Measurement Entry"** to save to history

## What's Different Now?

### Before (Mock):
- ❌ Fake authentication
- ❌ localStorage only
- ❌ No cloud sync
- ❌ Single device only

### Now (Supabase):
- ✅ **Real Google OAuth** - sign in with actual Google
- ✅ **PostgreSQL database** - production-ready
- ✅ **Cloud sync** - access from any device
- ✅ **Row-level security** - your data is private
- ✅ **Measurement history** - track progress over time
- ✅ **Auto-created profiles** - first login creates profile

## Database Structure

### `profiles` table
Stores user profile and current measurements:
- Personal info (name, email, photo)
- Current body measurements
- Fitness goals
- Activity level

### `measurement_history` table
Tracks all measurement changes over time:
- Date/time of measurement
- All body measurements at that point
- Notes
- Linked to user

## Security

✅ **Row Level Security (RLS)** enabled  
✅ Users can only see/edit their own data  
✅ Database-level security (not just app-level)  
✅ Automatic authentication checks  

## Troubleshooting

**Error: "Failed to sign in"**
- Make sure Google OAuth is properly configured
- Check that redirect URI is exactly: `https://jvcvnunmbxxejttioveu.supabase.co/auth/v1/callback`

**Error: "relation 'profiles' does not exist"**
- Run the SQL schema in Supabase SQL Editor

**Error: "Failed to save profile"**
- Check that Row Level Security policies are created
- Re-run the SQL schema

**Can't see my data in Supabase:**
- Go to **Table Editor** → `profiles`
- Make sure you're signed in with the same Google account
- Data is there, RLS is just hiding other users' data

## Check Your Data

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `profiles` table
4. You'll see your profile data!
5. Select `measurement_history` table
6. You'll see all your saved measurements!

## Environment Variables

Your `.env` file already has:
```
VITE_SUPABASE_URL=https://jvcvnunmbxxejttioveu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

These are public keys (safe to commit to git).

## Next Steps

- Add measurements regularly
- Track your progress over time
- Use the measurement history to see trends
- All data syncs across devices automatically!

## Need Help?

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your app is now production-ready with real authentication and cloud database!** 🚀
