import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { certifications, certCategories } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import {
  IconShield,
  IconGlobe,
  IconLayers,
  IconCheck,
  IconCap,
  IconClose,
  IconArrowRight,
  IconSpark,
  IconCopy,
  IconCheck as IconCheckmark,
  IconMail,
} from '../common/Icons.jsx'

const CAT_ICONS = {
  Cybersecurity: IconShield,
  Cloud: IconGlobe,
  Networking: IconLayers,
  Compliance: IconCheck,
}

const CERT_SKILLS = {
  'Google Cybersecurity Professional Certificate': [
    'Risk management frameworks & threat analysis',
    'Network security, protocols & traffic analysis',
    'Linux + Python for security automation',
    'Incident response playbooks & runbooks',
  ],
  'Google Network Security Certificate': [
    'TCP/IP, DNS, DHCP, routing & switching',
    'VPN, IPSec, TLS hardening & certificate management',
    'Firewall rule design & zero-trust segmentation',
    'IDS/IPS placement and alert tuning',
  ],
  'Google IT Support Professional Certificate': [
    'OS fundamentals (Windows / Linux / macOS)',
    'Hardware, networking, and directory services',
    'Ticketing systems, troubleshooting, and SOPs',
    'Backup strategies and data recovery',
  ],
  'AWS Certified SysOps Administrator – Associate': [
    'VPC design, security groups, NACLs, IAM policies',
    'S3 lifecycle, encryption at rest + in transit',
    'CloudWatch monitoring & CloudWatch Alarms',
    'Auto Scaling, ELB, and high-availability patterns',
  ],
  'Cryptography & Security: Protect Data from Cyber Threats': [
    'Symmetric + asymmetric cipher fundamentals',
    'Hashing, MAC, digital signatures & PKI',
    'Secure key exchange (Diffie-Hellman, ECDH)',
    'Attacks: collision, replay, oracle padding',
  ],
  'Cryptography & Cybersecurity': [
    'Classical + modern cipher suites (AES, RSA, ECC)',
    'TLS handshake, certificate chains, HSTS',
    'Password storage: bcrypt, Argon2, PBKDF2',
    'Cryptographic failure case studies',
  ],
  'SAP Security: Deep Dive into Roles and Authorization': [
    'SAP PFCG role design & authorization objects',
    'Segregation of duties (SoD) analysis & mitigation',
    'SU01 / SUIM user lifecycle & audit reporting',
    'Profile Generator & role transport strategy',
  ],
  'Master Course in Google Cloud Digital Leader': [
    'GCP shared-responsibility model',
    'Cloud Identity, IAM bindings, Org Policy',
    'VPC peering, Shared VPC, and workload isolation',
    'Cost + compliance governance patterns',
  ],
  'Cybersecurity': [
    'CIS Controls 1–20 mapping',
    'Offensive + defensive security foundations',
    'Blue team workflows & SOC terminology',
    'Risk = likelihood × impact scoring',
  ],
  'Critical Infrastructure Protection': [
    'ICS / SCADA architecture & defense-in-depth',
    'Network segmentation for industrial zones',
    'Purdue reference model & zero-trust ICS',
    'Incident response for operational technology',
  ],
  'Data Protection & Security': [
    'Data classification schema & data lifecycle',
    'GDPR, DLP, leakage prevention & audit',
    'Access control & need-to-know enforcement',
    'Encryption: at rest, in transit, in use',
  ],
  'National Certificate II – Computer System Servicing': [
    'Hardware assembly, disassembly, and BIOS setup',
    'OS install, driver management, imaging',
    'Troubleshooting + preventive maintenance',
    'Workplace safety & ESD protocols',
  ],
}

const CERT_VERIFY = {
  Coursera: 'https://www.coursera.org/verify',
  AWS: 'https://aws.amazon.com/verification',
  Certification: '#',
  CISCO: 'https://www.cisco.com/',
  OPSWAT: 'https://www.opswat.com/academy',
  TESDA: 'https://www.tesda.gov.ph/',
}

function useCopy(copyTimeoutMs = 1500) {
  const [copied, setCopied] = useState(false)
  function copy(text) {
    try {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), copyTimeoutMs)
    } catch {}
  }
  return [copied, copy]
}

export default function Certifications() {
  const [filter, setFilter] = useState('All')
  const [openCert, setOpenCert] = useState(null)
  const reduced = useReducedMotion()
  const [copied, copy] = useCopy()

  const counts = useMemo(() => {
    const c = { All: certifications.length }
    for (const cert of certifications) c[cert.category] = (c[cert.category] ?? 0) + 1
    return c
  }, [])

  const shown = useMemo(
    () =>
      filter === 'All'
        ? certifications
        : certifications.filter((c) => c.category === filter),
    [filter],
  )

  useEffect(() => {
    if (!openCert) return
    function onKey(e) {
      if (e.key === 'Escape') setOpenCert(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openCert])

  return (
    <section id="certifications" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={5} kicker="Credential Ledger" title="Certifications" />

        <p className="mb-8 -mt-4 max-w-2xl font-mono text-xs text-ink-faint">
          <span className="text-accent">//</span> credentials verified by issuer — click any card to
          open the full credential dossier.
        </p>

        {/* Category filter */}
        <Reveal className="mb-8 -mx-3 flex flex-nowrap gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {certCategories.map((cat) => {
            const on = filter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={on}
                className={`chip ${
                  on
                    ? 'border-accent/50 bg-accent/15 text-accent'
                    : 'border-white/10 text-ink-faint hover:border-white/25 hover:text-ink'
                }`}
              >
                {cat}
                <span className={`text-[10px] ${on ? 'text-accent/70' : 'text-ink-ghost'}`}>
                  {counts[cat] ?? 0}
                </span>
              </button>
            )
          })}
        </Reveal>

        <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((cert) => {
              const Icon = CAT_ICONS[cert.category] ?? IconCap
              return (
                <motion.article
                  key={cert.name}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setOpenCert(cert)}
                  className="group flex cursor-pointer flex-col rounded-xl border border-white/10 bg-base-800/50 p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink-soft transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      <Icon size={18} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost">
                      {cert.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-ink">{cert.name}</h3>
                  <p className="mt-1 font-mono text-xs text-accent">{cert.issuer}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 font-mono text-[11px] text-ink-faint">
                    <span>{cert.date ?? '—'}</span>
                    <span className="inline-flex items-center gap-1 text-accent/70 opacity-0 transition-opacity group-hover:opacity-100">
                      view dossier
                      <IconArrowRight size={11} />
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openCert && (
          <CertModal
            key={openCert.name}
            cert={openCert}
            onClose={() => setOpenCert(null)}
            copied={copied}
            copy={copy}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function CertModal({ cert, onClose, copied, copy }) {
  const Icon = CAT_ICONS[cert.category] ?? IconCap
  const skills = CERT_SKILLS[cert.name] ?? []
  const verifyLink = CERT_VERIFY[cert.issuer] ?? '#'
  const hasVerify = verifyLink !== '#'

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${cert.name} credential`}
        className="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-4"
        initial={false}
      >
        <motion.div
          className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-base-900 shadow-2xl sm:max-h-[calc(100vh-2rem)]"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative border-b border-white/10 p-5 sm:p-6">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-ink-faint transition-colors hover:border-accent/40 hover:text-accent"
              aria-label="Close credential"
            >
              <IconClose size={16} />
            </button>
            <div className="flex items-start gap-4 pr-10">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
                <Icon size={22} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                  {cert.category} · Credential
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{cert.name}</h3>
                <p className="mt-1 font-mono text-sm text-ink-soft">
                  Issued by <span className="text-accent">{cert.issuer}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {/* Meta row */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <MetaCell label="Issue date" value={cert.date ?? 'On file'} />
              <MetaCell
                label="Credential ID"
                value={cert.id ?? 'Available on request'}
                copyable={Boolean(cert.id)}
                onCopy={() => cert.id && copy(cert.id)}
                copied={copied}
              />
              <MetaCell label="Category" value={cert.category} />
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <div className="mb-2.5 flex items-center gap-1.5">
                  <IconSpark size={12} className="text-accent" />
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                    Skills attested by credential
                  </p>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {skills.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 rounded-lg border border-white/[0.08] bg-base-900/50 p-2.5"
                    >
                      <IconCheckmark
                        size={13}
                        className="mt-0.5 shrink-0 text-emerald-400/80"
                      />
                      <p className="text-[12px] leading-relaxed text-ink-soft">{s}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-stretch gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
              {hasVerify ? (
                <a
                  href={verifyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full justify-center sm:w-auto"
                >
                  <IconCheck size={14} /> Verify with {cert.issuer}
                </a>
              ) : (
                <a
                  href={`mailto:jhonel.alam@gmail.com?subject=Verify credential — ${encodeURIComponent(
                    cert.name,
                  )}`}
                  className="btn-primary w-full justify-center sm:w-auto"
                >
                  <IconMail size={14} /> Request verification
                </a>
              )}
              {cert.id && (
                <button
                  type="button"
                  onClick={() => copy(cert.id)}
                  className="btn-ghost w-full justify-center sm:w-auto"
                >
                  {copied ? <IconCheckmark size={14} /> : <IconCopy size={14} />}
                  {copied ? 'Copied ID' : 'Copy credential ID'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

function MetaCell({ label, value, copyable, onCopy, copied }) {
  return (
    <div className="rounded-lg border border-white/10 bg-base-700/40 p-3">
      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink-faint">{label}</p>
      {copyable ? (
        <button
          type="button"
          onClick={onCopy}
          className="mt-1 inline-flex w-full items-center justify-between gap-2 text-left text-sm text-ink-soft hover:text-accent"
        >
          <span className="truncate font-mono">{value}</span>
          {copied ? (
            <IconCheckmark size={12} className="shrink-0 text-emerald-400/80" />
          ) : (
            <IconCopy size={12} className="shrink-0 text-ink-faint" />
          )}
        </button>
      ) : (
        <p className="mt-1 truncate text-sm text-ink-soft">{value}</p>
      )}
    </div>
  )
}
