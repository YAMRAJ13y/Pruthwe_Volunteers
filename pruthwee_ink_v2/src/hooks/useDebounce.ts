import { useState, useEffect } from 'react';

/**
 * Debounces a value by `delay` ms.
 * Use for search inputs to avoid filtering on every keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(search, 300);
 * const filtered = events.filter(e => e.title.includes(debouncedSearch));
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
