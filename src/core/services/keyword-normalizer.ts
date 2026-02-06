// Keyword Normalizer - canonical forms for matching and display

/**
 * Small, explicit synonym map: variant -> canonical form.
 * Used after extraction so matching uses consistent terms.
 * Preserves C++, Node.js, .NET, Next.js; avoids false positives (e.g. SQL inside NoSQL).
 */
const SYNONYM_MAP: Record<string, string> = {
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  node: 'Node.js',
  'c++': 'C++',
  'c#': 'C#',
  dotnet: '.NET',
  '.net': '.NET',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  nosql: 'NoSQL',
  sql: 'SQL',
  reactjs: 'React',
  react: 'React',
  vuejs: 'Vue.js',
  vue: 'Vue.js',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  aws: 'AWS',
  rest: 'REST',
  api: 'API',
  graphql: 'GraphQL',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  git: 'Git',
  redis: 'Redis',
}

/**
 * Normalize a keyword to canonical form for matching and display.
 * Uses synonym map; preserves known multi-word/special forms (C++, Node.js, etc.).
 */
export function normalizeKeyword(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const lower = trimmed.toLowerCase()
  return SYNONYM_MAP[lower] ?? trimmed
}

/**
 * Normalize an array of keywords (dedupe by canonical form, preserve order).
 */
export function normalizeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const k of keywords) {
    const canon = normalizeKeyword(k)
    if (canon && !seen.has(canon)) {
      seen.add(canon)
      result.push(canon)
    }
  }
  return result
}
