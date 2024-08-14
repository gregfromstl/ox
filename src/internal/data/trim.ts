import type { ErrorType } from '../errors/error.js'
import type { Bytes, Hex } from '../types/data.js'

export type TrimLeftReturnType<value extends Bytes | Hex> = value extends Hex
  ? Hex
  : Bytes

export type TrimLeftErrorType = TrimErrorType

/**
 * Trims leading zeros from a {@link Bytes} or {@link Hex} value.
 *
 * @example
 * import { Data } from 'ox'
 * Data.trimLeft('0x00000000deadbeef') // '0xdeadbeef'
 *
 * @example
 * import { Hex } from 'ox'
 * Hex.trimLeft('0x00000000deadbeef') // '0xdeadbeef'
 *
 * @example
 * import { Bytes } from 'ox'
 * Bytes.trimLeft(Uint8Array.from([0, 0, 0, 0, 1, 2, 3])) // Uint8Array([1, 2, 3])
 */
export function trimLeft<value extends Bytes | Hex>(
  value: value,
): TrimReturnType<value> {
  return trim(value, { dir: 'left' })
}

export type TrimRightReturnType<value extends Bytes | Hex> = value extends Hex
  ? Hex
  : Bytes

export type TrimRightErrorType = TrimErrorType

/**
 * Trims trailing zeros from a {@link Bytes} or {@link Hex} value.
 *
 * @example
 * import { Data } from 'ox'
 * Data.trimRight('0xdeadbeef00000000') // '0xdeadbeef'
 *
 * @example
 * import { Hex } from 'ox'
 * Hex.trimRight('0xdeadbeef00000000') // '0xdeadbeef'
 *
 * @example
 * import { Bytes } from 'ox'
 * Bytes.trimRight(Uint8Array.from([1, 2, 3, 0, 0, 0, 0])) // Uint8Array([1, 2, 3])
 */
export function trimRight<value extends Bytes | Hex>(
  value: value,
): TrimReturnType<value> {
  return trim(value, { dir: 'right' })
}

/////////////////////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////////////////////

type TrimOptions = {
  dir?: 'left' | 'right' | undefined
}

type TrimReturnType<value extends Bytes | Hex> = value extends Hex ? Hex : Bytes

type TrimErrorType = ErrorType

function trim<value extends Bytes | Hex>(
  value: value,
  options: TrimOptions = {},
): TrimReturnType<value> {
  const { dir = 'left' } = options

  let data: any = typeof value === 'string' ? value.replace('0x', '') : value

  let sliceLength = 0
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === 'left' ? i : data.length - i - 1].toString() === '0')
      sliceLength++
    else break
  }
  data =
    dir === 'left'
      ? data.slice(sliceLength)
      : data.slice(0, data.length - sliceLength)

  if (typeof value === 'string') {
    if (data.length === 1 && dir === 'right') data = `${data}0`
    return `0x${data.length % 2 === 1 ? `0${data}` : data}` as TrimReturnType<value>
  }
  return data as TrimReturnType<value>
}