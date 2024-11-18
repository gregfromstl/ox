import * as abitype from 'abitype'
import type * as Abi from './Abi.js'
import * as AbiItem from './AbiItem.js'
import * as AbiParameters from './AbiParameters.js'
import * as Address from './Address.js'
import * as Bytes from './Bytes.js'
import * as Errors from './Errors.js'
import * as Hash from './Hash.js'
import * as Hex from './Hex.js'
import type * as internal from './internal/abiEvent.js'
import type * as AbiItem_internal from './internal/abiItem.js'
import * as Cursor from './internal/cursor.js'
import { prettyPrint } from './internal/errors.js'
import type { Compute } from './internal/types.js'
import type { IsNarrowable } from './internal/types.js'

/** Root type for an {@link ox#AbiItem.AbiItem} with an `event` type. */
export type AbiEvent = abitype.AbiEvent & {
  hash?: Hex.Hex | undefined
  overloads?: readonly AbiEvent[] | undefined
}

/**
 * Extracts an {@link ox#AbiEvent.AbiEvent} item from an {@link ox#Abi.Abi}, given a name.
 *
 * @example
 * ```ts twoslash
 * import { Abi, AbiEvent } from 'ox'
 *
 * const abi = Abi.from([
 *   'event Foo(string)',
 *   'event Bar(uint256)',
 * ])
 *
 * type Foo = AbiEvent.FromAbi<typeof abi, 'Foo'>
 * //   ^?
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 */
export type FromAbi<
  abi extends Abi.Abi,
  name extends ExtractNames<abi>,
> = abitype.ExtractAbiEvent<abi, name>

/**
 * Extracts the names of all {@link ox#AbiError.AbiError} items in an {@link ox#Abi.Abi}.
 *
 * @example
 * ```ts twoslash
 * import { Abi, AbiEvent } from 'ox'
 *
 * const abi = Abi.from([
 *   'event Foo(string)',
 *   'event Bar(uint256)',
 * ])
 *
 * type names = AbiEvent.Name<typeof abi>
 * //   ^?
 * ```
 */
export type Name<abi extends Abi.Abi | readonly unknown[] = Abi.Abi> =
  abi extends Abi.Abi ? ExtractNames<abi> : string

export type ExtractNames<abi extends Abi.Abi> =
  abitype.ExtractAbiEventNames<abi>

/**
 * Asserts that the provided arguments match the decoded log arguments.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from('event Transfer(address indexed from, address indexed to, uint256 value)')
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   ],
 * })
 *
 * AbiEvent.assertArgs(abiEvent, args, {
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   value: 1n,
 * })
 *
 * // @error: AbiEvent.ArgsMismatchError: Given arguments to not match the arguments decoded from the log.
 * // @error: Event: event Transfer(address indexed from, address indexed to, uint256 value)
 * // @error: Expected Arguments:
 * // @error:   from:   0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac
 * // @error:   to:     0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad
 * // @error:   value:  1
 * // @error: Given Arguments:
 * // @error:   from:   0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad
 * // @error:   to:     0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac
 * // @error:   value:  1
 * ```
 *
 * @param abiEvent - ABI Event to check.
 * @param args - Decoded arguments.
 * @param matchArgs - The arguments to check.
 */
export function assertArgs<const abiEvent extends AbiEvent>(
  abiEvent: abiEvent | AbiEvent,
  args: unknown,
  matchArgs: IsNarrowable<abiEvent, AbiEvent> extends true
    ? abiEvent['inputs'] extends readonly []
      ? never
      : internal.ParametersToPrimitiveTypes<
          abiEvent['inputs'],
          { EnableUnion: true; IndexedOnly: false; Required: false }
        >
    : unknown,
) {
  if (!args || !matchArgs)
    throw new ArgsMismatchError({
      abiEvent,
      expected: args,
      given: matchArgs,
    })

  function isEqual(
    input: abitype.AbiEventParameter,
    value: unknown,
    arg: unknown,
  ) {
    if (input.type === 'address')
      return Address.isEqual(value as Address.Address, arg as Address.Address)
    if (input.type === 'string')
      return Hash.keccak256(Bytes.fromString(value as string)) === arg
    if (input.type === 'bytes') return Hash.keccak256(value as Hex.Hex) === arg
    return value === arg
  }

  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    for (const [index, value] of matchArgs.entries()) {
      if (value === null || value === undefined) continue
      const input = abiEvent.inputs[index]
      if (!input)
        throw new InputNotFoundError({
          abiEvent,
          name: `${index}`,
        })
      const value_ = Array.isArray(value) ? value : [value]
      let equal = false
      for (const value of value_) {
        if (isEqual(input, value, args[index])) equal = true
      }
      if (!equal)
        throw new ArgsMismatchError({
          abiEvent,
          expected: args,
          given: matchArgs,
        })
    }
  }

  if (
    typeof args === 'object' &&
    !Array.isArray(args) &&
    typeof matchArgs === 'object' &&
    !Array.isArray(matchArgs)
  )
    for (const [key, value] of Object.entries(matchArgs)) {
      if (value === null || value === undefined) continue
      const input = abiEvent.inputs.find((input) => input.name === key)
      if (!input) throw new InputNotFoundError({ abiEvent, name: key })
      const value_ = Array.isArray(value) ? value : [value]
      let equal = false
      for (const value of value_) {
        if (isEqual(input, value, (args as Record<string, unknown>)[key]))
          equal = true
      }
      if (!equal)
        throw new ArgsMismatchError({
          abiEvent,
          expected: args,
          given: matchArgs,
        })
    }
}

export declare namespace assertArgs {
  type ErrorType =
    | Address.isEqual.ErrorType
    | Bytes.fromString.ErrorType
    | Hash.keccak256.ErrorType
    | ArgsMismatchError
    | Errors.GlobalErrorType
}

/**
 * ABI-Decodes the provided [Log Topics and Data](https://info.etherscan.com/what-is-event-logs/) according to the ABI Event's parameter types (`input`).
 *
 * :::tip
 *
 * This function is typically used to decode an [Event Log](https://info.etherscan.com/what-is-event-logs/) that may be returned from a Log Query (e.g. `eth_getLogs`) or Transaction Receipt.
 *
 * See the [End-to-end Example](#end-to-end).
 *
 * :::
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)'
 * )
 *
 * const log = {
 *   // ...
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   ],
 * } as const
 *
 * const decoded = AbiEvent.decode(transfer, log)
 * // @log: {
 * // @log:   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 * // @log:   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 * // @log:   value: 1n
 * // @log: }
 * ```
 *
 * @example
 * ### End-to-end
 *
 * Below is an end-to-end example of using `AbiEvent.decode` to decode the topics of a `Transfer` event on the [Wagmi Mint Example contract](https://etherscan.io/address/0xfba3912ca04dd458c843e2ee08967fc04f3579c2).
 *
 * ```ts twoslash
 * import 'ox/window'
 * import { AbiEvent, Hex } from 'ox'
 *
 * // 1. Instantiate the `Transfer` ABI Event.
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * // 2. Encode the ABI Event into Event Topics.
 * const { topics } = AbiEvent.encode(transfer)
 *
 * // 3. Query for events matching the encoded Topics.
 * const logs = await window.ethereum!.request({
 *   method: 'eth_getLogs',
 *   params: [
 *     {
 *       address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 *       fromBlock: Hex.fromNumber(19760235n),
 *       toBlock: Hex.fromNumber(19760240n),
 *       topics,
 *     },
 *   ],
 * })
 *
 * // 4. Decode the Log. // [!code focus]
 * const decoded = AbiEvent.decode(transfer, logs[0]!) // [!code focus]
 * // @log: {
 * // @log:   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 * // @log:   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 * // @log:   value: 603n
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
 * @param abiEvent - The ABI Event to decode.
 * @param log - `topics` & `data` to decode.
 * @returns The decoded event.
 */
export function decode<const abiEvent extends AbiEvent>(
  abiEvent: abiEvent | AbiEvent,
  log: decode.Log,
): decode.ReturnType<abiEvent> {
  const { data, topics } = log

  const [selector_, ...argTopics] = topics

  const selector = getSelector(abiEvent)
  if (selector_ !== selector)
    throw new SelectorTopicMismatchError({
      abiEvent,
      actual: selector_,
      expected: selector,
    })

  const { inputs } = abiEvent
  const isUnnamed = inputs?.every((x) => !('name' in x && x.name))

  let args: any = isUnnamed ? [] : {}

  // Decode topics (indexed args).
  const indexedInputs = inputs.filter((x) => 'indexed' in x && x.indexed)
  for (let i = 0; i < indexedInputs.length; i++) {
    const param = indexedInputs[i]!
    const topic = argTopics[i]
    if (!topic)
      throw new TopicsMismatchError({
        abiEvent,
        param: param as abitype.AbiParameter & { indexed: boolean },
      })
    args[isUnnamed ? i : param.name || i] = (() => {
      if (
        param.type === 'string' ||
        param.type === 'bytes' ||
        param.type === 'tuple' ||
        param.type.match(/^(.*)\[(\d+)?\]$/)
      )
        return topic
      const decoded = AbiParameters.decode([param], topic) || []
      return decoded[0]
    })()
  }

  // Decode data (non-indexed args).
  const nonIndexedInputs = inputs.filter((x) => !('indexed' in x && x.indexed))
  if (nonIndexedInputs.length > 0) {
    if (data && data !== '0x') {
      try {
        const decodedData = AbiParameters.decode(nonIndexedInputs, data)
        if (decodedData) {
          if (isUnnamed) args = [...args, ...decodedData]
          else {
            for (let i = 0; i < nonIndexedInputs.length; i++) {
              const index = inputs.indexOf(nonIndexedInputs[i]!)
              args[nonIndexedInputs[i]!.name! || index] = decodedData[i]
            }
          }
        }
      } catch (err) {
        if (
          err instanceof AbiParameters.DataSizeTooSmallError ||
          err instanceof Cursor.PositionOutOfBoundsError
        )
          throw new DataMismatchError({
            abiEvent,
            data: data,
            parameters: nonIndexedInputs,
            size: Hex.size(data),
          })
        throw err
      }
    } else {
      throw new DataMismatchError({
        abiEvent,
        data: '0x',
        parameters: nonIndexedInputs,
        size: 0,
      })
    }
  }

  return Object.values(args).length > 0 ? args : undefined
}

export declare namespace decode {
  type Log = {
    data?: Hex.Hex | undefined
    topics: readonly Hex.Hex[]
  }

  type ReturnType<abiEvent extends AbiEvent = AbiEvent> = IsNarrowable<
    abiEvent,
    AbiEvent
  > extends true
    ? abiEvent['inputs'] extends readonly []
      ? undefined
      : internal.ParametersToPrimitiveTypes<
          abiEvent['inputs'],
          { EnableUnion: false; IndexedOnly: false; Required: true }
        >
    : unknown

  type ErrorType =
    | AbiParameters.decode.ErrorType
    | getSelector.ErrorType
    | DataMismatchError
    | SelectorTopicMismatchError
    | TopicsMismatchError
    | Errors.GlobalErrorType
}

/**
 * ABI-encodes the provided event input (`inputs`) into an array of [Event Topics](https://info.etherscan.com/what-is-event-logs/).
 *
 * :::tip
 *
 * This function is typically used to encode event arguments into [Event Topics](https://info.etherscan.com/what-is-event-logs/).
 *
 * See the [End-to-end Example](#end-to-end).
 *
 * :::
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)'
 * )
 *
 * const { topics } = AbiEvent.encode(transfer)
 * // @log: ['0x406dade31f7ae4b5dbc276258c28dde5ae6d5c2773c5745802c493a2360e55e0']
 * ```
 *
 * @example
 * ### Passing Arguments
 *
 * You can pass `indexed` parameter values to `AbiEvent.encode`.
 *
 * TypeScript types will be inferred from the ABI Event, to guard you from inserting the wrong values.
 *
 * For example, the `Transfer` event below accepts an `address` type for the `from` and `to` attributes.
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)'
 * )
 *
 * const { topics } = AbiEvent.encode(transfer, {
 *   from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code hl]
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' // [!code hl]
 * })
 * // @log: [
 * // @log:   '0x406dade31f7ae4b5dbc276258c28dde5ae6d5c2773c5745802c493a2360e55e0',
 * // @log:   '0x00000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 * // @log:   '0x0000000000000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8'
 * // @log: ]
 * ```
 *
 * @example
 * ### End-to-end
 *
 * Below is an end-to-end example of using `AbiEvent.encode` to encode the topics of a `Transfer` event and query for events matching the encoded topics on the [Wagmi Mint Example contract](https://etherscan.io/address/0xfba3912ca04dd458c843e2ee08967fc04f3579c2).
 *
 * ```ts twoslash
 * import 'ox/window'
 * import { AbiEvent, Hex } from 'ox'
 *
 * // 1. Instantiate the `Transfer` ABI Event.
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * // 2. Encode the ABI Event into Event Topics.
 * const { topics } = AbiEvent.encode(transfer)
 *
 * // 3. Query for events matching the encoded Topics.
 * const logs = await window.ethereum!.request({
 *   method: 'eth_getLogs',
 *   params: [
 *     {
 *       address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 *       fromBlock: Hex.fromNumber(19760235n),
 *       toBlock: Hex.fromNumber(19760240n),
 *       topics,
 *     },
 *   ],
 * })
 * // @log: [
 * // @log:   "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
 * // @log:   "0x0000000000000000000000000000000000000000000000000000000000000000",
 * // @log:   "0x0000000000000000000000000c04d9e9278ec5e4d424476d3ebec70cb5d648d1",
 * // @log:   "0x000000000000000000000000000000000000000000000000000000000000025b",
 * // @log: ]
 * ```
 *
 * :::note
 *
 * For simplicity, the above example uses `window.ethereum.request`, but you can use any
 * type of JSON-RPC interface.
 *
 * :::
 *
 * @param abiEvent - The event to encode.
 * @param args - The arguments to encode.
 * @returns The encoded event topics.
 */
export function encode<const abiEvent extends AbiEvent>(
  abiEvent: abiEvent | AbiEvent,
  ...[args]: encode.Args<abiEvent>
): encode.ReturnType {
  let topics: (Hex.Hex | Hex.Hex[] | null)[] = []
  if (args && abiEvent.inputs) {
    const indexedInputs = abiEvent.inputs.filter(
      (param) => 'indexed' in param && param.indexed,
    )
    const args_ = Array.isArray(args)
      ? args
      : Object.values(args).length > 0
        ? indexedInputs?.map(
            (x: any, i: number) => (args as any)[x.name ?? i],
          ) ?? []
        : []

    if (args_.length > 0) {
      const encode = (param: abitype.AbiParameter, value: unknown) => {
        if (param.type === 'string')
          return Hash.keccak256(Hex.fromString(value as string))
        if (param.type === 'bytes') return Hash.keccak256(value as Hex.Hex)
        if (param.type === 'tuple' || param.type.match(/^(.*)\[(\d+)?\]$/))
          throw new FilterTypeNotSupportedError(param.type)
        return AbiParameters.encode([param], [value])
      }

      topics =
        indexedInputs?.map((param, i) => {
          if (Array.isArray(args_[i]))
            return args_[i].map((_: any, j: number) =>
              encode(param, args_[i][j]),
            )
          return args_[i] ? encode(param, args_[i]) : null
        }) ?? []
    }
  }

  const selector = (() => {
    if (abiEvent.hash) return abiEvent.hash
    return getSelector(abiEvent)
  })()

  return { topics: [selector, ...topics] }
}

export declare namespace encode {
  type Args<abiEvent extends AbiEvent> = IsNarrowable<
    abiEvent,
    AbiEvent
  > extends true
    ? abiEvent['inputs'] extends readonly []
      ? []
      : internal.ParametersToPrimitiveTypes<
            abiEvent['inputs']
          > extends infer result
        ? result extends readonly []
          ? []
          : [result] | []
        : []
    : [readonly unknown[] | Record<string, unknown>] | []

  type ReturnType = {
    topics: Compute<
      [selector: Hex.Hex, ...(Hex.Hex | readonly Hex.Hex[] | null)[]]
    >
  }

  type ErrorType =
    | AbiParameters.encode.ErrorType
    | getSelector.ErrorType
    | Hex.fromString.ErrorType
    | Hash.keccak256.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Formats an {@link ox#AbiEvent.AbiEvent} into a **Human Readable ABI Error**.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const formatted = AbiEvent.format({
 *   type: 'event',
 *   name: 'Transfer',
 *   inputs: [
 *     { name: 'from', type: 'address', indexed: true },
 *     { name: 'to', type: 'address', indexed: true },
 *     { name: 'value', type: 'uint256' },
 *   ],
 * })
 *
 * formatted
 * //    ^?
 *
 *
 * ```
 *
 * @param abiEvent - The ABI Event to format.
 * @returns The formatted ABI Event.
 */
export function format<const abiEvent extends AbiEvent>(
  abiEvent: abiEvent | AbiEvent,
): abitype.FormatAbiItem<abiEvent> {
  return abitype.formatAbiItem(abiEvent) as never
}

export declare namespace format {
  type ErrorType = Errors.GlobalErrorType
}

/**
 * Parses an arbitrary **JSON ABI Event** or **Human Readable ABI Event** into a typed {@link ox#AbiEvent.AbiEvent}.
 *
 * @example
 * ### JSON ABIs
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from({
 *   name: 'Transfer',
 *   type: 'event',
 *   inputs: [
 *     { name: 'from', type: 'address', indexed: true },
 *     { name: 'to', type: 'address', indexed: true },
 *     { name: 'value', type: 'uint256' },
 *   ],
 * })
 *
 * transfer
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Human Readable ABIs
 *
 * A Human Readable ABI can be parsed into a typed ABI object:
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)' // [!code hl]
 * )
 *
 * transfer
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @param abiEvent - The ABI Event to parse.
 * @returns Typed ABI Event.
 */
export function from<
  const abiEvent extends AbiEvent | string | readonly string[],
>(
  abiEvent: (abiEvent | AbiEvent | string | readonly string[]) &
    (
      | (abiEvent extends string ? internal.Signature<abiEvent> : never)
      | (abiEvent extends readonly string[]
          ? internal.Signatures<abiEvent>
          : never)
      | AbiEvent
    ),
  options: from.Options = {},
): from.ReturnType<abiEvent> {
  return AbiItem.from(abiEvent as AbiEvent, options) as never
}

export declare namespace from {
  type Options = {
    /**
     * Whether or not to prepare the extracted event (optimization for encoding performance).
     * When `true`, the `hash` property is computed and included in the returned value.
     *
     * @default true
     */
    prepare?: boolean | undefined
  }

  type ReturnType<abiEvent extends AbiEvent | string | readonly string[]> =
    AbiItem.from.ReturnType<abiEvent>

  type ErrorType = AbiItem.from.ErrorType | Errors.GlobalErrorType
}

/**
 * Extracts an {@link ox#AbiEvent.AbiEvent} from an {@link ox#Abi.Abi} given a name and optional arguments.
 *
 * @example
 * ### Extracting by Name
 *
 * ABI Events can be extracted by their name using the `name` option:
 *
 * ```ts twoslash
 * import { Abi, AbiEvent } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 *
 * const item = AbiEvent.fromAbi(abi, 'Transfer') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Extracting by Selector
 *
 * ABI Events can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
 *
 * ```ts twoslash
 * import { Abi, AbiEvent } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 * const item = AbiEvent.fromAbi(abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * :::note
 *
 * Extracting via a hex selector is useful when extracting an ABI Event from the first topic of a Log.
 *
 * :::
 *
 * @param abi - The ABI to extract from.
 * @param name - The name (or selector) of the ABI item to extract.
 * @param options - Extraction options.
 * @returns The ABI item.
 */
export function fromAbi<
  const abi extends Abi.Abi | readonly unknown[],
  name extends Name<abi>,
  const args extends
    | AbiItem_internal.ExtractArgs<abi, name>
    | undefined = undefined,
  //
  allNames = Name<abi>,
>(
  abi: abi | Abi.Abi | readonly unknown[],
  name: Hex.Hex | (name extends allNames ? name : never),
  options?: AbiItem.fromAbi.Options<
    abi,
    name,
    args,
    AbiItem_internal.ExtractArgs<abi, name>
  >,
): AbiItem.fromAbi.ReturnType<abi, name, args, AbiEvent> {
  const item = AbiItem.fromAbi(abi, name, options as any)
  if (item.type !== 'event')
    throw new AbiItem.NotFoundError({ name, type: 'event' })
  return item as never
}

export declare namespace fromAbi {
  type ErrorType = AbiItem.fromAbi.ErrorType | Errors.GlobalErrorType
}

/**
 * Computes the event selector (hash of event signature) for an {@link ox#AbiEvent.AbiEvent}.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const selector = AbiEvent.getSelector('event Transfer(address indexed from, address indexed to, uint256 value)')
 * // @log: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f556a2'
 * ```
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const selector = AbiEvent.getSelector({
 *   name: 'Transfer',
 *   type: 'event',
 *   inputs: [
 *     { name: 'from', type: 'address', indexed: true },
 *     { name: 'to', type: 'address', indexed: true },
 *     { name: 'value', type: 'uint256' }
 *   ]
 * })
 * // @log: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f556a2'
 * ```
 *
 * @param abiItem - The ABI event to compute the selector for.
 * @returns The {@link ox#Hash.(keccak256:function)} hash of the event signature.
 */
export function getSelector(abiItem: string | AbiEvent): Hex.Hex {
  return AbiItem.getSignatureHash(abiItem)
}

export declare namespace getSelector {
  type ErrorType = AbiItem.getSignatureHash.ErrorType | Errors.GlobalErrorType
}

/**
 * Thrown when the provided arguments do not match the expected arguments.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   ],
 * })
 *
 * AbiEvent.assertArgs(abiEvent, args, {
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   value: 1n,
 * })
 * // @error: AbiEvent.ArgsMismatchError: Given arguments do not match the expected arguments.
 * // @error: Event: event Transfer(address indexed from, address indexed to, uint256 value)
 * // @error: Expected Arguments:
 * // @error:   from:   0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac
 * // @error:   to:     0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad
 * // @error:   value:  1
 * // @error: Given Arguments:
 * // @error:   from:   0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad
 * // @error:   to:     0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac
 * // @error:   value:  1
 * ```
 *
 * ### Solution
 *
 * The provided arguments need to match the expected arguments.
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   ],
 * })
 *
 * AbiEvent.assertArgs(abiEvent, args, {
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad', // [!code --]
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac', // [!code ++]
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac', // [!code --]
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad', // [!code ++]
 *   value: 1n,
 * })
 * ```
 */
export class ArgsMismatchError extends Errors.BaseError {
  override readonly name = 'AbiEvent.ArgsMismatchError'

  constructor({
    abiEvent,
    expected,
    given,
  }: {
    abiEvent: AbiEvent
    expected: unknown
    given: unknown
  }) {
    super('Given arguments do not match the expected arguments.', {
      metaMessages: [
        `Event: ${format(abiEvent)}`,
        `Expected Arguments: ${!expected ? 'None' : ''}`,
        expected ? prettyPrint(expected) : undefined,
        `Given Arguments: ${!given ? 'None' : ''}`,
        given ? prettyPrint(given) : undefined,
      ],
    })
  }
}

/**
 * Thrown when no argument was found on the event signature.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   ],
 * })
 *
 * AbiEvent.assertArgs(abiEvent, args, {
 *   a: 'b',
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   value: 1n,
 * })
 * // @error: AbiEvent.InputNotFoundError: Parameter "a" not found on `event Transfer(address indexed from, address indexed to, uint256 value)`.
 * ```
 *
 * ### Solution
 *
 * Ensure the arguments match the event signature.
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   ],
 * })
 *
 * AbiEvent.assertArgs(abiEvent, args, {
 *   a: 'b', // [!code --]
 *   from: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad',
 *   value: 1n,
 * })
 * ```
 */
export class InputNotFoundError extends Errors.BaseError {
  override readonly name = 'AbiEvent.InputNotFoundError'

  constructor({
    abiEvent,
    name,
  }: {
    abiEvent: AbiEvent
    name: string
  }) {
    super(`Parameter "${name}" not found on \`${format(abiEvent)}\`.`)
  }
}

/**
 * Thrown when the provided data size does not match the expected size from the non-indexed parameters.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address to, uint256 value)',
 *   //                                    ↑ 32 bytes + ↑ 32 bytes = 64 bytes
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000023c34600',
 *   //       ↑ 32 bytes ❌
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   ],
 * })
 * // @error: AbiEvent.DataMismatchError: Data size of 32 bytes is too small for non-indexed event parameters.
 * // @error: Non-indexed Parameters: (address to, uint256 value)
 * // @error: Data:   0x0000000000000000000000000000000000000000000000000000000023c34600 (32 bytes)
 * ```
 *
 * ### Solution
 *
 * Ensure that the data size matches the expected size.
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address to, uint256 value)',
 *   //                                    ↑ 32 bytes + ↑ 32 bytes = 64 bytes
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000023c34600',
 *   //       ↑ 64 bytes ✅
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   ],
 * })
 * ```
 */
export class DataMismatchError extends Errors.BaseError {
  override readonly name = 'AbiEvent.DataMismatchError'

  abiEvent: AbiEvent
  data: Hex.Hex
  parameters: readonly abitype.AbiParameter[]
  size: number

  constructor({
    abiEvent,
    data,
    parameters,
    size,
  }: {
    abiEvent: AbiEvent
    data: Hex.Hex
    parameters: readonly abitype.AbiParameter[]
    size: number
  }) {
    super(
      [
        `Data size of ${size} bytes is too small for non-indexed event parameters.`,
      ].join('\n'),
      {
        metaMessages: [
          `Non-indexed Parameters: (${AbiParameters.format(parameters as any)})`,
          `Data:   ${data} (${size} bytes)`,
        ],
      },
    )

    this.abiEvent = abiEvent
    this.data = data
    this.parameters = parameters
    this.size = size
  }
}

/**
 * Thrown when the provided topics do not match the expected number of topics.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *   ],
 * })
 * // @error: AbiEvent.TopicsMismatchError: Expected a topic for indexed event parameter "to" for "event Transfer(address indexed from, address indexed to, uint256 value)".
 * ```
 *
 * ### Solution
 *
 * Ensure that the topics match the expected number of topics.
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const abiEvent = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, uint256 value)',
 * )
 *
 * const args = AbiEvent.decode(abiEvent, {
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000001',
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
 *     '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code ++]
 *   ],
 * })
 * ```
 *
 */
export class TopicsMismatchError extends Errors.BaseError {
  override readonly name = 'AbiEvent.TopicsMismatchError'

  abiEvent: AbiEvent

  constructor({
    abiEvent,
    param,
  }: {
    abiEvent: AbiEvent
    param: abitype.AbiParameter & { indexed: boolean }
  }) {
    super(
      [
        `Expected a topic for indexed event parameter${
          param.name ? ` "${param.name}"` : ''
        } for "${format(abiEvent)}".`,
      ].join('\n'),
    )

    this.abiEvent = abiEvent
  }
}

/**
 * Thrown when the provided selector does not match the expected selector.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, bool sender)',
 * )
 *
 * AbiEvent.decode(transfer, {
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045',
 *     '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   ],
 * })
 * // @error: AbiEvent.SelectorTopicMismatchError: topics[0]="0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" does not match the expected topics[0]="0x3da3cd3cf420c78f8981e7afeefa0eab1f0de0eb56e78ad9ba918ed01c0b402f".
 * // @error: Event: event Transfer(address indexed from, address indexed to, bool sender)
 * // @error: Selector: 0x3da3cd3cf420c78f8981e7afeefa0eab1f0de0eb56e78ad9ba918ed01c0b402f
 * ```
 *
 * ### Solution
 *
 * Ensure that the provided selector matches the selector of the event signature.
 *
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from(
 *   'event Transfer(address indexed from, address indexed to, bool sender)',
 * )
 *
 * AbiEvent.decode(transfer, {
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // [!code --]
 *     '0x3da3cd3cf420c78f8981e7afeefa0eab1f0de0eb56e78ad9ba918ed01c0b402f', // [!code ++]
 *     '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045',
 *     '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   ],
 * })
 * ```
 */
export class SelectorTopicMismatchError extends Errors.BaseError {
  override readonly name = 'AbiEvent.SelectorTopicMismatchError'

  constructor({
    abiEvent,
    actual,
    expected,
  }: {
    abiEvent: AbiEvent
    actual: Hex.Hex | undefined
    expected: Hex.Hex
  }) {
    super(
      `topics[0]="${actual}" does not match the expected topics[0]="${expected}".`,
      {
        metaMessages: [`Event: ${format(abiEvent)}`, `Selector: ${expected}`],
      },
    )
  }
}

/**
 * Thrown when the provided filter type is not supported.
 *
 * @example
 * ```ts twoslash
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from('event Transfer((string) indexed a, string b)')
 *
 * AbiEvent.encode(transfer, {
 *   a: ['hello'],
 * })
 * // @error: AbiEvent.FilterTypeNotSupportedError: Filter type "tuple" is not supported.
 * ```
 *
 * ### Solution
 *
 * Provide a valid event input type.
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiEvent } from 'ox'
 *
 * const transfer = AbiEvent.from('event Transfer((string) indexed a, string b)') // [!code --]
 * const transfer = AbiEvent.from('event Transfer(string indexed a, string b)') // [!code ++]
 * ```
 *
 *
 */
export class FilterTypeNotSupportedError extends Errors.BaseError {
  override readonly name = 'AbiEvent.FilterTypeNotSupportedError'
  constructor(type: string) {
    super(`Filter type "${type}" is not supported.`)
  }
}