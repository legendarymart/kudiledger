import { supabase } from "@/integrations/supabase/client.js";

export { supabase };

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
