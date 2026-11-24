import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { portfolio } from '../data/portfolio';
import SplitHeading from '../components/SplitHeading';
import { SlideText } from '../components/Navbar';

/** Pinned horizontal-scroll gallery on desktop; stacked cards on mobile. */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth;
        gsap.to(t, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // parallax inside each image while the track moves
        gsap.utils.toArray<HTMLElement>('.work-img').forEach((img) => {
          gsap.fromTo(img, { xPercent: -6 }, {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // 3D tilt + inner image depth on hover (desktop pointers only)
  useLayoutEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const cards = Array.from(root.current!.querySelectorAll<HTMLElement>('.work-card'));
    const offs = cards.map((card) => {
      gsap.set(card, { transformPerspective: 1100 });
      const inner = card.querySelector<HTMLElement>('.work-media')!;
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const ix = gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' });
      const iy = gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 10);
        rx(-py * 8);
        ix(px * -8);
        iy(py * -6);
        card.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        card.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      };
      const leave = () => {
        rx(0);
        ry(0);
        ix(0);
        iy(0);
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      return () => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      };
    });
    return () => offs.forEach((f) => f());
  }, []);

  // cards rise in once the section is on screen (IntersectionObserver is
  // more reliable than a ScrollTrigger on an element that is itself pinned)
  useLayoutEffect(() => {
    const el = root.current!;
    const cards = el.querySelectorAll<HTMLElement>('.work-card');
    gsap.set(cards, { y: 80, opacity: 0 });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        gsap.to(cards, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12 });
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      gsap.set(cards, { clearProps: 'transform,opacity' });
    };
  }, []);

  return (
    <section id="work" ref={root} className="relative overflow-hidden py-24 md:flex md:h-svh md:items-center md:py-0">
      <div ref={track} className="flex flex-col gap-10 px-6 md:flex-row md:items-center md:gap-[4vw] md:px-[9vw]">
        <div className="shrink-0 md:w-[30vw]">
          <p className="label mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-violet-500" /> Selected work
          </p>
          <SplitHeading text="Things I've built" accent={['built']} className="text-[12vw] font-semibold leading-[0.92] tracking-[-0.04em] md:text-[5vw]" />
          <p className="mt-6 max-w-sm text-mute">Full-stack products — real-time collaboration, payments and conversational AI.</p>
        </div>

        {portfolio.projects.map((p, i) => (
          <a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="work-card group block shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition duration-500 ease-expo hover:border-violet-500/70 hover:shadow-[0_0_60px_-12px_rgba(139,92,246,.7)] md:w-[46vw] lg:w-[40vw]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900">
              <div className="work-media absolute -inset-2">
              <img
                src={p.image}
                alt={`${p.title} cover`}
                loading="lazy"
                className="work-img absolute inset-0 h-full w-full scale-[1.12] object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.2]"
              />
              </div>
              {/* cursor-following sheen */}
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(167,139,250,.28), transparent 45%)' }} />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs backdrop-blur">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-start justify-between gap-6 px-2 pb-2 pt-6">
              <div>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{p.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="label mt-2 flex shrink-0 items-center gap-2 !text-white">
                <SlideText>View</SlideText> ↗
              </span>
            </div>
          </a>
        ))}
        <div className="hidden w-[6vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
