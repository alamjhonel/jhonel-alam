// Smooth-scroll to a section by id, honoring prefers-reduced-motion and the
// fixed navbar offset.
export function scrollToSection(id, offset = 72) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}
