import { Value } from 'ox'
import { expect, test } from 'vitest'

test('converts wei to ether', () => {
  expect(
    Value.formatEther(6942069420123456789123450000n),
  ).toMatchInlineSnapshot('"6942069420.12345678912345"')
  expect(
    Value.formatEther(6942069420000000000000000000n),
  ).toMatchInlineSnapshot('"6942069420"')
  expect(Value.formatEther(1000000000000000000000000n)).toMatchInlineSnapshot(
    '"1000000"',
  )
  expect(Value.formatEther(100000000000000000000000n)).toMatchInlineSnapshot(
    '"100000"',
  )
  expect(Value.formatEther(10000000000000000000000n)).toMatchInlineSnapshot(
    '"10000"',
  )
  expect(Value.formatEther(1000000000000000000000n)).toMatchInlineSnapshot(
    '"1000"',
  )
  expect(Value.formatEther(100000000000000000000n)).toMatchInlineSnapshot(
    '"100"',
  )
  expect(Value.formatEther(10000000000000000000n)).toMatchInlineSnapshot('"10"')
  expect(Value.formatEther(1000000000000000000n)).toMatchInlineSnapshot('"1"')
  expect(Value.formatEther(500000000000000000n)).toMatchInlineSnapshot('"0.5"')
  expect(Value.formatEther(100000000000000000n)).toMatchInlineSnapshot('"0.1"')
  expect(Value.formatEther(10000000000000000n)).toMatchInlineSnapshot('"0.01"')
  expect(Value.formatEther(1000000000000000n)).toMatchInlineSnapshot('"0.001"')
  expect(Value.formatEther(100000000000000n)).toMatchInlineSnapshot('"0.0001"')
  expect(Value.formatEther(10000000000000n)).toMatchInlineSnapshot('"0.00001"')
  expect(Value.formatEther(1000000000000n)).toMatchInlineSnapshot('"0.000001"')
  expect(Value.formatEther(100000000000n)).toMatchInlineSnapshot('"0.0000001"')
  expect(Value.formatEther(10000000000n)).toMatchInlineSnapshot('"0.00000001"')
  expect(Value.formatEther(1000000000n)).toMatchInlineSnapshot('"0.000000001"')
  expect(Value.formatEther(100000000n)).toMatchInlineSnapshot('"0.0000000001"')
  expect(Value.formatEther(10000000n)).toMatchInlineSnapshot('"0.00000000001"')
  expect(Value.formatEther(1000000n)).toMatchInlineSnapshot('"0.000000000001"')
  expect(Value.formatEther(100000n)).toMatchInlineSnapshot('"0.0000000000001"')
  expect(Value.formatEther(10000n)).toMatchInlineSnapshot('"0.00000000000001"')
  expect(Value.formatEther(1000n)).toMatchInlineSnapshot('"0.000000000000001"')
  expect(Value.formatEther(100n)).toMatchInlineSnapshot('"0.0000000000000001"')
  expect(Value.formatEther(10n)).toMatchInlineSnapshot('"0.00000000000000001"')
  expect(Value.formatEther(1n)).toMatchInlineSnapshot('"0.000000000000000001"')
  expect(Value.formatEther(0n)).toMatchInlineSnapshot('"0"')
  expect(
    Value.formatEther(-6942069420123456789123450000n),
  ).toMatchInlineSnapshot('"-6942069420.12345678912345"')
  expect(
    Value.formatEther(-6942069420000000000000000000n),
  ).toMatchInlineSnapshot('"-6942069420"')
  expect(Value.formatEther(-1000000000000000000n)).toMatchInlineSnapshot('"-1"')
  expect(Value.formatEther(-500000000000000000n)).toMatchInlineSnapshot(
    '"-0.5"',
  )
  expect(Value.formatEther(-100000000000000000n)).toMatchInlineSnapshot(
    '"-0.1"',
  )
  expect(Value.formatEther(-10000000n)).toMatchInlineSnapshot(
    '"-0.00000000001"',
  )
  expect(Value.formatEther(-1000000n)).toMatchInlineSnapshot(
    '"-0.000000000001"',
  )
  expect(Value.formatEther(-100000n)).toMatchInlineSnapshot(
    '"-0.0000000000001"',
  )
  expect(Value.formatEther(-10000n)).toMatchInlineSnapshot(
    '"-0.00000000000001"',
  )
  expect(Value.formatEther(-1000n)).toMatchInlineSnapshot(
    '"-0.000000000000001"',
  )
  expect(Value.formatEther(-100n)).toMatchInlineSnapshot(
    '"-0.0000000000000001"',
  )
  expect(Value.formatEther(-10n)).toMatchInlineSnapshot(
    '"-0.00000000000000001"',
  )
  expect(Value.formatEther(-1n)).toMatchInlineSnapshot(
    '"-0.000000000000000001"',
  )
})

test('converts gwei to ether', () => {
  expect(Value.formatEther(69420123456700n, 'gwei')).toMatchInlineSnapshot(
    '"69420.1234567"',
  )
  expect(Value.formatEther(69420000000000n, 'gwei')).toMatchInlineSnapshot(
    '"69420"',
  )
  expect(Value.formatEther(1000000000n, 'gwei')).toMatchInlineSnapshot('"1"')
  expect(Value.formatEther(500000000n, 'gwei')).toMatchInlineSnapshot('"0.5"')
  expect(Value.formatEther(100000000n, 'gwei')).toMatchInlineSnapshot('"0.1"')
  expect(Value.formatEther(10000000n, 'gwei')).toMatchInlineSnapshot('"0.01"')
  expect(Value.formatEther(1000000n, 'gwei')).toMatchInlineSnapshot('"0.001"')
  expect(Value.formatEther(100000n, 'gwei')).toMatchInlineSnapshot('"0.0001"')
  expect(Value.formatEther(10000n, 'gwei')).toMatchInlineSnapshot('"0.00001"')
  expect(Value.formatEther(1000n, 'gwei')).toMatchInlineSnapshot('"0.000001"')
  expect(Value.formatEther(100n, 'gwei')).toMatchInlineSnapshot('"0.0000001"')
  expect(Value.formatEther(10n, 'gwei')).toMatchInlineSnapshot('"0.00000001"')
  expect(Value.formatEther(1n, 'gwei')).toMatchInlineSnapshot('"0.000000001"')
  expect(Value.formatEther(-69420123456700n, 'gwei')).toMatchInlineSnapshot(
    '"-69420.1234567"',
  )
  expect(Value.formatEther(-69420000000000n, 'gwei')).toMatchInlineSnapshot(
    '"-69420"',
  )
  expect(Value.formatEther(-1000000000n, 'gwei')).toMatchInlineSnapshot('"-1"')
  expect(Value.formatEther(-500000000n, 'gwei')).toMatchInlineSnapshot('"-0.5"')
  expect(Value.formatEther(-100000000n, 'gwei')).toMatchInlineSnapshot('"-0.1"')
  expect(Value.formatEther(-10000000n, 'gwei')).toMatchInlineSnapshot('"-0.01"')
  expect(Value.formatEther(-1000000n, 'gwei')).toMatchInlineSnapshot('"-0.001"')
  expect(Value.formatEther(-100000n, 'gwei')).toMatchInlineSnapshot('"-0.0001"')
  expect(Value.formatEther(-10000n, 'gwei')).toMatchInlineSnapshot('"-0.00001"')
  expect(Value.formatEther(-1000n, 'gwei')).toMatchInlineSnapshot('"-0.000001"')
  expect(Value.formatEther(-100n, 'gwei')).toMatchInlineSnapshot('"-0.0000001"')
  expect(Value.formatEther(-10n, 'gwei')).toMatchInlineSnapshot('"-0.00000001"')
  expect(Value.formatEther(-1n, 'gwei')).toMatchInlineSnapshot('"-0.000000001"')
})
