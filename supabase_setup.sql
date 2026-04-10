-- 1. Create the Profiles table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  business_name TEXT,
  trial_count INT DEFAULT 0,
  is_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item TEXT NOT NULL,
  qty INT DEFAULT 1,
  unit_price NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  type TEXT CHECK (type IN ('sale', 'expense')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
-- This ensures users can only see their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- 5. Create a function to increment trial count
CREATE OR REPLACE FUNCTION increment_trial(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET trial_count = trial_count + 1
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;