import type { Versions } from '@scure/bip32'
import type { Hex } from '../Hex/types.js'
import type { PublicKey } from '../PublicKey/types.js'

export type HdKey = {
  derive: (path: string) => HdKey
  depth: number
  index: number
  identifier: Hex
  privateKey: Hex
  privateExtendedKey: string
  publicKey: PublicKey<false>
  publicExtendedKey: string
  versions: Versions
}