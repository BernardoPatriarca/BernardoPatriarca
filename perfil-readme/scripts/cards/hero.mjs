// HERO — a abertura do portfólio traduzida para SVG: piso em perspectiva correndo,
// ondas saindo do centro e o nome com glitch magenta/ciano.
import { Doc, W, PAD, measure, capHeight, fmt } from '../kit.mjs';

export function hero(theme) {
  const H = 540, d = new Doc(W, H, theme), t = d.t;
  const cx = W / 2, HZ = 372, D = H - HZ;
  d.frame();

  /* ---- piso: linhas horizontais andam de uma "casa" de profundidade até a próxima ---- */
  const N = 13, STEP = 0.4;
  const yAt = z => HZ + D / z;
  let rows = '', kf = '';
  for (let i = 0; i < N; i++) {
    const z = 1 + i * STEP, y = yAt(z), dy = yAt(z - STEP) - y;
    const o = Math.max(0.1, 0.62 - i * 0.045), o2 = Math.max(0.1, 0.62 - (i - 1) * 0.045);
    rows += `<path class="r${i}" d="M0 ${fmt(y)}H${W}" stroke="${t.accent}" stroke-opacity="${fmt(o)}"/>`;
    kf += `.r${i}{animation:r${i} 2.6s linear infinite}@keyframes r${i}{to{transform:translateY(${fmt(dy)}px);stroke-opacity:${fmt(o2)}}}`;
  }
  let fan = '';
  for (let k = -12; k <= 12; k++) fan += `M${cx} ${HZ}L${cx + k * 118} ${H}`;
  const fade = d.id('m'), fadeG = d.id('l'), hzG = d.id('l'), sun = d.id('o');
  d.def(`<linearGradient id="${fadeG}" x1="0" y1="${HZ}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff"/></linearGradient>`);
  d.def(`<mask id="${fade}" maskUnits="userSpaceOnUse" x="0" y="${HZ}" width="${W}" height="${D}"><rect y="${HZ}" width="${W}" height="${D}" fill="url(#${fadeG})"/></mask>`);
  d.def(`<linearGradient id="${hzG}" x1="0" x2="${W}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset=".3" stop-color="${t.accent2}"/><stop offset=".5" stop-color="${t.glitchC}"/><stop offset=".7" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>`);
  d.def(`<radialGradient id="${sun}"><stop offset="0" stop-color="${t.glowA}" stop-opacity="${t.dark ? 0.6 : 0.34}"/><stop offset="1" stop-color="${t.glowA}" stop-opacity="0"/></radialGradient>`);

  // ondas: "pedra na água" no plano do piso
  let rings = '';
  for (let i = 0; i < 3; i++) {
    rings += `<ellipse class="wv" style="animation-delay:${-i * 2}s" cx="${cx}" cy="${HZ + 58}" rx="620" ry="124" stroke="${i === 1 ? t.glitchC : t.accentText}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
  }
  d.style(`${kf}
.wv{transform-origin:${cx}px ${HZ + 58}px;animation:wv 6s cubic-bezier(.2,.6,.3,1) infinite}
@keyframes wv{0%{transform:scale(.02);opacity:0}12%{opacity:.85}100%{transform:scale(1);opacity:0}}`);

  d.add(`<ellipse cx="${cx}" cy="${HZ}" rx="430" ry="74" fill="url(#${sun})"/>`,
    `<g mask="url(#${fade})"><path d="${fan}" stroke="${t.accent}" stroke-opacity=".34"/>${rows}${rings}</g>`,
    `<path d="M0 ${HZ}H${W}" stroke="url(#${hzG})" stroke-width="1.5"/>`);

  /* ---- barra de cima ---- */
  d.style(`.blip{animation:blip 2s infinite}.halo{transform-origin:${PAD + 4}px 40px;animation:halo 2s infinite}
@keyframes blip{70%{opacity:.6}}@keyframes halo{0%{transform:scale(1);opacity:.6}70%,100%{transform:scale(3.4);opacity:0}}`);
  d.add(`<circle class="halo" cx="${PAD + 4}" cy="40" r="4" fill="${t.accent}"/><circle class="blip" cx="${PAD + 4}" cy="40" r="4" fill="${t.accent}"/>`,
    d.label('Disponível para oportunidades', { x: PAD + 18, y: 44, fill: t.text }),
    d.label('Pato Branco, PR · BR · UTC−3', { x: W - PAD, y: 44, anchor: 'end' }),
    `<path d="M${PAD} 64H${W - PAD}" stroke="${t.line}"/>`);

  /* ---- o nome: BERNARDO cheio, PATRIARCA vazado, como no hero do site ---- */
  const LS = -0.025;
  const widest = Math.max(measure('BERNARDO', 'U9', 100, LS), measure('PATRIARCA', 'U9', 100, LS));
  const S = (100 * (W - PAD * 2)) / widest, cap = capHeight('U9', S);
  const y1 = 96 + cap, y2 = y1 + cap + 26;
  const ttl = d.id('t');
  d.def(`<g id="${ttl}">${d.text('BERNARDO', { font: 'U9', size: S, x: cx, y: y1, anchor: 'middle', ls: LS, fill: 'currentColor' })}` +
    `${d.text('PATRIARCA', { font: 'U9', size: S, x: cx, y: y2, anchor: 'middle', ls: LS, stroke: { color: 'currentColor', width: 1.7 } })}</g>`);
  // três faixas horizontais do mesmo título: no glitch cada uma escorrega para um lado
  const cuts = [0, y1 - cap * 0.52, y2 - cap * 0.46, H];
  let bands = '';
  for (let i = 0; i < 3; i++) {
    const c = d.id('c');
    d.def(`<clipPath id="${c}"><rect x="-60" y="${fmt(cuts[i] - 0.4)}" width="${W + 120}" height="${fmt(cuts[i + 1] - cuts[i] + 0.8)}"/></clipPath>`);
    bands += `<g clip-path="url(#${c})"><g class="s${i}"><use href="#${ttl}"/></g></g>`;
  }
  const T = 7, delay = 'animation-delay:-5.9s';
  d.style(`.in{animation:in 1s cubic-bezier(.22,1,.36,1) both}@keyframes in{from{transform:translateY(22px)}}
.s0,.s1,.s2,.gm,.gc{animation-duration:${T}s;animation-timing-function:steps(1);animation-iteration-count:infinite;${delay}}
.s0{animation-name:s0}.s1{animation-name:s1}.s2{animation-name:s2}
.gm,.gc{opacity:0;mix-blend-mode:${t.blend}}.gm{animation-name:gm}.gc{animation-name:gc}
@keyframes s0{0%,43%,100%{transform:none}41%{transform:translateX(7px)}88%{transform:translateX(-16px)}89.6%{transform:translateX(9px)}91.2%{transform:none}}
@keyframes s1{0%,43.6%,100%{transform:none}41.6%{transform:translateX(-9px)}88.6%{transform:translateX(20px) skewX(-10deg)}90.2%{transform:translateX(-7px)}91.8%{transform:none}}
@keyframes s2{0%,100%{transform:none}88%{transform:translateX(12px)}90%{transform:translateX(-14px)}91.4%{transform:none}}
@keyframes gm{0%,43.6%,100%{opacity:0}41%{opacity:.8;transform:translate(-5px,0)}87.6%{opacity:.95;transform:translate(-9px,1px)}89.8%{opacity:.95;transform:translate(6px,-1px)}92.2%{opacity:0}}
@keyframes gc{0%,43.6%,100%{opacity:0}41%{opacity:.8;transform:translate(5px,0)}87.6%{opacity:.95;transform:translate(9px,-1px)}89.8%{opacity:.95;transform:translate(-6px,1px)}92.2%{opacity:0}}`);
  d.add(`<g class="in"><use class="gm" href="#${ttl}" style="color:${t.glitchM}"/><use class="gc" href="#${ttl}" style="color:${t.glitchC}"/>` +
    `<g style="color:${t.text}">${bands}</g></g>`);

  /* ---- chamada ---- */
  const ly = y2 + 44;
  d.add(d.line([
    { t: 'Desenvolvedor ' }, { t: 'Full Stack', hl: true, font: 'D5' },
    { t: '  construindo interfaces modernas e sistemas robustos.' },
  ], { x: cx, y: ly, size: 16.5, anchor: 'middle', fill: t.text }).svg);
  d.add(d.line([
    { t: 'Angular & Java no dia a dia, código limpo e experiências que ' },
    { t: 'fazem a diferença', font: 'SI', scale: 1.22 }, { t: '.' },
  ], { x: cx, y: ly + 28, size: 16.5, anchor: 'middle', fill: t.text }).svg);

  /* ---- HUD de baixo + selo girando ---- */
  d.add(d.label('Full Stack Developer', { x: PAD, y: H - 66, fill: t.text }),
    d.label('Angular · Java · Quarkus', { x: PAD, y: H - 48 }),
    d.label('Lat −26.22 · Lon −52.67', { x: PAD, y: H - 30 }));
  const sx = W - PAD - 52, sy = H - 84;
  d.style(`.seal{transform-origin:${sx}px ${sy}px;animation:spin 22s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.bob{animation:bob 1.8s ease-in-out infinite alternate}@keyframes bob{to{transform:translateY(4px)}}`);
  d.add(`<circle cx="${sx}" cy="${sy}" r="52" fill="${t.bg}" fill-opacity=".72" stroke="${t.line2}"/>`,
    `<g class="seal">${d.ring('DISPONÍVEL PARA PROJETOS • FULL STACK DEVELOPER • ', { cx: sx, cy: sy, r: 37, size: 8.6, fill: t.text })}</g>`,
    `<circle cx="${sx}" cy="${sy}" r="19" fill="${t.accentSurface}"/>`,
    `<path class="bob" d="M${sx} ${sy - 7}v13M${sx - 5} ${sy + 1}l5 5 5-5" stroke="${t.accentInk}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
  return d;
}
