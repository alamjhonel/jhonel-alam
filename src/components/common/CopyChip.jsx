import { useState } from 'react'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.js'
import { IconCopy, IconCheck } from './Icons.jsx'

/**
 * A contact chip that shows an icon + value and copies the value on click.
 * `href` makes the label a link (tel:/mailto:/https), while the copy button
 * stays a separate control so both keyboard flows work.
 */
export default function CopyChip({ icon: Icon, label, value, copyValue, href, copyLabel }) {
  const copy = useCopyToClipboard()
  const [done, setDone] = useState(false)

  const toCopy = copyValue ?? value

  async function handleCopy() {
    const ok = await copy(toCopy, copyLabel ?? label)
    if (ok) {
      setDone(true)
      window.setTimeout(() => setDone(false), 1400)
    }
  }

  return (
    <div className="group inline-flex items-center gap-2 rounded-md border border-white/10 bg-base-700/50 px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:border-accent/40">
      {Icon && <Icon size={15} className="text-accent" />}
      {href ? (
        <a
          href={href}
          className="truncate text-ink-soft transition-colors hover:text-accent"
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {value}
        </a>
      ) : (
        <span className="truncate">{value}</span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${copyLabel ?? label}`}
        className="ml-1 rounded p-1 text-ink-faint transition-colors hover:text-accent"
      >
        {done ? <IconCheck size={14} /> : <IconCopy size={14} />}
      </button>
    </div>
  )
}
