import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SplitHeading from '../components/SplitHeading';
import { portfolio } from '../data/portfolio';

// Rapier (WASM) + three are loaded only when this section approaches the viewport
const TechBalls = lazy(() => import('../three/TechBalls'));

export default function TechStack() {
  const root = useRef<HTMLElement>(null);
  const [mount, setMount] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = root.current!;
    // preload slightly before it is visible, drop balls when it actually enters
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setMount(true), { rootMargin: '600px' });
    const vis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.25 });
    pre.observe(el);
    vis.observe(el);
    return () => {
      pre.disconnect();
      vis.disconnect();
    };
  }, []);

  return (
    <section id="techstack" ref={root} className="relative h-svh min-h-[640px] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[12%] z-10 flex flex-col items-center px-6 text-center">
        <p className="label mb-5">What I build with</p>
        <SplitHeading text="MY TECHSTACK" className="text-[15vw] font-semibold leading-[0.85] tracking-[-0.05em] md:text-[9vw]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="absolute inset-0" data-cursor="hover">
        {mount && active && (
          <Suspense fallback={null}>
            <TechBalls />
          </Suspense>
        )}
      </div>
      <p className="label pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        {portfolio.techstack.length} technologies · move your cursor through them
      </p>
    </section>
  );
}
