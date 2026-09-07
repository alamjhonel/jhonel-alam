import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experience, tools } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import {
  IconChevron,
  IconCpu,
  IconBolt,
  IconShield,
  IconSpark,
  IconArrowRight,
  IconLayers,
  IconLock,
  IconPulse,
  IconEye,
  IconDatabase,
} from '../common/Icons.jsx'

const TOOL_ICON = {
  'Palo Alto': IconShield,
  Fortinet: IconShield,
  FortiSIEM: IconPulse,
  'CrowdStrike NG SIEM': IconPulse,
  'CrowdStrike Falcon': IconEye,
  'ManageEngine Endpoint Central': IconLock,
  Cloudflare: IconLayers,
  'Active Directory': IconDatabase,
  IAM: IconLock,
}

const PROFICIENCY = {
  'Palo Alto': 'Advanced',
  Fortinet: 'Advanced',
  FortiSIEM: 'Proficient',
  'CrowdStrike NG SIEM': 'Proficient',
  'CrowdStrike Falcon': 'Advanced',
  'ManageEngine Endpoint Central': 'Proficient',
  Cloudflare: 'Proficient',
  'Active Directory': 'Advanced',
  IAM: 'Advanced',
}

const PROFICIENCY_PCT = {
  Advanced: 92,
  Proficient: 78,
  Working: 60,
}

const TOOL_FEATURES = {
  'Palo Alto': [
    'App-ID based policy enforcement & application visibility',
    'Threat prevention — IPS, anti-malware, DNS signatures',
    'Zone-based segmentation & inter-zone policy tuning',
    'NAT, VPN (IPsec / GlobalProtect), and HA failover pairs',
  ],
  Fortinet: [
    'FortiGate firewall policy, objects, and address groups',
    'IPsec & SSL VPN for branch + remote worker access',
    'UTM stack: AV, IPS, application control, web filtering',
    'SD-WAN steering and multi-site traffic engineering',
  ],
  FortiSIEM: [
    'Log ingestion & multi-tenant parsing across firewalls + EDR',
    'Rule-based alerting & correlation for incident detection',
    'Incident ticketing, assignment, and audit trail',
    'Asset auto-discovery & CMDB enrichment',
  ],
  'CrowdStrike NG SIEM': [
    'Cross-telemetry correlation (EDR + identity + cloud events)',
    'Threat graph detections and IOC matching',
    'Hunting queries and scheduled analytics searches',
    'Dashboards for SOC posture & executive reporting',
  ],
  'CrowdStrike Falcon': [
    'Endpoint detection & response — real-time telemetry',
    'Threat hunts across process, network, and file activity',
    'Containment policy — host isolation with one click',
    'Prevention tuning: allow/deny, IOA rules, exploit blocking',
  ],
  'ManageEngine Endpoint Central': [
    'OS & third-party patch management — automation + approvals',
    'Data Loss Prevention — device control + file classification',
    'Application control, blacklisting, and software metering',
    'Vulnerability scans with remediation recommendations',
  ],
  Cloudflare: [
    'WAF managed rulesets and custom rule writing',
    'Rate limiting, bot fight mode, and L7 DDoS mitigation',
    'DNS security (DNSSEC, 0-RTT, cache rules)',
    'Access + Zero Trust tunnels for internal apps',
  ],
  'Active Directory': [
    'Domain design, OU structure, and GPO hardening (CIS / MBSS)',
    'AD DS replication, FSMO placement, and site topology',
    'Group Policy — security options, user rights, audit policy',
    'Backup / restore, offline join, and lifecycle automation',
  ],
  IAM: [
    'AD FS farm build — claims rules + relying-party trusts',
    'SAML 2.0 federation for SaaS and internal applications',
    'SSO design — one identity plane for all apps',
    'MFA integration, conditional access, and session controls',
  ],
}

const TOOL_DEPLOYED = {
  'Palo Alto': 'Philtrust Bank — perimeter firewall pair, HQ + DR',
  Fortinet: 'Philtrust Bank — branch-edge appliances, VPN concentrator',
  FortiSIEM: 'Philtrust Bank — SOC SIEM, cross-device correlation',
  'CrowdStrike NG SIEM': 'Philtrust Bank — EDR + identity telemetry ingestion',
  'CrowdStrike Falcon': 'Philtrust Bank — enterprise EDR rollout',
  'ManageEngine Endpoint Central': 'Philtrust Bank — endpoint hardening & patching',
  Cloudflare: 'Philtrust Bank — public-facing edge protection',
  'Active Directory': 'Philtrust Bank — bank-wide domain built from scratch',
  IAM: 'Philtrust Bank — AD FS, SAML, and SSO federation',
}

export default function Experience() {
  const [openId, setOpenId] = useState(experience[0]?.id ?? null)
  const [activeTool, setActiveTool] = useState(null)
  const [toolFilter, setToolFilter] = useState('All')

  const toolCategories = useMemo(() => {
    const set = new Set(['All'])
    tools.forEach((t) => set.add(t.category))
    return Array.from(set)
  }, [])

  const filteredTools = useMemo(
    () => (toolFilter === 'All' ? tools : tools.filter((t) => t.category === toolFilter)),
    [toolFilter],
  )

  return (
    <section id="experience" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={3} kicker="Operational History" title="Experience" />

        <div className="relative">
          {/* timeline spine */}
          <div
            className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-white/10 to-transparent sm:left-[19px]"
            aria-hidden="true"
          />

          <ul className="space-y-4">
            {experience.map((job, i) => {
              const isOpen = openId === job.id
              return (
                <Reveal as="li" key={job.id} delay={i * 0.05} className="relative pl-10 sm:pl-14">
                  {/* node */}
                  <span
                    className={`absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${
                      isOpen ? 'border-accent bg-accent/15' : 'border-white/15 bg-base-800'
                    }`}
                    aria-hidden="true"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-accent animate-pulse-node' : 'bg-white/30'}`} />
                  </span>

                  <div
                    className={`panel overflow-hidden transition-colors ${
                      isOpen ? 'border-accent/40' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : job.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-3 p-4 text-left sm:gap-4 sm:p-5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="min-w-0 text-base font-semibold text-ink sm:text-lg">{job.role}</h3>
                          <span className="shrink-0 rounded border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                            {job.tag}
                          </span>
                        </div>
                        <p className="mt-1 truncate font-mono text-sm text-accent">{job.org}</p>
                        <p className="mt-1 font-mono text-xs text-ink-faint">
                          {job.period} · {job.location}
                        </p>
                        {!isOpen && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{job.summary}</p>
                        )}
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 shrink-0 text-ink-faint"
                      >
                        <IconChevron size={18} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/10 px-5 pb-5 pt-4">
                            <ul className="space-y-2.5">
                              {job.bullets.map((b, bi) => (
                                <li key={bi} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>

        {/* Security toolstack — hands-on tools tied to the work above */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
            <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
              <IconCpu size={18} className="shrink-0 text-accent" />
              <h3 className="min-w-0 flex-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.25em] sm:text-xs">
                Security tools I operate
              </h3>
              <span className="hidden h-px w-24 shrink-0 bg-white/[0.08] sm:block" />
            </div>
            <div className="-mx-2 flex w-full flex-nowrap gap-1.5 overflow-x-auto px-2 pb-1 sm:mx-0 sm:w-auto sm:flex sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {toolCategories.map((cat) => {
                const on = toolFilter === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setToolFilter(cat)
                      setActiveTool(null)
                    }}
                    aria-pressed={on}
                    className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors sm:text-[10px] ${
                      on
                        ? 'border-accent/50 bg-accent/15 text-accent'
                        : 'border-white/10 text-ink-faint hover:border-white/25 hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((t, i) => {
              const Icon = TOOL_ICON[t.name] ?? IconCpu
              const isActive = activeTool === t.name
              const prof = PROFICIENCY[t.name] ?? 'Working'
              const pct = PROFICIENCY_PCT[prof] ?? 60
              const features = TOOL_FEATURES[t.name] ?? []
              const deployed = TOOL_DEPLOYED[t.name]
              return (
                <Reveal as="div" key={t.name} delay={i * 0.04} className="h-full">
                  <motion.article
                    layout
                    onClick={() => setActiveTool(isActive ? null : t.name)}
                    className={`group relative flex h-full cursor-pointer flex-col rounded-xl border bg-base-800/50 p-3.5 transition-colors sm:p-4 ${
                      isActive
                        ? 'border-accent/50 shadow-glow'
                        : 'border-white/10 hover:border-accent/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-9 sm:w-9 ${
                            isActive
                              ? 'border-accent/60 bg-accent/10 text-accent'
                              : 'border-white/10 text-accent group-hover:border-accent/50'
                          }`}
                        >
                          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </span>
                        <h4 className="truncate text-[15px] font-semibold text-ink sm:text-base">
                          {t.name}
                        </h4>
                      </div>
                      <span className="shrink-0 rounded border border-accent/25 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-accent sm:px-2 sm:text-[10px]">
                        {t.category}
                      </span>
                    </div>

                    <p className="mt-3 text-[13px] leading-relaxed text-ink-faint sm:text-sm">
                      {t.use}
                    </p>

                    {/* Proficiency bar */}
                    <div className="mt-3.5 sm:mt-4">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-ink-ghost">
                          <IconBolt size={9} className="mr-1 inline align-middle sm:w-[10px] sm:h-[10px]" />
                          proficiency
                        </span>
                        <span className={isActive ? 'text-accent' : 'text-ink-soft'}>{prof}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-base-900/60">
                        <motion.div
                          initial={false}
                          animate={{ width: isActive ? `${pct}%` : '20%' }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                        />
                      </div>
                    </div>

                    {/* Expandable detail */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3.5 space-y-3 border-t border-white/10 pt-3.5 sm:mt-4 sm:pt-4">
                            <div>
                              <div className="mb-2 flex items-center gap-1.5">
                                <IconSpark size={10} className="text-accent sm:w-[11px] sm:h-[11px]" />
                                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost">
                                  Key capability
                                </span>
                              </div>
                              <ul className="space-y-1.5">
                                {features.map((f) => (
                                  <li
                                    key={f}
                                    className="flex gap-2 text-[12px] leading-relaxed text-ink-soft sm:text-[12px]"
                                  >
                                    <IconArrowRight
                                      size={10}
                                      className="mt-1 shrink-0 text-accent/60 sm:w-[11px] sm:h-[11px]"
                                    />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-md border border-accent/20 bg-accent/[0.06] p-2.5 sm:p-2.5">
                              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost">
                                deployed at
                              </p>
                              <p className="mt-0.5 text-xs text-ink-soft">{deployed}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
