// kit.mjs — mini motor de SVG do README.
// Mesma ideia do portfólio: sem dependência, sem build. As fontes do site (Unbounded,
// Space Grotesk, Instrument Serif, DM Sans, JetBrains Mono) estão em glyphs.json já
// convertidas em curvas, então o texto renderiza igual em qualquer máquina — o GitHub
// não carrega fonte externa dentro de imagem.
import { readFileSync } from 'node:fs';

const FONTS = JSON.parse(readFileSync(new URL('./glyphs.json', import.meta.url), 'utf8'));

/* ---------- tokens: os mesmos de assets/css/base/tokens.css do portfólio ---------- */
export const THEMES = {
  dark: {
    name: 'dark', dark: true,
    bg: '#05041a', bg2: '#0A0826', surface: '#100D2B', surface2: '#171338',
    text: '#EEEBFF', muted: '#8C88C9',
    line: 'rgba(160,140,255,.28)', line2: 'rgba(170,152,255,.5)',
    accent: '#7A4DFF', accent2: '#2F7BFF', accentSurface: '#5B30E6', accentInk: '#FFFFFF',
    accentText: '#A68EFF', magenta: '#FF4D8D',
    glowA: '#6B47FF', glowB: '#0D38BF', glitchM: '#FF2D9B', glitchC: '#25E8FF',
    blend: 'screen', ok: '#5EE3C0',
    code: { kw: '#A68EFF', st: '#5EE3C0', tp: '#7FB2FF', fn: '#FF8AB3', cm: '#6F6BA8' },
  },
  light: {
    name: 'light', dark: false,
    bg: '#ECE9FF', bg2: '#DBD5FA', surface: '#FFFFFF', surface2: '#F2EEFF',
    text: '#07051C', muted: '#413C66',
    line: 'rgba(70,48,170,.22)', line2: 'rgba(70,48,170,.44)',
    accent: '#5B2EFF', accent2: '#1557E0', accentSurface: '#4A21E0', accentInk: '#FFFFFF',
    accentText: '#4A21E0', magenta: '#E0246B',
    glowA: '#7A4DFF', glowB: '#2F7BFF', glitchM: '#FF2D9B', glitchC: '#00B8D4',
    blend: 'multiply', ok: '#0B8F6C',
    code: { kw: '#4A21E0', st: '#0B7A5C', tp: '#1557E0', fn: '#C2185B', cm: '#7A76A8' },
  },
};

export const W = 880;            // largura de todos os cards (o README do perfil tem ~850px)
export const PAD = 40;           // respiro lateral interno
export const R = 22;             // raio do card

const n = (v, d = 2) => +(+v).toFixed(d);
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** largura de um texto em px */
export function measure(str, font = 'D4', size = 14, ls = 0) {
  const F = FONTS[font];
  const chars = [...str];
  let w = 0;
  chars.forEach((c, i) => {
    const g = F.g[c] || F.g['?'];
    w += g[0];
    if (i < chars.length - 1) w += (F.k[c + chars[i + 1]] || 0) + ls * F.upm;
  });
  return (w * size) / F.upm;
}
export const capHeight = (font, size) => (FONTS[font].cap * size) / FONTS[font].upm;

export class Doc {
  constructor(w, h, theme) {
    this.w = w; this.h = h; this.t = THEMES[theme];
    this.used = new Map(); this.defs = []; this.css = []; this.body = []; this.seq = 0;
  }
  id(p = 'e') { return p + (this.seq++).toString(36); }
  add(...s) { this.body.push(...s); return this; }
  def(s) { this.defs.push(s); return this; }
  style(s) { this.css.push(s); return this; }

  #glyph(font, ch) {
    const key = font + ch;
    if (!this.used.has(key)) this.used.set(key, 'g' + this.used.size.toString(36));
    return this.used.get(key);
  }

  /** texto em curvas. anchor: start | middle | end. stroke = { color, width } para texto vazado */
  text(str, { font = 'D4', size = 14, x = 0, y = 0, fill = this.t.text, anchor = 'start', ls = 0,
    stroke = null, opacity = null, cls = '', style = '' } = {}) {
    const F = FONTS[font];
    const s = size / F.upm;
    const w = measure(str, font, size, ls);
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const chars = [...str];
    let pen = 0, uses = '';
    chars.forEach((c, i) => {
      const ch = F.g[c] ? c : '?';
      if (ch !== ' ') uses += `<use href="#${this.#glyph(font, ch)}"${pen ? ` x="${n(pen, 1)}"` : ''}/>`;
      pen += F.g[ch][0] + (F.k[c + (chars[i + 1] || '')] || 0) + ls * F.upm;
    });
    const paint = stroke
      ? `fill="${stroke.fill || 'none'}" stroke="${stroke.color}" stroke-width="${n(stroke.width / s, 1)}" stroke-linejoin="round"`
      : `fill="${fill}"`;
    return `<g transform="translate(${n(x0)} ${n(y)}) scale(${n(s, 5)} ${n(-s, 5)})" ${paint}` +
      `${opacity != null ? ` opacity="${opacity}"` : ''}${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}>${uses}</g>`;
  }

  /** rótulo mono em caixa alta — o .mono-label do site */
  label(str, o = {}) {
    return this.text(str.toUpperCase(), { font: 'M5', size: 10.5, ls: 0.16, fill: this.t.muted, ...o });
  }

  /** linha com vários estilos: [{ t, font, fill, hl }] → { svg, width } */
  line(spans, { x = 0, y = 0, size = 14, font = 'D4', fill = this.t.text, anchor = 'start' } = {}) {
    const ws = spans.map(sp => measure(sp.t, sp.font || font, (sp.scale || 1) * size, sp.ls || 0));
    const total = ws.reduce((a, b) => a + b, 0);
    let cx = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
    let svg = '';
    spans.forEach((sp, i) => {
      const f = sp.font || font, sz = (sp.scale || 1) * size;
      if (sp.hl) {
        const lead = measure(sp.t.match(/^\s*/)[0], f, sz), trail = measure(sp.t.match(/\s*$/)[0], f, sz);
        svg += `<rect x="${n(cx + lead - sz * 0.18)}" y="${n(y - sz * 0.98)}" width="${n(ws[i] - lead - trail + sz * 0.36)}" height="${n(sz * 1.32)}" rx="3" fill="${this.t.accentSurface}"/>`;
      }
      svg += this.text(sp.t, { font: f, size: sz, x: cx, y, fill: sp.hl ? this.t.accentInk : (sp.fill || fill), ls: sp.ls || 0 });
      cx += ws[i];
    });
    return { svg, width: total };
  }

  /** parágrafo com quebra automática. Devolve { svg, height, lines } */
  para(spans, { x = 0, y = 0, width = 400, size = 14, lh = 1.6, font = 'D4', fill = this.t.text } = {}) {
    if (typeof spans === 'string') spans = [{ t: spans }];
    const words = [];
    for (const sp of spans) {
      for (const part of sp.t.split(/(\s+)/)) {
        if (!part) continue;
        const space = /^\s+$/.test(part);
        words.push({ ...sp, t: space ? ' ' : part, space, w: measure(space ? ' ' : part, sp.font || font, (sp.scale || 1) * size) });
      }
    }
    const lines = [[]];
    let lw = 0;
    for (const wd of words) {
      const cur = lines[lines.length - 1];
      if (wd.space) { if (cur.length) { cur.push(wd); lw += wd.w; } continue; }
      if (lw + wd.w > width && cur.length) {
        while (cur.length && cur[cur.length - 1].space) cur.pop();
        lines.push([wd]); lw = wd.w;
      } else { cur.push(wd); lw += wd.w; }
    }
    let svg = '';
    lines.forEach((ln, i) => {
      // junta vizinhos de mesmo estilo para manter o kerning
      const merged = [];
      for (const wd of ln) {
        const last = merged[merged.length - 1];
        const same = last && last.font === wd.font && last.fill === wd.fill && !!last.hl === !!wd.hl && last.scale === wd.scale;
        if (same) last.t += wd.t; else merged.push({ t: wd.t, font: wd.font, fill: wd.fill, hl: wd.hl, scale: wd.scale });
      }
      svg += this.line(merged, { x, y: y + i * size * lh, size, font, fill }).svg;
    });
    return { svg, height: lines.length * size * lh, lines: lines.length };
  }

  /** texto correndo em volta de um círculo (o selo do hero) */
  ring(str, { cx, cy, r, font = 'M5', size = 9, fill = this.t.text }) {
    const F = FONTS[font], s = size / F.upm;
    const chars = [...str];
    const total = chars.reduce((a, c) => a + (F.g[c] || F.g['?'])[0], 0);
    let pen = 0, out = '';
    for (const c of chars) {
      const g = F.g[c] ? c : '?', adv = F.g[g][0];
      const ang = ((pen + adv / 2) / total) * 360;
      if (g !== ' ') out += `<use href="#${this.#glyph(font, g)}" transform="rotate(${n(ang)}) translate(${n((-adv / 2) * s)} ${n(-r)}) scale(${n(s, 5)} ${n(-s, 5)})"/>`;
      pen += adv;
    }
    return `<g transform="translate(${cx} ${cy})" fill="${fill}">${out}</g>`;
  }

  /** moldura do card: fundo, brilhos (os "orbs" do site) e borda. Tudo que entra depois fica recortado.
   *  É montada só no toString(), para o card poder definir a altura no fim. */
  frame({ orbs = true, fill = null } = {}) { this._frame = { orbs, fill }; return this; }

  #frame() {
    const t = this.t, { orbs, fill } = this._frame, h = this.h, clip = this.id('c');
    this.def(`<clipPath id="${clip}"><rect x=".5" y=".5" width="${this.w - 1}" height="${h - 1}" rx="${R}"/></clipPath>`);
    let s = `<g clip-path="url(#${clip})"><rect width="${this.w}" height="${h}" fill="${fill || t.bg}"/>`;
    if (orbs) {
      const a = this.id('o'), b = this.id('o');
      this.def(`<radialGradient id="${a}"><stop offset="0" stop-color="${t.accent}" stop-opacity="${t.dark ? 0.34 : 0.3}"/><stop offset=".68" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>`);
      this.def(`<radialGradient id="${b}"><stop offset="0" stop-color="${t.dark ? t.glowB : t.accent2}" stop-opacity="${t.dark ? 0.5 : 0.24}"/><stop offset=".66" stop-color="${t.glowB}" stop-opacity="0"/></radialGradient>`);
      this.style(`.oa{animation:oa 26s ease-in-out infinite alternate}.ob{animation:ob 34s ease-in-out infinite alternate}
@keyframes oa{to{transform:translate(-70px,40px)}}@keyframes ob{to{transform:translate(80px,-30px)}}`);
      s += `<circle class="oa" cx="${this.w * 0.84}" cy="-20" r="${Math.max(360, Math.min(520, h * 0.9))}" fill="url(#${a})"/>` +
        `<circle class="ob" cx="${this.w * 0.08}" cy="${h + 30}" r="${Math.max(300, Math.min(460, h * 0.75))}" fill="url(#${b})"/>`;
    }
    return [s, `</g><rect x=".5" y=".5" width="${this.w - 1}" height="${h - 1}" rx="${R}" fill="none" stroke="${t.line}"/>`];
  }

  /** cabeçalho de seção: "(01) — Sobre mim" + título em duas fontes */
  head(num, name, lines, { x = PAD, y = 56, size = 34 } = {}) {
    let s = this.label(`(${num}) — ${name}`, { x, y });
    lines.forEach((ln, i) => {
      s += this.line(ln.map(sp => sp.i ? { t: sp.t, font: 'SI', scale: 1.14 } : { t: sp.t, font: 'G7', ls: -0.02 }),
        { x, y: y + 46 + i * size * 1.06, size }).svg;
    });
    return s;
  }

  toString() {
    const h = Math.ceil(this.h);
    this.h = h;
    const [open, close] = this._frame ? this.#frame() : ['', ''];
    const glyphs = [...this.used].map(([key, id]) => {
      const font = key.slice(0, 2), ch = key.slice(2);
      return `<path id="${id}" d="${FONTS[font].g[ch][1]}"/>`;
    }).join('');
    const css = this.css.join('\n') + '\n@media (prefers-reduced-motion:reduce){*{animation:none!important}}';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${h}" width="${this.w}" height="${h}" fill="none">` +
      `<style>${css}</style><defs>${glyphs}${this.defs.join('')}</defs>${open}${this.body.join('')}${close}</svg>\n`;
  }
}

/* ---------- pequenos ícones desenhados à mão ---------- */
/** seta ↗ dos links do site */
export const arrow = (x, y, s, color, w = 1.6) =>
  `<path d="M${n(x)} ${n(y + s)}L${n(x + s)} ${n(y)}M${n(x + s * 0.2)} ${n(y)}h${n(s * 0.8)}v${n(s * 0.8)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** asterisco ✳ da faixa */
export const star = (cx, cy, r, color, w = 2) => {
  let d = '';
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 4, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
    d += `M${n(cx - dx)} ${n(cy - dy)}L${n(cx + dx)} ${n(cy + dy)}`;
  }
  return `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
};

export const fmt = n;
