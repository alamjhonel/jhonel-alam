import { useCallback } from 'react'
import { useToast } from '../context/ToastContext.jsx'

/**
 * Returns a copy() function that writes text to the clipboard and fires a toast.
 * Falls back to a hidden textarea + execCommand for older / insecure contexts.
 */
export function useCopyToClipboard() {
  const { toast } = useToast()

  const copy = useCallback(
    async (text, label) => {
      const ok = await writeClipboard(text)
      if (ok) {
        toast(label ? `Copied ${label}` : 'Copied to clipboard')
      } else {
        toast('Copy failed — select and copy manually', { tone: 'error' })
      }
      return ok
    },
    [toast],
  )

  return copy
}

async function writeClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
