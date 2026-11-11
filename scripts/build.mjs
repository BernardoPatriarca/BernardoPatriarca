// build.mjs — gera todos os SVGs do README em assets/, nos temas escuro e claro.
//
//   node scripts/build.mjs            usa os dados em cache (scripts/data.json)
//   node scripts/build.mjs --live     busca dados novos na API do GitHub antes (precisa de GITHUB_TOKEN)
//   node scripts/build.mjs hero band  gera só os cards citados
//
// Zero dependência: só Node 18+.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as cards from './cards/index.mjs';
import { fetchLive } from './live.mjs';

const OUT = new URL('../assets/', import.meta.url);
const DATA = new URL('./data.json', import.meta.url);
const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith('--'));

let data = JSON.parse(readFileSync(DATA, 'utf8'));
if (args.includes('--live')) {
  const login = process.env.GH_LOGIN || data.login, token = process.env.GITHUB_TOKEN;
  try {
    if (!token) throw new Error('GITHUB_TOKEN não definido');
    data = await fetchLive(login, token);
    writeFileSync(DATA, JSON.stringify(data));
    console.log(`dados de @${login}: ${data.repos} repositórios, ${data.contrib.total} contribuições`);
  } catch (err) {
    // sem rede ou sem token: o README continua de pé com o último dado bom
    console.warn(`::warning::não consegui atualizar os dados (${err.message}) — usando o cache`);
  }
}

const file = n => n.replace(/[A-Z]/g, c => '-' + c.toLowerCase());   // chipSite → chip-site
mkdirSync(OUT, { recursive: true });
let total = 0;
for (const [name, make] of Object.entries(cards)) {
  if (only.length && !only.includes(name)) continue;
  for (const theme of ['dark', 'light']) {
    const svg = String(make(theme, data));
    writeFileSync(new URL(`${file(name)}-${theme}.svg`, OUT), svg);
    total += svg.length;
    console.log(`${file(name)}-${theme}.svg`.padEnd(26), (svg.length / 1024).toFixed(1).padStart(6) + ' KB');
  }
}
console.log('total'.padEnd(26), (total / 1024).toFixed(0).padStart(6) + ' KB');
