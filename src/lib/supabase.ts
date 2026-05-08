import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please ensure the integration is complete.");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
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
  total: number;
  currency: string;
  type: 'sale' | 'expense';
  created_at: string;
};