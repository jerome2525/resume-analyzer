import { describe, it, expect } from 'vitest'
import { normalizeKeyword, normalizeKeywords } from './keyword-normalizer'

describe('keyword-normalizer', () => {
  it('normalizes nodejs to Node.js', () => {
    expect(normalizeKeyword('nodejs')).toBe('Node.js')
    expect(normalizeKeyword('node.js')).toBe('Node.js')
  })

  it('normalizes c++ to C++', () => {
    expect(normalizeKeyword('c++')).toBe('C++')
  })

  it('preserves C++, Node.js, .NET, Next.js', () => {
    expect(normalizeKeyword('C++')).toBe('C++')
    expect(normalizeKeyword('Node.js')).toBe('Node.js')
    expect(normalizeKeyword('.NET')).toBe('.NET')
    expect(normalizeKeyword('Next.js')).toBe('Next.js')
  })

  it('normalizes synonym variants', () => {
    expect(normalizeKeyword('js')).toBe('JavaScript')
    expect(normalizeKeyword('typescript')).toBe('TypeScript')
    expect(normalizeKeyword('postgres')).toBe('PostgreSQL')
  })

  it('returns trimmed unknown terms as-is', () => {
    expect(normalizeKeyword('  UnknownTech  ')).toBe('UnknownTech')
  })

  it('normalizeKeywords dedupes by canonical form and preserves order', () => {
    const input = ['nodejs', 'Node.js', 'react', 'React']
    const result = normalizeKeywords(input)
    expect(result).toEqual(['Node.js', 'React'])
  })
})
