// Ornament illustrations, drawn in code as filled silhouettes in the manner of cut-felt
// (syrmak) ornament: bold shapes, mirror symmetry, horns that taper into a curl.
// Original drawings; motif forms follow the traditional types, not any specific source image.
// Rendered with <SvgXml>. To swap in final artwork, return its SVG markup for the motif key.
import { COURSE } from './content';

type Pal = string[];
type P = [number, number];

export const PAL: Record<string, Pal> = {
  // [tile background, main silhouette, accent]
  muyiz: ['#FCE6DF', '#B42A34', '#E2A72E'],
  qoshqar: ['#E1EBF8', '#1E4FA3', '#B42A34'],
  synyq: ['#FFF0D2', '#B42A34', '#1E4FA3'],
  syngar: ['#E1EBF8', '#1E4FA3', '#B42A34'],
  tuyeorkesh: ['#F5E4D2', '#7A4A2E', '#B42A34'],
  tuyetaban: ['#E3EEF9', '#1E4FA3', '#B42A34'],
  botamoyin: ['#FBE4E1', '#9E2232', '#7A4A2E'],
  atbasy: ['#E3E8F3', '#1C2340', '#B42A34'],
  jilinshik: ['#FBEBC2', '#1C1C22', '#B42A34'],
  kanka: ['#E8F2D8', '#2F6E43', '#D99A1E'],
  tortkulak: ['#FFF0D2', '#B42A34', '#1E4FA3'],
  qus: ['#DDEFF9', '#1F6FA8', '#B42A34'],
  qanat: ['#E2F2E8', '#1E4FA3', '#3E8E57'],
  qarlygash: ['#DDEFF9', '#1C2340', '#3BA7D6'],
  qargatuyaq: ['#FFF0D2', '#1C2340', '#B42A34'],
  tyshqan: ['#F5E4D2', '#7A4A2E', '#B42A34'],
  itquyryk: ['#E9D3BA', '#1E4FA3', '#B42A34'],
  ormekshi: ['#FFF0D2', '#7A4A2E', '#D99A1E'],
  qumyrsqa: ['#FBEED6', '#7A4A2E', '#B42A34'],
  butaq: ['#E6F2DE', '#2F6E43'], burshik: ['#FBE6E3', '#A8283A'], besjapyraq: ['#E6F2DE', '#3C7A3F'],
  gul: ['#FFF0D2', '#B8441F'], raushan: ['#FCE4E8', '#A8283A'], tortgul: ['#E6F2DE', '#2F6E43'], aishabibi: ['#E3EEF9', '#1E5FA8'],
  temirqazyq: ['#E1EBF8', '#1B3A7A'], juldyz: ['#E1EBF8', '#B42A34'], qosdongelek: ['#FBE6E3', '#1C2340'], bestanba: ['#F5E4D2', '#7A4A2E'],
  tolqyn: ['#DDEFF9', '#1F6FA8'], ireksu: ['#DDEFF9', '#1B3A7A'], qainar: ['#E1F3F5', '#127C8C'],
  balta: ['#F5E4D2', '#5A3A22'], qarmaq: ['#DDEFF9', '#1C2340'], taraq: ['#FBEBC2', '#7A4A2E'], baspaldaq: ['#F5E4D2', '#A8283A'],
  ilmek: ['#FBE6E3', '#7A4A2E'], baldaq: ['#E9D3BA', '#3E2A1C'], tumarsha: ['#E3E8F3', '#1C2340'], tuiyq: ['#FFF0D2', '#A8283A'],
  qoltyqsha: ['#F5E4D2', '#A8283A'],
};

/* ---------------- geometry ---------------- */

const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (pts: P[]) => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L') + 'Z';

interface Xf { x?: number; y?: number; s?: number; sx?: number; sy?: number; rot?: number }
function xf(pts: P[], t: Xf): P[] {
  const s = t.s ?? 1, sx = (t.sx ?? 1) * s, sy = (t.sy ?? 1) * s;
  const a = ((t.rot ?? 0) * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
  return pts.map(([x, y]) => {
    const X = x * sx, Y = y * sy;
    return [(t.x ?? 0) + X * c - Y * sn, (t.y ?? 0) + X * sn + Y * c];
  });
}

/** Sample a chain of cubic Béziers. segs: [c1x,c1y,c2x,c2y,x,y] continuing from `start`. */
function chain(start: P, segs: number[][], n = 18): P[] {
  const out: P[] = [start];
  let p0 = start;
  for (const [a, b, c, d, x, y] of segs) {
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * a + 3 * u * t * t * c + t * t * t * x,
        u * u * u * p0[1] + 3 * u * u * t * b + 3 * u * t * t * d + t * t * t * y,
      ]);
    }
    p0 = [x, y];
  }
  return out;
}

/** Filled outline of a stroke whose width tapers from w0 to w1 along the centerline, with a round tip. */
function taperPts(line: P[], w0: number, w1: number, ease = 1): P[] {
  const L: number[] = [0];
  for (let i = 1; i < line.length; i++) L.push(L[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  const total = L[L.length - 1];
  const left: P[] = [], right: P[] = [];
  for (let i = 0; i < line.length; i++) {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    const w = (w0 + (w1 - w0) * Math.pow(L[i] / total, ease)) / 2;
    left.push([line[i][0] - ty * w, line[i][1] + tx * w]);
    right.push([line[i][0] + ty * w, line[i][1] - tx * w]);
  }
  // round tip
  const end = line[line.length - 1], prev = line[line.length - 2];
  const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
  const cap: P[] = [];
  for (let k = 1; k < 8; k++) {
    const t = ang + Math.PI / 2 - (k * Math.PI) / 8;
    cap.push([end[0] + Math.cos(t) * (w1 / 2), end[1] + Math.sin(t) * (w1 / 2)]);
  }
  return [...left, ...cap, ...right.reverse()];
}

const path = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const poly = (pts: P[], fill: string) => path(fmt(pts), fill);
const circle = (x: number, y: number, r: number, fill: string) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${fill}"/>`;
const diamond = (x: number, y: number, r: number, fill: string) => poly([[x, y - r], [x + r, y], [x, y + r], [x - r, y]], fill);
const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${fill}"/>`;

/** A generic tapered curve from a Bézier chain, placed with a transform. */
function blade(start: P, segs: number[][], w0: number, w1: number, t: Xf, fill: string, ease = 1) {
  return poly(xf(taperPts(chain(start, segs), w0, w1, ease), t), fill);
}

/** Thick angular line (for geometric motifs): square caps, mitred corners. */
const bar = (pts: P[], w: number, fill: string) =>
  `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L')}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="square"/>`;
const mirrorX = (pts: P[], cx = 60): P[] => pts.map(([x, y]) => [2 * cx - x, y]);
const mirrorY = (pts: P[], cy = 60): P[] => pts.map(([x, y]) => [x, 2 * cy - y]);

/* ---------------- felt-cut primitives ---------------- */

/** Pointed blade: like taperPts but ends in a sharp point. */
function spikePts(line: P[], w0: number): P[] {
  const pts = taperPts(line, w0, 0.01, 1);
  return pts;
}
/** A tapered curve ending in a sharp point, from a Bézier chain. */
function spike(start: P, segs: number[][], w0: number, t: Xf, fill: string) {
  return poly(xf(spikePts(chain(start, segs), w0), t), fill);
}

interface Coil { cx: number; cy: number; R0: number; R1: number; turns: number; w: number; w0?: number; lead: number[]; knob?: number; a0?: number }
/**
 * Thick spiral horn: from base (0,0) a lead curve reaches the top of a spiral centred at (cx,cy),
 * then winds clockwise inward (R0 → R1) and ends in a round knob — the cut-felt qoshqar müyiz curl.
 */
function coilPts(c: Coil): P[] {
  const a0 = ((c.a0 ?? -90) * Math.PI) / 180;
  const S: P = [c.cx + c.R0 * Math.cos(a0), c.cy + c.R0 * Math.sin(a0)];
  const lead = chain([0, 0], [[c.lead[0], c.lead[1], c.lead[2], c.lead[3], S[0], S[1]]], 16);
  const sp: P[] = [];
  const n = Math.round(48 * c.turns);
  for (let i = 1; i <= n; i++) {
    const t = i / n, th = a0 + t * c.turns * 2 * Math.PI;
    const r = c.R0 - (c.R0 - c.R1) * t;
    sp.push([c.cx + r * Math.cos(th), c.cy + r * Math.sin(th)]);
  }
  return [...lead, ...sp];
}
function coil(c: Coil, t: Xf & { flip?: boolean }, fill: string) {
  const line = coilPts(c);
  const body = taperPts(line, c.w0 ?? c.w * 1.15, c.w, 1);
  const end = line[line.length - 1];
  const T = { ...t, sx: (t.sx ?? 1) * (t.flip ? -1 : 1) };
  const [kx, ky] = xf([end], T)[0];
  const k = (t.s ?? 1) * (c.knob ?? c.w * 0.62);
  return poly(xf(body, T), fill) + circle(kx, ky, k, fill);
}
const coilPair = (c: Coil, t: Xf, fill: string) => coil(c, t, fill) + coil(c, { ...t, flip: true }, fill);

/** Tulip bud on a short neck, tip pointing up, base at (0,0). */
const BUD: P[] = chain([0, 0], [[-3, -2, -10, -6, -10, -13], [-10, -20, -4, -24, 0, -32], [4, -24, 10, -20, 10, -13], [10, -6, 3, -2, 0, 0]], 12);
const bud = (t: Xf, fill: string) => poly(xf(BUD, t), fill);

/* ---------------- motifs ---------------- */

const ART: Record<string, (p: Pal) => string> = {
  // Müyiz: the basic element — a stem that opens into two horns curling outward.
  muyiz: ([, f]) =>
    spike([0, 0], [[0, 14, 0, 28, 0, 40]], 16, { x: 60, y: 64 }, f) +
    spike([0, 0], [[-2, 5, -7, 9, -13, 10]], 9, { x: 59, y: 94 }, f) +
    spike([0, 0], [[2, 5, 7, 9, 13, 10]], 9, { x: 61, y: 94 }, f) +
    coilPair({ a0: 180, cx: 20, cy: -20, R0: 20, R1: 7, turns: 0.9, w0: 13, w: 11, knob: 7.2, lead: [0, -7, 0, -14] }, { x: 60, y: 66 }, f),

  // Qoshqar müyiz: bud and leaves on top, two heavy horns rolling down, forked foot.
  qoshqar: ([, f]) =>
    spike([0, 0], [[0, 20, 0, 40, 0, 62]], 19, { x: 60, y: 36 }, f) +
    spike([0, 0], [[-2, 6, -8, 11, -15, 13]], 10, { x: 59, y: 88 }, f) +
    spike([0, 0], [[2, 6, 8, 11, 15, 13]], 10, { x: 61, y: 88 }, f) +
    coilPair({ cx: 25, cy: 22, R0: 22, R1: 9, turns: 0.9, w0: 11, w: 15, knob: 9, lead: [4, -8, 14, -1] }, { x: 60, y: 54, s: 0.95 }, f) +
    spike([0, 0], [[6, 0, 13, -3, 17, -11]], 10, { x: 60, y: 45 }, f) +
    spike([0, 0], [[-6, 0, -13, -3, -17, -11]], 10, { x: 60, y: 45 }, f) +
    bud({ x: 60, y: 42, s: 0.85 }, f),

  // Synyq müyiz: the horn hook rebuilt from straight lines, four hooks around a diamond.
  synyq: ([b, f]) => {
    const hook: P[] = [[60, 46], [60, 26], [84, 26], [84, 44], [70, 44], [70, 36]];
    let s = '';
    for (const pts of [hook, mirrorX(hook), mirrorY(hook), mirrorX(mirrorY(hook))]) s += bar(pts, 9, f);
    return s + diamond(60, 60, 13, f) + diamond(60, 60, 5, b);
  },

  // Syngar müyiz: a border band with single horns rising from it, all curling the same way.
  syngar: ([, f]) =>
    rect(8, 84, 104, 12, f, 2) +
    [14, 46, 78].map(x => coil({ a0: 180, cx: 14, cy: -22, R0: 14, R1: 4.5, turns: 0.88, w0: 10, w: 8, knob: 5.4, lead: [0, -8, 0, -15] }, { x: x + 1, y: 86 }, f)).join('') +
    [31, 63, 95].map(x => spike([0, 0], [[0, -6, 0, -12, 0, -18]], 7, { x, y: 85 }, f)).join(''),

  // Tüye örkesh: two camel humps rising from a band, a bud between them.
  tuyeorkesh: ([b, f]) =>
    path('M10 98 L10 88 C17 88 20 42 39 42 C54 42 56 62 60 70 C64 62 66 42 81 42 C100 42 103 88 110 88 L110 98 Z', f) +
    bud({ x: 39, y: 84, s: 0.95 }, b) + bud({ x: 81, y: 84, s: 0.95 }, b) +
    bud({ x: 60, y: 72, s: 0.75 }, f),

  // Tüye taban: four camel footprints (two-toed hearts) around a diamond.
  tuyetaban: ([b, f]) => {
    const pad = chain([0, 0], [[-13, 0, -17, -15, -11, -24], [-7, -30, -1, -28, 0, -17], [1, -28, 7, -30, 11, -24], [17, -15, 13, 0, 0, 0]], 14);
    let s = '';
    for (let k = 0; k < 4; k++) {
      const ang = ((k * 90 + 45) * Math.PI) / 180;
      s += poly(xf(pad, { s: 1.15, rot: k * 90 + 45 }).map(([x, y]) => [x + 60 + Math.sin(ang) * 13, y + 60 - Math.cos(ang) * 13] as P), f);
    }
    return s + diamond(60, 60, 9, f) + diamond(60, 60, 3.5, b);
  },

  // Bota moyyn: two slender necks bowing towards each other into heavy curls, a bud between.
  botamoyin: ([, f]) => {
    const neck = (flip: boolean) => {
      const sx = flip ? -1 : 1;
      return blade([0, 0], [[24, -8, 32, -30, 24, -50], [19, -62, 5, -66, 1, -56], [-1, -51, 3, -47, 7, -49]], 12, 9, { x: 60 + sx * 5, y: 102, sx }, f, 0.9) +
        circle(60 + sx * 12, 53, 6.5, f);
    };
    return neck(false) + neck(true) + bud({ x: 60, y: 84, s: 0.95 }, f) +
      spike([0, 0], [[0, 4, 0, 8, 0, 14]], 8, { x: 60, y: 84 }, f);
  },

  // At basy: two horse heads facing each other, arched necks.
  atbasy: ([, f]) => {
    const head: P[] = chain([0, 0], [
      [-2, -22, 2, -40, 12, -48], [13, -53, 15, -58, 17, -61], [19, -57, 20, -53, 22, -50],
      [30, -46, 38, -38, 42, -30], [44, -26, 42, -22, 37, -22], [31, -22, 27, -24, 24, -22],
      [20, -14, 20, -6, 24, 0],
    ], 12);
    const one = (flip: boolean) => {
      const x0 = flip ? 106 : 14, sx = flip ? -1 : 1;
      return poly(xf(head, { x: x0, y: 96, sx, s: 0.95 }), f) +
        spike([0, 0], [[-8, 4, -12, 14, -8, 24]], 7, { x: x0 + sx * 8, y: 52, sx }, f);
    };
    return one(false) + one(true) + rect(10, 96, 100, 9, f, 2);
  },

  // Jilinshik: the "shin bone" key — an angular meander.
  jilinshik: ([b, f]) => {
    const key: P[] = [[14, 88], [14, 34], [52, 34], [52, 70], [32, 70], [32, 52], [42, 52]];
    return bar(key, 10, f) + bar(mirrorX(mirrorY(key)), 10, f) + diamond(60, 60, 7, f) + diamond(60, 60, 2.5, b);
  },

  // Qangqa: a spine with dense ribs, each rib tapering to a point.
  kanka: ([, f]) => {
    let s = rect(55, 18, 10, 90, f, 3);
    for (let i = 0; i < 6; i++) {
      const y = 28 + i * 13;
      s += spike([0, 0], [[-10, 2, -20, 6, -30, 13]], 9, { x: 57, y }, f) + spike([0, 0], [[10, 2, 20, 6, 30, 13]], 9, { x: 63, y }, f);
    }
    return s + bud({ x: 60, y: 22, s: 0.6 }, f);
  },

  // Tört qulaq: four ram's-horn pairs on the four sides of a square core.
  tortkulak: ([b, f]) => {
    let s = '';
    for (let k = 0; k < 4; k++) {
      const ang = (k * 90 * Math.PI) / 180;
      s += coilPair({ a0: 180, cx: 16, cy: -15, R0: 16, R1: 5.5, turns: 0.9, w0: 12, w: 9, knob: 6, lead: [0, -5, 0, -10] },
        { x: 60 + Math.sin(ang) * 12, y: 60 - Math.cos(ang) * 12, rot: k * 90, s: 0.78 }, f);
    }
    return s + poly([[60, 44], [76, 60], [60, 76], [44, 60]], f) + diamond(60, 60, 5, b);
  },

  // Qus: two swans with S-shaped necks facing a bud.
  qus: ([b, f]) => {
    const bird = (flip: boolean) => {
      const t: Xf = { x: flip ? 104 : 16, y: 0, sx: flip ? -1 : 1 };
      const body = chain([0, 82], [[4, 98, 30, 102, 40, 88], [44, 82, 42, 74, 36, 72], [26, 70, 14, 76, 0, 82]], 12);
      return poly(xf(body, t), f) + blade([34, 76], [[42, 64, 40, 50, 30, 46], [22, 43, 20, 34, 28, 30]], 10, 7, t, f) +
        poly(xf([[27, 26], [33, 27], [42, 33], [33, 33]], t), f) + circle(flip ? 104 - 31 : 16 + 31, 29, 1.8, b) +
        spike([0, 0], [[-6, -2, -12, -8, -14, -16]], 8, { ...t, x: (t.x as number), y: 82 }, f);
    };
    return bird(false) + bird(true) + bud({ x: 60, y: 62, s: 0.9 }, f) + spike([0, 0], [[0, 6, 0, 14, 0, 24]], 7, { x: 60, y: 61 }, f);
  },

  // Qus qanaty: two curls facing the centre under a bud, long pointed wings sweeping out.
  qanat: ([, f]) =>
    path('M58 74 C46 74 30 70 22 58 C16 50 14 40 12 28 C22 40 32 48 44 52 C52 55 56 60 58 66 Z', f) +
    path('M62 74 C74 74 90 70 98 58 C104 50 106 40 108 28 C98 40 88 48 76 52 C68 55 64 60 62 66 Z', f) +
    coilPair({ cx: 14, cy: 15, R0: 14, R1: 6, turns: 0.85, w0: 10, w: 10, knob: 6.2, lead: [3, -3, 8, 1] }, { x: 60, y: 76 }, f) +
    spike([0, 0], [[0, 16, 0, 32, 0, 48]], 13, { x: 60, y: 50 }, f) +
    spike([0, 0], [[5, 0, 10, -2, 13, -8]], 7, { x: 60, y: 52 }, f) +
    spike([0, 0], [[-5, 0, -10, -2, -13, -8]], 7, { x: 60, y: 52 }, f) +
    bud({ x: 60, y: 50, s: 0.8 }, f),

  // Qarlyghash: a swallow seen from above: swept wings, deep forked tail.
  qarlygash: ([b, f]) =>
    path('M60 20 C66 20 68 28 67 36 C80 32 98 30 112 36 C98 44 82 52 70 58 L74 76 L88 104 L68 86 L60 96 L52 86 L32 104 L46 76 L50 58 C38 52 22 44 8 36 C22 30 40 32 53 36 C52 28 54 20 60 20 Z', f) +
    path('M60 42 C63 42 64 50 63 56 L60 61 L57 56 C56 50 57 42 60 42 Z', b),

  // Qargha tuyaq: crow's tracks — three pointed toes and a heel, stepping diagonally.
  qargatuyaq: ([, f]) => {
    const foot: P[] = [[0, 9], [-4.5, 0], [-18, -13], [-5, -5], [-3.5, -23], [0, -8], [3.5, -23], [5, -5], [18, -13], [4.5, 0]];
    return [[34, 94], [60, 64], [86, 34]].map(([x, y]) => poly(xf(foot, { x, y, rot: 30, s: 1.12 }), f)).join('');
  },

  // Tyshqan izi: mouse tracks — nested chevrons running in a band.
  tyshqan: ([, f]) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const y = 28 + i * 18;
      s += poly([[14, y], [60, y + 23], [106, y], [106, y + 10], [60, y + 33], [14, y + 10]], f);
    }
    return s;
  },

  // It quyryq: curled dog's tails rising and hanging along a carved band.
  itquyryk: ([, f]) => {
    const c: Coil = { a0: 180, cx: 10, cy: -14, R0: 10, R1: 3.5, turns: 0.85, w0: 13, w: 5.5, knob: 3.8, lead: [0, -5, 0, -10] };
    let s = rect(8, 90, 104, 6, f, 2) + rect(8, 24, 104, 6, f, 2);
    [10, 36, 62, 88].forEach((x, i) => { s += i % 2 ? coil(c, { x: x + 2, y: 32, sy: -1 }, f) : coil(c, { x: x + 2, y: 88 }, f); });
    for (let k = 0; k < 4; k++) s += circle(25 + k * 26, k % 2 ? 76 : 44, 2.4, f);
    return s;
  },

  // Örmekshi: the spider as an ornament — a rhombic body with horn-curl legs on the four diagonals.
  ormekshi: ([b, f]) => {
    let s = '';
    for (let k = 0; k < 4; k++) {
      const ang = ((k * 90 + 45) * Math.PI) / 180;
      s += coilPair({ a0: 180, cx: 15, cy: -13, R0: 15, R1: 5, turns: 0.9, w0: 11, w: 9, knob: 5.6, lead: [0, -4, 0, -8] },
        { x: 60 + Math.sin(ang) * 17, y: 62 - Math.cos(ang) * 17, rot: k * 90 + 45, s: 0.72 }, f);
    }
    return s + poly([[60, 40], [76, 62], [60, 88], [44, 62]], f) + poly([[60, 50], [68, 62], [60, 76], [52, 62]], b) +
      diamond(60, 62, 3.5, f) + diamond(60, 31, 7, f);
  },

  // Qumyrsqa: the ant — an angular cross whose arms end in hooks, around a diamond.
  qumyrsqa: ([b, f]) => {
    const arm: P[] = [[66, 54], [86, 34], [86, 20], [100, 20]];
    let s = '';
    for (const pts of [arm, mirrorX(arm), mirrorY(arm), mirrorX(mirrorY(arm))]) s += bar(pts, 9, f);
    return s + diamond(60, 60, 14, f) + diamond(60, 60, 5, b);
  },

  /* ---------- Module 3: plants ---------- */

  // Butaq: a stem with paired leaves, roots curling at its foot and a bud at its top.
  butaq: ([, f]) => {
    const leaf = chain([0, 0], [[6, -9, 18, -15, 30, -14], [22, -4, 11, 0, 0, 0]], 12);
    let s = rect(56.5, 30, 7, 70, f, 3);
    [[90, 1.05], [72, 0.95], [54, 0.8]].forEach(([y, k]) => {
      s += poly(xf(leaf, { x: 62, y, s: k }), f) + poly(xf(leaf, { x: 58, y, s: k, sx: -1 }), f);
    });
    return s + coilPair({ cx: 12, cy: 9, R0: 9, R1: 3.5, turns: 0.85, w0: 7, w: 7, knob: 4.4, lead: [3, -1, 6, 0] }, { x: 60, y: 98 }, f) + bud({ x: 60, y: 34, s: 0.75 }, f);
  },

  // Bürshik: a large tulip bud cupped by two leaves, small curls at the stem foot.
  burshik: ([b, f]) =>
    spike([0, 0], [[0, 10, 0, 22, 0, 32]], 11, { x: 60, y: 70 }, f) +
    spike([0, 0], [[-8, -4, -20, -14, -24, -34]], 12, { x: 57, y: 88 }, f) + spike([0, 0], [[8, -4, 20, -14, 24, -34]], 12, { x: 63, y: 88 }, f) +
    bud({ x: 60, y: 74, s: 1.65 }, f) + bud({ x: 60, y: 64, s: 0.75 }, b) +
    coilPair({ cx: 12, cy: 9, R0: 9, R1: 3.5, turns: 0.85, w0: 7, w: 7, knob: 4.4, lead: [3, -1, 6, 0] }, { x: 60, y: 98 }, f),

  // Besjapyraq: five pointed leaves round a pierced centre.
  besjapyraq: ([b, f]) => {
    const leaf = chain([0, 0], [[-13, -9, -13, -28, 0, -40], [13, -28, 13, -9, 0, 0]], 14);
    let s = '';
    for (let k = 0; k < 5; k++) s += poly(xf(leaf, { x: 60 + Math.sin((k * 72 * Math.PI) / 180) * 8, y: 62 - Math.cos((k * 72 * Math.PI) / 180) * 8, rot: k * 72 }), f);
    for (let k = 0; k < 5; k++) { const a = ((k * 72 + 36) * Math.PI) / 180; s += diamond(60 + Math.sin(a) * 30, 62 - Math.cos(a) * 30, 3.5, f); }
    return s + circle(60, 62, 11, f) + circle(60, 62, 4.5, b);
  },

  // Gül: an eight-petalled flower filling its whole field.
  gul: ([b, f]) => {
    const petal = chain([0, 0], [[-11, -6, -14, -22, -6, -32], [-3, -36, 3, -36, 6, -32], [14, -22, 11, -6, 0, 0]], 12);
    let s = '';
    for (let k = 0; k < 8; k++) s += poly(xf(petal, { x: 60, y: 60, rot: k * 45 }), f);
    for (let k = 0; k < 8; k++) s += poly(xf(chain([0, 0], [[-4, -4, -5, -12, 0, -18], [5, -12, 4, -4, 0, 0]], 8), { x: 60, y: 60, rot: k * 45 + 22.5, s: 1 }), b);
    return s + circle(60, 60, 9, f) + circle(60, 60, 3.5, b);
  },

  // Raushan gül: a rose — an outer ring of broad petals, an inner ring cut out, a solid heart.
  raushan: ([b, f]) => {
    const petal = chain([0, 0], [[-16, -6, -20, -28, -8, -38], [-4, -42, 4, -42, 8, -38], [20, -28, 16, -6, 0, 0]], 12);
    let s = '';
    for (let k = 0; k < 6; k++) s += poly(xf(petal, { x: 60, y: 60, rot: k * 60 }), f);
    for (let k = 0; k < 6; k++) s += poly(xf(petal, { x: 60, y: 60, rot: k * 60 + 30, s: 0.55 }), b);
    for (let k = 0; k < 6; k++) s += poly(xf(petal, { x: 60, y: 60, rot: k * 60, s: 0.3 }), f);
    return s + circle(60, 60, 5, f);
  },

  // Törtgül: four tulips turned to the four sides, leaves between them.
  tortgul: ([b, f]) => {
    let s = '';
    for (let k = 0; k < 4; k++) {
      const a = (k * 90 * Math.PI) / 180;
      s += bud({ x: 60 + Math.sin(a) * 14, y: 60 - Math.cos(a) * 14, rot: k * 90, s: 1.05 }, f);
      const d = ((k * 90 + 45) * Math.PI) / 180;
      s += spike([0, 0], [[0, -8, 2, -16, 0, -24]], 9, { x: 60 + Math.sin(d) * 10, y: 60 - Math.cos(d) * 10, rot: k * 90 + 45 }, f);
    }
    return s + poly([[60, 46], [74, 60], [60, 74], [46, 60]], f) + diamond(60, 60, 5, b);
  },

  // Aisha Bibi: a pointed arch, as on the mausoleum's carved walls, holding a closed bud.
  aishabibi: ([b, f]) =>
    path('M26 106 L26 54 C26 34 46 20 60 10 C74 20 94 34 94 54 L94 106 Z', f) +
    path('M34 98 L34 56 C34 40 50 28 60 20 C70 28 86 40 86 56 L86 98 Z', b) +
    spike([0, 0], [[0, 12, 0, 26, 0, 38]], 10, { x: 60, y: 58 }, f) +
    bud({ x: 60, y: 62, s: 1.05 }, f) +
    coilPair({ cx: 11, cy: 9, R0: 10, R1: 4, turns: 0.85, w0: 7, w: 8, knob: 5, lead: [3, -2, 6, 0] }, { x: 60, y: 76 }, f) +
    spike([0, 0], [[-5, -2, -12, -6, -15, -14]], 7, { x: 59, y: 92 }, f) + spike([0, 0], [[5, -2, 12, -6, 15, -14]], 7, { x: 61, y: 92 }, f),

  /* ---------- Module 4: sky and water ---------- */

  // Temirqazyq: the Pole Star — an eight-pointed star of two squares around a ringed centre.
  temirqazyq: ([b, f]) => {
    const sq = (r: number, rot: number) => poly(xf([[-r, -r], [r, -r], [r, r], [-r, r]], { x: 60, y: 60, rot }), f);
    return sq(30, 0) + sq(30, 45) + circle(60, 60, 18, b) + circle(60, 60, 12, f) + circle(60, 60, 5, b) +
      [0, 1, 2, 3].map(k => diamond(60 + [0, 46, 0, -46][k], 60 + [-46, 0, 46, 0][k], 5, f)).join('');
  },

  // Juldyz: a star of four long and four short sharp rays.
  juldyz: ([b, f]) => {
    const pts: P[] = [];
    for (let k = 0; k < 16; k++) {
      const r = k % 2 ? 11 : k % 4 === 0 ? 48 : 30;
      const a = ((k * 22.5 - 90) * Math.PI) / 180;
      pts.push([60 + r * Math.cos(a), 60 + r * Math.sin(a)]);
    }
    return poly(pts, f) + diamond(60, 60, 7, b) + diamond(60, 60, 3, f);
  },

  // Qos döngelek: two thick rings linked together.
  qosdongelek: ([b, f]) =>
    `<circle cx="44" cy="60" r="22" fill="none" stroke="${f}" stroke-width="11"/>` +
    `<circle cx="76" cy="60" r="22" fill="none" stroke="${f}" stroke-width="11"/>` +
    `<path d="M63.1 71 A22 22 0 0 1 56.3 78.2" fill="none" stroke="${b}" stroke-width="16"/>` +
    `<path d="M62.4 72 A22 22 0 0 1 55.4 78.8" fill="none" stroke="${f}" stroke-width="11"/>` +
    diamond(60, 60, 4, f),

  // Bes tangba: five marks — four corners and a centre joined by a cross.
  bestanba: ([b, f]) =>
    bar([[60, 22], [60, 98]], 6, f) + bar([[22, 60], [98, 60]], 6, f) +
    [[60, 22], [98, 60], [60, 98], [22, 60]].map(([x, y]) => diamond(x, y, 12, f) + diamond(x, y, 4, b)).join('') +
    diamond(60, 60, 18, f) + diamond(60, 60, 9, b) + diamond(60, 60, 4, f),

  // Tolqyn: waves rolling to the shore, each crest curling forward.
  tolqyn: ([, f]) => {
    const c: Coil = { a0: 180, cx: 14, cy: -22, R0: 14, R1: 5, turns: 0.9, w0: 18, w: 7.5, knob: 4.8, lead: [0, -6, 0, -12] };
    return rect(8, 84, 104, 20, f, 3) + [12, 44, 76].map(x => coil(c, { x, y: 88, rot: 22 }, f)).join('');
  },

  // Irek su: two winding streams between banks.
  ireksu: ([, f]) =>
    rect(8, 18, 104, 6, f, 2) + rect(8, 96, 104, 6, f, 2) +
    `<path d="M8 46 C20 30 32 30 44 46 S68 62 80 46 S104 30 112 40" fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"/>` +
    `<path d="M8 74 C20 58 32 58 44 74 S68 90 80 74 S104 58 112 68" fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"/>`,

  // Qainar: a spring — four curls whirling out of a source.
  qainar: ([b, f]) => {
    let s = '';
    for (let k = 0; k < 4; k++)
      s += coil({ cx: 18, cy: 14, R0: 15, R1: 5, turns: 0.9, w0: 9, w: 10, knob: 6, lead: [5, 0, 12, -1] }, { x: 60, y: 60, rot: k * 90 }, f);
    return s + circle(60, 60, 10, f) + circle(60, 60, 4, b);
  },

  /* ---------- Module 5: yurt, tools, amulets ---------- */

  // Balta: a double axe head on a handle, bud on top, forked foot.
  balta: ([, f]) =>
    rect(56, 30, 8, 66, f, 2) +
    path('M64 34 C78 32 88 34 98 24 C102 42 102 60 98 78 C88 68 78 70 64 68 Z', f) +
    path('M56 34 C42 32 32 34 22 24 C18 42 18 60 22 78 C32 68 42 70 56 68 Z', f) +
    bud({ x: 60, y: 32, s: 0.7 }, f) +
    spike([0, 0], [[-2, 5, -7, 9, -13, 10]], 8, { x: 59, y: 94 }, f) + spike([0, 0], [[2, 5, 7, 9, 13, 10]], 8, { x: 61, y: 94 }, f),

  // Qarmaq: two fish hooks back to back on one shank, with barbs.
  qarmaq: ([b, f]) =>
    rect(56, 30, 8, 46, f, 2) + `<circle cx="60" cy="24" r="8" fill="none" stroke="${f}" stroke-width="5"/>` +
    spike([0, 0], [[0, 16, 10, 28, 22, 28], [32, 28, 36, 16, 33, 4]], 10, { x: 61, y: 70 }, f) +
    spike([0, 0], [[0, 16, -10, 28, -22, 28], [-32, 28, -36, 16, -33, 4]], 10, { x: 59, y: 70 }, f) +
    poly([[94, 74], [86, 84], [93, 86]], f) + poly([[26, 74], [34, 84], [27, 86]], f) + diamond(60, 52, 3, b),

  // Taraq: a double-sided comb, teeth pointing up and down from a central bar.
  taraq: ([b, f]) => {
    let s = rect(14, 52, 92, 16, f, 3);
    for (let i = 0; i < 9; i++) {
      const x = 19 + i * 10.25;
      s += poly([[x - 4, 53], [x + 4, 53], [x, 22]], f) + poly([[x - 4, 67], [x + 4, 67], [x, 98]], f);
    }
    return s + [30, 60, 90].map(x => diamond(x, 60, 4, b)).join('');
  },

  // Baspaldaq: a stepped rhombus — the ladder — with a stepped core.
  baspaldaq: ([b, f]) => {
    const stepped = (r: number, st: number) => {
      const pts: P[] = [];
      const n = Math.round(r / st);
      for (let i = 0; i < n; i++) pts.push([60 + i * st, 60 - r + i * st], [60 + (i + 1) * st, 60 - r + i * st]);
      return pts;
    };
    const quad = (r: number, st: number) => {
      const q = stepped(r, st);
      return [...q, ...q.map(([x, y]) => [x, 120 - y] as P).reverse(), ...q.map(([x, y]) => [120 - x, 120 - y] as P), ...q.map(([x, y]) => [120 - x, y] as P).reverse()];
    };
    return poly(quad(48, 8), f) + poly(quad(32, 8), b) + poly(quad(16, 8), f) + diamond(60, 60, 4, b);
  },

  // Ilmek: two hooks catching each other — a clasp.
  ilmek: ([b, f]) =>
    rect(14, 54, 38, 12, f, 4) + `<circle cx="60" cy="60" r="12" fill="none" stroke="${f}" stroke-width="7"/>` +
    rect(68, 54, 38, 12, f, 4) + rect(57, 57, 14, 6, f, 2) + circle(61, 60, 6.5, f) + circle(61, 60, 2.2, b) +
    coilPair({ a0: 180, cx: 10, cy: -10, R0: 10, R1: 3.5, turns: 0.9, w0: 8, w: 7, knob: 4.4, lead: [0, -3, 0, -6] }, { x: 24, y: 54 }, f) +
    coilPair({ a0: 180, cx: 10, cy: -10, R0: 10, R1: 3.5, turns: 0.9, w0: 8, w: 7, knob: 4.4, lead: [0, -3, 0, -6] }, { x: 96, y: 66, sy: -1 }, f),

  // Baldaq: a staff whose crossbar ends in two down-curling hooks.
  baldaq: ([, f]) =>
    rect(55.5, 30, 9, 70, f, 3) +
    coilPair({ cx: 30, cy: 10, R0: 10, R1: 4, turns: 0.85, w0: 9, w: 9, knob: 5.5, lead: [10, 0, 20, 0] }, { x: 60, y: 30 }, f) +
    bud({ x: 60, y: 28, s: 0.7 }, f) +
    spike([0, 0], [[-2, 5, -7, 9, -13, 10]], 9, { x: 59, y: 96 }, f) + spike([0, 0], [[2, 5, 7, 9, 13, 10]], 9, { x: 61, y: 96 }, f),

  // Tumarsha: a triangular amulet hanging from its tube, with pendants.
  tumarsha: ([b, f]) =>
    rect(24, 26, 72, 11, f, 5) + circle(24, 31.5, 7, f) + circle(96, 31.5, 7, f) +
    poly([[28, 42], [92, 42], [60, 92]], f) + poly([[40, 49], [80, 49], [60, 80]], b) + poly([[50, 55], [70, 55], [60, 70]], f) +
    poly([[24, 40], [28, 52], [24, 62], [20, 52]], f) + poly([[96, 40], [100, 52], [96, 62], [92, 52]], f) +
    poly([[60, 94], [64, 102], [60, 110], [56, 102]], f),

  // Tuiyq: a closed, endless figure — a rhombus looped at each corner.
  tuiyq: ([, f]) =>
    `<path d="M60 26 L94 60 L60 94 L26 60 Z" fill="none" stroke="${f}" stroke-width="9" stroke-linejoin="round"/>` +
    [[60, 18], [102, 60], [60, 102], [18, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${f}" stroke-width="7"/>`).join('') +
    `<path d="M60 42 L78 60 L60 78 L42 60 Z" fill="none" stroke="${f}" stroke-width="7" stroke-linejoin="round"/>` + diamond(60, 60, 5, f),

  // Qoltyqsha: an angular figure with arms akimbo — a person in motion.
  qoltyqsha: ([, f]) =>
    diamond(60, 24, 9, f) + rect(53, 36, 14, 44, f, 2) +
    bar([[53, 44], [32, 60], [52, 74]], 8, f) + bar([[67, 44], [88, 60], [68, 74]], 8, f) +
    bar([[56, 80], [42, 100], [30, 100]], 8, f) + bar([[64, 80], [78, 100], [90, 100]], 8, f),
};

const cache: Record<string, string> = {};

/** Full SVG document for an ornament tile (120×120 viewBox). */
export function ornamentXml(id: string): string {
  if (cache[id]) return cache[id];
  const o = COURSE.orn[id];
  const p = PAL[o.art];
  const xml = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="30" fill="${p[0]}"/>${ART[o.art](p)}</svg>`;
  cache[id] = xml;
  return xml;
}

export const SHANYRAK_XML = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="44" fill="none" stroke="#FFFFFF" stroke-width="9"/><path d="M20 46 Q60 30 100 46 M20 74 Q60 90 100 74 M46 20 Q30 60 46 100 M74 20 Q90 60 74 100" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="60" r="8" fill="#FFFFFF"/></svg>`;

const LOGO_COIL: Coil = { a0: 180, cx: 20, cy: -20, R0: 20, R1: 7, turns: 0.9, w0: 13, w: 11, knob: 7.2, lead: [0, -7, 0, -14] };

export const hornStripXml = (color: string) =>
  `<svg viewBox="0 0 110 176" xmlns="http://www.w3.org/2000/svg">${[0, 1, 2, 3].map(r => coilPair(LOGO_COIL, { x: 55, y: 44 + r * 44, s: 0.62 }, color)).join('')}</svg>`;

export const LOGO_XML = (color: string) =>
  `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${spike([0, 0], [[0, 14, 0, 28, 0, 40]], 16, { x: 60, y: 70 }, color)}${spike([0, 0], [[-2, 5, -7, 9, -13, 10]], 9, { x: 59, y: 100 }, color)}${spike([0, 0], [[2, 5, 7, 9, 13, 10]], 9, { x: 61, y: 100 }, color)}${coilPair(LOGO_COIL, { x: 60, y: 72 }, color)}</svg>`;

export const ARTS = ART;
