import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01_ABCDEF§$%&'

/**
 * Scrambles through random glyphs before resolving to the real text.
 * Triggers when it scrolls into view. Respects prefers-reduced-motion.
 */
export default function DecryptText({ text, className = '', as: Tag = 'span', delay = 0, duration = 900 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? text : '')
  const started = useRef(false)

  useEffect(() => {
    if (reduced) {
      setDisplay(text)
      return
    }
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            run()
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    let raf = 0

    function run() {
      const start = performance.now() + delay
      const chars = text.split('')

      const tick = (now) => {
        const elapsed = now - start
        if (elapsed < 0) {
          raf = requestAnimationFrame(tick)
          return
        }
        const progress = Math.min(1, elapsed / duration)
        // Reveal characters left-to-right; scramble the rest.
        const revealCount = Math.floor(progress * chars.length)
        let out = ''
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') {
            out += ' '
          } else if (i < revealCount) {
            out += chars[i]
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
        }
        setDisplay(out)
        if (progress < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          setDisplay(text)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [text, reduced, delay, duration])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display || '\u00A0'}</span>
    </Tag>
  )
}
