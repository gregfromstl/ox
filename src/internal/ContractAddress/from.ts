import type * as Errors from '../../Errors.js'
import type { Address } from '../Address/types.js'
import type { OneOf } from '../types.js'
import { ContractAddress_fromCreate } from './fromCreate.js'
import { ContractAddress_fromCreate2 } from './fromCreate2.js'

/**
 * Computes Contract Address generated by the [CREATE](https://ethereum.stackexchange.com/questions/68943/create-opcode-what-does-it-really-do/68945#68945) or [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) opcode.
 *
 * @example
 * ### CREATE
 *
 * Computes via the [CREATE](https://ethereum.stackexchange.com/questions/68943/create-opcode-what-does-it-really-do/68945#68945) opcode. Shorthand for {@link ox#ContractAddress.(fromCreate:function)}.
 *
 * ```ts twoslash
 * import { ContractAddress } from 'ox'
 * ContractAddress.from({
 *   from: '0x1a1e021a302c237453d3d45c7b82b19ceeb7e2e6',
 *   nonce: 0n,
 * })
 * // @log: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2'
 * ```
 *
 * @example
 * ### CREATE2
 *
 * Computes via the [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) opcode. Shorthand for {@link ox#ContractAddress.(fromCreate2:function)}.
 *
 * ```ts twoslash
 * import { ContractAddress, Hex } from 'ox'
 * ContractAddress.from({
 *   from: '0x1a1e021a302c237453d3d45c7b82b19ceeb7e2e6',
 *   bytecode: '0x6394198df16000526103ff60206004601c335afa6040516060f3',
 *   salt: Hex.fromString('hello world'),
 * })
 * // @log: '0x59fbB593ABe27Cb193b6ee5C5DC7bbde312290aB'
 * ```
 *
 * @param options - Options.
 * @returns Contract Address.
 */
export function ContractAddress_from(
  options: ContractAddress_from.Options,
): Address {
  if (options.salt) return ContractAddress_fromCreate2(options)
  return ContractAddress_fromCreate(options)
}

export declare namespace ContractAddress_from {
  export type Options = OneOf<
    ContractAddress_fromCreate.Options | ContractAddress_fromCreate2.Options
  >

  type ErrorType =
    | ContractAddress_fromCreate.ErrorType
    | ContractAddress_fromCreate2.ErrorType
    | Errors.GlobalErrorType
}

ContractAddress_from.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as ContractAddress_from.ErrorType
