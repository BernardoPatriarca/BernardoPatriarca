// FAIXA — as duas marquees inclinadas do site: uma sólida, uma "fantasma" andando ao contrário.
import { Doc, W, measure, star, fmt } from '../kit.mjs';

const SOLID = ['Angular', 'Java', 'TypeScript', 'Quarkus', 'Docker', 'Node.js', 'Flutter', 'PostgreSQL'];
const GHOST = ['Clean Code', 'UI/UX', 'APIs REST', 'Scrum', 'Hackathons', 'Performance'];

export function band(theme) {
  const H = 148, d = new Doc(W, H, theme), t = d.t;
  const SIZE = 25, GAP = 22, BH = 48;

  const track = (items, cy, opt) => {
    let x = 0, one = '';
    for (const it of items) {
      const s = it.toUpperCase();
      one += d.text(s, { font: 'G7', size: SIZE, ls: -0.02, x, y: cy + SIZE * 0.35, ...opt.text });
      x += measure(s, 'G7', SIZE, -0.02) + GAP;
      one += star(x + 7, cy, 6.5, opt.star, 2);
      x += 14 + GAP;
    }
    const id = d.id('k'), copies = Math.ceil((W + 240) / x) + 1;
    d.def(`<g id="${id}">${one}</g>`);
    let all = '';
    for (let i = 0; i < copies; i++) all += `<use href="#${id}" x="${fmt(i * x)}"/>`;
    d.style(`.${id}{animation:${id} ${opt.dur}s linear infinite${opt.rev ? ' reverse' : ''}}@keyframes ${id}{to{transform:translateX(${fmt(-x)}px)}}`);
    return `<g transform="translate(-90 0)"><g class="${id}">${all}</g></g>`;
  };

  const y1 = 26;
  d.add(`<g transform="rotate(-2.2 ${W / 2} ${H / 2})">`,
    `<rect x="-60" y="${y1}" width="${W + 120}" height="${BH}" fill="${t.accentSurface}"/>`,
    track(SOLID, y1 + BH / 2, { dur: 38, text: { fill: t.accentInk }, star: 'rgba(255,255,255,.62)' }),
    `<path d="M-60 ${y1 + BH * 2 + 0.5}H${W + 60}" stroke="${t.line}"/>`,
    track(GHOST, y1 + BH * 1.5, { dur: 46, rev: true, text: { stroke: { color: t.dark ? 'rgba(238,235,255,.42)' : 'rgba(7,5,28,.42)', width: 1 } }, star: t.accentText }),
    '</g>');
  return d;
}
