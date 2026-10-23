// Lesson engine: pure functions, no React. Tested by scripts/selftest.ts.
import { COURSE, type Tri } from './content';

export type Step =
  | { k: 'intro' }
  | { k: 'visual'; ids: string[]; order: number[] }
  | { k: 'cp'; q: Tri; ids: string[]; order: number[] }
  | { k: 'task'; i: number; order: number[] };

export interface LessonState {
  id: string;
  steps: Step[];
  pos: number;
  sel: number | null;
  checked: boolean;
  ok: boolean | null;
  right: number;
  mistakes: number;
  graded: number;
  requeued: string[];
}

export type Rng = () => number;

export function shuffle<T>(a: T[], rng: Rng = Math.random): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Linear order of path nodes: lessons, then the module checkpoint "CP<n>". */
export const ORDER: string[] = COURSE.modules.flatMap(m => [...m.units.flatMap(u => u.lessons), 'CP' + m.id]);
export const ALL_ORNAMENTS = Object.keys(COURSE.orn);
export const isCheckpoint = (id: string) => id.startsWith('CP');
export const moduleOf = (id: string) =>
  COURSE.modules.find(m => 'CP' + m.id === id || m.units.some(u => u.lessons.includes(id)))!;

export function isUnlocked(id: string, done: Record<string, boolean>): boolean {
  const i = ORDER.indexOf(id);
  return i === 0 || (i > 0 && !!done[ORDER[i - 1]]);
}
export function currentNode(done: Record<string, boolean>): string | undefined {
  return ORDER.find(id => !done[id] && isUnlocked(id, done));
}

export function createLesson(id: string, rng: Rng = Math.random): LessonState {
  let steps: Step[];
  if (isCheckpoint(id)) {
    const m = moduleOf(id);
    steps = m.checkpoint.map(c => ({ k: 'cp' as const, q: c.q, ids: [...c.o], order: shuffle([0, 1, 2], rng) }));
  } else {
    const o = COURSE.orn[id];
    const pool = moduleOf(id).units.flatMap(u => u.lessons).filter(x => x !== id);
    const distract = shuffle(pool, rng).slice(0, 2);
    steps = [
      { k: 'intro' },
      { k: 'visual', ids: [id, ...distract], order: shuffle([0, 1, 2], rng) },
      ...o.tasks.map((_, i) => ({ k: 'task' as const, i, order: shuffle([0, 1, 2], rng) })),
    ];
  }
  return {
    id, steps, pos: 0, sel: null, checked: false, ok: null, right: 0, mistakes: 0,
    graded: steps.filter(s => s.k !== 'intro').length, requeued: [],
  };
}

/** Index (in the unshuffled option list) of the correct answer. */
export function correctIndex(l: LessonState, s: Step): number {
  if (s.k === 'task') return COURSE.orn[l.id].tasks[s.i].a;
  return 0; // visual & checkpoint: the first id is the answer
}

export const select = (l: LessonState, idx: number): LessonState => (l.checked ? l : { ...l, sel: idx });

/** Grade the current selection. A wrong step is repeated once at the end of the lesson. */
export function check(l: LessonState, rng: Rng = Math.random): { lesson: LessonState; correct: boolean } {
  const s = l.steps[l.pos];
  if (l.sel === null || l.checked || s.k === 'intro') return { lesson: l, correct: false };
  const correct = l.sel === correctIndex(l, s);
  let steps = l.steps;
  const requeued = l.requeued.slice();
  if (!correct) {
    const key = s.k + ':' + (s.k === 'task' ? s.i : s.ids.join(','));
    if (!requeued.includes(key)) {
      requeued.push(key);
      steps = [...steps, { ...s, order: shuffle([0, 1, 2], rng) } as Step];
    }
  }
  return {
    correct,
    lesson: { ...l, steps, requeued, checked: true, ok: correct, right: l.right + (correct ? 1 : 0), mistakes: l.mistakes + (correct ? 0 : 1) },
  };
}

export function advance(l: LessonState): { lesson: LessonState; finished: boolean } {
  const pos = l.pos + 1;
  return { lesson: { ...l, pos, sel: null, checked: false, ok: null }, finished: pos >= l.steps.length };
}

export const progressPct = (l: LessonState) => Math.round((100 * Math.min(l.right, l.graded)) / l.graded);

export interface LessonResult { id: string; isCp: boolean; gain: number; accuracy: number }
export function result(l: LessonState): LessonResult {
  const isCp = isCheckpoint(l.id);
  const total = l.right + l.mistakes;
  return {
    id: l.id, isCp,
    gain: isCp ? 20 : 10 + (l.mistakes === 0 ? 5 : 0),
    accuracy: total ? Math.round((100 * l.right) / total) : 100,
  };
}
