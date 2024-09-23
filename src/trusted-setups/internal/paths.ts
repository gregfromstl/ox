import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const Paths_mainnet = path('mainnet')

function path(name: string) {
  const __filename = fileURLToPath(
    // import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'
    // @ts-ignore
    import.meta.url,
  )
  const __dirname = dirname(__filename)
  return resolve(__dirname, `./setups/${name}.json`)
}