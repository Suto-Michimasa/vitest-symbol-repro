import { describe, expect, it } from 'vitest'

describe('Symbol serialization in vitest browser mode', () => {
  // This is the actual crash case: raw Symbol passed directly as a console argument.
  // baseFormat uses `str += `${x}`` for non-object trailing arguments,
  // and JavaScript does not allow implicit string conversion of Symbols via template literals.
  it('console.log with raw Symbol value should not throw - this crashes in 4.0.16', () => {
    // DOES crash in vitest 4.0.16:
    // TypeError: Cannot convert a Symbol value to a string
    console.log('value:', Symbol('test'))

    expect(true).toBe(true)
  })

  it('console.error with raw Symbol value should not throw', () => {
    console.error('error symbol:', Symbol('error-marker'))

    expect(true).toBe(true)
  })

  it('console.log with Symbol.for should not throw', () => {
    console.log('shared symbol:', Symbol.for('shared'))

    expect(true).toBe(true)
  })

  // This does NOT crash - Symbol as object key is handled differently
  it('console.error with Symbol as object key does not crash (for reference)', () => {
    const errorWithSymbol = {
      status: 400,
      data: null,
      [Symbol('rtk-query')]: { type: 'error' },
    }

    console.error('Test error:', errorWithSymbol)

    expect(true).toBe(true)
  })
})
