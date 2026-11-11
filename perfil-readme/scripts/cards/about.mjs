// (01) SOBRE — o bento do site: texto, números e o "agora".
import { Doc, W, PAD } from '../kit.mjs';
import { cell, reveal } from './ui.mjs';

export function about(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  d.add(d.head('01', 'Sobre mim', [[{ t: 'Transformando ideias' }], [{ t: 'em ' }, { t: 'código', i: true }]]));

  const top = 170, lw = 500, gap = 16, rx = PAD + lw + gap, rw = W - PAD - rx, ip = 26;
  const soft = t.dark ? 'rgba(238,235,255,.82)' : 'rgba(7,5,28,.82)';
  const paras = [
    [{ t: 'Sou um desenvolvedor Full Stack de 21 anos, apaixonado por tecnologia e inovação. Atualmente trabalho na ' },
      { t: 'IDS Software e Assessoria', font: 'D5', fill: t.text },
      { t: ', em Pato Branco — PR, onde atuo no módulo de Saúde de soluções de Gestão Pública Municipal, construindo sistemas que conectam cidadãos aos serviços públicos do município.' }],
    [{ t: 'Minha jornada começou pelo SENAI com o técnico em Análise de Sistemas de Computação, e hoje curso Sistemas de Informação na UNIMATER. Fora do trabalho, participo de hackathons e continuo evoluindo meu portfólio pessoal.' }],
    [{ t: 'Meu objetivo é crescer como engenheiro de software, aprofundando minha expertise em JavaScript moderno, arquiteturas escaláveis e boas práticas de engenharia.' }],
  ];
  let ty = top + ip + 14, body = '';
  for (const p of paras) {
    const r = d.para(p, { x: PAD + ip, y: ty, width: lw - ip * 2, size: 14.2, lh: 1.62, fill: soft });
    body += r.svg; ty += r.height + 12;
  }
  const ch = ty - 12 - 8 + ip - top;
  d.add(`<g class="rv">${cell(d, PAD, top, lw, ch)}${body}</g>`);

  // números
  const stats = [['2+', 'Anos de experiência'], ['2', 'Hackathons'], ['15+', 'Tecnologias']];
  const nowH = 132, sh = ch - nowH - gap, row = (sh - 28) / 3;
  let st = cell(d, rx, top, rw, sh);
  stats.forEach(([num, lab], i) => {
    const y = top + 14 + row * i;
    if (i) st += `<path d="M${rx + ip} ${y}H${rx + rw - ip}" stroke="${t.line}"/>`;
    st += d.text(num, { font: 'G7', size: 44, ls: -0.04, x: rx + ip, y: y + row / 2 + 15, fill: t.text });
    st += d.label(lab, { x: rx + rw - ip, y: y + row / 2 + 4, anchor: 'end' });
  });
  d.add(`<g class="rv" style="--i:1">${st}</g>`);

  // agora
  const ny = top + sh + gap;
  d.style(`.now{animation:now 2s infinite}@keyframes now{50%{opacity:.35}}`);
  d.add(`<g class="rv" style="--i:2">${cell(d, rx, ny, rw, nowH)}` +
    d.label('Agora', { x: rx + ip, y: ny + 32 }) +
    d.line([{ t: 'Full Stack @ ', fill: soft }, { t: 'IDS Software', font: 'D5' }], { x: rx + ip, y: ny + 62, size: 16 }).svg +
    d.text('e Assessoria', { font: 'D5', size: 16, x: rx + ip, y: ny + 84 }) +
    `<circle class="now" cx="${rx + ip + 4}" cy="${ny + 106}" r="3.5" fill="${t.ok}"/>` +
    d.label('Pato Branco, PR · UTC−3', { x: rx + ip + 16, y: ny + 110 }) + '</g>');

  d.h = top + ch + PAD;
  return d;
}
