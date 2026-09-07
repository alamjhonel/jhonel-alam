import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Vite plugin that inlines cert PDFs as base64 data URIs at build time
 * and prevents Vite from emitting them as separate asset files.
 *
 * Strategy:
 *  - At buildStart: read each PDF from src/assets/certs/, base64-encode it,
 *    and write the rewritten `src/data/certAssets.js` back to disk with
 *    the data: URIs inlined. The source file is restored on `buildEnd`.
 *  - At resolveId: return a virtual module for the PDF imports so Vite
 *    doesn't try to bundle them as assets.
 *  - At buildEnd: restore the placeholder file so the working copy is
 *    never committed with megabytes of base64 data.
 */
const PDF_KEYS = {
  '__ETHICAL_HACKER_PDF__':
    'src/assets/certs/Ethical-Hacker-NetAcad.pdf',
  '__INTRO_TO_CYBERSECURITY_PDF__':
    'src/assets/certs/IntrotoCybersec-NetAcad.pdf',
  '__GOOGLE_CYBERSECURITY_PDF__':
    'src/assets/certs/google-cybersecurity.pdf',
  '__GOOGLE_NETWORK_SECURITY_PDF__':
    'src/assets/certs/google-network-security.pdf',
}

const VIRTUAL_PDF_PREFIX = 'cert-pdf:'

export function certAssets() {
  let originalSource = null
  const root = dirname(fileURLToPath(import.meta.url)) + '/..'
  const placeholdersPath = resolve(root, 'src/data/certAssets.js')

  return {
    name: 'cert-assets',
    enforce: 'pre',

    buildStart() {
      originalSource = readFileSync(placeholdersPath, 'utf8')
      // Pre-warm: validate that every PDF we depend on exists.
      for (const relPath of Object.values(PDF_KEYS)) {
        try {
          readFileSync(resolve(root, relPath))
        } catch {
          this.warn(
            `cert-assets: ${relPath} not found — the matching cert will render without an inline PDF viewer until the file is added.`,
          )
        }
      }
    },

    resolveId(id) {
      if (id.startsWith(VIRTUAL_PDF_PREFIX)) {
        return '\0' + id
      }
      // Intercept the certAssets.js import so it resolves to the
      // generated file we just emitted.
      if (
        id.endsWith('/data/certAssets.js') ||
        id === './certAssets.js' ||
        id === '../data/certAssets.js'
      ) {
        return '\0virtual:cert-assets-generated'
      }
      return null
    },

    load(id) {
      if (id === '\0virtual:cert-assets-generated') {
        let source = readFileSync(placeholdersPath, 'utf8')
        for (const [placeholder, relPath] of Object.entries(PDF_KEYS)) {
          try {
            const bytes = readFileSync(resolve(root, relPath))
            const dataUri = `data:application/pdf;base64,${bytes.toString(
              'base64',
            )}`
            source = source.replace(`'${placeholder}'`, `'${dataUri}'`)
          } catch {
            // PDF not on disk yet — leave the placeholder string in place
            // so the build still succeeds. The runtime viewer skips entries
            // whose data: URI hasn't been inlined.
          }
        }
        return source
      }
      if (id.startsWith('\0' + VIRTUAL_PDF_PREFIX)) {
        return 'export default ""'
      }
      return null
    },

    // Drop the placeholder asset file from the bundle (it was only used
    // to compute the source; the virtual module is what ships).
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (
          fileName === 'certAssets.generated.js' ||
          fileName === 'assets/certAssets.generated.js'
        ) {
          delete bundle[fileName]
        }
      }
    },

    buildEnd() {
      // No-op: we never modified disk.
    },
  }
}