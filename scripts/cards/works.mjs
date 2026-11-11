// (06) PROJETOS — cabeçalho, ZELA em destaque (com o "corredor" do site) e uma linha por projeto.
import { readFileSync } from 'node:fs';
import { Doc, W, PAD, arrow, fmt } from '../kit.mjs';
import { reveal, pill } from './ui.mjs';

const img = name => 'data:image/jpeg;base64,' + readFileSync(new URL(`../img/${name}.jpg`, import.meta.url)).toString('base64');
const soft = t => (t.dark ? 'rgba(238,235,255,.8)' : 'rgba(7,5,28,.8)');
const code = (d, x, y) => d.label('Código', { x: x - 16, y, anchor: 'end', fill: d.t.accentText }) + arrow(x - 10, y - 9, 8, d.t.accentText);

export function works(theme) {
  const d = new Doc(W, 150, theme), t = d.t;
  d.frame(); reveal(d);
  d.add(d.head('06', 'Projetos', [[{ t: 'Trabalhos ' }, { t: 'recentes', i: true }]]));
  const p = d.para('Projetos full-stack que desenvolvi para estudar e resolver problemas reais. Clique em um deles para abrir o código no GitHub.',
    { x: 520, y: 76, width: W - PAD - 520, size: 13.4, lh: 1.55, fill: t.muted });
  d.add(`<g class="rv" style="--i:1">${p.svg}</g>`);
  return d;
}

export function zela(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  const lw = 468, top = 46;
  let s = d.label('01', { x: PAD, y: top, fill: t.accentText }) + d.label('Destaque', { x: PAD + 34, y: top });
  s += d.text('Zela', { font: 'G7', size: 54, ls: -0.035, x: PAD - 2, y: top + 62 });
  s += pill(d, 'Em andamento', { x: PAD + 132, y: top + 34, solid: true }).svg;
  s += d.label('Projeto atual · TCC · UNIMATER · Defesa prevista dez/2026', { x: PAD, y: top + 92, size: 9.8, ls: 0.13 });
  const p = d.para('Plataforma web de gestão financeira e prestação de contas para processos de curatela e tutela. Busca facilitar o trabalho de curadores e tutores, que hoje costumam juntar planilhas, papéis e extratos soltos para prestar contas à Justiça.',
    { x: PAD, y: top + 124, width: lw, size: 14, lh: 1.6, fill: soft(t) });
  s += p.svg;
  let y = top + 124 + p.height + 12;
  for (const pt of ['Conciliação com extratos bancários OFX/CSV', 'Relatório em PDF determinístico, com hash SHA-256', 'Trilha de auditoria de cada alteração', 'Alertas de prazo legal por e-mail']) {
    s += `<path d="M${PAD + 1} ${y - 4.5}h9M${PAD + 5.5} ${y - 9}v9" stroke="${t.accentText}" stroke-width="1.5" stroke-linecap="round"/>` +
      d.text(pt, { font: 'D4', size: 13.6, x: PAD + 22, y, fill: t.text });
    y += 24;
  }
  y += 10;
  s += d.label('Java 21 · Quarkus · Angular · PrimeNG · PostgreSQL · AWS Lambda · CloudFront', { x: PAD, y, size: 9.4, ls: 0.07 });
  d.h = y + PAD - 6;

  /* ---- corredor: sala em perspectiva, a "câmera" avança sem parar ---- */
  const px = PAD + lw + 36, pw = W - PAD - px, py = 34, ph = d.h - 68, cx = px + pw / 2, cy = py + ph / 2, K = 0.14;
  const clip = d.id('c'), glow = d.id('o');
  d.def(`<clipPath id="${clip}"><rect x="${px}" y="${py}" width="${pw}" height="${fmt(ph)}" rx="16"/></clipPath>`);
  d.def(`<radialGradient id="${glow}"><stop offset="0" stop-color="${t.glowA}" stop-opacity=".9"/><stop offset="1" stop-color="${t.glowA}" stop-opacity="0"/></radialGradient>`);
  let rays = '';
  const N = 6;
  for (let i = 0; i <= N; i++) {
    const fx = px + (pw * i) / N, fy = py + (ph * i) / N;
    for (const [x, yy] of [[fx, py], [fx, py + ph], [px, fy], [px + pw, fy]]) {
      rays += `M${fmt(cx + (x - cx) * K)} ${fmt(cy + (yy - cy) * K)}L${fmt(x)} ${fmt(yy)}`;
    }
  }
  let rings = '';
  for (let i = 0; i < 5; i++) {
    rings += `<rect class="cr" style="animation-delay:${fmt(-i * 1.1)}s" x="${px}" y="${py}" width="${pw}" height="${fmt(ph)}" stroke="${t.accent}" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`;
  }
  d.style(`.cr{transform-origin:${fmt(cx)}px ${fmt(cy)}px;animation:cr 5.5s cubic-bezier(.55,0,1,.45) infinite}@keyframes cr{0%{transform:scale(${K});opacity:0}18%{opacity:.75}100%{transform:scale(1.04);opacity:.9}}
.fl{animation:fl 3.6s ease-in-out infinite alternate}@keyframes fl{to{transform:translateY(-7px)}}`);
  const bw = 176, bh = 96;
  s += `<g clip-path="url(#${clip})"><rect x="${px}" y="${py}" width="${pw}" height="${fmt(ph)}" fill="${t.dark ? '#070620' : '#F6F3FF'}"/>` +
    `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(pw * 0.42)}" fill="url(#${glow})" opacity="${t.dark ? 0.55 : 0.35}"/>` +
    `<path d="${rays}" stroke="${t.accent}" stroke-opacity=".3"/>${rings}</g>` +
    `<rect x="${px}" y="${py}" width="${pw}" height="${fmt(ph)}" rx="16" stroke="${t.line2}"/>` +
    `<g class="fl"><rect x="${fmt(cx - bw / 2)}" y="${fmt(cy - bh / 2)}" width="${bw}" height="${bh}" rx="12" fill="${t.surface}" fill-opacity=".94" stroke="${t.accent}"/>` +
    d.text('zela', { font: 'U9', size: 34, ls: -0.03, x: cx, y: cy + 4, anchor: 'middle' }) +
    d.label('MVP em desenvolvimento', { x: cx, y: cy + 28, anchor: 'middle', size: 8.2, ls: 0.12 }) + '</g>';
  s += code(d, px - 36, top);
  d.add(`<g class="rv">${s}</g>`);
  return d;
}

/** linha de projeto com as três telas reais alternando, como o preview do site */
function row(theme, { num, title, desc, tags, shots }) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame({ orbs: false }); reveal(d);
  const tw = 304, th = 190, lw = W - PAD * 2 - tw - 44, top = 44;
  let s = d.label(num, { x: PAD, y: top, fill: t.accentText });
  s += d.text(title, { font: 'G7', size: 27, ls: -0.025, x: PAD, y: top + 42 });
  const p = d.para(desc, { x: PAD, y: top + 72, width: lw, size: 13.6, lh: 1.58, fill: soft(t) });
  s += p.svg;
  const ty = Math.max(top + 72 + p.height + 14, 30 + th - 4);
  s += d.label(tags, { x: PAD, y: ty, size: 9.4, ls: 0.1 });
  d.h = Math.max(ty + 30, 30 + th + 34);

  const tx = W - PAD - tw, y0 = (d.h - th) / 2, clip = d.id('c'), T = shots.length * 4;
  d.def(`<clipPath id="${clip}"><rect x="${tx}" y="${fmt(y0)}" width="${tw}" height="${th}" rx="12"/></clipPath>`);
  d.style(`.sl{opacity:0;transform-origin:${tx + tw / 2}px ${fmt(y0 + th / 2)}px;animation:sl ${T}s infinite}
@keyframes sl{0%{opacity:0;transform:scale(1.07)}6%{opacity:1}${fmt(100 / shots.length)}%{opacity:1}${fmt(100 / shots.length + 6)}%{opacity:0;transform:scale(1)}100%{opacity:0}}`);
  let slides = `<image x="${tx}" y="${fmt(y0)}" width="${tw}" height="${th}" preserveAspectRatio="xMidYMin slice" href="${img(shots[0])}"/>`;
  shots.forEach((sh, i) => {
    if (i) slides += `<image class="sl" style="animation-delay:${i * 4 - 0.24}s" x="${tx}" y="${fmt(y0)}" width="${tw}" height="${th}" preserveAspectRatio="xMidYMin slice" href="${img(sh)}"/>`;
  });
  s += `<rect x="${tx + 9}" y="${fmt(y0 + 9)}" width="${tw}" height="${th}" rx="12" stroke="${t.line2}"/>` +
    `<g clip-path="url(#${clip})"><rect x="${tx}" y="${fmt(y0)}" width="${tw}" height="${th}" fill="${t.surface2}"/>${slides}</g>` +
    `<rect x="${tx}" y="${fmt(y0)}" width="${tw}" height="${th}" rx="12" stroke="${t.line2}"/>`;
  s += code(d, tx - 44, top);
  d.add(`<g class="rv">${s}</g>`);
  return d;
}

export const catalogo = theme => row(theme, {
  num: '02', title: 'Catálogo de Filmes e Séries',
  desc: 'Catálogo de filmes e séries com cadastro de títulos, gêneros e elenco, avaliações com nota e comentário, dashboard com estatísticas e busca avançada. Projeto de estudo full-stack.',
  tags: 'Java · Quarkus · Angular · PostgreSQL · PrimeNG · Flyway', shots: ['catalogo-1', 'catalogo-2', 'catalogo-3'],
});
export const multi = theme => row(theme, {
  num: '03', title: 'Multi Plataform',
  desc: 'Sistema fullstack de login e gestão de usuários (web e mobile). Back-end em Java/Spring Boot com PostgreSQL e Flyway, autenticação JWT. Front-end em Angular + Ionic + Capacitor, gerando app web e nativo.',
  tags: 'Java · Spring Boot · Angular · Ionic · SQL · Flyway', shots: ['multi-1', 'multi-2', 'multi-3'],
});
export const crm = theme => row(theme, {
  num: '04', title: 'Prime CRM',
  desc: 'Sistema de gestão de relacionamento com clientes moderno, completo e configurável. Possui autenticação, dashboard, funil de vendas, entre outras funcionalidades.',
  tags: 'Java · Spring Boot · Angular · PostgreSQL · PrimeNG · SQL', shots: ['prime-1', 'prime-2', 'prime-3'],
});
