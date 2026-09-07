import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { certifications, certCategories } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import CertViewer from '../common/CertViewer.jsx'
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
  IconLock,
  IconEye,
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

// Bundled cert assets — read at build time by the Vite plugin and inlined
// as base64 data URIs inside the JS bundle. The PDFs are NOT emitted as
// separate fetchable files in /assets, so there is no stable URL a viewer
// can request. The map is keyed by the `pdf` field on each certification.
import { CERT_PDF } from '../../data/certAssets.js'

// True only when a value is a fully-inlined data: URI. The build-time
// placeholder strings (e.g. '__GOOGLE_CYBERSECURITY_PDF__') are kept
// here when the PDF file is missing on disk; the viewer must skip them.
function isInlinedPdf(value) {
  return typeof value === 'string' && value.startsWith('data:application/pdf')
}

export default function Certifications() {
  const [filter, setFilter] = useState('All')
  const [openCert, setOpenCert] = useState(null)
  const [viewerCert, setViewerCert] = useState(null)
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((cert) => {
            const Icon = CAT_ICONS[cert.category] ?? IconCap
            return (
              <article
                key={cert.name}
                onClick={() => setOpenCert(cert)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-base-800/50 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:bg-base-800/80 hover:shadow-glow active:scale-[0.98]"
              >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink-soft transition-all duration-200 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent">
                      <Icon size={18} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost transition-colors group-hover:text-ink-faint">
                      {cert.category}
                    </span>
                  </div>
                  <h3 className="break-words text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent/90">{cert.name}</h3>
                  <p className="mt-1 break-words font-mono text-xs text-accent/80">{cert.issuer}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 font-mono text-[11px] text-ink-faint">
                    <span>{cert.date ?? '—'}</span>
                    <span className="inline-flex items-center gap-1 text-accent transition-all duration-200 group-hover:gap-1.5">
                      <span className="hidden sm:inline opacity-0 transition-opacity group-hover:opacity-100">view dossier</span>
                      <IconArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                </article>
              )
            })}
        </div>
      </div>

      <AnimatePresence>
        {openCert && (
          <CertModal
            key={openCert.name}
            cert={openCert}
            onClose={() => setOpenCert(null)}
            copied={copied}
            copy={copy}
            onViewPdf={() => setViewerCert(openCert)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewerCert && isInlinedPdf(CERT_PDF[viewerCert.pdf]) && (
          <CertViewer
            key={viewerCert.name}
            src={CERT_PDF[viewerCert.pdf]}
            title={viewerCert.name}
            onClose={() => setViewerCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function CertModal({ cert, onClose, copied, copy, onViewPdf }) {
  const Icon = CAT_ICONS[cert.category] ?? IconCap
  const skills = CERT_SKILLS[cert.name] ?? []
  const verifyLink = CERT_VERIFY[cert.issuer] ?? '#'
  const hasVerify = verifyLink !== '#'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.name} credential`}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-base-900 shadow-2xl sm:max-h-[calc(100vh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Close — floating, always reachable, never overlaps title */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close credential"
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-base-900/90 text-ink-soft shadow-lg backdrop-blur-sm transition-all hover:border-accent/60 hover:text-accent hover:scale-105 active:scale-95 sm:right-4 sm:top-4"
          >
            <IconClose size={18} />
          </button>

          <div className="relative shrink-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-base-900 via-base-900 to-base-800 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" aria-hidden />
            <div className="relative flex items-start gap-4 pr-14">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent shadow-glow">
                <Icon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  {cert.category} · Credential
                </p>
                <h3 className="mt-1.5 break-words text-base font-semibold leading-snug text-ink sm:text-lg">
                  {cert.name}
                </h3>
                <p className="mt-1 break-words font-mono text-xs text-ink-soft sm:text-sm">
                  Issued by <span className="text-accent">{cert.issuer}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {/* Meta row */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
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
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                    Skills attested by credential
                  </p>
                  <span className="ml-auto font-mono text-[10px] text-ink-ghost">
                    {skills.length}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {skills.map((s, i) => (
                    <li
                      key={s}
                      className="group flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-base-800/40 p-2.5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06]"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <IconCheckmark
                        size={13}
                        className="mt-0.5 shrink-0 text-emerald-400/80 transition-transform group-hover:scale-110"
                      />
                      <p className="break-words text-[12px] leading-relaxed text-ink-soft transition-colors group-hover:text-ink">
                        {s}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-stretch gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
              {cert.pdf && isInlinedPdf(CERT_PDF[cert.pdf]) && (
                <button
                  type="button"
                  onClick={onViewPdf}
                  className="btn-primary w-full justify-center sm:w-auto"
                >
                  <IconLock size={14} /> View credential
                </button>
              )}
              {hasVerify ? (
                <a
                  href={verifyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost w-full justify-center sm:w-auto"
                >
                  <IconCheck size={14} /> Verify with {cert.issuer}
                </a>
              ) : (
                <a
                  href={`mailto:jhonel.alam@gmail.com?subject=Verify credential — ${encodeURIComponent(
                    cert.name,
                  )}`}
                  className="btn-ghost w-full justify-center sm:w-auto"
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
        </div>
      </div>
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
