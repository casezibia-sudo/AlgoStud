import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** True when .env has Supabase keys. Without them the app runs on localStorage. */
export const remoteEnabled = !!(url && key);
export const sb: SupabaseClient = remoteEnabled ? createClient(url!, key!) : (null as unknown as SupabaseClient);
