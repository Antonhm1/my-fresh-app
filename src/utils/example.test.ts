import { describe, it, expect } from 'vitest'

// Simple test to verify testing setup works
function add(a: number, b: number): number {
  return a + b
}

describe('Example Test', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0)
  })
})
