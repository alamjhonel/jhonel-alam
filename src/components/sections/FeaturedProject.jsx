import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { featuredProject as fp, cmdb } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import DecryptText from '../common/DecryptText.jsx'
import Reveal from '../common/Reveal.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import {
  IconLayers,
  IconShield,
  IconTerminal,
  IconSearch,
  IconSpark,
  IconArrowRight,
  IconDatabase,
  IconGrid,
  IconEye,
  IconPulse,
  IconMail,
} from '../common/Icons.jsx'

const TABS = [
  { id: 'assets', label: 'Assets', icon: IconLayers },
  { id: 'firewalls', label: 'Firewalls', icon: IconShield },
  { id: 'terminal', label: 'Terminal', icon: IconTerminal },
]

const STATUS_STYLES = {
  online: { dot: 'bg-emerald-400', text: 'text-emerald-300', label: 'online' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-300', label: 'degraded' },
  offline: { dot: 'bg-rose-400', text: 'text-rose-300', label: 'offline' },
}

const CMDB_TABS = [
  { id: 'classes', label: 'Assets', icon: IconLayers },
  { id: 'deps', label: 'Dependencies', icon: IconGrid },
  { id: 'audit', label: 'Audit', icon: IconEye },
]

const IMPACT_STYLES = {
  critical: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
  high: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  low: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
}

const AUDIT_STYLES = {
  create: 'text-emerald-300',
  update: 'text-accent',
  retire: 'text-rose-300',
  alert: 'text-amber-300',
}

export default function FeaturedProject() {
  const [tab, setTab] = useState('assets')
  const sectionRef = useRef(null)

  // Nudge the background denser while this showcase is in view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.dataset.bgDensity = entry.isIntersecting ? '1.35' : '1'
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      document.body.dataset.bgDensity = '1'
    }
  }, [])

  return (
    <section id="project" ref={sectionRef} className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={4} kicker={fp.kicker} title={fp.name} />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Left: narrative */}
          <Reveal className="space-y-6">
            <p className="text-base leading-relaxed text-ink-soft">{fp.blurb}</p>

            <div className="space-y-3">
              {fp.capabilities.map((c) => (
                <div key={c.title} className="rounded-lg border border-white/10 bg-base-800/50 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <h4 className="font-mono text-sm text-ink">{c.title}</h4>
                  </div>
                  <p className="mt-1 pl-3.5 text-sm text-ink-faint">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
              <div className="mb-2 flex items-center gap-2">
                <IconSpark size={15} className="text-accent" />
                <span className="mono-label text-accent">why i built this</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{fp.why}</p>
            </div>

            <div>
              <span className="mono-label text-ink-faint">stack</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fp.stack.map((s) => (
                  <span key={s} className="chip border-white/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: mock dashboard */}
          <Reveal delay={0.1}>
            <div className="panel overflow-hidden shadow-panel">
              {/* window chrome */}
              <div className="flex items-center justify-between border-b border-white/10 bg-base-700/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="font-mono text-[11px] text-ink-faint">netsec-console — internal</span>
                <span className="font-mono text-[10px] text-ink-ghost">v0.9</span>
              </div>

              {/* tabs */}
              <div className="flex border-b border-white/10" role="tablist" aria-label="Dashboard views">
                {TABS.map((t) => {
                  const Icon = t.icon
                  const on = tab === t.id
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={on}
                      onClick={() => setTab(t.id)}
                      className={`relative flex items-center gap-2 px-4 py-3 font-mono text-xs transition-colors ${
                        on ? 'text-accent' : 'text-ink-faint hover:text-ink'
                      }`}
                    >
                      <Icon size={15} />
                      {t.label}
                      {on && (
                        <motion.span
                          layoutId="fp-tab"
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="min-h-[360px] p-4">
                <AnimatePresence mode="wait">
                  {tab === 'assets' && <AssetsTab key="assets" />}
                  {tab === 'firewalls' && <FirewallsTab key="firewalls" />}
                  {tab === 'terminal' && <SshTab key="terminal" />}
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-ink-ghost">
              <span className="text-accent">//</span> interactive showcase of the console UI —
              sample values shown in place of live device data.
            </p>
          </Reveal>
        </div>

        {/* ===================== CMDB ===================== */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <IconDatabase size={20} className="shrink-0 text-accent" />
            <div className="min-w-0">
              <span className="mono-label">{cmdb.kicker}</span>
              <DecryptText
                as="h3"
                text={cmdb.name}
                className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
              />
            </div>
            <span className="ml-1 hidden h-px flex-1 bg-gradient-to-r from-white/15 to-transparent sm:block" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
            {/* Left: narrative */}
            <Reveal className="space-y-6">
              <p className="text-base leading-relaxed text-ink-soft">{cmdb.blurb}</p>

              <div className="space-y-3">
                {cmdb.capabilities.map((c) => (
                  <div key={c.title} className="rounded-lg border border-white/10 bg-base-800/50 p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <h4 className="font-mono text-sm text-ink">{c.title}</h4>
                    </div>
                    <p className="mt-1 pl-3.5 text-sm text-ink-faint">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <IconSpark size={15} className="text-accent" />
                  <span className="mono-label text-accent">why i built this</span>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">{cmdb.why}</p>
              </div>

              <div>
                <span className="mono-label text-ink-faint">stack</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cmdb.stack.map((s) => (
                    <span key={s} className="chip border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right: CMDB dashboard */}
            <Reveal delay={0.1}>
              <CmdbDashboard />
              <p className="mt-3 text-center font-mono text-[11px] text-ink-ghost">
                <span className="text-accent">//</span> interactive showcase of the CMDB — sample
                configuration items shown in place of live records.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function TabWrap({ children }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

function AssetsTab() {
  const [q, setQ] = useState('')
  const rows = fp.assets.filter((a) =>
    [a.host, a.ip, a.type, a.vendor, a.site].join(' ').toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <TabWrap>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-base-700/50 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          <IconLayers size={13} className="text-accent" /> parsed: inventory.xlsx · {fp.assets.length} hosts
        </span>
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-base-900/50 px-2.5">
          <IconSearch size={14} className="text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="filter hosts…"
            className="w-32 bg-transparent py-1.5 font-mono text-base text-ink placeholder:text-ink-ghost focus:outline-none sm:w-36 sm:text-xs"
            aria-label="Filter assets"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left text-ink-ghost">
              <th className="whitespace-nowrap py-2 pr-3 font-medium">host</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">ip</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">type</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">vendor</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const s = STATUS_STYLES[a.status]
              return (
                <motion.tr
                  key={a.host}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 text-ink-soft hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap py-2 pr-3 text-ink">{a.host}</td>
                  <td className="whitespace-nowrap py-2 pr-3">{a.ip}</td>
                  <td className="whitespace-nowrap py-2 pr-3">{a.type}</td>
                  <td className="whitespace-nowrap py-2 pr-3">{a.vendor}</td>
                  <td className="whitespace-nowrap py-2 pr-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className={s.text}>{s.label}</span>
                    </span>
                  </td>
                </motion.tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-faint">
                  no hosts match “{q}”
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TabWrap>
  )
}

function FirewallsTab() {
  return (
    <TabWrap>
      <div className="grid gap-3 sm:grid-cols-2">
        {fp.firewalls.map((f, i) => {
          const watch = f.state === 'watch'
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg border border-white/10 bg-base-800/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-mono text-sm text-ink">{f.name}</h4>
                  <p className="font-mono text-[11px] text-ink-faint">{f.vendor}</p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                    watch ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/15 text-emerald-300'
                  }`}
                >
                  {f.state}
                </span>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between font-mono text-[10px] text-ink-faint">
                  <span>health</span>
                  <span className={watch ? 'text-amber-300' : 'text-accent'}>{f.health}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className={`h-full rounded-full ${watch ? 'bg-amber-400/80' : 'bg-accent/80'}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.health}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.06 }}
                  />
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>
                  <dt className="text-ink-ghost">rules</dt>
                  <dd className="text-ink">{f.rules}</dd>
                </div>
                <div>
                  <dt className="text-ink-ghost">alerts</dt>
                  <dd className={f.alerts > 8 ? 'text-amber-300' : 'text-ink'}>{f.alerts}</dd>
                </div>
                <div>
                  <dt className="text-ink-ghost">tput</dt>
                  <dd className="text-ink">{f.throughput}</dd>
                </div>
              </dl>
            </motion.div>
          )
        })}
      </div>
    </TabWrap>
  )
}

function SshTab() {
  const cmds = fp.sshCommands
  const examples = Object.keys(cmds)
  const [lines, setLines] = useState([
    { type: 'sys', text: 'Connecting to core-fw-01 (10.10.0.1) via SSH …' },
    { type: 'sys', text: 'Authenticated. Type a command or click an example below.' },
  ])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  function run(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    const next = [{ type: 'cmd', text: cmd }]
    if (cmd === 'clear') {
      setLines([])
      setInput('')
      return
    }
    if (cmds[cmd]) {
      cmds[cmd].forEach((l) => next.push({ type: 'out', text: l }))
    } else if (cmd === 'help') {
      next.push({ type: 'out', text: 'available (demo): ' + examples.join(', ') + ', clear' })
    } else {
      next.push({ type: 'err', text: `-sh: ${cmd}: command not recognized in demo sandbox` })
    }
    setLines((prev) => [...prev, ...next])
    setInput('')
  }

  return (
    <TabWrap>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {examples.map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="chip border-white/10 hover:border-accent/40 hover:text-accent"
          >
            {c}
          </button>
        ))}
      </div>
      <div
        ref={bodyRef}
        className="h-[260px] overflow-y-auto rounded-lg border border-white/10 bg-base-900/70 p-3 font-mono text-[13px] leading-relaxed sm:text-xs"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === 'cmd'
                ? 'text-ink'
                : l.type === 'err'
                  ? 'text-rose-300'
                  : l.type === 'sys'
                    ? 'text-ink-faint'
                    : 'text-ink-soft'
            }
          >
            {l.type === 'cmd' && <span className="text-accent">core-fw-01# </span>}
            {l.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(input)
        }}
        className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-base-900/70 px-3"
      >
        <span className="font-mono text-xs text-accent">core-fw-01#</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="show interfaces"
          className="w-full bg-transparent py-2.5 font-mono text-base text-ink placeholder:text-ink-ghost focus:outline-none sm:text-xs"
          aria-label="SSH command input"
          spellCheck="false"
          autoComplete="off"
        />
        <button type="submit" className="text-ink-faint transition-colors hover:text-accent" aria-label="Run command">
          <IconArrowRight size={16} />
        </button>
      </form>
    </TabWrap>
  )
}

function CmdbDashboard() {
  const [tab, setTab] = useState('classes')
  const total = cmdb.classes.reduce((sum, c) => sum + c.count, 0)
  return (
    <div className="panel overflow-hidden shadow-panel">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-white/10 bg-base-700/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[11px] text-ink-faint">cmdb-console — internal</span>
        <span className="font-mono text-[10px] text-ink-ghost">{total} CIs</span>
      </div>

      {/* tabs */}
      <div className="flex border-b border-white/10" role="tablist" aria-label="CMDB views">
        {CMDB_TABS.map((t) => {
          const Icon = t.icon
          const on = tab === t.id
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-3 font-mono text-xs transition-colors ${
                on ? 'text-accent' : 'text-ink-faint hover:text-ink'
              }`}
            >
              <Icon size={15} />
              {t.label}
              {on && (
                <motion.span layoutId="cmdb-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
              )}
            </button>
          )
        })}
      </div>

      <div className="min-h-[360px] p-4">
        <AnimatePresence mode="wait">
          {tab === 'classes' && <CmdbClassesTab key="classes" total={total} />}
          {tab === 'deps' && <CmdbDepsTab key="deps" />}
          {tab === 'audit' && <CmdbAuditTab key="audit" />}
        </AnimatePresence>
      </div>

      {/* integrations footer */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 bg-base-900/40 px-4 py-2.5">
        <span className="mono-label text-ink-ghost">integrations</span>
        {cmdb.integrations.map((intg) => {
          const Icon = intg.name === 'SMTP' ? IconMail : IconPulse
          return (
            <span
              key={intg.name}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-faint"
            >
              <Icon size={13} className="text-accent" />
              {intg.name}
              <span className="text-ink-ghost">· {intg.proto}</span>
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {intg.status}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CmdbClassesTab({ total }) {
  return (
    <TabWrap>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-base-700/50 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          <IconDatabase size={13} className="text-accent" /> {cmdb.classes.length} classes · {total} configuration items
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cmdb.classes.map((c, i) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-white/10 bg-base-800/50 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded border border-accent/25 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                {c.code}
              </span>
              <span className="font-mono text-2xl text-ink">{c.count}</span>
            </div>
            <h4 className="mt-2 text-sm text-ink-soft">{c.name}</h4>
          </motion.div>
        ))}
      </div>
    </TabWrap>
  )
}

function CmdbDepsTab() {
  const [sel, setSel] = useState(cmdb.dependencies[0].ci)
  const node = cmdb.dependencies.find((d) => d.ci === sel) ?? cmdb.dependencies[0]
  const impact = IMPACT_STYLES[node.impact]
  return (
    <TabWrap>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {cmdb.dependencies.map((d) => (
          <button
            key={d.ci}
            onClick={() => setSel(d.ci)}
            className={`chip ${
              d.ci === sel
                ? 'border-accent/40 text-accent'
                : 'border-white/10 hover:border-accent/40 hover:text-accent'
            }`}
          >
            {d.ci}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-base-900/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-mono text-sm text-ink">{node.ci}</h4>
            <p className="font-mono text-[11px] text-ink-faint">
              {node.type} · {node.rack}
            </p>
          </div>
          <span className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${impact}`}>
            {node.impact} impact
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mono-label text-ink-ghost">depends on</span>
            <ul className="mt-2 space-y-1.5">
              {node.dependsOn.map((x) => (
                <li key={x} className="flex items-center gap-2 font-mono text-xs text-ink-soft">
                  <IconArrowRight size={12} className="rotate-180 text-rose-300" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="mono-label text-ink-ghost">supports</span>
            <ul className="mt-2 space-y-1.5">
              {node.supports.map((x) => (
                <li key={x} className="flex items-center gap-2 font-mono text-xs text-ink-soft">
                  <IconArrowRight size={12} className="text-emerald-300" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-lg border border-accent/25 bg-accent/[0.06] p-3 text-xs leading-relaxed text-ink-soft">
        <span className="font-mono text-accent">impact analysis:</span> if{' '}
        <span className="font-mono text-ink">{node.ci}</span> goes down,{' '}
        <span className="font-mono text-ink">{node.supports.length}</span> downstream{' '}
        {node.supports.length === 1 ? 'item is' : 'items are'} affected — {node.supports.join(', ')}.
      </p>
    </TabWrap>
  )
}

function CmdbAuditTab() {
  return (
    <TabWrap>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-base-700/50 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          <IconEye size={13} className="text-accent" /> immutable change log · {cmdb.audit.length} recent events
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left text-ink-ghost">
              <th className="whitespace-nowrap py-2 pr-3 font-medium">time</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">actor</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">action</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">ci</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">detail</th>
            </tr>
          </thead>
          <tbody>
            {cmdb.audit.map((a, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 text-ink-soft hover:bg-white/[0.03]"
              >
                <td className="whitespace-nowrap py-2 pr-3 text-ink-faint">{a.ts}</td>
                <td className="whitespace-nowrap py-2 pr-3">{a.actor}</td>
                <td className={`whitespace-nowrap py-2 pr-3 uppercase ${AUDIT_STYLES[a.action]}`}>{a.action}</td>
                <td className="whitespace-nowrap py-2 pr-3 text-ink">{a.ci}</td>
                <td className="whitespace-nowrap py-2 pr-3 text-ink-faint">{a.detail}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </TabWrap>
  )
}
