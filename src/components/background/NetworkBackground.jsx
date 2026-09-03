import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// ---------------------------------------------------------------------------
// Site-wide animated background: a slowly drifting node/network graph.
// - Fixed, low-opacity, sits behind all content.
// - Thin connecting lines redraw as nodes move; a few nodes pulse.
// - Subtle parallax on mouse move + scroll.
// - Density shifts via body[data-bg-density] (sections can nudge it).
// - Respects prefers-reduced-motion (renders one static faint frame).
// - Performant: capped frame rate, DPR-aware, pauses when tab is hidden.
// ---------------------------------------------------------------------------

function readAccent() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  const parts = raw.split(/\s+/).map(Number)
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) return parts
  return [34, 211, 238]
}

export default function NetworkBackground() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes = []
    let accent = readAccent()
    let raf = 0
    let running = true

    // Parallax + density targets (smoothed toward)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let scrollY = window.scrollY
    let density = 1
    let densityTarget = 1

    const FRAME_INTERVAL = 1000 / 30 // cap ~30fps
    let last = 0

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function seed() {
      const area = width * height
      const count = Math.max(28, Math.min(84, Math.round(area / 24000)))
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.8,
        pulse: 0,
        nextPulse: 1500 + Math.random() * 6000,
      }))
    }

    function drawStatic() {
      // Reduced-motion fallback: faint static grid + a few dots, drawn once.
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      const step = 48
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      const [r, g, b] = accent
      ctx.fillStyle = `rgba(${r},${g},${b},0.18)`
      for (let i = 0; i < 40; i++) {
        const x = (i * 97.13) % width
        const y = (i * 53.71) % height
        ctx.beginPath()
        ctx.arc(x, y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function step(ts) {
      if (!running) return
      raf = requestAnimationFrame(step)
      if (ts - last < FRAME_INTERVAL) return
      const dt = Math.min(ts - last, 60)
      last = ts

      // Smooth parallax + density
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      density += (densityTarget - density) * 0.04

      const parX = mouse.x * 18
      const parY = mouse.y * 18 + (window.scrollY - scrollY) * 0.02

      ctx.clearRect(0, 0, width, height)
      const [r, g, b] = accent
      const maxDist = 130 * density

      // Update + draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx * (dt / 16)
        n.y += n.vy * (dt / 16)
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20

        // pulse lifecycle
        n.nextPulse -= dt
        if (n.nextPulse <= 0 && n.pulse <= 0) {
          n.pulse = 1
          n.nextPulse = 4000 + Math.random() * 9000
        }
        if (n.pulse > 0) n.pulse = Math.max(0, n.pulse - dt / 900)

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const dx = n.x - m.x
          const dy = n.y - m.y
          const d = Math.hypot(dx, dy)
          if (d < maxDist) {
            const a = (1 - d / maxDist) * 0.5
            ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.5})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(n.x + parX, n.y + parY)
            ctx.lineTo(m.x + parX, m.y + parY)
            ctx.stroke()
          }
        }
      }

      // Draw nodes on top
      for (const n of nodes) {
        const glow = 0.35 + n.pulse * 0.65
        ctx.fillStyle = `rgba(${r},${g},${b},${glow})`
        ctx.beginPath()
        ctx.arc(n.x + parX, n.y + parY, n.r + n.pulse * 2.4, 0, Math.PI * 2)
        ctx.fill()
        if (n.pulse > 0.05) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${n.pulse * 0.4})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(n.x + parX, n.y + parY, (1 - n.pulse) * 22 + 4, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    function onMouse(e) {
      mouse.tx = (e.clientX / width) * 2 - 1
      mouse.ty = (e.clientY / height) * 2 - 1
    }
    function onVisibility() {
      running = !document.hidden
      if (running && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      } else {
        cancelAnimationFrame(raf)
      }
    }
    function onDensityPoll() {
      const v = Number(document.body.dataset.bgDensity)
      densityTarget = Number.isNaN(v) || v === 0 ? 1 : v
    }

    // Keep accent in sync with the theme toggle (watches inline style changes)
    const styleObserver = new MutationObserver(() => {
      accent = readAccent()
      if (reduced) drawStatic()
    })
    styleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })

    const densityInterval = window.setInterval(onDensityPoll, 400)

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (reduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVisibility)
      styleObserver.disconnect()
      window.clearInterval(densityInterval)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  )
}
