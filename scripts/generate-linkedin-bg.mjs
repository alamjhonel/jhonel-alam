/**
 * Generates a 1584x396 LinkedIn background image for the portfolio.
 *
 * Composition strategy:
 *  - The user's profile photo overlays the bottom-left ~280x280 region on
 *    LinkedIn. So we keep the left ~320px mostly dark/empty and put the
 *    wordmark + tagline in the center-right.
 *  - Top ~80px and bottom ~80px get cropped on mobile, so critical content
 *    sits in the middle 236px band.
 *  - Visual elements:
 *      - deep black base with subtle vertical gradient
 *      - cyan radial glows (left-center and right-center)
 *      - faint hex grid across the right 2/3
 *      - cloud-network node graph on the right
 *      - binary code cascade on the far right edge
 *      - shield outline on the left (faint, doesn't compete with photo)
 *      - "JHONEL1.ALAM" wordmark with cyan accent on the 1.
 *      - "CYBERSECURITY · CLOUD · NETWORK DEFENSE" tagline
 *      - small terminal prompt "> SIGNAL CIPHER ENGINEER" at the bottom
 *
 *  Output: public/linkedin-bg.png
 */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const W = 1584
const H = 396
const root = dirname(fileURLToPath(import.meta.url)) + '/..'

// ---- Hex grid pattern (filled into <pattern>, repeated) ----
const hexPattern = `
  <pattern id="hex" width="48" height="42" patternUnits="userSpaceOnUse">
    <path d="M12 2 L36 2 L48 22 L36 42 L12 42 L0 22 Z"
          fill="none" stroke="rgba(80,220,240,0.06)" stroke-width="1"/>
  </pattern>
`

// ---- Node graph (right side) ----
const nodes = [
  [1100, 90], [1240, 60], [1380, 110], [1170, 180], [1320, 220], [1480, 180],
  [1060, 270], [1200, 310], [1360, 290], [1500, 320], [1100, 350], [1450, 90],
]
const edges = [
  [0, 1], [0, 2], [1, 2], [1, 11], [0, 3], [3, 4], [4, 5], [2, 5], [5, 11],
  [3, 6], [6, 7], [7, 8], [8, 9], [4, 8], [6, 10], [10, 7],
]
const edgeLines = edges
  .map(([a, b]) => {
    const [x1, y1] = nodes[a]
    const [x2, y2] = nodes[b]
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="rgba(80,220,240,0.4)" stroke-width="1"/>`
  })
  .join('\n    ')

const nodeDots = nodes
  .map(([cx, cy]) => {
    return `
    <circle cx="${cx}" cy="${cy}" r="14" fill="rgba(34,211,238,0.35)"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#eafaff"/>`
  })
  .join('')

// ---- Binary cascade (far right) ----
let binaryStream = ''
for (let c = 0; c < 5; c++) {
  let col = ''
  for (let i = 0; i < 12; i++) {
    const ch = Math.random() < 0.5 ? '0' : '1'
    col += `<tspan x="${W - 28 - c * 9}" dy="14">${ch}</tspan>`
  }
  binaryStream += `
    <text x="0" y="20" fill="rgba(120,210,230,0.22)"
          font-family="ui-monospace, Menlo, monospace"
          font-size="11" letter-spacing="2">${col}</text>`
}

// ---- Shield outline (left, behind profile photo) ----
const shieldPath = `
  <path d="M 110 100 L 330 100 L 330 215 L 220 290 L 110 215 Z"
        fill="none" stroke="rgba(80,220,240,0.5)" stroke-width="1.5"/>
  <path d="M 140 130 L 300 130 L 300 205 L 220 260 L 140 205 Z"
        fill="none" stroke="rgba(80,220,240,0.2)" stroke-width="1"/>
  <text x="220" y="200" text-anchor="middle"
        fill="rgba(80,220,240,0.4)"
        font-family="ui-monospace, Menlo, monospace"
        font-size="13" letter-spacing="2">CIPHER</text>
`

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${hexPattern}

    <!-- Vertical base gradient: top slightly lighter, bottom darker. -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0a0e18"/>
      <stop offset="100%" stop-color="#04060b"/>
    </linearGradient>

    <!-- Cyan radial glows. -->
    <radialGradient id="glowLeft" cx="0.18" cy="0.5" r="0.32">
      <stop offset="0%"   stop-color="rgba(34,211,238,0.30)"/>
      <stop offset="60%"  stop-color="rgba(34,211,238,0.05)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <radialGradient id="glowRight" cx="0.82" cy="0.45" r="0.42">
      <stop offset="0%"   stop-color="rgba(34,211,238,0.28)"/>
      <stop offset="60%"  stop-color="rgba(45,212,191,0.05)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <radialGradient id="glowCenter" cx="0.45" cy="0.55" r="0.28">
      <stop offset="0%"   stop-color="rgba(34,211,238,0.20)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>

    <!-- Wordmark gradient (cyan to teal). -->
    <linearGradient id="word" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#eafaff"/>
      <stop offset="55%"  stop-color="#eafaff"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowLeft)"/>
  <rect width="${W}" height="${H}" fill="url(#glowRight)"/>
  <rect width="${W}" height="${H}" fill="url(#glowCenter)"/>

  <!-- Hex grid overlay (right 2/3) -->
  <rect x="540" y="0" width="${W - 540}" height="${H}" fill="url(#hex)"/>

  <!-- Network edges + nodes -->
  <g>${edgeLines}</g>
  <g>${nodeDots}</g>

  <!-- Binary cascade on far right -->
  <g>${binaryStream}</g>

  <!-- Shield outline on left (behind profile photo) -->
  <g>${shieldPath}</g>

  <!-- Vertical accent rails (left and right edges) -->
  <line x1="40" y1="50" x2="40" y2="${H - 50}" stroke="rgba(80,200,220,0.4)" stroke-width="1"/>
  <line x1="${W - 40}" y1="50" x2="${W - 40}" y2="${H - 50}" stroke="rgba(80,200,220,0.4)" stroke-width="1"/>
  <circle cx="40"    cy="50"    r="3" fill="#22d3ee"/>
  <circle cx="40"    cy="${H - 50}" r="3" fill="#22d3ee"/>
  <circle cx="${W - 40}" cy="50"    r="3" fill="#22d3ee"/>
  <circle cx="${W - 40}" cy="${H - 50}" r="3" fill="#22d3ee"/>

  <!-- Small terminal prompt at top-left of the wordmark area -->
  <text x="560" y="100" fill="rgba(34,211,238,0.75)"
        font-family="ui-monospace, Menlo, monospace"
        font-size="13" letter-spacing="2">~/portfolio $ whoami</text>

  <!-- WORDMARK: JHONEL1.ALAM -->
  <text x="560" y="200"
        fill="url(#word)"
        font-family="ui-monospace, Menlo, monospace"
        font-weight="700"
        font-size="72"
        letter-spacing="6">JHONEL<tspan fill="#22d3ee">1</tspan>.ALAM</text>

  <!-- Accent dot at the upper right of the M -->
  <circle cx="${W - 240}" cy="160" r="3" fill="#22d3ee"/>

  <!-- Tagline -->
  <text x="560" y="250"
        fill="rgba(180,220,235,0.75)"
        font-family="ui-monospace, Menlo, monospace"
        font-size="16" letter-spacing="5">CYBERSECURITY  ·  CLOUD  ·  NETWORK DEFENSE</text>

  <!-- Bottom rule -->
  <line x1="560" y1="275" x2="900" y2="275"
        stroke="rgba(34,211,238,0.45)" stroke-width="1"/>

  <!-- Status prompt -->
  <text x="560" y="305" fill="rgba(120,200,220,0.6)"
        font-family="ui-monospace, Menlo, monospace"
        font-size="13" letter-spacing="2">&gt; SIGNAL CIPHER ENGINEER  ·  DEFEND · DETECT · DEPLOY</text>

  <!-- Domain / URL strip -->
  <text x="560" y="330" fill="rgba(120,200,220,0.45)"
        font-family="ui-monospace, Menlo, monospace"
        font-size="12" letter-spacing="3">jhonel.alam  ·  github.com/alamjhonel</text>

  <!-- Faint dotted scanline texture -->
  <g opacity="0.04">
    ${Array.from({ length: 80 })
      .map(
        (_, i) =>
          `<line x1="0" y1="${i * 6 + 3}" x2="${W}" y2="${i * 6 + 3}"
                  stroke="#ffffff" stroke-width="1"/>`,
      )
      .join('')}
  </g>
</svg>`

const outPath = resolve(root, 'public/linkedin-bg.png')

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(outPath)

console.log(`Wrote ${outPath} (${W}x${H})`)