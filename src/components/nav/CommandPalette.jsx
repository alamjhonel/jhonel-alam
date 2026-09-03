import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sections } from '../../data/content.js'
import { scrollToSection } from '../../utils/scroll.js'
import { IconSearch, IconArrowRight, IconTerminal, IconSwatch, IconCommand } from '../common/Icons.jsx'

/**
 * Command palette. Open with "/" or Ctrl/Cmd+K, or the `palette:open` event.
 * Type a section name to jump, or run an action.
 */
export default function CommandPalette({ onOpenTerminal, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const commands = useMemo(() => {
    const navCmds = sections.map((s) => ({
      id: `go:${s.id}`,
      label: `Go to ${s.label}`,
      hint: s.cmd,
      icon: IconArrowRight,
      run: () => scrollToSection(s.id),
    }))
    const actions = [
      { id: 'act:terminal', label: 'Open mock terminal', hint: 'terminal', icon: IconTerminal, run: () => onOpenTerminal?.() },
      { id: 'act:theme', label: 'Toggle accent theme', hint: 'theme', icon: IconSwatch, run: () => onToggleTheme?.() },
    ]
    return [...navCmds, ...actions]
  }, [onOpenTerminal, onToggleTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
    )
  }, [commands, query])

  useEffect(() => setActive(0), [query, open])

  // Global open/close hotkeys
  useEffect(() => {
    const onKey = (e) => {
      const el = document.activeElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  function exec(cmd) {
    setOpen(false)
    // let the modal close before scrolling/acting
    window.setTimeout(() => cmd.run(), 60)
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') return setOpen(false)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filtered[active]
      if (cmd) exec(cmd)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/[0.12] bg-base-800/95 shadow-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <IconSearch size={18} className="text-accent" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command or section…"
                className="w-full bg-transparent py-4 font-mono text-sm text-ink placeholder:text-ink-ghost focus:outline-none"
                aria-label="Command input"
              />
              <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:block">
                esc
              </kbd>
            </div>
            <ul className="max-h-[46vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-xs text-ink-faint">
                  no matching commands
                </li>
              )}
              {filtered.map((cmd, i) => {
                const Icon = cmd.icon
                return (
                  <li key={cmd.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => exec(cmd)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                        i === active ? 'bg-accent/15 text-ink' : 'text-ink-soft hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} className={i === active ? 'text-accent' : 'text-ink-faint'} />
                      <span className="flex-1">{cmd.label}</span>
                      <span className="text-[11px] text-ink-ghost">{cmd.hint}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2 font-mono text-[10px] text-ink-ghost">
              <span className="flex items-center gap-1">
                <IconCommand size={12} /> palette
              </span>
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
