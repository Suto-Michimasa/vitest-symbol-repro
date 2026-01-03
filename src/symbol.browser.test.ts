import { describe, expect, it } from 'vitest'

describe('Symbol serialization in vitest browser mode', () => {
  it('console.error with Symbol property should not throw - this fails in 4.0.16', async () => {
    // RTK Query error objects contain Symbol properties like this
    const errorWithSymbol = {
      status: 400,
      data: null,
      // This Symbol property causes "Cannot convert a Symbol value to a string" in vitest 4.0.16
      [Symbol('rtk-query')]: { type: 'error' },
    }

    // In vitest 4.0.16, this console.error throws:
    // TypeError: Cannot convert a Symbol value to a string
    console.error('Test error:', errorWithSymbol)

    expect(true).toBe(true)
  })

  it('console.log with Symbol property should not throw', async () => {
    const objWithSymbol = {
      message: 'test',
      [Symbol.for('test')]: 'value',
    }

    console.log('Object with Symbol:', objWithSymbol)

    expect(true).toBe(true)
  })

  it('JSON.stringify with Symbol should work (Symbols are ignored)', () => {
    const obj = {
      message: 'test',
      [Symbol('key')]: 'value',
    }

    // JSON.stringify ignores Symbol properties
    const json = JSON.stringify(obj)
    expect(json).toBe('{"message":"test"}')
  })
})
