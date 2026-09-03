import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

/**
 * Types each word out, holds it, deletes it, then moves to the next — looping.
 * Respects prefers-reduced-motion by rendering the words statically.
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
  const timer = useRef(0)

  useEffect(() => {
    if (reduced || words.length === 0) return
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
  }, [text, phase, wordIdx, words, reduced, typingSpeed, deletingSpeed, hold])

  if (reduced) {
    return <span className={className}>{words.join(' · ')}</span>
  }

  return (
    <span className={className}>
      <span aria-live="polite">{text || '\u00A0'}</span>
      <span
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-accent align-middle animate-blink"
        aria-hidden="true"
      />
    </span>
  )
}
