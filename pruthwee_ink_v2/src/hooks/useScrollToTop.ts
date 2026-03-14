import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change.
 * Mount once inside App (or inside PageTransition).
 *
 * @example
 * // In App.tsx or PageTransition.tsx:
 * useScrollToTop();
 */
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll — the page transition animation handles the "feel"
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
}
