import { supabase } from '@/lib/supabase';
import type { CreatorSettings, Profile } from './types';

const PROFILE_COLS = 'id, name, handle, payment_link, deletion_requested_at, deletion_scheduled_for';
const SETTINGS_COLS = 'creator_id, default_trigger, notify_answers, notify_expiring, notify_due_soon';

export type ProfilePatch = Partial<Pick<Profile, 'name' | 'handle' | 'payment_link'>>;
export type SettingsPatch = Partial<Pick<CreatorSettings, 'default_trigger' | 'notify_answers' | 'notify_expiring' | 'notify_due_soon'>>;

const check = <T,>({ data, error }: { data: T | null; error: { message: string } | null }): T => {
  if (error || !data) throw new Error(error?.message || 'Not found');
  return data;
};

export const settingsApi = {
  async load(uid: string) {
    const [p, s] = await Promise.all([
      supabase.from('profiles').select(PROFILE_COLS).eq('id', uid).single(),
      supabase.from('settings').select(SETTINGS_COLS).eq('creator_id', uid).single(),
    ]);
    return { profile: check<Profile>(p), settings: check<CreatorSettings>(s) };
  },
  async updateProfile(uid: string, patch: ProfilePatch) {
    return check<Profile>(await supabase.from('profiles').update(patch).eq('id', uid).select(PROFILE_COLS).single());
  },
  async updateSettings(uid: string, patch: SettingsPatch) {
    return check<CreatorSettings>(await supabase.from('settings').update(patch).eq('creator_id', uid).select(SETTINGS_COLS).single());
  },
  /** Needs a session created by an email code in the last 5 minutes; the database enforces it. */
  async scheduleDeletion() {
    const { error } = await supabase.rpc('schedule_deletion');
    if (error) throw new Error(error.message);
  },
  async cancelDeletion() {
    const { error } = await supabase.rpc('cancel_deletion');
    if (error) throw new Error(error.message);
  },
};
