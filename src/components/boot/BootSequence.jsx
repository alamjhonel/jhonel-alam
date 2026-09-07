import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Minimum time the boot overlay is visible. Below this it flashes by too
// fast to read on mobile and looks like the animation never ran.
const MIN_VISIBLE_MS = 1400

const LINES = [
  { t: '> initializing secure session', d: 'boot' },
  { t: 'loading kernel modules ......... [ ok ]', d: 'ok' },
  { t: 'mounting encrypted volumes ..... [ ok ]', d: 'ok' },
  { t: 'verifying integrity signatures .. [ ok ]', d: 'ok' },
  { t: 'negotiating TLS 1.3 handshake ... [ ok ]', d: 'ok' },
  { t: 'starting telemetry daemon ...... [ ok ]', d: 'ok' },
  { t: 'authenticating operator ........ [ ok ]', d: 'ok' },
  { t: '> ACCESS GRANTED — welcome, operator.', d: 'grant' },
]

export default function BootSequence({ onComplete }) {
  const reduced = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)
  const finished = useRef(false)
  const startedAt = useRef(0)

  function finish() {
    if (finished.current) return
    finished.current = true
    // Guarantee the overlay is on screen long enough to read, even if
    // the user hits Esc/Enter immediately on a slow phone.
    const elapsed = performance.now() - startedAt.current
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
    window.setTimeout(() => {
      setDone(true)
      // allow exit animation to play
      window.setTimeout(() => onComplete?.(), reduced ? 0 : 450)
    }, wait)
  }

  useEffect(() => {
    startedAt.current = performance.now()
    if (reduced) {
      // Reduced motion: show all lines immediately and hold the overlay
      // long enough to be readable on small screens (otherwise it flashes
      // by in 350ms and looks like nothing happened on mobile).
      setVisibleCount(LINES.length)
      const id = window.setTimeout(finish, 1200)
      return () => window.clearTimeout(id)
    }

    let i = 0
    const timers = []
    const pushNext = () => {
      i += 1
      setVisibleCount(i)
      if (i < LINES.length) {
        const delay = 220 + Math.random() * 180
        timers.push(window.setTimeout(pushNext, delay))
      } else {
        timers.push(window.setTimeout(finish, 700))
      }
    }
    timers.push(window.setTimeout(pushNext, 250))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  // Skip on Esc / Enter / click
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-base-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={finish}
      role="dialog"
      aria-label="System boot sequence"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]"
        style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)' }}
      />
      <div className="relative w-full max-w-lg px-6">
        <div className="mb-4 flex items-center gap-2.5 font-mono text-xs text-ink-faint">
          <img
            src="/logo.png"
            alt=""
            className="h-5 w-5 rounded border border-accent/30 bg-base-800/60 object-contain shadow-glow"
          />
          <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
          secure-console — /dev/ttys001
        </div>
        <div className="min-h-[220px] font-mono text-[13px] leading-relaxed">
          {LINES.slice(0, visibleCount).map((line, idx) => (
            <div
              key={idx}
              className={
                line.d === 'grant'
                  ? 'text-accent text-glow'
                  : line.d === 'boot'
                    ? 'text-ink'
                    : 'text-ink-soft'
              }
            >
              {line.t}
            </div>
          ))}
          {!done && (
            <span className="inline-block h-4 w-2 translate-y-0.5 bg-accent animate-blink" aria-hidden="true" />
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            finish()
          }}
          className="mt-6 font-mono text-xs text-ink-faint underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
        >
          skip intro [esc]
        </button>
      </div>
    </motion.div>
  )
}
