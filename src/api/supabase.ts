import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** True when .env has Supabase keys. Without them the app runs on localStorage. */
export const remoteEnabled = !!(url && key);
/** The one shared client (src/lib/supabase.ts), so there is a single connection and session. */
export const sb: SupabaseClient = supabase;
