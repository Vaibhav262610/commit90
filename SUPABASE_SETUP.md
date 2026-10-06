# Supabase Setup (Real Database - Easier than Firebase!)

Supabase is a Firebase alternative that's easier to setup and gives you a real PostgreSQL database.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (easiest) or email

## Step 2: Create a New Project

1. Click "New Project"
2. Enter project details:
   - **Name**: Commit90
   - **Database Password**: (create a strong password and save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2 minutes for project to be ready

## Step 3: Get Your API Keys

1. In your project dashboard, click the **Settings** icon (gear)
2. Go to **API** section
3. You'll see:
   - `Project URL` (looks like: https://xxxxx.supabase.co)
   - `anon/public` key (this is safe to use in your app)

## Step 4: Create Database Tables

1. Go to **SQL Editor** (left sidebar)
2. Click **+ New Query**
3. Paste this SQL and click **Run**:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Body measurements
  current_weight DECIMAL,
  target_weight DECIMAL,
  height DECIMAL,
  age INTEGER,
  gender TEXT,
  
  -- Measurements in cm
  chest DECIMAL,
  waist DECIMAL,
  hips DECIMAL,
  biceps DECIMAL,
  forearms DECIMAL,
  thighs DECIMAL,
  calves DECIMAL,
  shoulders DECIMAL,
  neck DECIMAL,
  
  -- Goals
  fitness_goal TEXT,
  activity_level TEXT
);

-- Create measurement history table
CREATE TABLE IF NOT EXISTS measurement_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  weight DECIMAL,
  chest DECIMAL,
  waist DECIMAL,
  hips DECIMAL,
  biceps DECIMAL,
  forearms DECIMAL,
  thighs DECIMAL,
  calves DECIMAL,
  shoulders DECIMAL,
  neck DECIMAL,
  
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_history ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own measurements"
  ON measurement_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements"
  ON measurement_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements"
  ON measurement_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements"
  ON measurement_history FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 5: Enable Google Authentication

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Google** in the list
3. Toggle **Enable**
4. You need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
5. Paste them in Supabase Google provider settings
6. Click **Save**

## Step 6: Install Supabase Client

In your terminal:

```bash
npm install @supabase/supabase-js
```

## Step 7: Update Your Config

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `src/config/firebase.ts` with `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Step 8: Test It!

1. Start your dev server: `npm run dev`
2. Click "Continue with Google"
3. You'll see real Google OAuth popup
4. Sign in with your Google account
5. Your data is now saved in a real PostgreSQL database!

## Benefits Over Firebase:

✅ **Real SQL Database** - PostgreSQL, not NoSQL  
✅ **Easier Setup** - No complex config files  
✅ **Free Tier** - 500MB database, 50MB storage  
✅ **Built-in Auth** - Google, GitHub, Email, Magic links  
✅ **Row Level Security** - Database-level security  
✅ **Realtime** - Built-in subscriptions  
✅ **Auto-generated APIs** - REST & GraphQL  
✅ **Better Dashboard** - See your data easily  

## Need Help?

Check out:
- [Supabase Docs](https://supabase.com/docs)
- [Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Want to stick with the current mock system?** That's fine too! The mock works perfectly for testing and development. Switch to Supabase when you want real cloud sync.
