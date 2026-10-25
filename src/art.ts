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
  qoshqar: ['#1E4FA3', '#FFF3E0', '#F2C14E'],
  synyq: ['#FFF0D2', '#B42A34', '#1E4FA3'],
  syngar: ['#E1EBF8', '#1E4FA3', '#B42A34'],
  tuyeorkesh: ['#F5E4D2', '#7A4A2E', '#B42A34'],
  tuyetaban: ['#E3EEF9', '#1E4FA3', '#B42A34'],
  botamoyin: ['#FBE4E1', '#9E2232', '#7A4A2E'],
  atbasy: ['#E3E8F3', '#1C2340', '#B42A34'],
  jilinshik: ['#F2C14E', '#1C1C22', '#B42A34'],
  kanka: ['#E8F2D8', '#2F6E43', '#D99A1E'],
  tortkulak: ['#FFF0D2', '#B42A34', '#1E4FA3'],
  qus: ['#DDEFF9', '#1F6FA8', '#B42A34'],
  qanat: ['#E2F2E8', '#1E4FA3', '#3E8E57', '#B42A34'],
  qarlygash: ['#DDEFF9', '#1C2340', '#3BA7D6'],
  qargatuyaq: ['#FFF0D2', '#1C2340', '#B42A34'],
  tyshqan: ['#F5E4D2', '#7A4A2E', '#B42A34'],
  itquyryk: ['#E9D3BA', '#1E4FA3', '#B42A34'],
  ormekshi: ['#FFF0D2', '#7A4A2E', '#D99A1E'],
  qumyrsqa: ['#FBEED6', '#7A4A2E', '#B42A34'],
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

/* ---------------- the horn ---------------- */

// Canonical right horn, base at (0,0), rising, rolling outward and down into a tight curl.
const HORN_LINE = chain([0, 0], [
  [0, -14, 3, -27, 15, -33],
  [27, -39, 41, -31, 39, -18],
  [37, -7, 24, -6, 23, -15],
  [22.5, -21, 28.5, -22.5, 30, -18.5],
]);
/** One horn as a filled path. flip mirrors it to curl left. */
function horn(t: Xf & { flip?: boolean; w0?: number; w1?: number }, fill: string) {
  const pts = taperPts(HORN_LINE, t.w0 ?? 13, t.w1 ?? 4.2, 0.8);
  return poly(xf(pts, { ...t, sx: (t.sx ?? 1) * (t.flip ? -1 : 1) }), fill);
}
const hornPair = (t: Xf & { w0?: number; w1?: number }, fill: string) => horn(t, fill) + horn({ ...t, flip: true }, fill);

/** A generic tapered curve from a Bézier chain, placed with a transform. */
function blade(start: P, segs: number[][], w0: number, w1: number, t: Xf, fill: string, ease = 1) {
  return poly(xf(taperPts(chain(start, segs), w0, w1, ease), t), fill);
}

/** Thick angular line (for geometric motifs): square caps, mitred corners. */
const bar = (pts: P[], w: number, fill: string) =>
  `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L')}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="square"/>`;
const mirrorX = (pts: P[], cx = 60): P[] => pts.map(([x, y]) => [2 * cx - x, y]);
const mirrorY = (pts: P[], cy = 60): P[] => pts.map(([x, y]) => [x, 2 * cy - y]);

/* ---------------- motifs ---------------- */

const ART: Record<string, (p: Pal) => string> = {
  // Müyiz: the single basic element: a short stem splitting into two horns.
  muyiz: ([, f, a]) =>
    poly([[54, 100], [66, 100], [64.5, 74], [55.5, 74]], f) +
    hornPair({ x: 60, y: 76, s: 1.12 }, f) +
    diamond(60, 104, 5, a),

  // Qoshqar müyiz: big pair up, small pair turned down, joined by a pointed core.
  qoshqar: ([, f, a]) =>
    hornPair({ x: 60, y: 62, s: 1.1, w0: 14 }, f) +
    hornPair({ x: 60, y: 72, s: 0.6, sy: -1, w0: 13 }, f) +
    poly([[60, 50], [69, 67], [60, 84], [51, 67]], f) +
    diamond(60, 67, 5.5, a),

  // Synyq müyiz: the horn hook rebuilt from straight lines, four hooks around a diamond.
  synyq: ([, f, a]) => {
    const hook: P[] = [[60, 46], [60, 26], [84, 26], [84, 44], [70, 44], [70, 36]];
    let s = '';
    for (const pts of [hook, mirrorX(hook), mirrorY(hook), mirrorX(mirrorY(hook))]) s += bar(pts, 8, f);
    return s + diamond(60, 60, 12, f) + diamond(60, 60, 5.5, a);
  },

  // Syngar müyiz: a border of single horns rising from one band.
  syngar: ([, f, a]) =>
    rect(8, 86, 104, 11, f, 3) +
    [12, 45, 78].map(x => horn({ x: x + 2, y: 88, s: 0.76, w0: 13, w1: 4.2 }, f)).join('') +
    [31, 64, 97].map(x => diamond(x, 36, 4, a)).join(''),

  // Tüye örkesh: two humps on a band, the outer slopes ending in horn curls.
  tuyeorkesh: ([, f, a]) =>
    path('M12 96 L12 88 C17 88 20 38 39 38 C55 38 56 64 60 70 C64 64 65 38 81 38 C100 38 103 88 108 88 L108 96 Z', f) +
    diamond(39, 72, 6, a) + diamond(81, 72, 6, a) + diamond(60, 88, 4, a),

  // Tüye taban: four camel footprints (two-toed heart shapes) around a diamond.
  tuyetaban: ([, f, a]) => {
    const pad = chain([0, 0], [[-13, 0, -17, -15, -11, -24], [-7, -30, -1, -28, 0, -17], [1, -28, 7, -30, 11, -24], [17, -15, 13, 0, 0, 0]], 14);
    let s = '';
    for (let k = 0; k < 4; k++) {
      const ang = ((k * 90 + 45) * Math.PI) / 180;
      const pts = xf(pad, { s: 1.15, rot: k * 90 + 45 }).map(([x, y]) => [x + 60 + Math.sin(ang) * 13, y + 60 - Math.cos(ang) * 13] as P);
      s += poly(pts, f);
    }
    return s + diamond(60, 60, 8, a);
  },

  // Bota moyyn: two slender necks bowing towards each other, forming a lyre.
  botamoyin: ([, f, a]) => {
    const neck = (flip: boolean) =>
      blade([0, 0], [[24, -8, 32, -30, 24, -50], [19, -62, 5, -66, 1, -56], [-2, -50, 4, -45, 8, -49]], 13, 4.5, { x: 60 + (flip ? -5 : 5), y: 100, sx: flip ? -1 : 1 }, f, 0.9);
    return neck(false) + neck(true) + diamond(60, 66, 7, a) + diamond(60, 104, 3.5, a);
  },

  // At basy: two horse heads facing each other, arched necks, curled manes.
  atbasy: ([, f, a]) => {
    const head: P[] = chain([0, 0], [
      [-2, -22, 2, -40, 12, -48], [13, -53, 15, -58, 17, -61], [19, -57, 20, -53, 22, -50],
      [30, -46, 38, -38, 42, -30], [44, -26, 42, -22, 37, -22], [31, -22, 27, -24, 24, -22],
      [20, -14, 20, -6, 24, 0],
    ], 12);
    const one = (flip: boolean) => {
      const x0 = flip ? 106 : 14, sx = flip ? -1 : 1;
      return poly(xf(head, { x: x0, y: 96, sx, s: 0.95 }), f) +
        blade([0, 0], [[-8, 4, -12, 14, -8, 22]], 6, 3, { x: x0 + sx * 8, y: 52, sx }, f) +
        circle(x0 + sx * 25, 57, 2.4, a);
    };
    return one(false) + one(true) + rect(12, 98, 96, 6, a, 3);
  },

  // Jilinshik: the "shin bone" key — an angular meander band.
  jilinshik: ([, f, a]) => {
    const key: P[] = [[14, 88], [14, 34], [52, 34], [52, 70], [32, 70], [32, 52], [42, 52]];
    return bar(key, 9, f) + bar(mirrorX(mirrorY(key)), 9, f) + diamond(60, 60, 6, a);
  },

  // Qangqa: a spine with dense, slightly bowed ribs.
  kanka: ([, f, a]) => {
    let s = rect(55.5, 14, 9, 92, f, 4);
    for (let i = 0; i < 6; i++) {
      const y = 26 + i * 13.5;
      s += blade([0, 0], [[-10, 2, -20, 6, -28, 12]], 7, 5.5, { x: 58, y }, f) +
        blade([0, 0], [[10, 2, 20, 6, 28, 12]], 7, 5.5, { x: 62, y }, f);
    }
    return s + diamond(60, 12, 6, a);
  },

  // Tört qulaq: four ram's-horn pairs spreading to the four sides of a square core.
  tortkulak: ([, f, a]) => {
    let s = '';
    for (let k = 0; k < 4; k++) {
      const ang = (k * 90 * Math.PI) / 180;
      s += hornPair({ x: 60 + Math.sin(ang) * 13, y: 60 - Math.cos(ang) * 13, s: 0.62, rot: k * 90, w0: 14, w1: 4.5 }, f);
    }
    return s + poly([[60, 46], [74, 60], [60, 74], [46, 60]], f) + diamond(60, 60, 6, a);
  },

  // Qus: two swans with S-shaped necks facing a bud.
  qus: ([b, f, a]) => {
    const bird = (flip: boolean) => {
      const t: Xf = { x: flip ? 104 : 16, y: 0, sx: flip ? -1 : 1 };
      const body = chain([0, 82], [[4, 98, 30, 102, 40, 88], [44, 82, 42, 74, 36, 72], [26, 70, 14, 76, 0, 82]], 12);
      const neck = blade([34, 76], [[42, 64, 40, 50, 30, 46], [22, 43, 20, 34, 28, 30]], 9, 6, t, f);
      return poly(xf(body, t), f) + neck +
        poly(xf([[27, 26], [33, 27], [42, 33], [33, 33]], t), f) +
        circle(flip ? 104 - 31 : 16 + 31, 29, 1.8, b);
    };
    return bird(false) + bird(true) + circle(60, 50, 6.5, a) + rect(58.5, 55, 3, 18, a, 1.5);
  },

  // Qus qanaty: a pair of spread wings, each of three tapering feathers, around a red core.
  qanat: ([, f, a, r]) =>
    hornPair({ x: 60, y: 82, s: 1.12, w0: 14, w1: 4.5 }, f) +
    hornPair({ x: 60, y: 82, s: 0.72, w0: 12, w1: 4 }, a) +
    poly([[60, 72], [67, 84], [60, 100], [53, 84]], f) + diamond(60, 86, 4.5, r),

  // Qarlyghash: a swallow seen from above: swept wings, deep forked tail.
  qarlygash: ([, f, a]) =>
    path('M60 22 C66 22 68 30 67 38 C80 34 96 32 110 36 C96 44 82 52 70 58 L74 76 L86 102 L68 86 L60 96 L52 86 L34 102 L46 76 L50 58 C38 52 24 44 10 36 C24 32 40 34 53 38 C52 30 54 22 60 22 Z', f) +
    path('M60 40 C64 40 65 48 64 56 L60 62 L56 56 C55 48 56 40 60 40 Z', a),

  // Qargha tuyaq: crow's tracks — three pointed toes and a heel, stepping diagonally.
  qargatuyaq: ([, f, a]) => {
    const foot: P[] = [[0, 8], [-4, 0], [-17, -13], [-5, -5], [-3, -22], [0, -8], [3, -22], [5, -5], [17, -13], [4, 0]];
    return [[36, 92], [62, 64], [88, 36]].map(([x, y]) => poly(xf(foot, { x, y, rot: 30, s: 1.05 }), f)).join('') +
      diamond(30, 40, 5, a) + diamond(90, 92, 5, a);
  },

  // Tyshqan izi: mouse tracks — nested chevrons running in a band.
  tyshqan: ([, f, a]) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const y = 30 + i * 18;
      s += poly([[16, y], [60, y + 22], [104, y], [104, y + 9], [60, y + 31], [16, y + 9]], i === 3 ? a : f);
    }
    return s;
  },

  // It quyryq: curled dog's tails rising and falling along a carved band.
  itquyryk: ([, f, a]) => {
    const tail = (x: number, up: boolean) =>
      blade([0, 0], [[0, -16, 8, -30, 20, -30], [30, -30, 32, -16, 24, -12], [18, -9, 14, -16, 19, -19]], 11, 4, { x, y: up ? 88 : 32, sy: up ? 1 : -1, s: 0.82 }, f, 0.9);
    return rect(8, 88, 104, 7, a, 3) + rect(8, 25, 104, 7, a, 3) + tail(12, true) + tail(38, false) + tail(64, true) + tail(90, false);
  },

  // Örmekshi: a spider — round body, eight legs ending in small hooks.
  ormekshi: ([, f, a]) => {
    let s = '';
    for (const flip of [false, true]) {
      [-42, -14, 14, 42].forEach(rot => {
        const sx = flip ? -1 : 1;
        s += blade([0, 0], [[9, -5, 18, -11, 26, -13], [31, -14, 35, -10, 35, -3]], 6.5, 3.4,
          { x: 60 + sx * 8, y: 64, rot: (flip ? -1 : 1) * rot, sx }, f);
      });
    }
    return s + `<ellipse cx="60" cy="72" rx="12" ry="15" fill="${f}"/>` + circle(60, 51, 8, f) + diamond(60, 72, 5, a);
  },

  // Qumyrsqa: the ant — an angular cross whose arms end in hooks, around a diamond.
  qumyrsqa: ([, f, a]) => {
    const arm: P[] = [[66, 54], [86, 34], [86, 20], [100, 20]];
    let s = '';
    for (const pts of [arm, mirrorX(arm), mirrorY(arm), mirrorX(mirrorY(arm))]) s += bar(pts, 8, f);
    return s + diamond(60, 60, 13, f) + diamond(60, 60, 6, a);
  },
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

export const hornStripXml = (color: string) =>
  `<svg viewBox="0 0 110 176" xmlns="http://www.w3.org/2000/svg">${[0, 1, 2, 3].map(r => hornPair({ x: 55, y: 40 + r * 44, s: 0.62 }, color)).join('')}</svg>`;

export const LOGO_XML = (color: string) =>
  `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${poly([[54, 104], [66, 104], [64.5, 72], [55.5, 72]], color)}${hornPair({ x: 60, y: 74, s: 1.2, w0: 15, w1: 5 }, color)}</svg>`;

export const ARTS = ART;
