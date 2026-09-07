import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

// Two curated accent themes — one accent color at a time, never mixed.
export const THEMES = {
  cyan: {
    id: 'cyan',
    label: 'Cyan Ops',
    // RGB triplets consumed by Tailwind's rgb(var(--accent) / <alpha>)
    accent: '34 211 238', // cyan-400
    hex: '#22d3ee',
  },
  amber: {
    id: 'amber',
    label: 'Amber Alert',
    accent: '245 158 11', // amber-500
    hex: '#f59e0b',
  },
}

const STORAGE_KEY = 'sc.accent'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState('cyan')

  // Load persisted choice on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && THEMES[saved]) setThemeId(saved)
    } catch {
      /* ignore storage errors */
    }
  }, [])

  // Apply the accent to the CSS variable + persist. We briefly disable
  // every CSS transition on <html> while the variable flips so the
  // accent change is instant — otherwise every accent-colored element
  // would transition one by one and the swap could take 1-2 seconds.
  useEffect(() => {
    const theme = THEMES[themeId] ?? THEMES.cyan
    const root = document.documentElement
    root.classList.add('theme-swapping')
    root.style.setProperty('--accent', theme.accent)
    try {
      localStorage.setItem(STORAGE_KEY, themeId)
    } catch {
      /* ignore */
    }
    // Re-enable transitions on the next frame so the swap itself is
    // instant but the next user interaction still animates normally.
    const raf = requestAnimationFrame(() => {
      root.classList.remove('theme-swapping')
    })
    return () => cancelAnimationFrame(raf)
  }, [themeId])

  const toggleTheme = useCallback(() => {
    setThemeId((prev) => (prev === 'cyan' ? 'amber' : 'cyan'))
  }, [])

  const value = useMemo(
    () => ({
      themeId,
      theme: THEMES[themeId] ?? THEMES.cyan,
      setThemeId,
      toggleTheme,
    }),
    [themeId, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
