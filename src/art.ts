// Placeholder ornament illustrations, drawn as SVG markup and rendered with <SvgXml>.
// Replace a motif by returning final artwork for its key (or swap to image assets later).
import { COURSE } from './content';

type Pal = string[];

export const PAL: Record<string, Pal> = {
  muyiz: ['#FBE3DF', '#B8312F', '#1C1C22'], qoshqar: ['#1E4FA3', '#F2475A', '#F2C14E'], synyq: ['#FFF0D2', '#C8323C', '#D99A1E'],
  syngar: ['#E2ECFA', '#1E4FA3', '#C8323C'], tuyeorkesh: ['#F6E5D6', '#8A5A3B', '#C8323C'], tuyetaban: ['#E3EEF9', '#1E4FA3', '#C8323C'],
  botamoyin: ['#FBE4E1', '#B02A37', '#8A5A3B'], atbasy: ['#E3E9F5', '#1C2340', '#C8323C'], jilinshik: ['#F2C14E', '#1C1C22', '#FFF6E0'],
  kanka: ['#EAF4D8', '#2F7D4A', '#D99A1E'], tortkulak: ['#FFF0D2', '#C8323C', '#1E4FA3'], qus: ['#DDF0FA', '#2384BA', '#C8323C'],
  qanat: ['#E2F2E8', '#1E4FA3', '#3E9B5A', '#C8323C'], qarlygash: ['#DDF0FA', '#1C2340', '#3BA7D6'], qargatuyaq: ['#FFF0D2', '#1E4FA3', '#C8323C'],
  tyshqan: ['#F6E5D6', '#8A5A3B', '#B02A37'], itquyryk: ['#EAD6C0', '#1E4FA3', '#C8323C'], ormekshi: ['#FFF0D2', '#8A5A3B', '#D99A1E'],
  qumyrsqa: ['#FBEED6', '#8A5A3B', '#C8323C'],
};

const HORN = 'M0 0 C0 -22 8 -36 22 -36 C36 -36 42 -22 35 -14 C29 -8 20 -12 22 -20 C23 -25 29 -25 30 -21';
const ANG = 'M0 0 V-30 H26 V-12 H12 V-21';
const st = (c: string, w: number) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const r2 = (n: number) => Math.round(n * 100) / 100;
const pth = (d: string, x: number, y: number, sx: number, sy: number, c: string, w: number, rot = 0) =>
  `<path d="${d}" transform="translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})" ${st(c, r2(w / Math.abs(sx)))}/>`;
const pair = (x: number, y: number, s: number, c: string, w: number, d = HORN) => pth(d, x, y, s, s, c, w) + pth(d, x, y, -s, s, c, w);

const ART: Record<string, (p: Pal) => string> = {
  muyiz: ([, f, a]) => `<path d="M60 96 V70" ${st(f, 7)}/>${pair(60, 70, 1, f, 7)}<circle cx="60" cy="101" r="4.5" fill="${a}"/>`,
  qoshqar: ([, f, a]) => `${pair(60, 74, 1.05, f, 8)}<path d="M47 98 L60 76 L73 98Z" fill="${a}"/><circle cx="60" cy="44" r="5" fill="${a}"/>`,
  synyq: ([, f, a]) => `<path d="M60 98 V74" ${st(f, 7)}/>${pair(60, 74, 1.25, f, 7, ANG)}<path d="M44 100 H76" ${st(a, 6)}/><rect x="55" y="45" width="10" height="10" fill="${a}" transform="rotate(45,60,50)"/>`,
  syngar: ([, f, a]) => `<path d="M10 32 H110 M10 90 H110" ${st(a, 4)}/>${[12, 42, 72].map(x => pth(HORN, x, 80, 0.66, 0.66, f, 7)).join('')}`,
  tuyeorkesh: ([, f, a]) => `<path d="M16 88 H104" ${st(f, 6)}/><path d="M24 88 C24 52 58 50 60 74 C62 50 96 52 96 88" ${st(f, 8)}/>` + [42, 60, 78].map(x => `<circle cx="${x}" cy="99" r="4" fill="${a}"/>`).join(''),
  tuyetaban: ([, f, a]) => [0, 1, 2, 3].map(k => `<path d="M0 0 C-12 0 -14 -14 -8 -22 C-5 -26 -1 -24 0 -19 C1 -24 5 -26 8 -22 C14 -14 12 0 0 0Z" fill="${f}" transform="translate(60,60) rotate(${k * 90}) translate(0,-14) scale(1.2,1.2)"/>`).join('') + `<rect x="53" y="53" width="14" height="14" fill="${a}" transform="rotate(45,60,60)"/>`,
  botamoyin: ([, f, a]) => { const d = 'M0 0 C26 -14 32 -44 14 -54 C4 -59 -4 -52 2 -46'; return pth(d, 60, 94, 1, 1, f, 8) + pth(d, 60, 94, -1, 1, f, 8) + `<circle cx="60" cy="72" r="5" fill="${a}"/>`; },
  atbasy: ([, f, a]) => { const d = 'M0 0 C0 -24 10 -40 26 -42 L32 -52 L34 -39 C44 -33 46 -21 38 -18 C31 -16 27 -21 21 -21 C17 -12 19 -5 23 0 Z'; return `<path d="${d}" fill="${f}" transform="translate(14,94)"/><path d="${d}" fill="${f}" transform="translate(106,94) scale(-1,1)"/><circle cx="43" cy="62" r="3.5" fill="${a}"/><circle cx="77" cy="62" r="3.5" fill="${a}"/><path d="M14 101 H106" ${st(a, 5)}/>`; },
  jilinshik: ([, f]) => [[60, 32, -28], [60, 60, 28], [60, 88, -28]].map(([x, y, r]) => `<g transform="translate(${x},${y}) rotate(${r})"><path d="M-18 0 H18" ${st(f, 9)}/><circle cx="-21" cy="-5" r="6" fill="${f}"/><circle cx="-21" cy="5" r="6" fill="${f}"/><circle cx="21" cy="-5" r="6" fill="${f}"/><circle cx="21" cy="5" r="6" fill="${f}"/></g>`).join(''),
  kanka: ([, f, a]) => `<path d="M60 18 V102" ${st(f, 7)}/><path d="M50 22 H70" ${st(a, 6)}/>` + [40, 53, 66, 79, 92].map(y => `<path d="M60 ${y} L34 ${y - 11} M60 ${y} L86 ${y - 11}" ${st(f, 6)}/><circle cx="31" cy="${y - 12}" r="3.5" fill="${a}"/><circle cx="89" cy="${y - 12}" r="3.5" fill="${a}"/>`).join(''),
  tortkulak: ([, f, a]) => [0, 1, 2, 3].map(k => `<g transform="rotate(${k * 90},60,60)">${pair(60, 47, 0.6, f, 7)}</g>`).join('') + `<rect x="51" y="51" width="18" height="18" fill="${a}" transform="rotate(45,60,60)"/>`,
  qus: ([b, f, a]) => {
    const d = 'M0 0 C8 -16 26 -20 36 -10 L46 -12 L39 -3 C30 8 12 8 0 0 Z';
    const bird = (tr: string) => `<g transform="${tr}"><path d="${d}" fill="${f}"/><path d="M0 0 L-9 -9 M0 0 L-9 6" ${st(f, 6)}/><circle cx="30" cy="-9" r="2.8" fill="${b}"/></g>`;
    return bird('translate(16,74) scale(0.88,0.88)') + bird('translate(104,74) scale(-0.88,0.88)') + `<circle cx="60" cy="38" r="7" fill="${a}"/><path d="M60 46 V60" ${st(a, 4)}/>${pth(HORN, 60, 98, 0.3, 0.3, a, 4)}${pth(HORN, 60, 98, -0.3, 0.3, a, 4)}`;
  },
  qanat: ([, f, a, r]) => `${pair(60, 84, 1.05, f, 7)}${pair(60, 84, 0.7, a, 6)}${pair(60, 84, 0.4, f, 5)}<rect x="54" y="88" width="12" height="12" fill="${r}" transform="rotate(45,60,94)"/>`,
  qarlygash: ([, f, a]) => `<path d="M60 28 C65 28 67 35 67 42 L106 36 C92 50 78 55 69 57 L76 94 L60 79 L44 94 L51 57 C42 55 28 50 14 36 L53 42 C53 35 55 28 60 28Z" fill="${f}"/><ellipse cx="60" cy="50" rx="5" ry="8" fill="${a}"/>`,
  qargatuyaq: ([, f, a]) => [[34, 94], [60, 66], [86, 38]].map(([x, y]) => `<g transform="translate(${x},${y}) rotate(-20)"><path d="M0 0 V-20 M0 0 L-14 -14 M0 0 L14 -14 M0 0 V9" ${st(f, 6)}/><circle cx="0" cy="-22" r="3.5" fill="${a}"/><circle cx="-15.5" cy="-15.5" r="3.5" fill="${a}"/><circle cx="15.5" cy="-15.5" r="3.5" fill="${a}"/></g>`).join(''),
  tyshqan: ([, f, a]) => `<rect x="8" y="38" width="104" height="44" rx="10" fill="${a}" fill-opacity="0.14"/><path d="M10 38 H110 M10 82 H110" ${st(f, 4)}/>` + [0, 1, 2, 3, 4, 5, 6].map(i => { const x = 18 + i * 14, y = i % 2 ? 54 : 68; return `<circle cx="${x}" cy="${y}" r="4" fill="${f}"/><circle cx="${x - 4}" cy="${y - 6.5}" r="1.9" fill="${a}"/><circle cx="${x}" cy="${y - 8}" r="1.9" fill="${a}"/><circle cx="${x + 4}" cy="${y - 6.5}" r="1.9" fill="${a}"/>`; }).join(''),
  itquyryk: ([, f, a]) => `<path d="M8 26 H112 M8 94 H112" ${st(a, 4)}/>` + [10, 34, 58, 82].map((x, i) => (i % 2 ? pth(HORN, x, 36, 0.64, -0.64, f, 7) : pth(HORN, x, 84, 0.64, 0.64, f, 7))).join(''),
  ormekshi: ([, f, a]) => [0, 1, 2, 3].map(k => `<g transform="rotate(${k * 90 + 45},60,60)">${pair(60, 45, 0.5, f, 5.5)}</g>`).join('') + `<ellipse cx="60" cy="65" rx="10" ry="12" fill="${f}"/><circle cx="60" cy="49" r="7" fill="${f}"/><circle cx="60" cy="65" r="3.5" fill="${a}"/>`,
  qumyrsqa: ([, f, a]) => {
    let g = '';
    for (let k = -120; k <= 120; k += 30) g += `<path d="M${k} 0 L${k + 120} 120 M${k} 120 L${k + 120} 0" ${st(a, 2.5)} opacity="0.45"/>`;
    const ant = (x: number, y: number, r: number) => `<g transform="translate(${x},${y}) rotate(${r}) scale(0.8,0.8)"><path d="M-10 -6 L10 6 M-10 6 L10 -6 M-11 0 H11" ${st(f, 2.6)}/><circle cx="0" cy="-10" r="5" fill="${f}"/><circle cx="0" cy="0" r="4" fill="${f}"/><circle cx="0" cy="11" r="6" fill="${f}"/></g>`;
    return `<g clip-path="url(#tile)">${g}</g>` + ant(60, 34, 0) + ant(34, 78, -30) + ant(86, 78, 30);
  },
};

const cache: Record<string, string> = {};

/** Full SVG document for an ornament tile (120×120 viewBox). */
export function ornamentXml(id: string): string {
  if (cache[id]) return cache[id];
  const o = COURSE.orn[id];
  const p = PAL[o.art];
  const xml = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="tile"><rect width="120" height="120" rx="30"/></clipPath></defs><rect width="120" height="120" rx="30" fill="${p[0]}"/>${ART[o.art](p)}</svg>`;
  cache[id] = xml;
  return xml;
}

export const SHANYRAK_XML = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="44" fill="none" stroke="#FFFFFF" stroke-width="9"/><path d="M20 46 Q60 30 100 46 M20 74 Q60 90 100 74 M46 20 Q30 60 46 100 M74 20 Q90 60 74 100" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="60" r="8" fill="#FFFFFF"/></svg>`;

export const hornStripXml = (color: string) =>
  `<svg viewBox="0 0 110 176" xmlns="http://www.w3.org/2000/svg">${[0, 1, 2, 3].map(r => `<g transform="translate(0,${r * 44})">${pair(55, 40, 0.62, color, 6)}</g>`).join('')}</svg>`;

export const LOGO_XML = (color: string) =>
  `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M60 100 V68 M60 68 C60 46 68 32 82 32 C96 32 102 46 95 54 C89 60 80 56 82 48 M60 68 C60 46 52 32 38 32 C24 32 18 46 25 54 C31 60 40 56 38 48" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const ARTS = ART;
