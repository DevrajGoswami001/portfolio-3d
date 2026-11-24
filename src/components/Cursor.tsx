import { useEffect, useRef } from 'react';
import { isTouch, mouse } from '../lib/signals';

/** Purple glowing dot + a lagging blurred circle. Hidden on touch devices. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let scale = 1;
    let target = 1;
    let raf = 0;

    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      target = t.closest('a, button, [data-cursor="hover"]') ? 2.6 : 1;
    };
    document.addEventListener('pointerover', over);

    const loop = () => {
      rx += (mouse.clientX - rx) * 0.12;
      ry += (mouse.clientY - ry) * 0.12;
      scale += (target - scale) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${mouse.clientX}px, ${mouse.clientY}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerover', over);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-10 w-10 rounded-full bg-violet-500/25 blur-[6px]"
        style={{ boxShadow: '0 0 30px 6px rgba(139,92,246,.35)' }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-violet-300"
        style={{ boxShadow: '0 0 10px 3px rgba(167,139,250,.95)' }}
      />
    </div>
  );
}
