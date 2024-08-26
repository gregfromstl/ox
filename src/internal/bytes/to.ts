import type { Bytes } from '../bytes/types.js'
import { InvalidBytesBooleanError, InvalidTypeError } from '../errors/data.js'
import type { GlobalErrorType } from '../errors/error.js'
import { Hex_fromBytes } from '../hex/from.js'
import { Hex_toBigInt, Hex_toNumber } from '../hex/to.js'
import type { Hex } from '../hex/types.js'
import { Bytes_assertSize } from './assertSize.js'
import { Bytes_trimLeft, Bytes_trimRight } from './trim.js'

/**
 * Decodes {@link Bytes#Bytes} into a UTF-8 string, {@link Hex#Hex}, number, bigint or boolean.
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.to(Bytes.from([1, 164]), 'number')
 * // 420
 * ```
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.to(
 *   Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
 *   'string'
 * )
 * // 'Hello world'
 * ```
 *
 * @param bytes - Bytes to decode.
 * @param to - Decode Bytes into the specified type.
 * @param options - Decoding options.
 */
export function Bytes_to<
  to extends 'string' | 'Hex' | 'bigint' | 'number' | 'boolean',
>(
  bytes: Bytes,
  to: to | 'string' | 'Hex' | 'bigint' | 'number' | 'boolean',
  options: Bytes_to.Options = {},
): Bytes_to.ReturnType<to> {
  if (to === 'number') return Bytes_toNumber(bytes, options) as never
  if (to === 'bigint') return Bytes_toBigInt(bytes, options) as never
  if (to === 'boolean') return Bytes_toBoolean(bytes, options) as never
  if (to === 'string') return Bytes_toString(bytes, options) as never
  if (to === 'Hex') return Bytes_toHex(bytes, options) as never
  throw new InvalidTypeError(to, 'string | Hex | bigint | number | boolean')
}

export declare namespace Bytes_to {
  type Options = {
    /** Size of the bytes. */
    size?: number | undefined
  }

  type ReturnType<
    to extends 'string' | 'Hex' | 'bigint' | 'number' | 'boolean',
  > =
    | (to extends 'string' ? string : never)
    | (to extends 'Hex' ? Hex : never)
    | (to extends 'bigint' ? bigint : never)
    | (to extends 'number' ? number : never)
    | (to extends 'boolean' ? boolean : never)

  type ErrorType =
    | Bytes_toBigInt.ErrorType
    | Bytes_toBoolean.ErrorType
    | Bytes_toNumber.ErrorType
    | Bytes_toString.ErrorType
    | Hex_fromBytes.ErrorType
    | InvalidTypeError
    | GlobalErrorType
}

/* v8 ignore next */
Bytes_to.parseError = (error: unknown) => error as Bytes_to.ErrorType

/**
 * Decodes a byte array into a bigint.
 * 
 - Docs: https://oxlib.sh/api/bytes/toBigInt
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.toBigInt(Bytes.from([1, 164]))
 * // 420n
 * ```
 */
export function Bytes_toBigInt(
  bytes: Bytes,
  options: Bytes_toBigInt.Options = {},
): bigint {
  const { size } = options
  if (typeof size !== 'undefined') Bytes_assertSize(bytes, size)
  const hex = Hex_fromBytes(bytes, options)
  return Hex_toBigInt(hex, options)
}

export declare namespace Bytes_toBigInt {
  type Options = {
    /** Whether or not the number of a signed representation. */
    signed?: boolean | undefined
    /** Size of the bytes. */
    size?: number | undefined
  }

  type ErrorType =
    | Hex_fromBytes.ErrorType
    | Hex_toBigInt.ErrorType
    | GlobalErrorType
}

/* v8 ignore next */
Bytes_toBigInt.parseError = (error: unknown) =>
  error as Bytes_toBigInt.ErrorType

/**
 * Decodes a byte array into a boolean.
 *
 * - Docs: https://oxlib.sh/api/bytes/toBoolean
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.toBoolean(Bytes.from([1]))
 * // true
 * ```
 */
export function Bytes_toBoolean(
  bytes_: Bytes,
  options: Bytes_toBoolean.Options = {},
): boolean {
  const { size } = options
  let bytes = bytes_
  if (typeof size !== 'undefined') {
    Bytes_assertSize(bytes, size)
    bytes = Bytes_trimLeft(bytes)
  }
  if (bytes.length > 1 || bytes[0]! > 1)
    throw new InvalidBytesBooleanError(bytes)
  return Boolean(bytes[0])
}

export declare namespace Bytes_toBoolean {
  type Options = {
    /** Size of the bytes. */
    size?: number | undefined
  }

  type ErrorType =
    | Bytes_assertSize.ErrorType
    | Bytes_trimLeft.ErrorType
    | GlobalErrorType
}

Bytes_toBoolean.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as Bytes_toBoolean.ErrorType

/**
 * Encodes a {@link Bytes#Bytes} value into a {@link Hex#Hex} value.
 *
 * - Docs: https://oxlib.sh/api/bytes/toHex
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.toHex(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 * ```
 */
export function Bytes_toHex(
  value: Bytes,
  options: Bytes_toHex.Options = {},
): Hex {
  return Hex_fromBytes(value, options)
}

export declare namespace Bytes_toHex {
  type Options = {
    /** Size of the bytes. */
    size?: number | undefined
  }

  type ErrorType = Hex_fromBytes.ErrorType | GlobalErrorType
}

/* v8 ignore next */
Bytes_toHex.parseError = (error: unknown) => error as Bytes_toHex.ErrorType

/**
 * Decodes a byte array into a number.
 *
 * - Docs: https://oxlib.sh/api/bytes/toNumber
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * Bytes.toNumber(Bytes.from([1, 164]))
 * // 420
 * ```
 */
export function Bytes_toNumber(
  bytes: Bytes,
  options: Bytes_toNumber.Options = {},
): number {
  const { size } = options
  if (typeof size !== 'undefined') Bytes_assertSize(bytes, size)
  const hex = Hex_fromBytes(bytes, options)
  return Hex_toNumber(hex, options)
}

export declare namespace Bytes_toNumber {
  export type Options = Bytes_toBigInt.Options

  export type ErrorType =
    | Hex_fromBytes.ErrorType
    | Hex_toNumber.ErrorType
    | GlobalErrorType
}

/* v8 ignore next */
Bytes_toNumber.parseError = (error: unknown) =>
  error as Bytes_toNumber.ErrorType

const decoder = /*#__PURE__*/ new TextDecoder()

/**
 * Decodes a byte array into a UTF-8 string.
 *
 * - Docs: https://oxlib.sh/api/bytes/toString
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * const data = Bytes.toString(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
 * // 'Hello world'
 * ```
 */
export function Bytes_toString(
  bytes_: Bytes,
  options: Bytes_toString.Options = {},
): string {
  const { size } = options

  let bytes = bytes_
  if (typeof size !== 'undefined') {
    Bytes_assertSize(bytes, size)
    bytes = Bytes_trimRight(bytes)
  }
  return decoder.decode(bytes)
}

export declare namespace Bytes_toString {
  export type Options = {
    /** Size of the bytes. */
    size?: number | undefined
  }

  export type ErrorType =
    | Bytes_assertSize.ErrorType
    | Bytes_trimRight.ErrorType
    | GlobalErrorType
}

/* v8 ignore next */
Bytes_toString.parseError = (error: unknown) =>
  error as Bytes_toString.ErrorType
