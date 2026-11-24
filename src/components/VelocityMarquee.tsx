import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Giant outlined text strip. It drifts constantly, speeds up with scroll
 * velocity, reverses with scroll direction and skews while you scroll fast.
 */
export default function VelocityMarquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const skewer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let skew = 0;
    const tick = (_t: number, dtMs: number) => {
      const v = window.__lenis?.velocity ?? 0;
      if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      const speed = 0.04 + Math.min(Math.abs(v) * 0.02, 0.9);
      x += dir * speed * dtMs * 0.06;
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, v * 0.6)) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px,0,0)`;
      if (skewer.current) skewer.current.style.transform = `skewX(${-skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reverse]);

  const row = items.map((t, i) => (
    <span key={i} className="flex items-center gap-[4vw] whitespace-nowrap pr-[4vw]">
      <span className={i % 2 ? 'accent-grad' : 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.55)]'}>{t}</span>
      <span className="text-violet-500">✦</span>
    </span>
  ));

  return (
    <div className="relative overflow-hidden border-y border-white/10 py-6 md:py-8" aria-hidden="true">
      <div ref={skewer}>
        <div ref={track} className="flex w-max text-[13vw] font-semibold uppercase leading-none tracking-[-0.04em] will-change-transform md:text-[7.5vw]">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
