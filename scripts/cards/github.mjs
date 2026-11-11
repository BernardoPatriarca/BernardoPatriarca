// (07) GITHUB — "Atividade ao vivo": números, mapa de contribuições, linguagens e últimos repositórios.
// É o único card com dados que mudam; a Action regenera todo dia a partir de scripts/data.json.
import { Doc, W, PAD, measure, fmt } from '../kit.mjs';
import { cell, reveal } from './ui.mjs';

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dia = iso => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d} ${MES[+m - 1]}`; };
// data no fuso de Brasília, para o carimbo "atualizado em"
const local = iso => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).format(new Date(iso));

export function github(theme, data) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  d.add(d.head('07', 'GitHub', [[{ t: 'Atividade ' }, { t: 'ao vivo', i: true }]]));

  // carimbo de atualização
  const stamp = local(data.fetchedAt);
  d.style(`.lv{animation:lv 1.8s infinite}@keyframes lv{50%{opacity:.25}}`);
  const stxt = `Atualizado em ${dia(stamp)} ${stamp.slice(0, 4)}`;
  d.add(d.label(stxt, { x: W - PAD, y: 56, anchor: 'end' }),
    `<circle class="lv" cx="${fmt(W - PAD - measure(stxt.toUpperCase(), 'M5', 10.5, 0.16) - 12)}" cy="52" r="3.5" fill="${t.ok}"/>`);

  /* ---- números ---- */
  const active = data.contrib.days.filter(x => x[2] > 0).length;
  const stats = [[data.repos, 'Repositórios'], [data.contrib.total, 'Contribuições · 12 meses'], [active, 'Dias ativos'], [data.since, 'No GitHub desde']];
  const sy = 146, sh = 88, gap = 14, sw = (W - PAD * 2 - gap * 3) / 4;
  stats.forEach(([num, lab], i) => {
    const x = PAD + i * (sw + gap);
    d.add(`<g class="rv" style="--i:${i}">${cell(d, x, sy, sw, sh, { r: 16 })}` +
      d.text(String(num), { font: 'G7', size: 34, ls: -0.035, x: x + 20, y: sy + 46 }) +
      d.label(lab, { x: x + 20, y: sy + 68, size: 9, ls: 0.1 }) + '</g>');
  });

  /* ---- mapa de contribuições: 7 linhas × ~53 semanas, uma onda de brilho passa por ele ---- */
  const hy = sy + sh + 40, S = 12, G = 3.08, STEP = S + G;
  const ramp = t.dark ? ['rgba(160,140,255,.09)', '#3A2A96', '#5B3FD8', '#7A4DFF', '#C2ADFF'] : ['rgba(70,48,170,.08)', '#CFC3FF', '#A68EFF', '#7A4DFF', '#3D14C9'];
  const days = data.contrib.days, cols = [];
  days.forEach(([date, lvl, n]) => {
    const wd = new Date(date + 'T00:00:00Z').getUTCDay();
    if (!cols.length || wd === 0) cols.push([]);
    cols[cols.length - 1].push({ date, lvl, n, wd });
  });
  const use = cols.slice(-53), gx = PAD + (W - PAD * 2 - (use.length * STEP - G)) / 2;
  let grid = '', months = '', last = -1;
  d.style(`.hc{animation:hc 6s ease-in-out infinite}@keyframes hc{0%,22%,100%{opacity:1}11%{opacity:.45}}`);
  use.forEach((col, ci) => {
    const m = +col[0].date.slice(5, 7) - 1;
    if (m !== last && ci < use.length - 1) { if (last !== -1 || col[0].date.slice(8) <= '07') months += d.label(MES[m], { x: gx + ci * STEP, y: hy + 12, size: 9, ls: 0.1 }); last = m; }
    let cells = '';
    for (const c of col) cells += `<rect x="${fmt(gx + ci * STEP)}" y="${fmt(hy + 22 + c.wd * STEP)}" width="${S}" height="${S}" rx="3" fill="${ramp[c.lvl]}"/>`;
    grid += `<g class="hc" style="animation-delay:${fmt(ci * 0.07 - 6)}s">${cells}</g>`;
  });
  // legenda menos → mais
  const lx = W - PAD - 5 * STEP - 40, gy2 = hy + 22 + 7 * STEP + 6;
  let legend = d.label('menos', { x: lx - 8, y: gy2 + 10, size: 9, ls: 0.1, anchor: 'end' }) + d.label('mais', { x: W - PAD, y: gy2 + 10, size: 9, ls: 0.1, anchor: 'end' });
  ramp.forEach((c, i) => { legend += `<rect x="${fmt(lx + i * STEP)}" y="${gy2}" width="${S}" height="${S}" rx="3" fill="${c}"/>`; });
  d.add(`<g class="rv" style="--i:2">${months}${legend}${grid}</g>`);

  /* ---- linguagens (por bytes de código nos repositórios próprios) ---- */
  const ly = hy + 22 + 7 * STEP + 50, total = data.langs.reduce((s, l) => s + l.bytes, 0) || 1;
  const top = data.langs.slice(0, 6), rest = total - top.reduce((s, l) => s + l.bytes, 0);
  const segs = top.map(l => ({ name: l.name, pct: (l.bytes / total) * 100 }));
  if (rest > 0) segs.push({ name: 'Outras', pct: (rest / total) * 100 });
  const colors = [t.accent, t.accent2, t.magenta, t.glitchC, t.ok, t.accentText, t.muted];
  const bw = W - PAD * 2, clip = d.id('c');
  d.def(`<clipPath id="${clip}"><rect x="${PAD}" y="${ly + 16}" width="${bw}" height="10" rx="5"/></clipPath>`);
  let bar = '', x = PAD, leg = '', lgx = PAD;
  segs.forEach((s, i) => {
    const w = (bw * s.pct) / 100;
    bar += `<rect x="${fmt(x)}" y="${ly + 16}" width="${fmt(Math.max(w - 2, 1))}" height="10" fill="${colors[i]}"/>`;
    x += w;
    const pct = s.pct >= 10 ? Math.round(s.pct) : +s.pct.toFixed(1);
    leg += `<circle cx="${fmt(lgx + 4)}" cy="${ly + 46}" r="4" fill="${colors[i]}"/>` +
      d.text(s.name, { font: 'D5', size: 13, x: lgx + 14, y: ly + 50.5 });
    const nw = measure(s.name, 'D5', 13);
    leg += d.text(`${String(pct).replace('.', ',')}%`, { font: 'M4', size: 11, x: lgx + 20 + nw, y: ly + 50.5, fill: t.muted });
    lgx += 20 + nw + measure(`${pct}%`, 'M4', 11) + 22;
  });
  const sg = d.id('l');
  d.def(`<linearGradient id="${sg}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
  d.style(`.bs{animation:bs 5s ease-in-out infinite}@keyframes bs{0%{transform:translateX(-140px)}55%,100%{transform:translateX(${bw + 20}px)}}`);
  d.add(`<g class="rv" style="--i:3">${d.label('Linguagens mais usadas', { x: PAD, y: ly })}` +
    `<g clip-path="url(#${clip})">${bar}<rect class="bs" x="${PAD}" y="${ly + 16}" width="120" height="10" fill="url(#${sg})"/></g>${leg}</g>`);

  /* ---- últimos repositórios ---- */
  const ry = ly + 96, rw = (W - PAD * 2 - gap * 2) / 3, rh = 62;
  let rep = d.label('Últimos repositórios atualizados', { x: PAD, y: ry });
  data.recent.slice(0, 6).forEach((r, i) => {
    const cx = PAD + (i % 3) * (rw + gap), cy = ry + 16 + Math.floor(i / 3) * (rh + 12);
    const li = segs.findIndex(s => s.name === r.lang);
    rep += cell(d, cx, cy, rw, rh, { r: 14 }) +
      d.text(r.name, { font: 'G5', size: 15, x: cx + 18, y: cy + 27 }) +
      `<circle cx="${cx + 22}" cy="${cy + 44}" r="3.5" fill="${li >= 0 ? colors[li] : t.muted}"/>` +
      d.text(r.lang || '—', { font: 'M4', size: 10.4, x: cx + 32, y: cy + 47.5, fill: t.muted }) +
      d.label(dia(local(r.pushed)), { x: cx + rw - 18, y: cy + 47.5, anchor: 'end', size: 9.4, ls: 0.1 });
  });
  d.add(`<g class="rv" style="--i:4">${rep}</g>`);
  d.h = ry + 16 + Math.ceil(Math.min(6, data.recent.length) / 3) * (rh + 12) - 12 + PAD;
  return d;
}
