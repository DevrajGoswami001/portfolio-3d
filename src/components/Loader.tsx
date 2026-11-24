import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { isHeroReady, REVEAL_EVENT } from '../lib/signals';
import { portfolio } from '../data/portfolio';

/**
 * 0–100% counter. Real progress comes from three's loading manager (GLB/textures)
 * plus a "hero 3D scene is ready" signal; it never finishes before both are done.
 */
export default function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  // real asset progress is reported by the lazily-loaded 3D chunk (see three/HeroScene.tsx)
  const real = useRef({ progress: 0, active: false });
  useEffect(() => {
    const on = (e: Event) => (real.current = (e as CustomEvent<{ progress: number; active: boolean }>).detail);
    window.addEventListener('load:progress', on);
    return () => window.removeEventListener('load:progress', on);
  }, []);

  useEffect(() => {
    let p = 0;
    let finished = false;
    let readyAt = 0;
    let readyFrom = 0;
    const started = performance.now();
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    let fontsDone = false;
    fontsReady.then(() => (fontsDone = true));
    const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

    // time-based (not frame-based) so slow devices never get stuck
    const tick = () => {
      if (finished) return;
      const now = performance.now();
      const elapsed = now - started;
      const ready = (isHeroReady() && fontsDone && !real.current.active && elapsed > 1400) || elapsed > 9000;
      if (ready && !readyAt) {
        readyAt = now;
        readyFrom = p;
      }
      if (readyAt) {
        p = readyFrom + (100 - readyFrom) * easeOut((now - readyAt) / 500);
      } else {
        const timeP = 92 * easeOut(elapsed / 2600);
        const assetP = real.current.active ? 40 + real.current.progress * 0.52 : timeP;
        p = Math.max(p, Math.min(timeP, assetP));
      }
      setPct(Math.floor(p));
      if (p >= 99.9) {
        finished = true;
        clearInterval(id);
        reveal();
      }
    };
    const id = window.setInterval(tick, 40);

    const reveal = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
          window.__lenis?.start();
          ScrollTrigger.refresh();
        },
      });
      tl.to('.ld-count', { yPercent: -110, duration: 0.7, ease: 'expo.in' })
        .to('.ld-meta', { opacity: 0, duration: 0.4 }, '<')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' })
        .add(() => window.dispatchEvent(new Event(REVEAL_EVENT)), '-=0.55');
    };

    return () => {
      finished = true;
      clearInterval(id);
    };
  }, []);

  if (gone) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-black p-6 md:p-10"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="ld-meta flex justify-between label">
        <span>{portfolio.name}</span>
        <span>Portfolio © {new Date().getFullYear()}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="ld-meta label hidden md:block">Loading 3D experience</div>
        <div className="overflow-hidden">
          <div className="ld-count text-[22vw] font-semibold leading-[0.8] tracking-tighter md:text-[14vw]">
            {pct}
            <span className="text-violet-400">%</span>
          </div>
        </div>
      </div>
      <div className="ld-meta absolute bottom-0 left-0 h-px bg-violet-500" style={{ width: `${pct}%`, boxShadow: '0 0 12px #8b5cf6' }} />
    </div>
  );
}
