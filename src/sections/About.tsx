import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { portfolio } from '../data/portfolio';

/** Words fade in one by one, scrubbed to scroll position */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.12, filter: 'blur(4px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
        },
      );
      gsap.from('.about-label', { opacity: 0, y: 20, scrollTrigger: { trigger: root.current, start: 'top 80%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32 md:px-24">
      <p className="about-label label mb-10 flex items-center gap-4">
        <span className="h-px w-10 bg-violet-500" /> About me
      </p>
      <p className="about-text text-[7vw] font-medium leading-[1.18] tracking-[-0.02em] md:text-[3.1vw]" data-speed="0.95">
        {portfolio.about.split(' ').map((w, i) => (
          <span key={i} className="about-word inline-block whitespace-pre">
            {w}{' '}
          </span>
        ))}
      </p>
      <div className="about-label mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
        {[
          ['8.3', 'CGPA · SRM IST'],
          ['300+', 'LeetCode problems'],
          ['1,580', 'Contest rating'],
          ['7+', 'Hackathons'],
        ].map(([n, l]) => (
          <div key={l} className="bg-black p-6">
            <div className="text-3xl font-semibold tracking-tight md:text-4xl">{n}</div>
            <div className="label mt-2 !text-[0.65rem]">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
