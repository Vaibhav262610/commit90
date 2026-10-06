-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Body measurements
  current_weight DECIMAL,
  target_weight DECIMAL,
  height DECIMAL,   
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  
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
  fitness_goal TEXT CHECK (fitness_goal IN ('lose_weight', 'gain_muscle', 'maintain', 'get_fit')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'))
);

-- Create measurement history table
CREATE TABLE IF NOT EXISTS measurement_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own measurements" ON measurement_history;
DROP POLICY IF EXISTS "Users can insert own measurements" ON measurement_history;
DROP POLICY IF EXISTS "Users can update own measurements" ON measurement_history;
DROP POLICY IF EXISTS "Users can delete own measurements" ON measurement_history;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_measurement_history_user_id ON measurement_history(user_id);
CREATE INDEX IF NOT EXISTS idx_measurement_history_date ON measurement_history(date DESC);
