// Smooth-scroll to a section by id, honoring prefers-reduced-motion.
// Uses scrollIntoView (more reliable on iOS Safari than window.scrollTo
// with behavior: 'smooth', which is known to be cancelled by DOM
// mutations that happen in the same tick). The scroll-mt-20 utility on
// each <section> handles the fixed-navbar offset, so no manual offset
// calculation is needed here.
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
