import type { AbiFunction } from 'abitype'

import { slice } from '../data/slice.js'
import type { GlobalErrorType } from '../errors/error.js'
import { getSignatureHash } from './getSignatureHash.js'

export declare namespace getSelector {
  type Parameters = getSignatureHash.Parameters

  type ErrorType =
    | getSignatureHash.ErrorType
    | slice.ErrorType
    | GlobalErrorType
}

/**
 * Computes the selector for an ABI Item.
 *
 * @example
 * import { Abi } from 'ox'
 * const selector = Abi.getSelector('function ownerOf(uint256 tokenId)')
 * // '0x6352211e'
 *
 * const selector = Abi.getSelector({
 *   inputs: [{ type: 'uint256' }],
 *   name: 'ownerOf',
 *   outputs: [],
 *   stateMutability: 'view',
 *   type: 'function'
 * })
 * // '0x6352211e'
 */
export const getSelector = (abiItem: string | AbiFunction) =>
  slice(getSignatureHash(abiItem), 0, 4)
