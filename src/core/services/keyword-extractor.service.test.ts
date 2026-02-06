import { describe, it, expect } from 'vitest'
import { extractFromText } from './keyword-extractor.service'

describe('keyword-extractor', () => {
  it('extracts allowlisted terms from text', () => {
    const text = 'I use Node.js and React daily. Also C++ and TypeScript.'
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
    expect(result).toContain('C++')
    expect(result).toContain('TypeScript')
    expect(result).not.toContain('random word')
  })

  it('does not extract SQL when only NoSQL appears (no false positive)', () => {
    const text = 'Experience with NoSQL databases.'
    const result = extractFromText(text)
    expect(result).toContain('NoSQL')
    expect(result).not.toContain('SQL')
  })

  it('extracts SQL when SQL appears as whole word', () => {
    const text = 'Strong SQL and PostgreSQL skills.'
    const result = extractFromText(text)
    expect(result).toContain('SQL')
    expect(result).toContain('PostgreSQL')
  })

  it('handles messy formatting without crashing', () => {
    const text = '  \n\n  Node.js   \t  React  \n  '
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
  })

  it('returns empty array for empty or whitespace-only text', () => {
    expect(extractFromText('')).toEqual([])
    expect(extractFromText('   \n\t  ')).toEqual([])
  })

  it('returns only allowlisted terms (no hallucination)', () => {
    const text = 'I know Node.js, React, and SuperDuperFramework and XYZ.'
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
    expect(result).not.toContain('SuperDuperFramework')
    expect(result).not.toContain('XYZ')
  })
})
