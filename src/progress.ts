// Learner progress: pure functions, no React or storage. Tested by scripts/selftest.ts.
import type { Lang } from './i18n';

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 30 * 60 * 1000;

export interface Progress {
  done: Record<string, boolean>;
  xp: number;
  hearts: number;
  heartsAt: number;   // when the hearts count was last set; drives refill
  streak: number;
  lastDay: string;    // YYYY-MM-DD of the last finished lesson
  lang: Lang;
  updatedAt: number;
}

export const freshProgress = (lang: Lang = 1): Progress => ({
  done: {}, xp: 0, hearts: MAX_HEARTS, heartsAt: 0, streak: 0, lastDay: '', lang, updatedAt: 0,
});

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Hearts refill one by one; returns the progress with regenerated hearts at `now`. */
export function regenHearts(p: Progress, now: number): Progress {
  if (p.hearts >= MAX_HEARTS) return p;
  const gained = Math.floor((now - p.heartsAt) / HEART_REFILL_MS);
  if (gained <= 0) return p;
  const hearts = Math.min(MAX_HEARTS, p.hearts + gained);
  return { ...p, hearts, heartsAt: hearts >= MAX_HEARTS ? now : p.heartsAt + gained * HEART_REFILL_MS };
}

/** Milliseconds until the next heart, or 0 when full. */
export function nextHeartIn(p: Progress, now: number): number {
  if (p.hearts >= MAX_HEARTS) return 0;
  return Math.max(0, HEART_REFILL_MS - (now - p.heartsAt));
}

export function loseHeart(p: Progress, now: number): Progress {
  const base = regenHearts(p, now);
  const full = base.hearts >= MAX_HEARTS;
  return { ...base, hearts: Math.max(0, base.hearts - 1), heartsAt: full ? now : base.heartsAt, updatedAt: now };
}

export function finishLesson(p: Progress, id: string, gain: number, now: Date): Progress {
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 864e5));
  let { streak, lastDay } = p;
  if (lastDay !== today) {
    streak = lastDay === yesterday ? streak + 1 : 1;
    lastDay = today;
  }
  return { ...p, done: { ...p.done, [id]: true }, xp: p.xp + gain, streak, lastDay, updatedAt: now.getTime() };
}

/** A streak only counts if the last lesson was today or yesterday. */
export function liveStreak(p: Progress, now: Date): number {
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 864e5));
  return p.lastDay === today || p.lastDay === yesterday ? p.streak : 0;
}

/**
 * Merge two copies of progress (this phone and the cloud). Never loses a finished lesson:
 * lessons are unioned, XP takes the max, the streak comes from the copy with the later day.
 * Hearts and language are device-local, so they stay from `local`.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const done = { ...remote.done, ...local.done };
  let streak = local.streak, lastDay = local.lastDay;
  if (remote.lastDay > local.lastDay) { streak = remote.streak; lastDay = remote.lastDay; }
  else if (remote.lastDay === local.lastDay) streak = Math.max(local.streak, remote.streak);
  return {
    ...local,
    done,
    xp: Math.max(local.xp, remote.xp),
    streak,
    lastDay,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
}

/** The part of progress that is stored in the cloud. */
export const cloudPart = (p: Progress) => ({ done: p.done, xp: p.xp, streak: p.streak, lastDay: p.lastDay, updatedAt: p.updatedAt });
