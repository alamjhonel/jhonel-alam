import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

/**
 * Types each word out, holds it, deletes it, then moves to the next — looping.
 * Respects prefers-reduced-motion by rendering the words statically.
 * Only starts typing once the element is actually visible in the viewport
 * (otherwise the typing happens while the parent is at opacity 0 and the
 * user never sees the animation on mobile).
 */
export default function TypeCycle({
  words = [],
  className = '',
  typingSpeed = 85,
  deletingSpeed = 40,
  hold = 1500,
}) {
  const reduced = useReducedMotion()
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState('typing') // typing | deleting
  const [active, setActive] = useState(false)
  const ref = useRef(null)
  const timer = useRef(0)

  // Wait for the element to be visible before starting the loop.
  // The boot overlay + framer-motion stagger can keep the parent at
  // opacity 0 for the first ~500ms after page load, so the typing
  // would otherwise run invisibly.
  useEffect(() => {
    if (reduced || active || !ref.current) return
    const node = ref.current
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.01 },
    )
    observer.observe(node)
    // Safety net: if the observer never fires (already-visible but
    // timing edge case), start after 600ms anyway so the user always
    // sees typing within half a second of the page being visible.
    const fallback = window.setTimeout(() => setActive(true), 600)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [reduced, active])

  useEffect(() => {
    if (reduced || !active || words.length === 0) return
    const current = words[wordIdx % words.length]

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer.current = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typingSpeed,
        )
      } else {
        timer.current = window.setTimeout(() => setPhase('deleting'), hold)
      }
    } else if (text.length > 0) {
      timer.current = window.setTimeout(
        () => setText(current.slice(0, text.length - 1)),
        deletingSpeed,
      )
    } else {
      setWordIdx((i) => (i + 1) % words.length)
      setPhase('typing')
    }

    return () => window.clearTimeout(timer.current)
  }, [text, phase, wordIdx, words, reduced, active, typingSpeed, deletingSpeed, hold])

  if (reduced) {
    return <span className={className}>{words.join(' · ')}</span>
  }

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      <span aria-live="polite" className="whitespace-pre">{text || '\u00A0'}</span>
      <span
        className="ml-1 inline-block h-[1em] w-[3px] shrink-0 translate-y-[0.15em] bg-accent align-middle animate-blink sm:w-[2px]"
        aria-hidden="true"
      />
    </span>
  )
}
