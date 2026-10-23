// Logic self-test: content integrity, lesson engine, progress and sync merge. Run: npm run selftest
import assert from 'node:assert/strict';
import { COURSE } from '../src/content';
import { ARTS, ornamentXml } from '../src/art';
import * as L from '../src/lesson';
import * as P from '../src/progress';

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log('  ✓ ' + name); };

console.log('Content');
test('every ornament has art, 3 tasks with 3 options and a valid answer', () => {
  for (const [id, o] of Object.entries(COURSE.orn)) {
    assert.ok(ARTS[o.art], `${id}: missing art ${o.art}`);
    assert.equal(o.tasks.length, 3, `${id}: tasks`);
    for (const tk of o.tasks) {
      assert.equal(tk.o.length, 3); assert.ok(tk.a >= 0 && tk.a < 3, `${id}: answer index`);
      for (const tri of [tk.q, ...tk.o]) assert.ok(tri.every(s => s.trim().length > 0), `${id}: empty text`);
    }
    for (const tri of [o.d, o.s, o.gl]) assert.ok(tri.every(s => s.trim().length > 0), `${id}: empty text`);
  }
});
test('every lesson and checkpoint option points to a real ornament', () => {
  for (const m of COURSE.modules) {
    for (const u of m.units) for (const id of u.lessons) assert.ok(COURSE.orn[id], id);
    assert.equal(m.checkpoint.length, 5);
    for (const cp of m.checkpoint) { for (const id of cp.o) assert.ok(COURSE.orn[id], id); assert.equal(new Set(cp.o).size, 3); }
  }
});
test('ornament SVG renders to non-empty markup', () => {
  for (const id of Object.keys(COURSE.orn)) assert.match(ornamentXml(id), /^<svg[\s\S]+<\/svg>$/);
});

console.log('Lesson engine');
let seed = 7; const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
test('path order: 19 lessons + 2 checkpoints, only the first is open at start', () => {
  assert.equal(L.ORDER.length, 21);
  assert.equal(L.currentNode({}), 'ZOO-001');
  assert.ok(!L.isUnlocked('ZOO-002', {}));
  assert.ok(L.isUnlocked('ZOO-002', { 'ZOO-001': true }));
});
test('a lesson is intro + visual + 3 tasks; perfect run gives 15 XP and 100%', () => {
  let l = L.createLesson('ZOO-001', rng);
  assert.deepEqual(l.steps.map(s => s.k), ['intro', 'visual', 'task', 'task', 'task']);
  let finished = false;
  ({ lesson: l, finished } = L.advance(l));
  while (!finished) {
    l = L.select(l, L.correctIndex(l, l.steps[l.pos]));
    ({ lesson: l } = L.check(l, rng));
    assert.equal(l.ok, true);
    ({ lesson: l, finished } = L.advance(l));
  }
  assert.deepEqual(L.result(l), { id: 'ZOO-001', isCp: false, gain: 15, accuracy: 100 });
});
test('a wrong answer is repeated once at the end and costs the bonus', () => {
  let l = L.createLesson('ZOO-002', rng);
  ({ lesson: l } = L.advance(l));
  const wrong = (L.correctIndex(l, l.steps[l.pos]) + 1) % 3;
  l = L.select(l, wrong);
  ({ lesson: l } = L.check(l, rng));
  assert.equal(l.ok, false); assert.equal(l.steps.length, 6);
  let finished = false;
  ({ lesson: l, finished } = L.advance(l));
  while (!finished) {
    l = L.select(l, L.correctIndex(l, l.steps[l.pos]));
    ({ lesson: l } = L.check(l, rng));
    ({ lesson: l, finished } = L.advance(l));
  }
  const r = L.result(l);
  assert.equal(r.gain, 10); assert.equal(r.accuracy, 80); assert.equal(L.progressPct(l), 100);
});
test('checkpoint has 5 picture questions and gives 20 XP', () => {
  const l = L.createLesson('CP1', rng);
  assert.equal(l.steps.length, 5); assert.ok(l.steps.every(s => s.k === 'cp'));
  assert.equal(L.result({ ...l, right: 5 }).gain, 20);
});

console.log('Progress');
test('hearts: lose one, refill after 30 minutes, cap at 5', () => {
  let p = P.freshProgress();
  p = P.loseHeart(p, 1000);
  assert.equal(p.hearts, 4);
  assert.equal(P.regenHearts(p, 1000 + P.HEART_REFILL_MS - 1).hearts, 4);
  assert.equal(P.regenHearts(p, 1000 + P.HEART_REFILL_MS).hearts, 5);
  assert.equal(P.regenHearts({ ...p, hearts: 1 }, 1000 + 10 * P.HEART_REFILL_MS).hearts, 5);
  assert.equal(P.nextHeartIn(p, 1000 + 60000), P.HEART_REFILL_MS - 60000);
});
test('streak grows on consecutive days and resets after a gap', () => {
  let p = P.freshProgress();
  p = P.finishLesson(p, 'ZOO-001', 15, new Date(2026, 9, 20, 10));
  p = P.finishLesson(p, 'ZOO-002', 15, new Date(2026, 9, 20, 18));
  assert.equal(p.streak, 1);
  p = P.finishLesson(p, 'ZOO-003', 15, new Date(2026, 9, 21, 9));
  assert.equal(p.streak, 2); assert.equal(p.xp, 45);
  assert.equal(P.liveStreak(p, new Date(2026, 9, 22, 9)), 2);
  assert.equal(P.liveStreak(p, new Date(2026, 9, 24, 9)), 0);
  p = P.finishLesson(p, 'ZOO-004', 15, new Date(2026, 9, 25, 9));
  assert.equal(p.streak, 1);
});
test('sync merge never loses a finished lesson and keeps device-local hearts and language', () => {
  const phone: P.Progress = { ...P.freshProgress(0), done: { 'ZOO-001': true, 'ZOO-003': true }, xp: 30, hearts: 2, streak: 3, lastDay: '2026-10-22', updatedAt: 5 };
  const cloud: P.Progress = { ...P.freshProgress(2), done: { 'ZOO-001': true, 'ZOO-002': true }, xp: 45, hearts: 5, streak: 1, lastDay: '2026-10-23', updatedAt: 9 };
  const m = P.mergeProgress(phone, cloud);
  assert.deepEqual(Object.keys(m.done).sort(), ['ZOO-001', 'ZOO-002', 'ZOO-003']);
  assert.equal(m.xp, 45); assert.equal(m.streak, 1); assert.equal(m.lastDay, '2026-10-23');
  assert.equal(m.hearts, 2); assert.equal(m.lang, 0); assert.equal(m.updatedAt, 9);
  assert.deepEqual(Object.keys(P.cloudPart(m)).sort(), ['done', 'lastDay', 'streak', 'updatedAt', 'xp']);
});

console.log(`\n${passed} checks passed`);
