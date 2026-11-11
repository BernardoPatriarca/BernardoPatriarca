// (08) LAB — o terminal do site. Dois comandos em loop: neofetch e skills.
import { Doc, W, PAD, measure, fmt } from '../kit.mjs';
import { cell } from './ui.mjs';

export function terminal(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame();
  d.add(d.head('08', 'Lab', [[{ t: 'Brinca com o ' }, { t: 'terminal', i: true }]]));

  const top = 146, FS = 13, LH = 21.5, CH = measure('0', 'M4', FS), bar = 40, ip = 24, LINES = 11;
  const H = bar + ip * 2 + LINES * LH - 6, x0 = PAD + ip, y0 = top + bar + ip + 12;
  const T = 18;                                   // duração do ciclo completo
  const PROMPT = 'visitante@bernardo', pw = (PROMPT.length + 4) * CH;

  let s = `<rect x="${PAD}" y="${top}" width="${W - PAD * 2}" height="${fmt(H)}" rx="16" fill="${t.dark ? '#070620' : '#FFFFFF'}" fill-opacity=".92" stroke="${t.line2}"/>` +
    `<path d="M${PAD} ${top + bar}H${W - PAD}" stroke="${t.line}"/>` +
    ['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => `<circle cx="${PAD + 22 + i * 16}" cy="${top + bar / 2}" r="5" fill="${c}" fill-opacity=".9"/>`).join('') +
    d.label('bernardo@portfolio — bash', { x: W / 2, y: top + bar / 2 + 4, anchor: 'middle' });

  const prompt = y => d.text(PROMPT, { font: 'M5', size: FS, x: x0, y, fill: t.ok }) +
    d.text(':~$', { font: 'M5', size: FS, x: x0 + PROMPT.length * CH, y, fill: t.accentText });

  /** uma "cena": prompt + comando digitado + saída. on/off = quando a cena aparece e some (% do ciclo),
   *  type = quando começa a digitar, show = quando a saída entra. A cena 1 já começa pronta no quadro 0. */
  const scene = (cmd, { on, off, type, show, first = false }, rows) => {
    const done = type + (cmd.length * 0.1 * 100) / T, clip = d.id('c'), k = d.id('s'), n = cmd.length, dx = fmt(n * CH);
    const vis = (a, b) => first ? `0%{opacity:1}${b}%{opacity:0}${a}%{opacity:1}100%{opacity:1}` : `0%{opacity:0}${a}%{opacity:1}${b}%{opacity:0}100%{opacity:0}`;
    const typed = (from, to) => first
      ? `0%,${on - 1}%{transform:${to};animation-timing-function:steps(1)}${on}%,${type}%{transform:${from};animation-timing-function:steps(${n})}${fmt(done)}%,100%{transform:${to}}`
      : `0%,${type}%{transform:${from};animation-timing-function:steps(${n})}${fmt(done)}%,100%{transform:${to}}`;
    d.def(`<clipPath id="${clip}"><rect class="${k}t" x="${fmt(x0 + pw)}" y="${y0 - 14}" width="${fmt(n * CH + 1)}" height="20"/></clipPath>`);
    d.style(`.${k}{animation:${k} ${T}s steps(1) infinite}@keyframes ${k}{${vis(on, off)}}
.${k}t{transform-origin:${fmt(x0 + pw)}px 0;animation:${k}t ${T}s infinite}@keyframes ${k}t{${typed('scaleX(0)', 'scaleX(1)')}}
.${k}c{animation:${k}c ${T}s infinite}@keyframes ${k}c{${typed('translateX(0)', `translateX(${dx}px)`)}}
.${k}o{animation:${k}o ${T}s steps(1) infinite}@keyframes ${k}o{${vis(show, off)}}`);
    const hide = first ? '' : ' opacity="0"';
    return `<g class="${k}"${hide}>` + prompt(y0) +
      `<g clip-path="url(#${clip})">${d.text(cmd, { font: 'M4', size: FS, x: x0 + pw, y: y0 })}</g>` +
      `<g class="${k}c"${first ? ` transform="translate(${dx} 0)"` : ''}><rect class="blk" x="${fmt(x0 + pw + 1)}" y="${y0 - 12}" width="${fmt(CH)}" height="16" fill="${t.accentText}"/></g></g>` +
      `<g class="${k}o"${hide}>${rows}</g>`;
  };
  d.style(`.blk{animation:blk 1s steps(1) infinite}@keyframes blk{50%{opacity:0}}`);

  /* cena 1: neofetch */
  const art = ['  ____', ' /    \\', '| BP   |', '|  __  |', ' \\____/'];
  const info = [['host', 'bernardopatriarca.netlify.app'], ['kernel', 'java-21 · quarkus · angular'], ['uptime', 'no GitHub desde 2023'],
    ['shell', 'bash-web'], ['tema', theme], ['stack', 'Angular · Java · Quarkus'], ['local', 'Pato Branco, PR — BR']];
  let neo = '';
  const ny = y0 + LH * 1.6, ix = x0 + 15 * CH;
  art.forEach((ln, i) => { neo += d.text(ln, { font: 'M7', size: FS, x: x0 + CH * 2, y: ny + (i + 1) * LH, fill: t.accentText }); });
  neo += d.text('visitante', { font: 'M7', size: FS, x: ix, y: ny, fill: t.ok }) + d.text('@', { font: 'M4', size: FS, x: ix + 9 * CH, y: ny, fill: t.muted }) +
    d.text('bernardo', { font: 'M7', size: FS, x: ix + 10 * CH, y: ny, fill: t.accentText }) +
    `<path d="M${fmt(ix)} ${fmt(ny + 9)}h${fmt(18 * CH)}" stroke="${t.line2}" stroke-dasharray="3 3"/>`;
  info.forEach(([k, v], i) => {
    const y = ny + (i + 1) * LH + 4;
    neo += d.text(k, { font: 'M7', size: FS, x: ix, y, fill: t.accentText }) + d.text(v, { font: 'M4', size: FS, x: ix + 10 * CH, y });
  });
  // paleta, como no neofetch de verdade
  [t.accent, t.accent2, t.magenta, t.glitchC, t.ok, t.text].forEach((c, i) => {
    neo += `<rect x="${fmt(ix + i * 22)}" y="${fmt(ny + 8 * LH + 2)}" width="22" height="12" fill="${c}"/>`;
  });

  /* cena 2: skills */
  const SK = [['front', 'Angular · React · TypeScript · JavaScript · Tailwind · PrimeNG'], ['back', 'Java · Quarkus · Spring Boot · Node.js · JSF · REST APIs · n8n'],
    ['dados', 'PostgreSQL · SQL Server · MongoDB · Firestore · Supabase'], ['devops', 'Docker · Kubernetes · Jenkins · Portainer · RabbitMQ · Redis · Flyway'],
    ['mobile', 'Flutter · React Native · Dart'], ['tools', 'Git · GitHub · Bitbucket · AWS · Testes unitários · Scrum · Kanban']];
  let sk = '';
  SK.forEach(([k, v], i) => {
    const y = y0 + LH * (i + 1.6);
    sk += d.text(k, { font: 'M7', size: FS, x: x0, y, fill: t.accentText }) + d.text(v, { font: 'M4', size: FS, x: x0 + 9 * CH, y });
  });
  const y2 = y0 + LH * 8.4;
  sk += prompt(y2) + d.text('open zela', { font: 'M4', size: FS, x: x0 + pw, y: y2 }) +
    d.text('Abrindo github.com/BernardoPatriarca/zela ...', { font: 'M4', size: FS, x: x0, y: y2 + LH, fill: t.ok });

  s += scene('neofetch', { first: true, on: 90, type: 92, show: 98.5, off: 42 }, neo) + scene('skills', { on: 44, type: 46, show: 51, off: 90 }, sk);
  d.add(s);
  d.h = top + H + PAD;
  return d;
}
