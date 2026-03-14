// ═══════════════════════════════════════════════
//  PRUTHWEE THEME CONSTANTS — INK PALETTE
//  Font: Syne (display) + Plus Jakarta Sans (body)
// ═══════════════════════════════════════════════

export const COLORS = {
  // backgrounds
  bg:        '#0C0C0C',
  surface:   '#141414',
  raised:    '#1A1A1A',
  border:    'rgba(255,255,255,0.07)',
  borderHi:  'rgba(255,255,255,0.14)',
  // text
  text:      '#F2F2F2',
  muted:     '#888888',
  faint:     '#555555',
  // brand accent
  lime:      '#CCFF00',
  // category colours
  env:       '#4ADE80',
  edu:       '#38BDF8',
  health:    '#FB7185',
  sports:    '#FACC15',
  cultural:  '#C4B5FD',
  // legacy aliases
  sky:       '#CCFF00',
  teal:      '#CCFF00',
  ocean:     '#999900',
  deep:      '#1A1A1A',
  midnight:  '#0C0C0C',
  light:     '#F2F2F2',
  white:     '#F2F2F2',
  success:   '#4ADE80',
  warning:   '#FACC15',
  error:     '#FB7185',
  info:      '#38BDF8',
} as const;

export const FONTS = {
  display: "'Syne', 'Arial Black', sans-serif",
  body:    "'Plus Jakarta Sans', system-ui, sans-serif",
  mono:    "'DM Mono', 'Courier New', monospace",
} as const;

export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  xxl: 1536,
} as const;

export const TRANSITIONS = {
  fast:   '150ms ease',
  base:   '250ms ease',
  slow:   '400ms ease',
  spring: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const SHADOWS = {
  sm:   '0 1px 3px rgba(0,0,0,0.4)',
  md:   '0 4px 16px rgba(0,0,0,0.5)',
  lg:   '0 8px 32px rgba(0,0,0,0.6)',
  lime: '0 0 24px rgba(204,255,0,0.2)',
  card: '0 4px 24px rgba(0,0,0,0.6)',
  glow: '0 0 24px rgba(204,255,0,0.2)',
} as const;
