# Error Handling 

Every function namespace in Ox exports an accompanying error type (`ErrorType`) and parser (`parseError`) that you can use to strongly type your `catch` statements, or inject into a custom type-safe error handling library (e.g. [`neverthrow`](https://github.com/supermacro/neverthrow), [`Effect`](https://effect.website/), etc.).

<!-- These types come in the form of `{function}.ErrorType`. For example, the `Abi.encodeParameters` action exports a `Abi.encodeParameters.ErrorType` type. -->

## Usage with Vanilla TypeScript

Unfortunately, [TypeScript doesn't have an abstraction for typed exceptions](https://github.com/microsoft/TypeScript/issues/13219), so the most pragmatic & vanilla approach would be to explicitly cast error types in the `catch` statement with the function's `.ErrorType` property.

```ts twoslash
// @noErrors
import { Abi, Errors, Hex } from 'ox'

try {
  Abi.encodeParameters(
    ['address'], 
    ['0xc961145a54c96e3ae9baa048c4f4d6b04c13916b']
  )
} catch (err) {
  const error = err as Abi.encodeParameters.ErrorType
  error.name
  //    ^? 








  if (error.name === 'InvalidAddressError') 
    error.cause.name
    //          ^? 
}






```

## Usage with `neverthrow`

You can utilize Ox's `parseError` property into custom type-safe error handling libraries like [`neverthrow`](https://github.com/supermacro/neverthrow).

```ts twoslash
// @noErrors
import { Abi } from 'ox'
import { fromThrowable } from 'neverthrow';

const safeEncodeAbiParameters = fromThrowable( // [!code hl]
  Abi.encodeParameters, // [!code hl]
  Abi.encodeParameters.parseError // [!code hl]
) // [!code hl]

const result = safeEncodeAbiParameters(['bytes'], ['0xdeadbeef'])

if (result.isErr()) // [!code hl]
	result.error.name // [!code hl]
  //           ^?







```
