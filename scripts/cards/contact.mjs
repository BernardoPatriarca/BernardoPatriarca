// (09) CONTATO — a "planta técnica" do site + um botão por canal + rodapé.
import { Doc, W, PAD, arrow, fmt } from '../kit.mjs';

export function contact(theme) {
  const H = 380, d = new Doc(W, H, theme), t = d.t;
  d.frame();
  // planta: grade, diagonais e círculos que se desenham sozinhos
  const gx = [110, 300, 580, 770], gy = [86, 190, 294], cx = 440, cy = 190;
  const draw = [`M110 86L770 294`, `M770 86L110 294`];
  const ticks = `M110 86h36M110 86v36M770 86h-36M770 86v36M110 294h36M110 294v-36M770 294h-36M770 294v-36M${cx - 7} ${cy}h14M${cx} ${cy - 7}v14`;
  d.style(`.bd{stroke-dasharray:1;animation:bd 12s ease-in-out infinite}@keyframes bd{0%{stroke-dashoffset:1}28%,86%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
.bt{animation:bt 12s infinite}@keyframes bt{0%,20%{opacity:0}30%,86%{opacity:1}100%{opacity:0}}`);
  d.add(`<g stroke="${t.line}" opacity=".75"><path d="${gx.map(x => `M${x} 0V${H}`).join('')}${gy.map(y => `M0 ${y}H${W}`).join('')}"/></g>`,
    `<g stroke="${t.accent}" stroke-opacity=".55" stroke-width="1.2">` + draw.map((p, i) => `<path class="bd" style="animation-delay:${i * 0.5 - 5}s" pathLength="1" d="${p}"/>`).join('') +
    `<circle class="bd" style="animation-delay:-4.1s" pathLength="1" cx="${cx}" cy="${cy}" r="150"/><circle class="bd" style="animation-delay:-3.7s" pathLength="1" cx="${cx}" cy="${cy}" r="74"/></g>`,
    `<path class="bt" style="animation-delay:-5s" d="${ticks}" stroke="${t.accentText}" stroke-width="1.5"/>`);
  // notas de canto
  d.add(d.label('(09) — Contato', { x: PAD, y: 44 }), d.label('Fig. 09 · Lat −26.22 · Lon −52.67', { x: W - PAD, y: 44, anchor: 'end' }),
    d.label('Escala 1:1 · Esc. BP', { x: PAD, y: H - 30 }), d.label('Pato Branco · PR · BR', { x: W - PAD, y: H - 30, anchor: 'end' }));
  // título
  d.style(`.up{animation:up 1.1s cubic-bezier(.22,1,.36,1) both}@keyframes up{from{transform:translateY(26px)}}`);
  d.add(`<g class="up">${d.text('Vamos', { font: 'G7', size: 92, ls: -0.045, x: cx, y: 176, anchor: 'middle' })}</g>`,
    `<g class="up" style="animation-delay:.12s">${d.line([{ t: 'conversar', font: 'SI' }, { t: '?', font: 'G7', scale: 0.86 }], { x: cx, y: 268, size: 104, anchor: 'middle' }).svg}</g>`);
  return d;
}

const ICONS = {
  site: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.600 4-9z"/>',
  mail: '<rect x="2.5" y="4.500" width="19" height="15" rx="2.500"/><path d="M3 6.500l8.100 6a1.500 1.500 0 0 0 1.800 0l8.100-6" stroke-linecap="round"/>',
  whats: '<path d="M3.200 20.800l1.300-4.600A8.500 8.500 0 1 1 7.900 19.500l-4.700 1.300z" stroke-linejoin="round"/><path d="M9 8.400c.2-.5.4-.5.7-.5h.6c.2 0 .5 0 .7.6l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.5.9 1.300 1.700 2.300 2.200.3.2.5.1.6 0l.7-.8c.2-.2.4-.2.6-.1l1.900.9c.2.1.4.2.4.4 0 .6-.3 1.400-.6 1.600-.5.4-1.200.6-2 .5-1.600-.3-3.500-1.300-5-3-1-1.200-1.600-2.500-1.700-3.600-.1-.9.2-1.600.5-1.900z"/>',
  in: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.600 10.600v6.200" stroke-linecap="round"/><circle cx="7.600" cy="7.500" r="1.150" fill="currentColor" stroke="none"/><path d="M11.400 16.800v-3.500a2.350 2.350 0 0 1 4.700 0v3.500M11.400 16.800v-6.200" stroke-linecap="round"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.300" cy="6.700" r="1.150" fill="currentColor" stroke="none"/>',
  gh: '<path d="M9.200 19.500c-3 .9-3-1.500-4.200-1.800m8.400 3.300v-2.900c0-.8.1-1.200-.4-1.600 2.300-.3 4.600-1.100 4.600-5a3.900 3.900 0 0 0-1.100-2.700 3.600 3.600 0 0 0-.1-2.700s-.9-.3-2.900 1.100a10 10 0 0 0-5 0C6.500 5.800 5.600 6.100 5.600 6.100a3.600 3.600 0 0 0-.1 2.700 3.900 3.900 0 0 0-1.100 2.700c0 3.900 2.300 4.700 4.600 5-.3.3-.5.700-.4 1.100v3" stroke-linecap="round" stroke-linejoin="round"/>',
};

/** botão de contato: metade da largura do README, duas por linha */
function chip(theme, icon, label, value) {
  const CW = 432, CH = 76, d = new Doc(CW, CH, theme), t = d.t;
  d.style(`.ar{animation:ar 2.4s ease-in-out infinite}@keyframes ar{50%{transform:translate(3px,-3px)}}`);
  d.add(`<rect x=".5" y=".5" width="${CW - 1}" height="${CH - 1}" rx="18" fill="${t.bg}" stroke="${t.line2}"/>`,
    `<rect x="16" y="16" width="44" height="44" rx="12" fill="${t.accentSurface}" fill-opacity="${t.dark ? 0.28 : 0.12}"/>`,
    `<g transform="translate(26 26)" stroke="${t.accentText}" style="color:${t.accentText}" stroke-width="1.6" fill="none">${ICONS[icon]}</g>`,
    d.label(label, { x: 76, y: 32, size: 9.6 }), d.text(value, { font: 'D5', size: 15, x: 76, y: 54 }),
    `<g class="ar">${arrow(CW - 38, 31, 11, t.accentText, 1.7)}</g>`);
  return d;
}
export const chipSite = t => chip(t, 'site', 'Portfólio', 'bernardopatriarca.netlify.app');
export const chipLinkedin = t => chip(t, 'in', 'LinkedIn', '/in/bernardopatriarca');
export const chipMail = t => chip(t, 'mail', 'E-mail', 'bernardopatriarca2026@gmail.com');
export const chipWhats = t => chip(t, 'whats', 'WhatsApp', '+55 (46) 9 9971-6231');
export const chipInsta = t => chip(t, 'insta', 'Instagram', '@bernardopatriarca');
export const chipRepos = t => chip(t, 'gh', 'GitHub', 'Todos os repositórios');

export function footer(theme) {
  const d = new Doc(W, 56, theme), t = d.t;
  d.add(`<path d="M0 .5H${W}" stroke="${t.line2}"/>`,
    d.label('© 2026 Bernardo Patriarca', { x: 0, y: 34 }),
    d.label('Pato Branco, BR', { x: W / 2, y: 34, anchor: 'middle' }),
    d.label('SVG + CSS · sem build · sem dependência', { x: W, y: 34, anchor: 'end' }));
  return d;
}
