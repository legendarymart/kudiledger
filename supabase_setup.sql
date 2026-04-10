-- 1. CLEAN SLATE: Remove existing tables and functions to avoid conflicts
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS profiles;
DROP FUNCTION IF EXISTS increment_trial;

-- 2. CREATE PROFILES TABLE
-- This stores business settings and subscription status
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  business_name TEXT,
  trial_count INT DEFAULT 0,
  is_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE TRANSACTIONS TABLE
-- This stores every sale and expense
CREATE TABLE transactions (
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

-- 4. ENABLE SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. CREATE SECURITY POLICIES
-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Transactions: Users can only see and manage their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- 6. CREATE TRIAL INCREMENT FUNCTION
-- This is called by the app to track free usage
CREATE OR REPLACE FUNCTION increment_trial(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET trial_count = trial_count + 1
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. AUTOMATIC PROFILE CREATION
-- This trigger creates a profile automatically when a user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number)
  VALUES (new.id, new.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();