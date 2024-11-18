import * as Bytes from './Bytes.js'
import type * as Errors from './Errors.js'
import * as Hash from './Hash.js'
import * as Hex from './Hex.js'

/**
 * Checks if an input is matched in the bloom filter.
 *
 * @example
 * ```ts twoslash
 * import { Bloom } from 'ox'
 *
 * Bloom.contains(
 *   '0x00000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002020000000000000000000000000000000000000000000008000000001000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *   '0xef2d6d194084c2de36e0dabfce45d046b37d1106',
 * )
 * // @log: true
 * ```
 *
 * @param bloom - Bloom filter value.
 * @param input - Input to check.
 * @returns Whether the input is matched in the bloom filter.
 */
export function contains(
  bloom: Hex.Hex,
  input: Hex.Hex | Bytes.Bytes,
): boolean {
  const filter = Bytes.fromHex(bloom)
  const hash = Hash.keccak256(input, { as: 'Bytes' })

  for (const i of [0, 2, 4]) {
    const bit = (hash[i + 1]! + (hash[i]! << 8)) & 0x7ff
    if ((filter[256 - 1 - Math.floor(bit / 8)]! & (1 << (bit % 8))) === 0)
      return false
  }

  return true
}

export declare namespace contains {
  type ErrorType =
    | Bytes.fromHex.ErrorType
    | Hash.keccak256.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Checks if a string is a valid bloom filter value.
 *
 * @example
 * ```ts twoslash
 * import { Bloom } from 'ox'
 *
 * Bloom.validate('0x')
 * // @log: false
 *
 * Bloom.validate('0x00000000000000000000008000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000044000200000000000000000002000000000000000000000040000000000000000000000000000020000000000000000000800000000000800000000000800000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000808002000000000400000000000000000000000060000000000000000000000000000000000000000000000100000000000002000000')
 * // @log: true
 * ```
 *
 * @param value - Value to check.
 * @returns Whether the value is a valid bloom filter.
 */
export function validate(value: string): value is Hex.Hex {
  return Hex.validate(value) && Hex.size(value) === 256
}

export declare namespace validate {
  type ErrorType =
    | Hex.validate.ErrorType
    | Hex.size.ErrorType
    | Errors.GlobalErrorType
}