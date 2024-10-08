import { PublicKey } from 'ox'
import { expect, test } from 'vitest'

test('default', () => {
  expect(
    PublicKey.validate({
      prefix: 4,
      x: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
      y: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
    }),
  ).toBe(true)
  expect(
    PublicKey.validate({
      prefix: 4,
      y: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
    }),
  ).toBe(false)
})