---
showOutline: 1
---

# Errors [Glossary of Errors in Ox]

## `IntegerOutOfRangeError`

### Why?

The number provided is not within the signed or unsigned integer range of a given size.

### Example

An example of this error might be when trying to convert a number to hex representation of an 8-bit unsigned integer (ie. `Hex.fromNumber(69420, { size: 1 })`).

```
Number "69420" is not in safe 8-bit unsigned integer range (0 to 255)
```

This means that the number provided (`69420`) is not in the valid range of an **8-bit unsigned integer**. 

An 8-bit **_unsigned_** integer can range from `0` to `(2 ** 8) - 1`, which is `255`. 

On the other hand, an 8-bit **_signed_** integer can range from `-2 ** (8 - 1)` to `(2 ** (8 - 1)) - 1`, which is `-128` to `127`.

### Solution

Pass a number within the valid signed or unsigned integer range.

## `InvalidBytesBooleanError`

### Why?

The provided bytes value can not be represented as a boolean. This typically occurs when a bytes value is something other than `Uint8Array [1]` or `Uint8Array[0]`.

### Example

An example of this error might be when trying to convert a bytes value to a boolean (ie. `Bytes.toBoolean(Bytes.from([69]))`).

```
Bytes value "69" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.
```

### Solution

Pass a bytes value that can be coerced to a boolean (e.g. `Uint8Array [1]` or `Uint8Array[0]`).

## `InvalidBytesTypeError`

### Why?

An invalid Bytes type was provided as an argument. This typically occurs when a bytes value is something other than `Bytes` (`Uint8Array`).

### Example

```ts
Value `"0x1"` of type `string` is an invalid Bytes value. Bytes values must be of type `Uint8Array`.
```

### Solution

Pass a value of type `Bytes`. A `Bytes` value can be created by using `Bytes.from`:

```ts twoslash
// @noErrors
import { Bytes } from 'ox'
const bytes = Bytes.from([1, 2, 3])
const bytes = Bytes.from('0x123')
const bytes = Bytes.from('hello world')
```

## `InvalidHexBooleanError`

### Why?

The provided hex value can not be represented as a boolean. This typically occurs when a hex value is something other than `0x1` or `0x0`.

### Example

An example of this error might be when trying to convert a hex value to a boolean (ie. `Hex.toBoolean(Hex.from("0x69"))`).

```
Bytes value "0x69" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).
```

### Solution

Pass a hex value that can be coerced to a boolean (e.g. `0x1` or `0x0`).

## `InvalidHexLengthError`

### Why?

The hex value provided contains an odd number of [nibbles](https://en.wikipedia.org/wiki/Nibble), which cannot be represented as a valid hex bytes value.

### Example

An example of this error may occur when trying to convert an odd-length hex value to a bytes value (ie. `Hex.toBytes(Hex.from("0xdeadb"))`).

```
Hex value "0xdeadb" is an odd length (5 nibbles). It must be an even length.
```

### Solution

Pass an even-length hex value (e.g. `0x0deadb`).

## `InvalidHexTypeError`

### Why?

An invalid Hex type was provided as an argument. This typically occurs when a hex value is something other than `Hex` (`"0x{string}"`).

### Example

```
Value `69n` of type `bigint` is an invalid Hex value. Hex values must be of type `"0x${string}"`.
```

### Solution

Pass a value of type `Hex`. A `Hex` value can be created by using `Hex.from`:

```ts twoslash
// @noErrors
import { Hex } from 'ox'
const hex = Hex.from('0x123')
const hex = Hex.from([1, 2, 3])
const hex = Hex.from('hello world')
```

## `InvalidHexValueError`

### Why?

The provided value is not a valid hex value. This typically occurs when a hex value does not start with `"0x"` or contains characters other than hexadecimal characters (`0-9`, `a-f`, `A-F`).

### Example

```
Value `"0xzz"` is an invalid hex value. Hex values must start with "0x" and contain only hexadecimal characters (0-9, a-f, A-F).
```

### Solution

Pass a valid hex string value in the format of `"0x{0-9A-Fa-f}"`.

## `InvalidTypeError`

### Why?

An invalid type was provided as an argument.

### Example

An example of this error may occur when trying to convert an object to a Bytes value (ie. `Bytes.from({ foo: 'bar' })`).

```
Type `object` is invalid. Expected: `string | hex | bigint | number | boolean`
```

### Solution

Pass a value of an expected type.

## `SizeExceedsPaddingSizeError`

### Why?

The bytes size of the value provided exceeds the expected bytes size of the final padded value.

### Example

An example of this error may occur when trying to pad a hex value to a certain size (ie. `Hex.padLeft('0xdeadbeefdeadbeef', 4)`).

```
Hex size (`8`) exceeds padding size (`4`).
```

### Solution

Pass a hex value below the padding size (e.g. `Hex.padLeft('0xbeef', 4)`).

## `SizeOverflowError`

### Why?

The size of the value provided exceeds the maximum size of the value.

### Example

An example of this may occur when trying to convert a string to a Hex value of a given size (ie. `Hex.from('Hello World!', { size: 8 })`).

```
Size cannot exceed `8` bytes. Given size: `12` bytes.
```

### Solution

Pass a value that is less than or equal to the maximum `size`.

## `SliceOffsetOutOfBoundsError`

### Why?

The offset provided for slicing exceeds the bounds of the value.

### Example

An example of this error may occur when trying to slice a hex value at an out of bounds offset (ie. `Hex.slice('0xbeefde', 5)`).

```
Slice starting at offset `5` is out-of-bounds (size: `3`).
```

### Solution

Pass an offset that is less than or equal to the size of the value (e.g. `Hex.slice('0xbeef', 1)`).