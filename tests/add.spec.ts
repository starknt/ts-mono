import { describe, expect, test } from 'vitest'
import { add } from '@pkg/core'

describe('core package', () => {
  test('add', () => {
    expect(add(1, 2)).toEqual(3)
  })
})
