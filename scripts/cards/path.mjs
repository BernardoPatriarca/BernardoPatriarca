// (05) TRAJETÓRIA — linha do tempo, destaque e idiomas.
import { Doc, W, PAD, fmt } from '../kit.mjs';
import { cell, reveal, pill } from './ui.mjs';

const ITEMS = [
  { when: 'Mai 2026 — Atual', badge: 'Trabalho', title: 'Desenvolvedor Full Stack', org: 'IDS Software e Assessoria · Pato Branco, PR',
    desc: 'Time do módulo de Saúde, em soluções de Gestão Pública Municipal. Java e Quarkus nas APIs, Docker e PostgreSQL; Angular e PrimeNG no front, com foco em usabilidade e performance.' },
  { when: 'Mai 2024 — Mai 2026 · 2 anos 1 mês', badge: 'Trabalho', title: 'Desenvolvedor de Sistemas', org: 'Supera Sistemas · Pato Branco, PR',
    desc: 'Full Stack Java em sistemas de gestão de entidades e CRM, do levantamento de requisitos à sustentação. Angular, PrimeFaces, PostgreSQL, SQL Server, MongoDB, Firestore e integrações com APIs externas (Google, WhatsApp).' },
  { when: '2024 — 2028 · Em andamento', badge: 'Graduação', title: 'Sistemas de Informação', org: 'UNIMATER · Pato Branco, PR' },
  { when: 'Ago 2022 — Dez 2023 · Concluído', badge: 'Técnico', title: 'Análise de Sistemas de Computação', org: 'SENAI · Pato Branco, PR',
    desc: 'Base em lógica de programação, estruturas de dados, desenvolvimento web e boas práticas de engenharia de software.' },
  { when: '2014 — 2019 · Concluído', badge: 'Idioma', title: 'Inglês — 5 anos de formação', org: 'PBF · Pato Branco, PR' },
];

export function path(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  d.add(d.head('05', 'Trajetória', [[{ t: 'Formação & ' }, { t: 'experiência', i: true }]]));

  const top = 150, lx = PAD + 7, cx = PAD + 36, cw = 492, right = cx + cw;
  let y = top, items = '';
  const dots = [];
  ITEMS.forEach((it, i) => {
    dots.push(y - 4);
    let s = d.label(it.when, { x: cx, y, fill: i === 0 ? t.accentText : t.muted });
    s += pill(d, it.badge, { x: right, y: y - 15, anchor: 'end' }).svg;
    s += d.text(it.title, { font: 'G7', size: 19, ls: -0.015, x: cx, y: y + 30 });
    s += d.text(it.org, { font: 'D4', size: 13.2, x: cx, y: y + 51, fill: t.muted });
    let h = 62;
    if (it.desc) {
      const p = d.para(it.desc, { x: cx, y: y + 76, width: cw, size: 13.2, lh: 1.55, fill: t.dark ? 'rgba(238,235,255,.78)' : 'rgba(7,5,28,.8)' });
      s += p.svg; h = 62 + p.height + 6;
    }
    items += `<g class="rv" style="--i:${i}">${s}</g>`;
    y += h + 30;
  });
  const end = y - 30;
  // linha do tempo: trilho + um "cometa" que desce acendendo os pontos
  const T = 8, len = end - top;
  d.style(`.cm{animation:cm ${T}s linear infinite}@keyframes cm{0%{transform:translateY(-60px);opacity:0}6%{opacity:1}92%{opacity:1}100%{transform:translateY(${fmt(len)}px);opacity:0}}
.dt{animation:dt ${T}s infinite}@keyframes dt{0%,100%{fill:${t.bg};stroke:${t.line2}}6%,22%{fill:${t.accent};stroke:${t.accent}}40%{fill:${t.bg};stroke:${t.line2}}}`);
  const cg = d.id('l'), cc = d.id('c');
  d.def(`<linearGradient id="${cg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="1" stop-color="${t.glitchC}"/></linearGradient>`);
  d.def(`<clipPath id="${cc}"><rect x="${lx - 4}" y="${top - 8}" width="8" height="${fmt(len + 8)}"/></clipPath>`);
  let line = `<path d="M${lx} ${top - 8}V${fmt(end)}" stroke="${t.line}" stroke-width="1.5"/>` +
    `<g clip-path="url(#${cc})"><rect class="cm" x="${lx - 1}" y="${top - 8}" width="2" height="60" rx="1" fill="url(#${cg})"/></g>`;
  dots.forEach((dy, i) => {
    const delay = ((dy - top + 52) / (len + 60)) * T - T;
    line += `<circle class="dt" style="animation-delay:${fmt(delay)}s" cx="${lx}" cy="${fmt(dy)}" r="5.5" fill="${t.bg}" stroke="${t.line2}" stroke-width="1.5"/>`;
  });
  d.add(line, items);

  /* ---- coluna da direita ---- */
  const rx = right + 30, rw = W - PAD - rx, ip = 22;
  // destaque: hackathons
  const hp = d.para('Dois hackathons: projetos completos do zero, com foco em inovação, entrega rápida e trabalho em equipe.',
    { x: rx + ip, y: top + 122, width: rw - ip * 2, size: 13, lh: 1.5, fill: t.muted });
  const hh = 140 + hp.height + 6;
  d.add(`<g class="rv" style="--i:1">${cell(d, rx, top - 18, rw, hh)}` +
    d.label('Destaque', { x: rx + ip, y: top + 12 }) +
    pill(d, '2× Hackathon', { x: rx + rw - ip, y: top - 3, solid: true, anchor: 'end' }).svg +
    d.text('Soluções criativas', { font: 'G7', size: 19, ls: -0.015, x: rx + ip, y: top + 60 }) +
    d.line([{ t: 'sob ', font: 'G7', ls: -0.015 }, { t: 'pressão', font: 'SI', scale: 1.16 }], { x: rx + ip, y: top + 84, size: 19 }).svg +
    hp.svg + '</g>');

  // idiomas
  const ly = top - 18 + hh + 16, LANGS = [['Português', 'Nativo', 'C2', 1], ['Inglês', 'Avançado · 5 anos (PBF)', 'C1', 0.8334]];
  const lh = 196, bw = rw - ip * 2;
  const sh = d.id('l');
  d.def(`<linearGradient id="${sh}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
  d.style(`.sh{animation:sh 3.6s ease-in-out infinite}@keyframes sh{0%{transform:translateX(-70px)}60%,100%{transform:translateX(${bw + 20}px)}}`);
  let lg = cell(d, rx, ly, rw, lh) + d.label('Idiomas', { x: rx + ip, y: ly + 30 });
  LANGS.forEach(([name, lvl, code, fill], i) => {
    const y = ly + 62 + i * 68, c = d.id('c');
    d.def(`<clipPath id="${c}"><rect x="${rx + ip}" y="${y + 26}" width="${fmt(bw * fill)}" height="6" rx="3"/></clipPath>`);
    lg += d.text(name, { font: 'G7', size: 16, x: rx + ip, y }) + d.text(code, { font: 'G7', size: 16, x: rx + rw - ip, y, anchor: 'end', fill: t.accentText }) +
      d.text(lvl, { font: 'M4', size: 9.6, x: rx + ip, y: y + 16, fill: t.muted }) +
      `<rect x="${rx + ip}" y="${y + 26}" width="${bw}" height="6" rx="3" fill="${t.line}"/>` +
      `<g clip-path="url(#${c})"><rect x="${rx + ip}" y="${y + 26}" width="${bw}" height="6" fill="${t.accent}"/>` +
      `<rect class="sh" style="animation-delay:${i * 0.5}s" x="${rx + ip}" y="${y + 26}" width="60" height="6" fill="url(#${sh})"/></g>`;
  });
  d.add(`<g class="rv" style="--i:2">${lg}</g>`);

  // próximo marco: a defesa do TCC
  const my = ly + lh + 16, mh = Math.max(150, end - my);
  d.style(`.mk{animation:mk 2s infinite}@keyframes mk{50%{opacity:.3}}`);
  const mp = d.para('ZELA — prestação de contas para curatela e tutela. Defesa prevista para dez/2026, na UNIMATER.',
    { x: rx + ip, y: my + 88, width: rw - ip * 2, size: 13, lh: 1.5, fill: t.muted });
  d.add(`<g class="rv" style="--i:3">${cell(d, rx, my, rw, mh)}` +
    `<circle class="mk" cx="${rx + ip + 4}" cy="${my + 27}" r="3.5" fill="${t.magenta}"/>` +
    d.label('Próximo marco', { x: rx + ip + 16, y: my + 31 }) +
    d.text('Defesa do TCC', { font: 'G7', size: 19, ls: -0.015, x: rx + ip, y: my + 62 }) + mp.svg + '</g>');

  d.h = Math.max(end, my + mh) + PAD;
  return d;
}
