import { Data } from 'ox'
import { expect, test } from 'vitest'

test('hex', () => {
  expect(Data.slice('0x')).toMatchInlineSnapshot('"0x"')
  expect(Data.slice('0x0123456789')).toMatchInlineSnapshot('"0x0123456789"')

  expect(Data.slice('0x', 0)).toMatchInlineSnapshot('"0x"')
  expect(Data.slice('0x0123456789', 0, 4)).toMatchInlineSnapshot('"0x01234567"')
  expect(Data.slice('0x0123456789', 1, 4)).toMatchInlineSnapshot('"0x234567"')
  expect(Data.slice('0x0123456789', 2, 5)).toMatchInlineSnapshot('"0x456789"')
  expect(Data.slice('0x0123456789', 2)).toMatchInlineSnapshot('"0x456789"')
  expect(Data.slice('0x0123456789', 2)).toMatchInlineSnapshot('"0x456789"')
  expect(
    Data.slice(
      '0x0000000000000000000000000000000000000000000000000000000000010f2c000000000000000000000000000000000000000000000000000000000000a45500000000000000000000000000000000000000000000000000000000190f1b44',
      33,
      65,
    ),
  ).toBe('0x0000000000000000000000000000000000000000000000000000000000a45500')

  expect(Data.slice('0x0123456789', -1)).toMatchInlineSnapshot('"0x89"')
  expect(Data.slice('0x0123456789', -3, -1)).toMatchInlineSnapshot('"0x4567"')
  expect(Data.slice('0x0123456789', -5)).toMatchInlineSnapshot('"0x0123456789"')
  expect(Data.slice('0x0123456789', -5)).toMatchInlineSnapshot('"0x0123456789"')

  expect(Data.slice('0x0123456789', 0, 10)).toMatchInlineSnapshot(
    '"0x0123456789"',
  )
  expect(Data.slice('0x0123456789', -10)).toMatchInlineSnapshot(
    '"0x0123456789"',
  )

  expect(() =>
    Data.slice('0x0123456789', 5),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice starting at offset "5" is out-of-bounds (size: 5).

    Version: ox@x.y.z]
  `,
  )

  expect(() =>
    Data.slice('0x0123456789', 0, 6, { strict: true }),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice ending at offset "6" is out-of-bounds (size: 5).

    Version: ox@x.y.z]
  `,
  )
  expect(() =>
    Data.slice('0x0123456789', 0, 10, { strict: true }),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice ending at offset "10" is out-of-bounds (size: 5).

    Version: ox@x.y.z]
  `,
  )
})

test('bytes', () => {
  expect(Data.slice(new Uint8Array([]))).toMatchInlineSnapshot('Uint8Array []')
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `)

  expect(Data.slice(new Uint8Array([]), 0)).toMatchInlineSnapshot(
    'Uint8Array []',
  )
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 0, 4),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      0,
      1,
      2,
      3,
    ]
  `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 2, 8),
  ).toMatchInlineSnapshot(`
      Uint8Array [
        2,
        3,
        4,
        5,
        6,
        7,
      ]
    `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 5, 9),
  ).toMatchInlineSnapshot(`
      Uint8Array [
        5,
        6,
        7,
        8,
      ]
    `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 2),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 2),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `)

  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), -1),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      9,
    ]
  `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), -3, -1),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      7,
      8,
    ]
  `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), -8),
  ).toMatchInlineSnapshot(`
      Uint8Array [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ]
    `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), -8),
  ).toMatchInlineSnapshot(`
      Uint8Array [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ]
    `)

  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 0, 10),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `)
  expect(
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), -10),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `)

  expect(() =>
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice starting at offset "10" is out-of-bounds (size: 10).

    Version: ox@x.y.z]
  `,
  )

  expect(() =>
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 0, 11, {
      strict: true,
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice ending at offset "11" is out-of-bounds (size: 10).

    Version: ox@x.y.z]
  `,
  )
  expect(() =>
    Data.slice(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 5, 15, {
      strict: true,
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SliceOffsetOutOfBoundsError: Slice ending at offset "15" is out-of-bounds (size: 5).

    Version: ox@x.y.z]
  `,
  )
})