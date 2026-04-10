import { createClient } from '@supabase/supabase-js';

// Support both Vite (import.meta.env) and Node/Vercel (process.env)
const supabaseUrl = 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : undefined) || 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://scukahafvtdfidkeeksi.supabase.co';

const supabaseAnonKey = 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : undefined) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is missing.");
}

export const supabase = createClient(
  supabaseUrl, 
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