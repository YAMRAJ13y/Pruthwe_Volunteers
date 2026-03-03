import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks';

// ── VARIANTS ───────────────────────────────────
// Enter: fade up from 10px below
// Exit:  instant cut (snappy feel — no slow exit drag)
const variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

// Reduced-motion variant — just a simple fade
const reducedVariants = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.15 } },
  exit:     { opacity: 0, transition: { duration: 0.1  } },
};

// ── SCROLL TO TOP ──────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

// ═════════════════════════════════════════════
interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location      = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const v             = reducedMotion ? reducedVariants : variants;

  return (
    <>
      {/* Scroll to top on every route change */}
      <ScrollToTop />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={v}
          initial="initial"
          animate="animate"
          exit="exit"
          // Ensure the motion div doesn't add layout-breaking styles
          style={{ minHeight: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
