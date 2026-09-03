import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { IconShield, IconClose, IconSpark } from '../common/Icons.jsx'

// ↑ ↑ ↓ ↓ ← → ← → b a
const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/**
 * Hidden reward: enter the Konami code anywhere to unlock a small message.
 * Dismissible with Esc, backdrop click, or the close button.
 */
export default function KonamiEasterEgg() {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let progress = 0
    const onKey = (e) => {
      // Don't hijack typing in inputs/textareas.
      const el = document.activeElement
      const typing =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (typing) return

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = SEQUENCE[progress]
      progress = key === expected ? progress + 1 : key === SEQUENCE[0] ? 1 : 0
      if (progress === SEQUENCE.length) {
        progress = 0
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            className="panel relative w-full max-w-sm overflow-hidden p-6 text-center shadow-panel"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Easter egg unlocked"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 text-ink-faint transition-colors hover:text-accent"
            >
              <IconClose size={18} />
            </button>

            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <IconShield size={28} />
            </div>

            <p className="mono-label mb-2 flex items-center justify-center gap-1.5 text-accent">
              <IconSpark size={14} /> sequence accepted
            </p>
            <h3 className="font-mono text-lg text-ink">CHEAT CODE UNLOCKED</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              <span className="font-mono text-accent">MAX_DEFENSE</span> engaged — thirty extra layers
              of firewall granted. You clearly know your way around a keyboard, operator.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-ghost">
              // decommissioning easter egg… back to your regularly scheduled security ops.
            </p>

            <button type="button" onClick={() => setOpen(false)} className="btn-primary mt-5">
              Acknowledge
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
