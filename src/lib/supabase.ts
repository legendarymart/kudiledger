import { createClient } from '@supabase/supabase-js';

// These variables must be set in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to prevent crash during initialization if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

export type Profile = {
  id: string;
  phone_number: string;
  business_name: string | null;
  trial_count: number;
  is_subscribed: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  item: string;
  qty: number;
  unit_price: number;
  total: number;
  currency: string;
  type: 'sale' | 'expense';
  created_at: string;
};