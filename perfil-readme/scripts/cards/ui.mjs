// peças compartilhadas entre os cards
import { fmt } from '../kit.mjs';

/** célula do "bento": superfície translúcida com borda fina */
export const cell = (d, x, y, w, h, { r = 18, cls = '', extra = '' } = {}) =>
  `<rect${cls ? ` class="${cls}"` : ''} x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${r}" fill="${d.t.surface}" fill-opacity="${d.t.dark ? 0.74 : 0.78}" stroke="${d.t.line}"${extra}/>`;

/** entrada em cascata: .rv com --i define o atraso. Só desloca (não esconde): o quadro 0 já é o card completo,
 *  então nada some se o navegador pausar a animação de uma imagem fora da tela. */
export const reveal = d => d.style(`.rv{animation:rv .9s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i,0)*.09s)}
@keyframes rv{from{transform:translateY(16px)}}`);

/** pílula com texto (badge) → { svg, width } */
export function pill(d, str, { x, y, h = 22, solid = false, font = 'M5', size = 9.5, color = null, anchor = 'start' }) {
  const t = d.t, label = str.toUpperCase();
  const tw = (label.length * 0.6 + (label.length - 1) * 0.14) * size, w = tw + 20;
  const x0 = anchor === 'end' ? x - w : x;
  const svg = `<rect x="${fmt(x0)}" y="${fmt(y)}" width="${fmt(w)}" height="${h}" rx="${h / 2}" ${solid ? `fill="${t.accentSurface}"` : `fill="none" stroke="${color || t.line2}"`}/>` +
    d.text(label, { font, size, ls: 0.14, x: x0 + 10, y: y + h / 2 + size * 0.36, fill: solid ? t.accentInk : (color || t.text) });
  return { svg, width: w };
}
