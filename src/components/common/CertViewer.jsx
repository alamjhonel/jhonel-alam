import { useEffect, useRef, useState } from 'react'
import { IconShield, IconClose, IconLock, IconEye } from '../common/Icons.jsx'

/**
 * Protected PDF cert viewer.
 *
 * Hardening layers:
 *  - PDF is imported via Vite (bundled, NOT served from /public) so there is
 *    no stable URL and the file is hashed at build time.
 *  - The blob URL is created on demand inside this component; the source
 *    import is never exposed as a fetchable asset.
 *  - Iframe sandbox disables printing, scripts, forms, top-level nav, and
 *    pointer-lock to neutralize the built-in PDF viewer toolbar.
 *  - oncontextmenu / ondragstart / onselectstart are blocked at the wrapper.
 *  - Keyboard shortcuts for save/print are suppressed while the viewer is open.
 *
 * Caveat: a determined user with a second device (camera) or OS-level screen
 * capture can still copy the visual. This component makes casual and scripted
 * scraping materially harder.
 */
export default function CertViewer({ src, title, onClose }) {
  const wrapperRef = useRef(null)
  const [blobUrl, setBlobUrl] = useState('')

  useEffect(() => {
    let url = ''
    let cancelled = false
    ;(async () => {
      try {
        // `src` is a data: URI embedded in the JS bundle. Convert it to a
        // short-lived blob URL so the PDF renders without exposing the raw
        // data URI in the address bar / dev tools.
        const res = await fetch(src)
        const blob = await res.blob()
        url = URL.createObjectURL(
          new Blob([blob], { type: 'application/pdf' }),
        )
        if (!cancelled) setBlobUrl(url)
      } catch (err) {
        console.error('Cert viewer failed to load asset', err)
      }
    })()
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [src])

  // Block keyboard shortcuts: Ctrl/Cmd+S (save), Ctrl/Cmd+P (print),
  // Ctrl/Cmd+Shift+S (save as), Ctrl/Cmd+U (view source), F12 (devtools).
  useEffect(() => {
    function onKey(e) {
      const k = e.key?.toLowerCase()
      if (
        (e.ctrlKey || e.metaKey) &&
        ['s', 'p', 'u'].includes(k)
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'F12' || e.key === 'PrintScreen') {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', onKey, { capture: true })
    return () =>
      document.removeEventListener('keydown', onKey, { capture: true })
  }, [])

  function blockEvent(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  function openFullscreen() {
    const iframe = wrapperRef.current?.querySelector('iframe')
    if (iframe && document.fullscreenElement === null) {
      iframe.requestFullscreen?.().catch(() => {})
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Protected credential — ${title}`}
      onClick={onClose}
      onContextMenu={blockEvent}
    >
      <div
        ref={wrapperRef}
        className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-accent/30 bg-base-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={blockEvent}
        onDragStart={blockEvent}
        onSelectStart={blockEvent}
      >
        {/* Watermark strip */}
        <div className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden" aria-hidden>
          <div className="absolute inset-0 flex flex-wrap content-start gap-x-12 gap-y-10 p-6 opacity-[0.04]">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="-rotate-12 whitespace-nowrap font-mono text-xs tracking-widest text-ink"
              >
                JHONEL ALAM · CONFIDENTIAL
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-base-900/95 px-5 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
              <IconShield size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Protected credential
              </p>
              <p className="truncate text-sm font-semibold text-ink">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[10px] text-emerald-300 sm:inline-flex">
              <IconLock size={11} /> NO DOWNLOAD
            </span>
            <button
              type="button"
              onClick={openFullscreen}
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-white/15 text-ink-soft transition-colors hover:border-accent/40 hover:text-accent sm:flex"
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              <IconEye size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close credential viewer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-base-900/90 text-ink-soft shadow-lg transition-all hover:border-accent/60 hover:text-accent hover:scale-105 active:scale-95"
            >
              <IconClose size={18} />
            </button>
          </div>
        </div>

        {/* PDF */}
        <div className="relative z-0 flex-1 bg-black">
          {blobUrl ? (
            <iframe
              key={blobUrl}
              src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&statusbar=0&messages=0&print=0`}
              title={title}
              className="h-full min-h-[60vh] w-full select-none"
              // Hard sandbox: no scripts, no top-level navigation, no popups,
              // no form submission, no same-origin (so the PDF can't read
              // cookies or call back into the parent).
              sandbox=""
              onContextMenu={blockEvent}
              onLoad={(e) => {
                try {
                  e.currentTarget.contentWindow?.print && undefined
                } catch {}
              }}
            />
          ) : (
            <div className="flex min-h-[60vh] items-center justify-center font-mono text-xs text-ink-faint">
              Loading credential…
            </div>
          )}
        </div>

        {/* Footer notice */}
        <div className="relative z-20 shrink-0 border-t border-white/10 bg-base-900/95 px-5 py-2.5 backdrop-blur">
          <p className="text-center font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            screenshots &amp; downloads restricted · for verification use official issuer
          </p>
        </div>
      </div>
    </div>
  )
}