import DecryptText from './DecryptText.jsx'

/**
 * Consistent section header: mono kicker (with index) + decrypting title.
 */
export default function SectionHeading({ index, kicker, title, className = '' }) {
  return (
    <div className={`mb-10 ${className}`}>
      <div className="mb-3 flex items-center gap-3">
        {index != null && (
          <span className="font-mono text-xs text-accent">{String(index).padStart(2, '0')}</span>
        )}
        <span className="mono-label">{kicker}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      <DecryptText
        as="h2"
        text={title}
        className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl"
      />
    </div>
  )
}
