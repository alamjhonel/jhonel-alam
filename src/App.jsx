import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { useTheme } from './context/ThemeContext.jsx'
import NetworkBackground from './components/background/NetworkBackground.jsx'
import BootSequence from './components/boot/BootSequence.jsx'
import Navbar from './components/nav/Navbar.jsx'
import CommandPalette from './components/nav/CommandPalette.jsx'
import TerminalWidget from './components/terminal/TerminalWidget.jsx'
import KonamiEasterEgg from './components/easter/KonamiEasterEgg.jsx'

import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Skills from './components/sections/Skills.jsx'
import Experience from './components/sections/Experience.jsx'
import FeaturedProject from './components/sections/FeaturedProject.jsx'
import Certifications from './components/sections/Certifications.jsx'
import Activities from './components/sections/Activities.jsx'
import Education from './components/sections/Education.jsx'
import Contact from './components/sections/Contact.jsx'

export default function App() {
  const { toggleTheme } = useTheme()
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('sc.booted') === '1'
    } catch {
      return false
    }
  })
  const [terminalOpen, setTerminalOpen] = useState(false)

  function handleBootComplete() {
    setBooted(true)
    try {
      sessionStorage.setItem('sc.booted', '1')
    } catch {
      /* ignore storage errors */
    }
  }

  return (
    <>
      <NetworkBackground />

      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <FeaturedProject />
        <Certifications />
        <Activities />
        <Education />
        <Contact />
      </main>

      <CommandPalette
        onOpenTerminal={() => setTerminalOpen(true)}
        onToggleTheme={toggleTheme}
      />
      <TerminalWidget open={terminalOpen} onOpenChange={setTerminalOpen} />
      <KonamiEasterEgg />
      <Analytics />
    </>
  )
}
