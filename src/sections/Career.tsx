import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { portfolio } from '../data/portfolio';
import SplitHeading from '../components/SplitHeading';

/** Vertical timeline; a glowing line + dot fill from top to bottom as you scroll */
export default function Career() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: '.tl-wrap', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 };
      gsap.fromTo('.tl-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.tl-dot', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: st });

      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        gsap.from(item.querySelectorAll('.tl-anim'), {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: item, start: 'top 78%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="career" ref={root} className="relative mx-auto max-w-6xl px-6 py-32 md:px-16">
      <SplitHeading
        text="My career & experience"
        accent={['experience']}
        className="mx-auto max-w-3xl text-center text-[11vw] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[5.6vw]"
      />

      <div className="tl-wrap relative mt-24">
        {/* base line + glowing fill + dot */}
        <div ref={line} className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2">
          <div className="tl-fill glow-line absolute inset-0 origin-top bg-gradient-to-b from-violet-300 via-violet-500 to-violet-600" />
          <div className="tl-dot glow-dot absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200" />
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {portfolio.career.map((c) => (
            <div key={c.year + c.role} className="tl-item relative grid grid-cols-1 gap-4 pl-12 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-12 md:pl-0">
              <div className="md:text-right">
                <h3 className="tl-anim text-2xl font-semibold tracking-tight md:text-3xl">{c.role}</h3>
                <p className="tl-anim mt-1 text-violet-300/90">{c.place}</p>
              </div>
              <div className="tl-anim order-first bg-black py-2 text-5xl font-semibold tracking-tighter text-white md:order-none md:w-44 md:text-center md:text-7xl">
                {c.year}
              </div>
              <p className="tl-anim max-w-md leading-relaxed text-mute">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
