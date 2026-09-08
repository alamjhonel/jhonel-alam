// Minimal inline icon set (stroke = currentColor) — avoids an icon dependency.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const S = ({ children, size = 18, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...rest}>
    {children}
  </svg>
)

export const IconShield = (p) => (
  <S {...p}>
    <path d="M12 3 20 6v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </S>
)
export const IconTerminal = (p) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3M13 15h4" />
  </S>
)
export const IconCopy = (p) => (
  <S {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </S>
)
export const IconCheck = (p) => (
  <S {...p}>
    <path d="m5 12 5 5L20 7" />
  </S>
)
export const IconMail = (p) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </S>
)
export const IconPhone = (p) => (
  <S {...p}>
    <path d="M4 5c0-1 .8-2 2-2h2l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5V18c0 1.2-1 2-2 2A16 16 0 0 1 4 5Z" />
  </S>
)
export const IconGlobe = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </S>
)
export const IconCommand = (p) => (
  <S {...p}>
    <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />
  </S>
)
export const IconChevron = (p) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
)
export const IconArrowRight = (p) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
)
export const IconClose = (p) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
)
export const IconSearch = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </S>
)
export const IconSpark = (p) => (
  <S {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </S>
)
export const IconLock = (p) => (
  <S {...p}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </S>
)
export const IconPulse = (p) => (
  <S {...p}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </S>
)
export const IconLayers = (p) => (
  <S {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </S>
)
export const IconCpu = (p) => (
  <S {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </S>
)
export const IconFlag = (p) => (
  <S {...p}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </S>
)
export const IconEye = (p) => (
  <S {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="2.6" />
  </S>
)
export const IconCap = (p) => (
  <S {...p}>
    <path d="m2 8 10-4 10 4-10 4L2 8Z" />
    <path d="M6 10v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5" />
  </S>
)
export const IconGrid = (p) => (
  <S {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </S>
)
export const IconSwatch = (p) => (
  <S {...p}>
    <path d="M4 17a3 3 0 0 0 6 0V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12Z" />
    <path d="M7 17h.01M10 9l4-4 3 3-8 8" />
  </S>
)
export const IconSend = (p) => (
  <S {...p}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </S>
)
export const IconDownload = (p) => (
  <S {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </S>
)
export const IconDatabase = (p) => (
  <S {...p}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </S>
)
export const IconBug = (p) => (
  <S {...p}>
    <rect x="8" y="6" width="8" height="14" rx="4" />
    <path d="M12 6V3M8 10H5M16 10h3M8 14H4M16 14h4M8 18H5M16 18h3" />
    <circle cx="10" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14" cy="11" r="0.8" fill="currentColor" stroke="none" />
  </S>
)
export const IconTarget = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </S>
)
export const IconBot = (p) => (
  <S {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 5v3M8 1v3M16 1v3" />
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M9 17h6" />
  </S>
)
export const IconBolt = (p) => (
  <S {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </S>
)
export const IconRadar = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 12 19 7" />
  </S>
)
export const IconChevronDown = (p) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
)
export const IconChevronUp = (p) => (
  <S {...p}>
    <path d="m6 15 6-6 6 6" />
  </S>
)
