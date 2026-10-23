// Sign-in by emailed code and progress sync through Supabase.
// Works offline-first: the phone is the source of truth, the cloud copy is merged in.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { cloudPart, mergeProgress, type Progress } from './progress';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
      })
    : null;

export const syncEnabled = supabase !== null;

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(cb: (s: Session | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

export async function sendCode(email: string): Promise<void> {
  if (!supabase) throw new Error('sync-off');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyCode(email: string, token: string): Promise<Session> {
  if (!supabase) throw new Error('sync-off');
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error || !data.session) throw error ?? new Error('no-session');
  return data.session;
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

/** Pull the cloud copy, merge it with this phone's progress, push the result. Returns the merged progress. */
export async function syncProgress(local: Progress, session: Session): Promise<Progress> {
  if (!supabase) return local;
  const userId = session.user.id;
  const { data, error } = await supabase.from('progress').select('data').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  const merged = data?.data ? mergeProgress(local, { ...local, ...(data.data as Partial<Progress>) }) : local;
  const { error: upErr } = await supabase
    .from('progress')
    .upsert({ user_id: userId, data: cloudPart(merged), updated_at: new Date().toISOString() });
  if (upErr) throw upErr;
  return merged;
}
