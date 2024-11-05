import { expect, test } from 'vitest'
import * as exports from '../index.js'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "Abi",
      "AbiConstructor",
      "AbiError",
      "AbiEvent",
      "AbiFunction",
      "AbiItem",
      "AbiParameters",
      "AccessList",
      "AccountProof",
      "Address",
      "AesGcm",
      "Authorization",
      "Base58",
      "Base64",
      "Blobs",
      "Block",
      "Bloom",
      "Bytes",
      "Caches",
      "ContractAddress",
      "Ens",
      "Errors",
      "Filter",
      "Hash",
      "HdKey",
      "Hex",
      "Fee",
      "Json",
      "Kzg",
      "Log",
      "Mnemonic",
      "PersonalMessage",
      "Provider",
      "PublicKey",
      "Rlp",
      "RpcSchema",
      "RpcRequest",
      "RpcResponse",
      "RpcTransport",
      "Secp256k1",
      "P256",
      "Signature",
      "Siwe",
      "Solidity",
      "Transaction",
      "TransactionEnvelope",
      "TransactionEnvelopeLegacy",
      "TransactionEnvelopeEip1559",
      "TransactionEnvelopeEip2930",
      "TransactionEnvelopeEip4844",
      "TransactionEnvelopeEip7702",
      "TransactionReceipt",
      "TransactionRequest",
      "TypedData",
      "ValidatorData",
      "Value",
      "WebAuthnP256",
      "WebCryptoP256",
      "Withdrawal",
    ]
  `)
})