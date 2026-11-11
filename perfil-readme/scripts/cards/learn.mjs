// CÓDIGO + ESTUDANDO AGORA — o bernardo.ts do site ao lado do pipeline de deploy que ele descreve.
import { Doc, W, PAD, measure, fmt } from '../kit.mjs';
import { cell, reveal } from './ui.mjs';

const CODE = `const dev: Developer = {
  name:     "Bernardo Patriarca",
  role:     "Full Stack Developer",
  location: "Pato Branco, PR",
  stack: {
    front: ["Angular", "React", "TypeScript"],
    back:  ["Java", "Quarkus", "Spring"],
    infra: ["Docker", "Kubernetes"],
    data:  ["PostgreSQL", "MongoDB"],
  },
  learning: ["AWS", "Terraform", "GitHub Actions"],
  available: () => true, // sempre
};

// o que estou estudando, em forma de pipeline
async function deploy(app: App) {
  await test(app);
  const img = await buildNative(app); // GraalVM
  await terraform.apply();            // IaC
  await lambda.publish(img);          // + API Gateway
  await s3.sync("dist/");
  await cloudfront.invalidate("/*");
  return monitor(app);                // CloudWatch
}`.split('\n');

const STEPS = [
  ['Quarkus nativo', 'GraalVM · cold start baixo'],
  ['CI/CD', 'GitHub Actions · testes · deploy'],
  ['Terraform', 'infraestrutura como código'],
  ['Lambda + API Gateway', 'back-end serverless'],
  ['S3 + CloudFront', 'front-end com CDN e HTTPS'],
  ['Cognito + MFA', 'autenticação com 2º fator · JWT'],
  ['CloudWatch + X-Ray', 'logs, métricas e tracing'],
];

/** realce de sintaxe mínimo: devolve [{ t, c }] */
function tokens(line) {
  const out = [], re = /(\/\/.*$)|("[^"]*")|\b(const|async|function|await|return|true)\b|\b(Developer|App)\b|([A-Za-z_]\w*)(?=\()|(\s+)|([^\s"]+?)/g;
  let m;
  while ((m = re.exec(line))) {
    const c = m[1] ? 'cm' : m[2] ? 'st' : m[3] ? 'kw' : m[4] ? 'tp' : m[5] ? 'fn' : null;
    const last = out[out.length - 1];
    if (last && last.c === c) last.t += m[0]; else out.push({ t: m[0], c });
  }
  return out;
}

export function learn(theme) {
  const d = new Doc(W, 10, theme), t = d.t;
  d.frame(); reveal(d);
  const top = PAD, cw = 470, gap = 16, FS = 12.2, LH = 19.4, CHW = measure('0', 'M4', FS);
  const barH = 40, cp = 22, codeTop = top + barH + cp + 10;
  const H = barH + cp * 2 + CODE.length * LH + 2;

  /* ---- editor ---- */
  let code = cell(d, PAD, top, cw, H) +
    `<path d="M${PAD} ${top + barH}H${PAD + cw}" stroke="${t.line}"/>` +
    d.label('bernardo.ts', { x: PAD + cp, y: top + 25 }) +
    [0, 1, 2].map(i => `<circle cx="${PAD + cw - cp - i * 14}" cy="${top + 21}" r="4" fill="${t.line2}"/>`).join('');
  // barra de realce que desce pelos passos do deploy()
  const first = CODE.findIndex(l => l.includes('await test')), steps = 7;
  d.style(`.run{animation:run ${steps * 1.4}s steps(${steps},jump-none) infinite}@keyframes run{to{transform:translateY(${fmt((steps - 1) * LH)}px)}}
.crt{animation:crt 1.1s steps(1) infinite}@keyframes crt{50%{opacity:0}}`);
  code += `<rect class="run" x="${PAD + 8}" y="${fmt(codeTop + first * LH - 13.4)}" width="${cw - 16}" height="${LH}" rx="5" fill="${t.accent}" fill-opacity="${t.dark ? 0.2 : 0.13}"/>`;
  CODE.forEach((ln, i) => {
    const y = codeTop + i * LH;
    code += d.text(String(i + 1).padStart(2, ' '), { font: 'M4', size: FS, x: PAD + cp - 4, y, fill: t.muted, opacity: 0.5 });
    let col = 0;
    for (const tk of tokens(ln)) {
      if (tk.t.trim()) code += d.text(tk.t, { font: tk.c === 'kw' ? 'M5' : 'M4', size: FS, x: PAD + cp + 26 + col * CHW, y, fill: tk.c ? t.code[tk.c] : t.text });
      col += tk.t.length;
    }
  });
  code += `<rect class="crt" x="${fmt(PAD + cp + 26 + CHW + 3)}" y="${fmt(codeTop + (CODE.length - 1) * LH - 11)}" width="7" height="14" fill="${t.accentText}"/>`;
  d.add(`<g class="rv">${code}</g>`);

  /* ---- pipeline ---- */
  const px = PAD + cw + gap, pw = W - PAD - px, ip = 24;
  let pipe = cell(d, px, top, pw, H) + d.label('Estudando agora', { x: px + ip, y: top + 34, fill: t.accentText });
  pipe += d.text('Deploy de ponta a', { font: 'G7', size: 23, ls: -0.02, x: px + ip, y: top + 68 });
  pipe += d.text('ponta na AWS', { font: 'G7', size: 23, ls: -0.02, x: px + ip, y: top + 95 });
  const sub = d.para('Do commit à produção: build, infraestrutura como código, segurança e observabilidade.',
    { x: px + ip, y: top + 124, width: pw - ip * 2, size: 13, lh: 1.5, fill: t.muted });
  pipe += sub.svg;
  const s0 = top + 124 + sub.height + 18, rowH = (top + H - 44 - s0) / (STEPS.length - 1), lx = px + ip + 7;
  const cyc = STEPS.length * 1.4;
  d.style(`.nd{animation:nd ${cyc}s infinite}@keyframes nd{0%,16%{fill:${t.accent};stroke:${t.accent}}26%,100%{fill:${t.surface};stroke:${t.line2}}}
.nt{animation:nt ${cyc}s infinite}@keyframes nt{0%,16%{opacity:1}30%,100%{opacity:.62}}
.pk{animation:pk ${cyc}s linear infinite}@keyframes pk{0%{transform:translateY(0);opacity:1}${fmt(100 * (STEPS.length - 1) / STEPS.length)}%{transform:translateY(${fmt(rowH * (STEPS.length - 1))}px);opacity:1}${fmt(100 * (STEPS.length - 0.6) / STEPS.length)}%,100%{transform:translateY(${fmt(rowH * (STEPS.length - 1))}px);opacity:0}}`);
  pipe += `<path d="M${lx} ${fmt(s0)}V${fmt(s0 + rowH * (STEPS.length - 1))}" stroke="${t.line2}" stroke-dasharray="2 5" stroke-linecap="round"/>`;
  STEPS.forEach(([name, det], i) => {
    const y = s0 + i * rowH, dl = `animation-delay:${fmt(i * 1.4 - cyc)}s`;
    pipe += `<circle class="nd" style="${dl}" cx="${lx}" cy="${fmt(y)}" r="6" fill="${t.surface}" stroke="${t.line2}" stroke-width="1.5"/>`;
    pipe += `<g class="nt" style="${dl}">` + d.text(name, { font: 'D5', size: 14, x: lx + 22, y: y + 1 }) +
      d.text(det, { font: 'M4', size: 10.2, x: lx + 22, y: y + 17, fill: t.muted }) + '</g>';
  });
  pipe += `<circle class="pk" cx="${lx}" cy="${fmt(s0)}" r="3" fill="${t.glitchC}"/>`;
  d.add(`<g class="rv" style="--i:1">${pipe}</g>`);

  d.h = top + H + PAD;
  return d;
}
