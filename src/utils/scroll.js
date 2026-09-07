// Smooth-scroll to a section by id, honoring prefers-reduced-motion and the
// fixed navbar offset. Uses scrollIntoView (more reliable on iOS Safari
// than window.scrollTo with behavior: 'smooth', which is known to be
// cancelled by DOM mutations that happen in the same tick).
export function scrollToSection(id, _offset = 72) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // scroll-mt-20 on each <section> handles the navbar offset, so we
  // don't need to pass a manual offset here.
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
