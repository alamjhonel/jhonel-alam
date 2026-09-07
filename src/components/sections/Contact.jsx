import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { profile } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import CopyChip from '../common/CopyChip.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import {
  IconMail,
  IconPhone,
  IconSend,
  IconCheck,
  IconClose,
} from '../common/Icons.jsx'

// EmailJS free-tier config, read from Vite env at build time.
// If any value is missing, the form degrades to a mailto: handoff — zero setup.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_READY = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildMailto({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`)
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`)
  return `mailto:${profile.email}?subject=${subject}&body=${body}`
}

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const { toast } = useToast()
  const reduced = useReducedMotion()
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  function validate() {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email looks off.'
    if (!values.message.trim()) next.message = 'Add a short message.'
    else if (values.message.trim().length < 10) next.message = 'A little more detail, please.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    // No EmailJS keys configured → hand off to the visitor's mail client.
    if (!EMAILJS_READY) {
      window.location.href = buildMailto(values)
      setStatus('success')
      toast('Opening your email app…')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: values.name,
          from_email: values.email,
          reply_to: values.email,
          to_name: 'Jhonel',
          message: values.message,
        },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('success')
      setValues(EMPTY)
      toast('Message sent')
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  return (
    <>
      <section id="contact" className="relative scroll-mt-20 py-24">
        <div className="container-page">
          <SectionHeading index={8} kicker="Open Channel" title="Establish contact" />

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left: invitation + direct channels */}
            <Reveal className="space-y-6">
              <p className="max-w-md text-base leading-relaxed text-ink-soft">
                Have a role to fill, a system to harden, or a security problem worth solving? I am
                open to security-engineering and blue-team work — send a signal and I will get back
                to you.
              </p>

              <div className="flex flex-col gap-2.5">
                <CopyChip
                  icon={IconMail}
                  label="email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                  copyLabel="email"
                />
                <CopyChip
                  icon={IconPhone}
                  label="phone"
                  value={profile.phone}
                  href={`tel:${profile.phone}`}
                  copyLabel="phone"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-base-800/40 p-4">
                <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
                  <span className="text-accent">//</span> prefer your own mail client? the button
                  below always works with zero setup.
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-ghost mt-3 inline-flex"
                >
                  <IconMail size={16} /> Email me directly
                </a>
              </div>
            </Reveal>

            {/* Right: EmailJS form (falls back to mailto) */}
            <Reveal delay={0.1}>
              <form
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                className="panel space-y-4 p-4 shadow-panel sm:p-5"
              >
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                  <span className="mono-label">secure.message</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-ghost">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-node" />
                    {EMAILJS_READY ? 'encrypted relay' : 'mailto fallback'}
                  </span>
                </div>

                <Field
                  id="cf-name"
                  label="name"
                  error={errors.name}
                >
                  <input
                    id="cf-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'cf-name-err' : undefined}
                    className={inputCls(errors.name)}
                  />
                </Field>

                <Field id="cf-email" label="email" error={errors.email}>
                  <input
                    id="cf-email"
                    type="email"
                    value={values.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'cf-email-err' : undefined}
                    className={inputCls(errors.email)}
                  />
                </Field>

                <Field id="cf-message" label="message" error={errors.message}>
                  <textarea
                    id="cf-message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="What would you like to build or secure?"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'cf-message-err' : undefined}
                    className={`${inputCls(errors.message)} resize-y`}
                  />
                </Field>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <button type="submit" className="btn-primary w-full justify-center sm:w-auto" disabled={sending}>
                    {sending ? 'Sending…' : 'Send message'}
                    {!sending && <IconSend size={15} />}
                  </button>

                  <AnimatePresence mode="wait">
                    {status === 'success' && (
                      <StatusPill key="ok" tone="ok">
                        <IconCheck size={14} /> Message sent — I&apos;ll get back to you soon.
                      </StatusPill>
                    )}
                    {status === 'error' && (
                      <StatusPill key="err" tone="err">
                        <IconClose size={14} /> Couldn&apos;t send — please use the email link.
                      </StatusPill>
                    )}
                  </AnimatePresence>
                </div>

                <p
                  className="font-mono text-[10px] text-ink-ghost"
                  role="status"
                  aria-live="polite"
                >
                  {reduced ? '' : null}
                  {EMAILJS_READY
                    ? '// submissions relay straight to my inbox via EmailJS.'
                    : '// form not yet wired to EmailJS — it opens your mail client instead.'}
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-10">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt=""
              className="h-5 w-5 rounded border border-white/10 object-contain"
            />
            <span className="font-mono text-sm text-ink">
              {profile.name.split(' ')[0]}
              <span className="text-accent">.alam</span>
            </span>
            <span className="font-mono text-[11px] text-ink-ghost">// Signal &amp; Cipher</span>
          </div>
          <p className="font-mono text-[11px] text-ink-ghost">
            {profile.title} · {profile.location}
          </p>
          <p className="font-mono text-[11px] text-ink-ghost">
            built with react · tailwind · framer motion
          </p>
        </div>
      </footer>
    </>
  )
}

function inputCls(hasError) {
  return `w-full rounded-md border bg-base-900/50 px-3 py-2.5 font-mono text-base text-ink placeholder:text-ink-ghost transition-colors focus:outline-none sm:text-sm ${
    hasError
      ? 'border-rose-400/60 focus:border-rose-400'
      : 'border-white/10 focus:border-accent/50'
  }`
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-1.5 block">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1 font-mono text-[11px] text-rose-300">
          {error}
        </p>
      )}
    </div>
  )
}

function StatusPill({ tone, children }) {
  const cls =
    tone === 'ok'
      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
      : 'border-rose-400/40 bg-rose-400/10 text-rose-300'
  return (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[11px] ${cls}`}
    >
      {children}
    </motion.span>
  )
}
