import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sections, profile } from '../../data/content.js'
import { scrollToSection } from '../../utils/scroll.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { IconShield, IconCommand, IconSwatch, IconClose } from '../common/Icons.jsx'

const NAV_ITEMS = sections.filter((s) => s.id !== 'hero')

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [activeId, setActiveId] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lightweight background-scroll prevention while the mobile menu is
  // open. We deliberately do NOT use the `position: fixed; top: -Ypx`
  // trick here — that approach zeroes out window.scrollY and breaks
  // scrollToSection when the user picks a section to navigate to.
  // `overflow: hidden` on <html> is enough to keep the page from
  // scrolling under a small dropdown menu, and window.scrollY stays
  // intact so smooth-scroll-to-section works correctly.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [menuOpen])

  function go(id) {
    setMenuOpen(false)
    // Defer the scroll to the next frame so React can commit the
    // menu-close state change first. Calling scrollIntoView in the
    // same tick as a state update can be cancelled on iOS Safari.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(id)
      })
    })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
          scrolled ? 'border-b border-white/10 bg-base-900 sm:bg-base-900/80 sm:backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => go('hero')}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-7 w-7 rounded-md border border-white/10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="font-mono text-sm font-semibold tracking-tight text-ink">
              {profile.name.split(' ')[0]}
              <span className="text-accent">.alam</span>
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  className={`relative rounded-md px-3 py-2 font-mono text-xs transition-colors ${
                    activeId === s.id ? 'text-accent' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {activeId === s.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-md bg-accent/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('palette:open'))}
              className="hidden items-center gap-2 rounded-md border border-white/[0.12] px-2.5 py-1.5 font-mono text-xs text-ink-faint transition-colors hover:border-accent/40 hover:text-ink sm:flex"
              aria-label="Open command palette"
            >
              <IconCommand size={14} />
              <span className="text-ink-ghost">press</span>
              <kbd className="rounded border border-white/15 px-1 text-[10px] text-ink-soft">/</kbd>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-md border border-white/[0.12] px-2.5 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
              aria-label={`Switch accent theme (current: ${theme.label})`}
              title={`Accent: ${theme.label}`}
            >
              <IconSwatch size={14} className="text-accent" />
              <span className="hidden md:inline">{theme.label}</span>
            </button>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.12] text-ink-soft lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <IconClose size={18} />
              ) : (
                <span className="flex flex-col gap-1">
                  <span className="h-0.5 w-4 bg-current" />
                  <span className="h-0.5 w-4 bg-current" />
                  <span className="h-0.5 w-4 bg-current" />
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-16 z-[95] border-b border-white/10 bg-base-900 lg:hidden"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
          >
            <ul className="container-page grid grid-cols-2 gap-2 py-4">
              {NAV_ITEMS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={`flex min-h-11 w-full items-center rounded-md border border-white/[0.08] px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                      activeId === s.id ? 'border-accent/40 text-accent' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    <span className="text-ink-ghost">{'>'}</span> {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
