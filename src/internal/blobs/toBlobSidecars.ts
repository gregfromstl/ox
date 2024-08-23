import type { GlobalErrorType } from '../errors/error.js'
import type { BlobSidecars } from '../types/blob.js'
import type { Bytes, Hex } from '../types/data.js'
import type { Kzg } from '../types/kzg.js'
import type { Mutable, OneOf, UnionCompute } from '../types/utils.js'
import { blobsToCommitments } from './blobsToCommitments.js'
import { blobsToProofs } from './blobsToProofs.js'

/**
 * Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
 *
 * @example
 * ```ts
 * import { Blobs } from 'ox'
 *
 * const blobs = Blobs.from('0xdeadbeef')
 * const sidecars = Blobs.toSidecars(blobs)
 * ```
 *
 * @example
 * ```ts
 * import { Blobs } from 'ox'
 *
 * const blobs = Blobs.from('0xdeadbeef')
 * const commitments = Blobs.toCommitments(blobs, { kzg })
 * const proofs = Blobs.toProofs(blobs, { commitments, kzg })
 *
 * const sidecars = Blobs.toSidecars(blobs, { commitments, proofs })
 * ```
 */
export function toBlobSidecars<
  const blobs extends readonly Hex[] | readonly Bytes[],
>(
  blobs: blobs,
  options: toBlobSidecars.Options<blobs>,
): toBlobSidecars.ReturnType<blobs> {
  const { kzg } = options

  const commitments =
    options.commitments ?? blobsToCommitments(blobs, { kzg: kzg! })
  const proofs =
    options.proofs ??
    blobsToProofs(blobs, { commitments: commitments as any, kzg: kzg! })

  const sidecars: Mutable<BlobSidecars> = []
  for (let i = 0; i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i]!,
      commitment: commitments[i]!,
      proof: proofs[i]!,
    })

  return sidecars as never
}

export declare namespace toBlobSidecars {
  type Options<
    blobs extends readonly Hex[] | readonly Bytes[] =
      | readonly Hex[]
      | readonly Bytes[],
  > = {
    kzg?: Kzg | undefined
  } & OneOf<
    | {}
    | {
        /** Commitment for each blob. */
        commitments: blobs | readonly Hex[] | readonly Bytes[]
        /** Proof for each blob. */
        proofs: blobs | readonly Hex[] | readonly Bytes[]
      }
  >

  type ReturnType<blobs extends readonly Hex[] | readonly Bytes[]> =
    UnionCompute<
      | (blobs extends readonly Hex[] ? BlobSidecars<Hex> : never)
      | (blobs extends readonly Bytes[] ? BlobSidecars<Bytes> : never)
    >

  type ErrorType = GlobalErrorType
}

toBlobSidecars.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as toBlobSidecars.ErrorType