// ═══════════════════════════════════════════════
//  PRUTHWEE THEME CONSTANTS — LUNA PALETTE
//  Font: Barlow Condensed (display) + Barlow (body)
// ═══════════════════════════════════════════════

export const COLORS = {
  sky:      '#A7EBF2',
  teal:     '#54ACBF',
  ocean:    '#26658C',
  deep:     '#023859',
  midnight: '#011C40',
  light:    '#EAF7F9',
  muted:    '#8BBFCC',
  white:    '#F0FAFB',
  success:  '#6EE07A',
  warning:  '#FCD34D',
  error:    '#FCA5A5',
  info:     '#93C5FD',
} as const;

export const FONTS = {
  // Bold, tight, uppercase — ALL headings, stats, nav, buttons
  display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  // Clean, readable — paragraphs, body copy, descriptions
  body:    "'Barlow', system-ui, sans-serif",
  // Fixed-width — labels, badges, overlines, codes
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
  sm:   '0 1px 3px rgba(1,28,64,0.3)',
  md:   '0 4px 16px rgba(1,28,64,0.4)',
  lg:   '0 8px 32px rgba(1,28,64,0.5)',
  glow: '0 0 24px rgba(84,172,191,0.3)',
  card: '0 4px 24px rgba(1,28,64,0.6)',
} as const;