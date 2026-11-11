// live.mjs — busca os dados do card "GitHub ao vivo" na API GraphQL do GitHub.
// Roda dentro da Action com o GITHUB_TOKEN padrão (não precisa criar token nenhum).
const QUERY = `query($login: String!) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes {
        name isFork stargazerCount pushedAt
        primaryLanguage { name }
        languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

export async function fetchLive(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': `${login}-profile-readme` },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub respondeu ${res.status}`);
  const json = await res.json();
  if (json.errors?.length || !json.data?.user) throw new Error(json.errors?.[0]?.message || 'usuário não encontrado');
  return normalize(login, json.data.user);
}

/** deixa a resposta no formato de scripts/data.json */
export function normalize(login, u) {
  const repos = u.repositories.nodes;
  const bytes = {};
  for (const r of repos) {
    if (r.isFork) continue;
    for (const e of r.languages.edges) bytes[e.node.name] = (bytes[e.node.name] || 0) + e.size;
  }
  const cal = u.contributionsCollection.contributionCalendar;
  return {
    login,
    since: new Date(u.createdAt).getUTCFullYear(),
    repos: u.repositories.totalCount,
    followers: u.followers.totalCount,
    stars: repos.reduce((s, r) => s + r.stargazerCount, 0),
    contrib: {
      total: cal.totalContributions,
      days: cal.weeks.flatMap(w => w.contributionDays.map(d => [d.date, LEVEL[d.contributionLevel] ?? 0, d.contributionCount])),
    },
    langs: Object.entries(bytes).sort((a, b) => b[1] - a[1]).map(([name, b]) => ({ name, bytes: b })),
    // o próprio repositório do perfil fica de fora da lista
    recent: repos.filter(r => !r.isFork && r.name.toLowerCase() !== login.toLowerCase()).slice(0, 6)
      .map(r => ({ name: r.name, lang: r.primaryLanguage?.name || null, pushed: r.pushedAt })),
    fetchedAt: new Date().toISOString(),
  };
}
