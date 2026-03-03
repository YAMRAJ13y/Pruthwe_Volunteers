/**
 * SR — ScrollReveal component
 *
 * Drop-in replacement for the inline `function SR()` defined in every page.
 * Import once, delete the local definition, use identically.
 *
 * @example
 * import SR from '../components/ui/SR';
 *
 * <SR delay={0.1} direction="up" className="col-span-2">
 *   <MyCard />
 * </SR>
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface SRProps {
  children:   React.ReactNode;
  /** Framer Motion delay in seconds (default 0) */
  delay?:     number;
  /** Tailwind / custom className on the wrapper div */
  className?: string;
  /** Entry direction (default 'up') */
  direction?: Direction;
  /** Travel distance in px (default 20) */
  distance?:  number;
  /** Animation duration in seconds (default 0.5) */
  duration?:  number;
  /** Viewport margin before trigger (default '0px 0px -40px 0px') */
  margin?:    string;
}

const OFFSET: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up:    { y: 1  },
  down:  { y: -1 },
  left:  { x: 1  },
  right: { x: -1 },
  fade:  {},
  scale: { scale: 0.94 },
};

export default function SR({
  children,
  delay     = 0,
  className = '',
  direction = 'up',
  distance  = 20,
  duration  = 0.5,
  margin    = '0px 0px -40px 0px',
}: SRProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as any });

  const off = OFFSET[direction];

  const hidden: Record<string, number> = {
    opacity: 0,
    ...(off.y     !== undefined ? { y:     off.y     * distance } : {}),
    ...(off.x     !== undefined ? { x:     off.x     * distance } : {}),
    ...(off.scale !== undefined ? { scale: off.scale }            : {}),
  };

  const visible: Record<string, number> = {
    opacity: 1,
    ...(off.y     !== undefined ? { y: 0 }     : {}),
    ...(off.x     !== undefined ? { x: 0 }     : {}),
    ...(off.scale !== undefined ? { scale: 1 } : {}),
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? visible : hidden}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
