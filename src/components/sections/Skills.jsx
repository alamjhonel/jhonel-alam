import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { skillGroups } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import { IconPulse, IconShield, IconLock, IconEye } from '../common/Icons.jsx'

const ICONS = {
  threat: IconPulse,
  hardening: IconShield,
  identity: IconLock,
  monitoring: IconEye,
}

export default function Skills() {
  const [pinned, setPinned] = useState(null)
  const [hovered, setHovered] = useState(null)
  const shown = pinned ?? hovered

  return (
    <section id="skills" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading
          index={2}
          kicker="Capability Matrix"
          title="Core technical skills"
        />
        <p className="mb-8 -mt-4 max-w-2xl font-mono text-xs text-ink-faint">
          <span className="text-accent">//</span> hover, tap, or focus a domain to decrypt the
          tooling and a real-world application.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g, i) => {
            const Icon = ICONS[g.id] ?? IconShield
            const isOpen = shown === g.id
            return (
              <Reveal key={g.id} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => setPinned((p) => (p === g.id ? null : g.id))}
                  onMouseEnter={() => setHovered(g.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(g.id)}
                  onBlur={() => setHovered(null)}
                  aria-expanded={isOpen}
                  className={`group relative flex w-full flex-col overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
                    isOpen
                      ? 'border-accent/50 bg-base-700/60 shadow-glow'
                      : 'border-white/10 bg-base-800/50 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                          isOpen ? 'border-accent/50 text-accent' : 'border-white/10 text-ink-soft'
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-ink">{g.label}</h3>
                        <p className="mt-0.5 text-sm text-ink-faint">{g.summary}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-ink-ghost">{g.code}</span>
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 font-mono text-xs text-ink-soft">
                        <span className="mt-1 text-accent">▸</span>
                        {it}
                      </li>
                    ))}
                  </ul>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {g.tools.map((t) => (
                              <span key={t} className="chip border-accent/25 text-accent">
                                {t}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-ink-soft">
                            <span className="mono-label mr-2 text-accent">field&nbsp;note</span>
                            {g.example}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isOpen && (
                    <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-ghost transition-colors group-hover:text-accent">
                      + decrypt details
                    </span>
                  )}
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
