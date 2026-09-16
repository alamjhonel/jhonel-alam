import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Inline cert PDFs as base64 data URIs in a virtual module, without
 * emitting separate PDF assets or modifying the source file on disk.
 */
const PDF_KEYS = {
  '__AWS_SYSOPS_PDF__':
    'src/assets/certs/AWS Certified SysOps Administrator – Associate.pdf',
  '__DATA_PROTECTION_GDPR_PDF__':
    'src/assets/certs/Diploma in Data Protection and Security (GDPR).pdf',
  '__ETHICAL_HACKER_PDF__':
    'src/assets/certs/Ethical-Hacker-NetAcad.pdf',
  '__GOOGLE_CLOUD_DIGITAL_LEADER_PDF__':
    'src/assets/certs/Master Course in Google Cloud Digital Leader.pdf',
  '__GOOGLE_CYBERSECURITY_PDF__':
    'src/assets/certs/google-cybersecurity.pdf',
  '__GOOGLE_NETWORK_SECURITY_PDF__':
    'src/assets/certs/google-network-security.pdf',
  '__INTRO_TO_CYBERSECURITY_PDF__':
    'src/assets/certs/IntrotoCybersec-NetAcad.pdf',
  '__SAP_SECURITY_PDF__':
    'src/assets/certs/SAP Security.pdf',
  '__TESDA_NC2_PDF__':
    'src/assets/certs/Tesda.pdf',
}

const VIRTUAL_PDF_PREFIX = 'cert-pdf:'
const VIRTUAL_CERT_ID = '\0virtual:cert-assets-generated'

export function certAssets() {
  const root = dirname(fileURLToPath(import.meta.url)) + '/..'
  const placeholdersPath = resolve(root, 'src/data/certAssets.js')
  const pdfPaths = Object.values(PDF_KEYS).map((relPath) => resolve(root, relPath))
  const watchedPaths = new Set([placeholdersPath, ...pdfPaths])

  return {
    name: 'cert-assets',
    enforce: 'pre',

    buildStart() {
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

    configureServer(server) {
      // Watch the directory too, so uploading a previously missing PDF refreshes the viewer.
      server.watcher.add([resolve(root, 'src/assets/certs'), ...watchedPaths])
      const refreshCerts = (file) => {
        if (!watchedPaths.has(resolve(file))) return
        const module = server.moduleGraph.getModuleById(VIRTUAL_CERT_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload', path: '*' })
      }
      server.watcher.on('add', refreshCerts)
      server.watcher.on('change', refreshCerts)
      server.watcher.on('unlink', refreshCerts)
      server.httpServer?.once('close', () => {
        server.watcher.off('add', refreshCerts)
        server.watcher.off('change', refreshCerts)
        server.watcher.off('unlink', refreshCerts)
      })
    },

    resolveId(id) {
      if (id.startsWith(VIRTUAL_PDF_PREFIX)) {
        return '\0' + id
      }
      if (
        id.endsWith('/data/certAssets.js') ||
        id === './certAssets.js' ||
        id === '../data/certAssets.js'
      ) {
        return VIRTUAL_CERT_ID
      }
      return null
    },

    load(id) {
      if (id === VIRTUAL_CERT_ID) {
        for (const file of watchedPaths) this.addWatchFile(file)
        let source = readFileSync(placeholdersPath, 'utf8')
        for (const [placeholder, relPath] of Object.entries(PDF_KEYS)) {
          try {
            const bytes = readFileSync(resolve(root, relPath))
            const dataUri = `data:application/pdf;base64,${bytes.toString(
              'base64',
            )}`
            source = source.replace(`'${placeholder}'`, `'${dataUri}'`)
          } catch {
            // Missing PDFs keep their placeholders; the viewer skips those entries.
          }
        }
        return source
      }
      if (id.startsWith('\0' + VIRTUAL_PDF_PREFIX)) {
        return 'export default ""'
      }
      return null
    },

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
  }
}
