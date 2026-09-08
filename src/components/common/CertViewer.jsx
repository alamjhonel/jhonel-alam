import { useEffect, useMemo, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {
  IconShield,
  IconClose,
  IconLock,
  IconEye,
  IconChevronDown,
  IconChevronUp,
} from '../common/Icons.jsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const STOP = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

function decodeDataUri(uri) {
  const comma = uri.indexOf(',')
  const data = uri.slice(comma + 1)
  const isBase64 = /;base64(?:;|,)/.test(uri.slice(0, comma + 1))
  if (isBase64) {
    const bin = atob(data)
    const buf = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
    return buf
  }
  const text = decodeURIComponent(data)
  const buf = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) buf[i] = text.charCodeAt(i)
  return buf
}

export default function CertViewer({ src, title, onClose }) {
  const wrapperRef = useRef(null)
  const pageRefs = useRef([])
  const [pdf, setPdf] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [containerW, setContainerW] = useState(0)

  const pageCount = pdf?.numPages ?? 0

  // ---------- Decode + load PDF once per src ----------
  useEffect(() => {
    let cancelled = false
    let doc = null
    ;(async () => {
      try {
        const data = decodeDataUri(src)
        doc = await pdfjsLib.getDocument({
          data,
          // Standard-encoded cert PDFs don't need custom cmaps. If a cert
          // ever ships with a non-standard encoding, this will throw and
          // the user sees a friendly fallback that directs them to the
          // issuer for verification.
          isEvalSupported: false,
          password: '',
        }).promise
        if (!cancelled) {
          setLoadError(null)
          setPdf(doc)
        }
      } catch (err) {
        console.error('Cert viewer load failed', err)
        if (!cancelled) setLoadError(String(err?.message || err))
      }
    })()
    return () => {
      cancelled = true
      doc?.destroy?.().catch(() => {})
    }
  }, [src])

  // ---------- Track container width for responsive fitting ----------
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const target = el.querySelector('[data-pdf-scroll]')
    if (!target) return
    function measure() {
      const inner = Math.max(
        320,
        target.clientWidth -
          Number.parseInt(getComputedStyle(target).paddingLeft || '0', 10) -
          Number.parseInt(getComputedStyle(target).paddingRight || '0', 10),
      )
      setContainerW(inner)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(target)
    window.addEventListener('orientationchange', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', measure)
    }
  }, [pdf])

  // ---------- Render each page to its canvas when width or PDF changes ----------
  useEffect(() => {
    if (!pdf || containerW <= 0) return
    let cancelled = false
    const renderAll = async () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const canvases = pageRefs.current
      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return
        try {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1 })
          // Fit width. For portrait certs this gives a tall page that scrolls
          // naturally; for landscape certs the page is still readable because
          // we never zoom wider than the container.
          const scale = containerW / viewport.width
          const vp = page.getViewport({ scale })
          const canvas = canvases[i - 1]
          if (!canvas) continue
          canvas.width = Math.ceil(vp.width * dpr)
          canvas.height = Math.ceil(vp.height * dpr)
          canvas.style.width = vp.width + 'px'
          canvas.style.height = vp.height + 'px'
          const ctx = canvas.getContext('2d')
          if (!ctx) continue
          // Neutralize any DPI tint so backgrounds are pure white and the
          // viewer chrome contrasts properly.
          await page.render({
            canvasContext: ctx,
            viewport: vp,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
            background: '#ffffff',
          }).promise
        } catch (err) {
          console.error('Failed to render cert page', i, err)
        }
      }
    }
    renderAll()
    return () => {
      cancelled = true
    }
  }, [pdf, containerW])

  // ---------- Security: keyboard shortcuts (save/print/source) ----------
  useEffect(() => {
    function onKey(e) {
      const k = e.key?.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(k)) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'F12' || e.key === 'PrintScreen') {
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey, { capture: true })
    return () =>
      document.removeEventListener('keydown', onKey, { capture: true })
  }, [onClose])

  // ---------- Body scroll lock while open ----------
  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [])

  function openFullscreen() {
    const el = wrapperRef.current
    if (!el || document.fullscreenElement) return
    el.requestFullscreen?.().catch(() => {})
  }

  const pages = useMemo(
    () => (pdf ? Array.from({ length: pdf.numPages }, (_, i) => i + 1) : []),
    [pdf],
  )

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Protected credential — ${title}`}
      onClick={onClose}
      onContextMenu={STOP}
    >
      <div
        ref={wrapperRef}
        className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-accent/30 bg-base-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={STOP}
        onDragStart={STOP}
        onSelectStart={STOP}
      >
        {/* Watermark strip — lives above canvas layer so it always reads on screenshots */}
        <div className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden" aria-hidden>
          <div className="absolute inset-0 flex flex-wrap content-start gap-x-12 gap-y-10 p-6 opacity-[0.045]">
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
        <div className="relative z-30 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-base-900/95 px-5 py-3 backdrop-blur">
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

        {/* PDF canvas stack */}
        <div
          data-pdf-scroll
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden bg-black px-3 py-4 sm:px-5"
        >
          {loadError ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="font-mono text-xs text-rose-300/80">
                unable to render this credential in your browser
              </p>
              <p className="max-w-md font-mono text-[11px] text-ink-faint">
                {loadError}
              </p>
              <p className="font-mono text-[11px] text-ink-soft">
                request verification from the issuer instead
              </p>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="flex items-center gap-3 font-mono text-xs text-ink-faint">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                loading credential…
              </div>
            </div>
          ) : (
            <div className="mx-auto flex flex-col items-center gap-4">
              {pages.map((p) => (
                <canvas
                  key={p}
                  ref={(el) => {
                    pageRefs.current[p - 1] = el
                  }}
                  className={`block max-w-full rounded-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ${
                    pages.length > 1 ? 'sm:rounded-lg' : ''
                  }`}
                  style={{ background: '#ffffff' }}
                  aria-label={`Credential page ${p} of ${pageCount}`}
                />
              ))}
              {pages.length > 1 && (
                <div className="flex items-center gap-2 pt-2 font-mono text-[11px] text-ink-faint">
                  <IconChevronUp size={12} /> scroll to view all pages{' '}
                  <IconChevronDown size={12} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer notice */}
        <div className="relative z-30 shrink-0 border-t border-white/10 bg-base-900/95 px-5 py-2.5 backdrop-blur">
          <div className="flex items-center justify-between gap-3 text-center font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            <span className="flex items-center gap-1">
              {pageCount > 0 ? `${pageCount} page${pageCount === 1 ? '' : 's'}` : '—'}
            </span>
            <span className="truncate">
              screenshots &amp; downloads restricted · verify via issuer
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <IconLock size={10} /> LOCKED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}