import { useState, useEffect } from 'react';

/**
 * Returns true when the given media query matches.
 * SSR-safe: defaults to false on the server.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isMobile  = useMediaQuery('(max-width: 767px)');
 *
 * Pre-built breakpoint helpers are also exported:
 * const isMd = useMd();   // ≥ 768px
 * const isLg = useLg();   // ≥ 1024px
 * const isXl = useXl();   // ≥ 1280px
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql     = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ── Tailwind-aligned breakpoint shortcuts ──
export const useSm = () => useMediaQuery('(min-width: 640px)');
export const useMd = () => useMediaQuery('(min-width: 768px)');
export const useLg = () => useMediaQuery('(min-width: 1024px)');
export const useXl = () => useMediaQuery('(min-width: 1280px)');
export const use2Xl = () => useMediaQuery('(min-width: 1536px)');

// ── Preference shortcuts ──
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersDark = () =>
  useMediaQuery('(prefers-color-scheme: dark)');
