import { motion } from 'framer-motion'
import { profile } from '../../data/content.js'
import { scrollToSection } from '../../utils/scroll.js'
import DecryptText from '../common/DecryptText.jsx'
import TypeCycle from '../common/TypeCycle.jsx'
import CopyChip from '../common/CopyChip.jsx'
import { IconPhone, IconMail, IconArrowRight, IconShield, IconDownload } from '../common/Icons.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const STATUS = [
  ['session', 'ACTIVE'],
  ['clearance', 'OPERATOR'],
  ['node', 'MNL-01'],
  ['threat_level', 'NOMINAL'],
]

export default function Hero() {
  const reduced = useReducedMotion()
  const Mv = reduced ? 'div' : motion.div

  return (
    <section id="hero" className="relative flex min-h-screen items-center pt-24 pb-16">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Mv
          variants={reduced ? undefined : container}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'show'}
        >
          <Mv variants={reduced ? undefined : item} className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-node" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              secure session established
            </span>
          </Mv>

          <Mv variants={reduced ? undefined : item}>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              <DecryptText text="Jhonel" duration={700} />{' '}
              <span className="text-accent text-glow">
                <DecryptText text="Alam" duration={900} delay={150} />
              </span>
            </h1>
          </Mv>

          <Mv variants={reduced ? undefined : item} className="mt-4 space-y-1.5">
            <p className="font-mono text-sm text-ink-soft sm:text-base">
              <span className="text-accent">$</span> {profile.title}
            </p>
            <p className="font-mono text-sm text-accent sm:text-base">
              <span className="text-ink-faint">&gt;</span>{' '}
              <TypeCycle words={profile.roles} className="text-glow" />
            </p>
          </Mv>

          <Mv variants={reduced ? undefined : item} className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {profile.tagline}
          </Mv>

          <Mv variants={reduced ? undefined : item} className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToSection('experience')} className="btn-primary">
              View Experience <IconArrowRight size={16} />
            </button>
            <a href={profile.cv} download className="btn-ghost">
              <IconDownload size={16} /> Download CV
            </a>
            <button type="button" onClick={() => scrollToSection('contact')} className="btn-ghost">
              Contact
            </button>
          </Mv>

          <Mv variants={reduced ? undefined : item} className="mt-8 flex flex-wrap gap-2.5">
            <CopyChip icon={IconPhone} label="phone" value={profile.phone} href={`tel:${profile.phone}`} copyLabel="phone" />
            <CopyChip icon={IconMail} label="email" value={profile.email} href={`mailto:${profile.email}`} copyLabel="email" />
          </Mv>
        </Mv>

        {/* Telemetry panel */}
        <Mv
          initial={reduced ? undefined : { opacity: 0, x: 24 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={reduced ? undefined : { duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="relative"
        >
          <div className="panel relative overflow-hidden p-5 shadow-panel">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconShield size={16} className="text-accent" />
                  <span className="mono-label">operator.readout</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </div>
              </div>

              <dl className="space-y-2.5 font-mono text-xs">
                {STATUS.map(([k, v]) => (
                  <div key={k} className="flex min-w-0 items-center gap-3">
                    <dt className="shrink-0 whitespace-nowrap text-ink-faint">{k}</dt>
                    <span className="h-px min-w-0 flex-1 bg-white/[0.08]" />
                    <dd className="shrink-0 text-accent">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 space-y-2">
                {[76, 54, 88].map((w, i) => (
                  <div key={i} className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <Mv
                      className="h-full rounded-full bg-accent/70"
                      initial={reduced ? undefined : { width: 0 }}
                      animate={reduced ? undefined : { width: `${w}%` }}
                      style={reduced ? { width: `${w}%` } : undefined}
                      transition={reduced ? undefined : { duration: 1, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                ))}
              </div>

              <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-faint">
                <span className="text-accent">//</span> telemetry is decorative — no live data is
                collected or transmitted from this page.
              </p>
            </div>
          </div>
        </Mv>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-ghost transition-colors hover:text-accent sm:flex"
      >
        scroll
        <span className="h-8 w-px bg-gradient-to-b from-accent/60 to-transparent" />
      </button>
    </section>
  )
}
