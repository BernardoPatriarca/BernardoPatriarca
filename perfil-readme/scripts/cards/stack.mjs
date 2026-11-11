// (04) STACK — os trilhos de tecnologias, cada um correndo para um lado.
import { Doc, W, PAD, measure, fmt } from '../kit.mjs';
import { reveal } from './ui.mjs';

const RAILS = [
  ['Front-end', ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'PrimeNG', 'PrimeFlex', 'Bootstrap']],
  ['Back-end', ['Java', 'Quarkus', 'Spring Boot', 'JSF', 'Node.js', 'REST APIs', 'N8N', 'Agente IA RAG']],
  ['Dados', ['PostgreSQL', 'SQL Server', 'MongoDB', 'Firestore', 'Supabase']],
  ['DevOps & Infra', ['Docker', 'Kubernetes', 'Jenkins', 'Portainer', 'RabbitMQ', 'Redis', 'Flyway']],
  ['Mobile & ferramentas', ['Flutter', 'React Native', 'Dart', 'Git', 'GitHub', 'Bitbucket', 'AWS', 'Testes unitários', 'Claude Code', 'Scrum', 'Kanban']],
];

export function stack(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  d.add(d.head('04', 'Stack', [[{ t: 'Ferramentas do ' }, { t: 'ofício', i: true }]]));

  const top = 146, RH = 40, GAP = 14, X0 = 236, X1 = W, SIZE = 14.5, PX = 16, TG = 10;
  // máscara: os trilhos somem suavemente nas duas pontas
  const mg = d.id('l'), mk = d.id('m');
  d.def(`<linearGradient id="${mg}" x1="${X0}" x2="${X1}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".09" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
  d.def(`<mask id="${mk}" maskUnits="userSpaceOnUse" x="${X0}" y="${top - 4}" width="${X1 - X0}" height="${RAILS.length * (RH + GAP)}"><rect x="${X0}" y="${top - 4}" width="${X1 - X0}" height="${RAILS.length * (RH + GAP)}" fill="url(#${mg})"/></mask>`);

  let rails = '', labels = '';
  RAILS.forEach(([name, tags], i) => {
    const y = top + i * (RH + GAP);
    labels += `<g class="rv" style="--i:${i}">` + d.label(name, { x: PAD, y: y + RH / 2 + 4 }) +
      `<path d="M${PAD} ${y + RH + GAP / 2}H${X0 - 24}" stroke="${t.line}"/></g>`;
    let x = 0, one = '';
    for (const tg of tags) {
      const w = measure(tg, 'G5', SIZE) + PX * 2;
      one += `<rect x="${fmt(x)}" y="${y}" width="${fmt(w)}" height="${RH}" rx="${RH / 2}" fill="${t.surface}" fill-opacity="${t.dark ? 0.8 : 0.9}" stroke="${t.line2}"/>` +
        d.text(tg, { font: 'G5', size: SIZE, x: x + PX, y: y + RH / 2 + 5 });
      x += w + TG;
    }
    const id = d.id('k'), copies = Math.ceil((X1 - X0 + 40) / x) + 1, dur = Math.round(x / 26) + (i % 2) * 5;
    d.def(`<g id="${id}">${one}</g>`);
    let all = '';
    for (let c = 0; c < copies; c++) all += `<use href="#${id}" x="${fmt(c * x)}"/>`;
    d.style(`.${id}{animation:${id} ${dur}s linear infinite${i % 2 ? ' reverse' : ''}}@keyframes ${id}{to{transform:translateX(${fmt(-x)}px)}}`);
    rails += `<g transform="translate(${X0} 0)"><g class="${id}">${all}</g></g>`;
  });
  d.add(labels, `<g mask="url(#${mk})">${rails}</g>`);
  d.h = top + RAILS.length * (RH + GAP) - GAP + PAD;
  return d;
}
