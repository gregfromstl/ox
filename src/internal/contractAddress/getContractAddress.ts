import type { GlobalErrorType } from '../errors/error.js'
import { getCreate2Address } from './getCreate2Address.js'
import { getCreateAddress } from './getCreateAddress.js'

/**
 * Retrieves contract address generated by the [CREATE](https://ethereum.stackexchange.com/questions/68943/create-opcode-what-does-it-really-do/68945#68945) or [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) opcode.
 *
 * - Docs: https://oxlib.sh/api/contractAddress/from
 *
 * @example
 * ```ts twoslash
 * import { ContractAddress } from 'ox'
 * ContractAddress.from({
 *   opcode: 'CREATE',
 *   from: '0x1a1e021a302c237453d3d45c7b82b19ceeb7e2e6',
 *   nonce: 0n,
 * })
 * // '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2'
 * ```
 *
 * @example
 * ```ts twoslash
 * import { Bytes, ContractAddress, Hex } from 'ox'
 * ContractAddress.from({
 *   opcode: 'CREATE2',
 *   from: '0x1a1e021a302c237453d3d45c7b82b19ceeb7e2e6',
 *   bytecode: Bytes.from('0x6394198df16000526103ff60206004601c335afa6040516060f3'),
 *   salt: Hex.from('hello world'),
 * })
 * // '0x59fbB593ABe27Cb193b6ee5C5DC7bbde312290aB'
 * ```
 */
export function getContractAddress(opts: getContractAddress.Options) {
  if (opts.opcode === 'CREATE2') return getCreate2Address(opts)
  return getCreateAddress(opts)
}

export declare namespace getContractAddress {
  export type Options =
    | ({
        opcode?: 'CREATE' | undefined
      } & getCreateAddress.Options)
    | ({ opcode: 'CREATE2' } & getCreate2Address.Options)

  type ErrorType =
    | getCreateAddress.ErrorType
    | getCreate2Address.ErrorType
    | GlobalErrorType
}

getContractAddress.parseError = (error: unknown) =>
  error as getContractAddress.ErrorType
