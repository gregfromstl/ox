import type { GlobalErrorType } from '../Errors/error.js'
import type { Log, Log_Rpc } from './types.js'

/**
 * Converts a {@link ox#Log.Rpc} to an {@link ox#Log.Log}.
 *
 * @example
 * ```ts twoslash
 * import { Log } from 'ox'
 *
 * const log = Log.fromRpc({
 *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x0000000000000000000000000000000000000000000000000000000000000000',
 *     '0x0000000000000000000000000c04d9e9278ec5e4d424476d3ebec70cb5d648d1',
 *     '0x000000000000000000000000000000000000000000000000000000000000025b',
 *   ],
 *   data: '0x',
 *   blockHash:
 *     '0xabe69134e80a12f6a93d0aa18215b5b86c2fb338bae911790ca374a8716e01a4',
 *   blockNumber: '0x12d846c',
 *   transactionHash:
 *     '0xcfa52db0bc2cb5bdcb2c5bd8816df7a2f018a0e3964ab1ef4d794cf327966e93',
 *   transactionIndex: '0x91',
 *   logIndex: '0x10f',
 *   removed: false,
 * })
 * // @log: {
 * // @log:   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 * // @log:   blockHash: '0xabe69134e80a12f6a93d0aa18215b5b86c2fb338bae911790ca374a8716e01a4',
 * // @log:   blockNumber: 19760236n,
 * // @log:   data: '0x',
 * // @log:   logIndex: 271,
 * // @log:   removed: false,
 * // @log:   topics: [
 * // @log:     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
 * // @log:     "0x0000000000000000000000000000000000000000000000000000000000000000",
 * // @log:     "0x0000000000000000000000000c04d9e9278ec5e4d424476d3ebec70cb5d648d1",
 * // @log:     "0x000000000000000000000000000000000000000000000000000000000000025b",
 * // @log:   transactionHash:
 * // @log:     '0xcfa52db0bc2cb5bdcb2c5bd8816df7a2f018a0e3964ab1ef4d794cf327966e93',
 * // @log:   transactionIndex: 145,
 * // @log: }
 * ```
 *
 * @example
 * ### End-to-end
 *
 * Below is an example of how to use `Log.fromRpc` to instantiate a {@link ox#Log.Log} from an RPC log.
 *
 * ```ts twoslash
 * import 'ox/window'
 * import { AbiEvent, Hex, Log } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 indexed value)',
 * )
 *
 * const { topics } = AbiEvent.encode(transfer)
 *
 * const logs = await window.ethereum!.request({
 *   method: 'eth_getLogs',
 *   params: [
 *     {
 *       address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 *       fromBlock: Hex.from(19760235n),
 *       toBlock: Hex.from(19760240n),
 *       topics,
 *     },
 *   ],
 * })
 *
 * const log = Log.fromRpc(logs[0]) // [!code focus]
 * // @log: {
 * // @log:   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 * // @log:   blockHash: '0xabe69134e80a12f6a93d0aa18215b5b86c2fb338bae911790ca374a8716e01a4',
 * // @log:   blockNumber: 19760236n,
 * // @log:   data: '0x',
 * // @log:   logIndex: 271,
 * // @log:   removed: false,
 * // @log:   topics: [
 * // @log:     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
 * // @log:     "0x0000000000000000000000000000000000000000000000000000000000000000",
 * // @log:     "0x0000000000000000000000000c04d9e9278ec5e4d424476d3ebec70cb5d648d1",
 * // @log:     "0x000000000000000000000000000000000000000000000000000000000000025b",
 * // @log:   transactionHash:
 * // @log:     '0xcfa52db0bc2cb5bdcb2c5bd8816df7a2f018a0e3964ab1ef4d794cf327966e93',
 * // @log:   transactionIndex: 145,
 * // @log: }
 * ```
 *
 * :::note
 *
 * For simplicity, the above example uses `window.ethereum.request`, but you can use any
 * type of JSON-RPC interface.
 *
 * :::
 *
 * @param log - The RPC log to convert.
 * @returns An instantiated {@link ox#Log.Log}.
 */
export function Log_fromRpc(log: Log_Rpc): Log {
  return {
    address: log.address,
    blockHash: log.blockHash,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    data: log.data,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    topics: log.topics,
    transactionHash: log.transactionHash,
    transactionIndex: log.transactionIndex
      ? Number(log.transactionIndex)
      : null,
    removed: log.removed,
  }
}

export declare namespace Log_fromRpc {
  export type ErrorType = GlobalErrorType
}

Log_fromRpc.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as Log_fromRpc.ErrorType