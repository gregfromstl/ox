import type * as Errors from '../../Errors.js'
import { Authorization_toRpcList } from '../Authorization/toRpcList.js'
import { Hex_fromNumber } from '../Hex/fromNumber.js'
import type { TransactionRequest, TransactionRequest_Rpc } from './types.js'

/**
 * Converts a {@link ox#TransactionRequest.TransactionRequest} to a {@link ox#TransactionRequest.Rpc}.
 *
 * @example
 * ```ts twoslash
 * import { TransactionRequest, Value } from 'ox'
 *
 * const request = TransactionRequest.toRpc({
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('0.01'),
 * })
 * ```
 *
 * @example
 * ### Using with a Provider
 *
 * You can use {@link ox#Provider.(from:function)} to instantiate an EIP-1193 Provider and
 * send a transaction to the Wallet using the `eth_sendTransaction` method.
 *
 * ```ts twoslash
 * import 'ox/window'
 * import { Provider, TransactionRequest, Value } from 'ox'
 *
 * const provider = Provider.from(window.ethereum!)
 *
 * const request = TransactionRequest.toRpc({
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: Value.fromEther('0.01'),
 * })
 *
 * const hash = await provider.request({ // [!code focus]
 *   method: 'eth_sendTransaction', // [!code focus]
 *   params: [request], // [!code focus]
 * }) // [!code focus]
 * ```
 *
 * @param request - The request to convert.
 * @returns An RPC request.
 */
export function TransactionRequest_toRpc(
  request: TransactionRequest,
): TransactionRequest_Rpc {
  const request_rpc: TransactionRequest_Rpc = {}

  if (typeof request.accessList !== 'undefined')
    request_rpc.accessList = request.accessList
  if (typeof request.authorizationList !== 'undefined')
    request_rpc.authorizationList = Authorization_toRpcList(
      request.authorizationList,
    )
  if (typeof request.blobVersionedHashes !== 'undefined')
    request_rpc.blobVersionedHashes = request.blobVersionedHashes
  if (typeof request.blobs !== 'undefined') request_rpc.blobs = request.blobs
  if (typeof request.chainId !== 'undefined')
    request_rpc.chainId = Hex_fromNumber(request.chainId)
  if (typeof request.data !== 'undefined') {
    request_rpc.data = request.data
    request_rpc.input = request.data
  } else if (typeof request.input !== 'undefined') {
    request_rpc.data = request.input
    request_rpc.input = request.input
  }
  if (typeof request.from !== 'undefined') request_rpc.from = request.from
  if (typeof request.gas !== 'undefined')
    request_rpc.gas = Hex_fromNumber(request.gas)
  if (typeof request.gasPrice !== 'undefined')
    request_rpc.gasPrice = Hex_fromNumber(request.gasPrice)
  if (typeof request.maxFeePerBlobGas !== 'undefined')
    request_rpc.maxFeePerBlobGas = Hex_fromNumber(request.maxFeePerBlobGas)
  if (typeof request.maxFeePerGas !== 'undefined')
    request_rpc.maxFeePerGas = Hex_fromNumber(request.maxFeePerGas)
  if (typeof request.maxPriorityFeePerGas !== 'undefined')
    request_rpc.maxPriorityFeePerGas = Hex_fromNumber(
      request.maxPriorityFeePerGas,
    )
  if (typeof request.maxPriorityFeePerGas !== 'undefined')
    request_rpc.maxPriorityFeePerGas = Hex_fromNumber(
      request.maxPriorityFeePerGas,
    )
  if (typeof request.nonce !== 'undefined')
    request_rpc.nonce = Hex_fromNumber(request.nonce)
  if (typeof request.to !== 'undefined') request_rpc.to = request.to
  if (typeof request.type !== 'undefined') request_rpc.type = request.type
  if (typeof request.value !== 'undefined')
    request_rpc.value = Hex_fromNumber(request.value)

  return request_rpc
}

export declare namespace TransactionRequest_toRpc {
  export type ErrorType =
    | Authorization_toRpcList.ErrorType
    | Hex_fromNumber.ErrorType
    | Errors.GlobalErrorType
}

TransactionRequest_toRpc.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as TransactionRequest_toRpc.ErrorType
