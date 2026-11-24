import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { REVEAL_EVENT } from '../lib/signals';
import { portfolio } from '../data/portfolio';
import ScrambleText from '../components/ScrambleText';

// heavy 3D chunk is lazy-loaded
const HeroScene = lazy(() => import('../three/HeroScene'));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const avatar = useRef<HTMLDivElement>(null);
  const { hero, firstName, lastName } = portfolio;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-in', { yPercent: 115 });
      gsap.set('.hero-fade', { opacity: 0, y: 20 });
      gsap.set(avatar.current, { opacity: 0, scale: 0.9 });
      const nav = document.querySelectorAll('.reveal-nav'); // outside this section, so not scoped
      gsap.set(nav, { opacity: 0 });

      const intro = () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.to(avatar.current, { opacity: 1, scale: 1, duration: 2 })
          .to('.hero-in', { yPercent: 0, duration: 1.4, stagger: 0.08 }, 0.15)
          .to('.hero-fade', { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.5)
          .to(nav, { opacity: 1, duration: 1.2, stagger: 0.05 }, 0.7);
      };
      window.addEventListener(REVEAL_EVENT, intro, { once: true });

      // Pin the hero; the avatar drifts to the side and shrinks while the text exits
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' },
        (c) => {
          const desktop = (c.conditions as { desktop: boolean }).desktop;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=75%', scrub: 1, pin: true },
            defaults: { ease: 'none' },
          });
          tl.to(avatar.current, desktop ? { xPercent: 30, scale: 0.7, opacity: 0.35 } : { yPercent: -18, scale: 0.8, opacity: 0.3 }, 0)
            .to('.hero-left', { xPercent: -35, opacity: 0 }, 0)
            .to('.hero-right', { xPercent: 35, opacity: 0 }, 0)
            .to('.hero-scroll', { opacity: 0 }, 0);
        },
      );
      return () => window.removeEventListener(REVEAL_EVENT, intro);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={root} className="relative h-svh min-h-[620px] w-full overflow-hidden">
      {/* purple floor glow */}
      <div className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />

      <div ref={avatar} className="pointer-events-none absolute inset-0 will-change-transform">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* fade the avatar's body into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* left: greeting + name */}
      <div className="hero-left absolute left-6 top-[16%] md:left-[9vw] md:top-1/2 md:-translate-y-1/2">
        <div className="overflow-hidden">
          <p className="hero-in label !text-violet-300">{hero.greeting}</p>
        </div>
        <h1 className="mt-3 text-[13vw] font-semibold uppercase leading-[0.88] tracking-[-0.04em] md:text-[6.2vw]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-in block">{firstName}</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-in block text-white/90">{lastName}</span>
          </span>
        </h1>
      </div>

      {/* right: role with scramble */}
      <div className="hero-right absolute bottom-[14%] right-6 text-right md:bottom-auto md:right-[9vw] md:top-1/2 md:-translate-y-1/2">
        <div className="overflow-hidden">
          <p className="hero-in text-xl font-light text-white/80 md:text-[2vw]">{hero.headingPrefix}</p>
        </div>
        <div className="overflow-hidden">
          <p className="hero-in mt-1 text-[9vw] font-semibold leading-none tracking-[-0.03em] md:text-[4.2vw]">
            <ScrambleText words={hero.cyclingWords} className="accent-grad" />
          </p>
        </div>
        <p className="hero-fade label mt-4">{hero.tagline}</p>
      </div>

      <div className="hero-scroll hero-fade absolute bottom-8 left-[9vw] hidden flex-col items-center gap-3 md:flex">
        <span className="label !text-[0.65rem]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollline_1.8s_ease-in-out_infinite] bg-violet-400" />
        </span>
      </div>
      <style>{`@keyframes scrollline{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
