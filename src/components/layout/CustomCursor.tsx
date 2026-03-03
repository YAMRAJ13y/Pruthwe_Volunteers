import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const target = useRef<Point>({ x: 0, y: 0 });
  const ring = useRef<Point>({ x: 0, y: 0 });
  const glow = useRef<Point>({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer:fine)').matches && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  });

  useEffect(() => {
    const mediaFinePointer = window.matchMedia('(pointer:fine)');
    const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

    const refreshEnabled = () => {
      setEnabled(mediaFinePointer.matches && mediaReducedMotion.matches);
    };

    refreshEnabled();

    if (typeof mediaFinePointer.addEventListener === 'function') {
      mediaFinePointer.addEventListener('change', refreshEnabled);
      mediaReducedMotion.addEventListener('change', refreshEnabled);
    } else {
      mediaFinePointer.addListener(refreshEnabled);
      mediaReducedMotion.addListener(refreshEnabled);
    }

    return () => {
      if (typeof mediaFinePointer.removeEventListener === 'function') {
        mediaFinePointer.removeEventListener('change', refreshEnabled);
        mediaReducedMotion.removeEventListener('change', refreshEnabled);
      } else {
        mediaFinePointer.removeListener(refreshEnabled);
        mediaReducedMotion.removeListener(refreshEnabled);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cursor-fancy');
      return;
    }

    document.body.classList.add('cursor-fancy');

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const onHover = (event: Event) => {
      const element = event.target as HTMLElement | null;
      if (!element) return;

      if (element.closest('a, button, [role="button"], input[type="submit"], input[type="button"], summary, .btn-primary, .btn-outline, .btn-ghost')) {
        cursorRef.current?.classList.add('cursor-dot-hover');
        ringRef.current?.classList.add('cursor-ring-hover');
        glowRef.current?.classList.add('cursor-glow-hover');
        return;
      }

      cursorRef.current?.classList.remove('cursor-dot-hover');
      ringRef.current?.classList.remove('cursor-ring-hover');
      glowRef.current?.classList.remove('cursor-glow-hover');
    };

    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      glow.current.x += (target.current.x - glow.current.x) * 0.12;
      glow.current.y += (target.current.y - glow.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.current.x}px, ${glow.current.y}px, 0)`;
      }

      frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onHover, { passive: true });

    return () => {
      document.body.classList.remove('cursor-fancy');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onHover);
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />
    </>
  );
}