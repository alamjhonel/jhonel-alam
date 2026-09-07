import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, skillGroups, experience } from '../../data/content.js'
import { useToast } from '../../context/ToastContext.jsx'
import { scrollToSection } from '../../utils/scroll.js'
import { IconTerminal, IconClose } from '../common/Icons.jsx'

const PROMPT = 'visitor@ciph3r:~$'

// Commands surfaced as quick-tap chips (also the "public" whitelist).
const QUICK = ['whoami', 'skills', 'experience', 'contact', 'help']

const INTRO = [
  { type: 'sys', text: 'operator-shell v1.0 — simulated sandbox (no real system access)' },
  { type: 'sys', text: 'type "help" for commands, or tap one below.' },
]

/**
 * Global mock terminal. Controlled via `open` / `onOpenChange` so the command
 * palette (and the floating launcher) can drive it. Every response is scripted
 * from the site content — it is clearly a simulation, not a real shell.
 */
export default function TerminalWidget({ open, onOpenChange }) {
  const { toast } = useToast()
  const [lines, setLines] = useState(INTRO)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  const close = () => onOpenChange?.(false)

  // Scripted command resolver. Returns { lines, after? }.
  const resolve = useMemo(() => {
    return (cmd) => {
      switch (cmd) {
        case 'help':
          return {
            lines: [
              { type: 'out', text: 'available commands:' },
              { type: 'out', text: '  whoami        operator identity' },
              { type: 'out', text: '  skills        core skill domains' },
              { type: 'out', text: '  experience    work history' },
              { type: 'out', text: '  contact       reach me' },
              { type: 'out', text: '  sudo hire-me  ;)' },
              { type: 'out', text: '  clear         wipe the screen' },
              { type: 'out', text: '  exit          close this shell' },
              { type: 'sys', text: 'tip: press "/" anywhere for the command palette.' },
            ],
          }
        case 'whoami':
          return {
            lines: [
              { type: 'accent', text: profile.name },
              { type: 'out', text: profile.title },
              { type: 'sys', text: profile.location },
            ],
          }
        case 'skills':
          return {
            lines: skillGroups.flatMap((g) => [
              { type: 'accent', text: `${g.code}  ${g.label}` },
              { type: 'sys', text: `   └ ${g.tools.join(', ')}` },
            ]),
          }
        case 'experience':
          return {
            lines: experience.flatMap((e) => [
              { type: 'accent', text: e.role },
              { type: 'sys', text: `   ${e.org} · ${e.period}` },
            ]),
          }
        case 'contact':
          return {
            lines: [
              { type: 'out', text: `email      ${profile.email}` },
              { type: 'out', text: `phone      ${profile.phone}` },
            ],
          }
        case 'sudo hire-me':
          return {
            lines: [
              { type: 'sys', text: '[sudo] password for recruiter: ********' },
              { type: 'ok', text: 'access granted — provisioning offer letter…' },
              { type: 'out', text: `${profile.name.split(' ')[0]} is open to security-engineering & blue-team roles.` },
              { type: 'accent', text: '→ jumping to contact. send a signal.' },
            ],
            after: () => {
              toast("Access granted — let's talk.")
              window.setTimeout(() => {
                close()
                scrollToSection('contact')
              }, 700)
            },
          }
        case 'sudo':
          return { lines: [{ type: 'err', text: 'usage: sudo hire-me   (nice try, operator)' }] }
        case 'exit':
        case 'quit':
          return { lines: [{ type: 'sys', text: 'closing shell…' }], after: () => window.setTimeout(close, 300) }
        default:
          return {
            lines: [
              { type: 'err', text: `command not found: ${cmd}` },
              { type: 'sys', text: 'type "help" to see what this sandbox understands.' },
            ],
          }
      }
    }
  }, [toast]) // eslint-disable-line react-hooks/exhaustive-deps

  function run(raw) {
    const cmd = raw.trim()
    setInput('')
    setHistIdx(-1)
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 40))
    if (cmd.toLowerCase() === 'clear') {
      setLines([])
      return
    }
    const res = resolve(cmd.toLowerCase())
    setLines((prev) => [...prev, { type: 'cmd', text: cmd }, ...res.lines])
    res.after?.()
  }

  // Autofocus + scroll to bottom when opened / on new output
  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60)
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, open])

  // Lock body scroll while the terminal is open so the page underneath
  // doesn't scroll when the user tries to scroll the terminal output.
  // We use overflow:hidden on <html> (not the position:fixed trick)
  // so window.scrollY stays correct — the terminal's "hire-me" command
  // scrolls to the contact section and needs the real scrollY.
  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [open])

  // ESC closes the shell
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function onInputKey(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((i) => {
        const next = Math.min(i + 1, history.length - 1)
        if (history[next] !== undefined) setInput(history[next])
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((i) => {
        const next = Math.max(i - 1, -1)
        setInput(next === -1 ? '' : history[next] ?? '')
        return next
      })
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => onOpenChange?.(!open)}
        aria-label={open ? 'Close mock terminal' : 'Open mock terminal'}
        aria-expanded={open}
        className="group fixed bottom-5 right-5 z-[115] inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-base-800 text-accent shadow-panel transition-colors hover:bg-accent/15 focus:outline-none sm:bg-base-800/90 sm:backdrop-blur"
      >
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent shadow-glow animate-pulse-node" aria-hidden="true" />
        <IconTerminal size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-4 bottom-20 z-[130] flex justify-end sm:inset-x-auto sm:right-5"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-label="Mock terminal (simulated)"
          >
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-base-800 shadow-panel sm:backdrop-blur-sm">
              {/* chrome */}
              <div className="flex items-center justify-between border-b border-white/10 bg-base-700/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-2 font-mono text-[11px] text-ink-faint">operator-shell — simulated</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close terminal"
                  className="text-ink-faint transition-colors hover:text-accent"
                >
                  <IconClose size={16} />
                </button>
              </div>

              {/* output */}
              <div
                ref={bodyRef}
                className="h-[320px] overflow-y-auto bg-base-900/70 p-3 font-mono text-[13px] leading-relaxed sm:text-xs"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l, i) => (
                  <Line key={i} line={l} />
                ))}
              </div>

              {/* quick commands */}
              <div className="flex flex-wrap gap-1.5 border-t border-white/10 bg-base-800/40 px-3 py-2">
                {QUICK.map((c) => (
                  <button
                    key={c}
                    onClick={() => run(c)}
                    className="chip border-white/10 py-1 hover:border-accent/40 hover:text-accent"
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  run(input)
                }}
                className="flex items-center gap-2 border-t border-white/10 bg-base-900/70 px-3"
              >
                <span className="font-mono text-xs text-accent">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="whoami"
                  className="w-full bg-transparent py-2.5 font-mono text-base text-ink placeholder:text-ink-ghost focus:outline-none sm:text-xs"
                  aria-label="Terminal command input (simulated)"
                  spellCheck="false"
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const LINE_STYLES = {
  cmd: 'text-ink',
  out: 'text-ink-soft',
  sys: 'text-ink-faint',
  err: 'text-rose-300',
  ok: 'text-emerald-300',
  accent: 'text-accent',
}

function Line({ line }) {
  return (
    <div className={`whitespace-pre-wrap break-words ${LINE_STYLES[line.type] ?? 'text-ink-soft'}`}>
      {line.type === 'cmd' && <span className="text-accent">{PROMPT} </span>}
      {line.text}
    </div>
  )
}
