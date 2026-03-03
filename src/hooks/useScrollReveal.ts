import { useRef } from 'react';
import { useInView } from 'framer-motion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

export interface ScrollRevealOptions {
  /** Framer Motion delay in seconds */
  delay?:     number;
  /** How far the element travels before revealing (px) */
  distance?:  number;
  /** Viewport margin before the trigger fires */
  margin?:    string;
  /** Only animate once (default: true) */
  once?:      boolean;
  /** Direction of entry */
  direction?: RevealDirection;
  /** Animation duration in seconds (default 0.55) */
  duration?:  number;
}

const DIRECTION_MAP: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
  up:    { y: 24 },
  down:  { y: -24 },
  left:  { x: 32 },
  right: { x: -32 },
  fade:  {},
  scale: { scale: 0.94 },
};

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    delay     = 0,
    distance  = 24,
    margin    = '0px 0px -48px 0px',
    once      = true,
    direction = 'up',
    duration  = 0.55,
  } = options;

  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: margin as any });

  const base = DIRECTION_MAP[direction];

  // Scale direction uses its own distance
  const hidden: Record<string, number> = {
    opacity: 0,
    ...(base.y !== undefined  ? { y:     (base.y  / 24) * distance } : {}),
    ...(base.x !== undefined  ? { x:     (base.x  / 32) * distance } : {}),
    ...(base.scale !== undefined ? { scale: base.scale } : {}),
  };

  const visible: Record<string, number> = {
    opacity: 1,
    ...(base.y     !== undefined ? { y: 0 }     : {}),
    ...(base.x     !== undefined ? { x: 0 }     : {}),
    ...(base.scale !== undefined ? { scale: 1 } : {}),
  };

  const motionProps = {
    ref,
    initial:    hidden,
    animate:    inView ? visible : hidden,
    transition: {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  return { ref, inView, motionProps };
}
