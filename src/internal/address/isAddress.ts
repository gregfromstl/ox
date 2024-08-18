import type { Address } from 'abitype'
import type { GlobalErrorType } from '../errors/error.js'
import { assertAddress } from './assert.js'

export declare namespace isAddress {
  export type Options = assertAddress.Options
  export type ErrorType = assertAddress.ErrorType | GlobalErrorType
}

/**
 * Checks if the given address is a valid address.
 *
 * @example
 * ```ts
 * import { Address } from 'ox'
 *
 * Address.isAddress('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
 * // true
 *
 * Address.isAddress('0xdeadbeef')
 * // false
 * ```
 */
export function isAddress(
  address: string,
  options?: isAddress.Options | undefined,
): address is Address {
  const { strict = true } = options ?? {}
  try {
    assertAddress(address, { strict })
    return true
  } catch {
    return false
  }
}
