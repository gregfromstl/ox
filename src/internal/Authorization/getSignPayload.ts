import type * as Errors from '../../Errors.js'
import type { Hex } from '../Hex/types.js'
import { Authorization_hash } from './hash.js'
import type { Authorization } from './types.js'

/**
 * Computes the sign payload for an {@link ox#Authorization.Authorization} in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 *
 * @example
 * The example below demonstrates computing the sign payload for an {@link ox#Authorization.Authorization}. This payload
 * can then be passed to signing functions like {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * import { Authorization, Secp256k1 } from 'ox'
 *
 * const authorization = Authorization.from({
 *   address: '0x1234567890abcdef1234567890abcdef12345678',
 *   chainId: 1,
 *   nonce: 69n,
 * })
 *
 * const payload = Authorization.getSignPayload(authorization) // [!code focus]
 *
 * const signature = Secp256k1.sign({
 *   payload,
 *   privateKey: '0x...',
 * })
 * ```
 *
 * @param authorization - The {@link ox#Authorization.Authorization}.
 * @returns The sign payload.
 */
export function Authorization_getSignPayload(
  authorization: Authorization,
): Hex {
  return Authorization_hash(authorization)
}

export declare namespace Authorization_getSignPayload {
  type ErrorType = Authorization_hash.ErrorType | Errors.GlobalErrorType
}

Authorization_getSignPayload.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as Authorization_getSignPayload.ErrorType
