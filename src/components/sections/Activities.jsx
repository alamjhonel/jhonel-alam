import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { activities } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import {
  IconTerminal,
  IconFlag,
  IconEye,
  IconBug,
  IconTarget,
  IconChevron,
  IconRadar,
  IconSpark,
} from '../common/Icons.jsx'

const ICONS = {
  pentest: IconBug,
  vapt: IconTarget,
  htb: IconTerminal,
  ctf: IconFlag,
  osint: IconEye,
}

const PHASES = {
  pentest: [
    { label: 'Reconnaissance', note: 'OSINT, port scans, service enumeration.' },
    { label: 'Enumeration', note: 'Probe services, directory brute, AD recon.' },
    { label: 'Exploitation', note: 'Weaponize CVEs, misconfigs, weak creds.' },
    { label: 'Post-Exploitation', note: 'Privesc, lateral movement, persistence.' },
    { label: 'Reporting', note: 'Risk-rated findings with reproduction steps.' },
  ],
  vapt: [
    { label: 'Discovery', note: 'Inventory internal hosts, services, trusts.' },
    { label: 'Vulnerability Scan', note: 'Automated scanning + manual triage.' },
    { label: 'AD Audit', note: 'Kerberoasting, ACLs, GPO gaps, LAPS review.' },
    { label: 'Segmentation Check', note: 'Validate VLAN / zone isolation.' },
    { label: 'Remediation Plan', note: 'Prioritized fixes by CVSS + impact.' },
  ],
  htb: [
    { label: 'Active Machines', note: 'Weekly boxes across Windows / Linux.' },
    { label: 'Pro Labs', note: 'Enterprise-style segmented networks.' },
    { label: 'Challenges', note: 'Pwn, web, crypto, reversing tracks.' },
  ],
  ctf: [
    { label: 'Crypto', note: 'Classical + modern cipher challenges.' },
    { label: 'Forensics', note: 'Disk / memory / packet capture analysis.' },
    { label: 'Reversing', note: 'Binary analysis, unpacking, patching.' },
    { label: 'Web', note: 'OWASP Top 10 under CTF rules.' },
  ],
  osint: [
    { label: 'Passive Recon', note: 'DNS, WHOIS, certificate transparency.' },
    { label: 'Social Mapping', note: 'Employee, org, and footprint intel.' },
    { label: 'Threat Intel', note: 'IOC enrichment and reputation lookups.' },
  ],
}

export default function Activities() {
  const [openId, setOpenId] = useState(null)

  return (
    <section id="activities" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={6} kicker="Field Exercises" title="Technical activities" />
        <p className="mb-8 -mt-4 max-w-2xl font-mono text-xs text-ink-faint">
          <span className="text-accent">//</span> ongoing practice that keeps offense and defense
          sharp. click any card to unfold the workflow.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {activities.map((a, i) => {
            const Icon = ICONS[a.id] ?? IconTerminal
            const isOpen = openId === a.id
            const phases = PHASES[a.id] ?? []
            return (
              <Reveal key={a.id} delay={i * 0.05} className="h-full">
                <motion.article
                  layout
                  onClick={() => setOpenId(isOpen ? null : a.id)}
                  className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-base-800/50 p-4 transition-colors sm:p-5 ${
                    isOpen
                      ? 'border-accent/50 shadow-glow'
                      : 'border-white/10 hover:border-accent/40 hover:shadow-glow'
                  }`}
                >
                  <span className="absolute right-3 top-3 font-mono text-[10px] text-ink-ghost sm:right-4 sm:top-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors sm:h-11 sm:w-11 ${
                      isOpen
                        ? 'border-accent/60 bg-accent/10 text-accent'
                        : 'border-white/10 text-accent group-hover:border-accent/50'
                    }`}
                  >
                    <Icon size={20} className="sm:text-[22px]" />
                  </span>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-ink sm:text-base">{a.title}</h3>
                      <p className="mt-0.5 font-mono text-[11px] text-accent sm:text-xs">{a.platform}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 shrink-0 text-ink-faint"
                    >
                      <IconChevron size={14} className="sm:text-[16px]" />
                    </motion.span>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-ink-soft sm:text-sm">{a.desc}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <span key={t} className="chip border-white/10 px-2 py-1 text-[10px] text-ink-faint sm:text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && phases.length > 0 && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                          <div className="flex items-center gap-1.5">
                            <IconRadar size={13} className="text-accent" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost">
                              Workflow
                            </span>
                          </div>
                          {phases.map((p, pi) => (
                            <div
                              key={p.label}
                              className="flex items-start gap-2.5 rounded-md border border-white/[0.06] bg-base-900/50 p-2.5"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-accent/30 bg-accent/10 font-mono text-[10px] text-accent">
                                {pi + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-ink">{p.label}</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-faint">
                                  {p.note}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/10 px-2 py-1 font-mono text-[10px] text-accent">
                            <IconSpark size={11} /> hands-on · not just theory
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent transition-opacity duration-300 ${
                      isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
