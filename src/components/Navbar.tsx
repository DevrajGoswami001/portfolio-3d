import { portfolio } from '../data/portfolio';
import { Icon } from './Icons';

/** Text that slides up and is replaced by a violet copy on hover */
export function SlideText({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-top leading-[1.25]">
      <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{children}</span>
      <span className="absolute left-0 top-full block text-violet-300 transition-transform duration-500 ease-expo group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

export default function Navbar() {
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <header className="reveal-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent px-6 py-5 md:from-black/60 md:px-12 md:py-7">
      <a href="#home" className="group flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-violet-500/50 text-sm font-semibold shadow-[0_0_20px_-4px_rgba(139,92,246,.8)]">
          {portfolio.initials}
        </span>
        <span className="hidden text-sm font-medium tracking-wide sm:block">
          <SlideText>{portfolio.name}</SlideText>
        </span>
      </a>
      <nav className="flex items-center gap-6 text-sm md:gap-10">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="group label !text-white/80 !tracking-[0.2em]">
            <SlideText>{l.label}</SlideText>
          </a>
        ))}
      </nav>
    </header>
  );
}

/** Fixed vertical social bar on the left + RESUME link bottom-right */
export function SocialBar() {
  const items = portfolio.socials.filter((s) => s.href);
  return (
    <>
      <aside className="reveal-nav fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-5 md:flex md:left-10">
        {items.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            aria-label={s.label}
            className="text-mute transition duration-300 hover:-translate-y-1 hover:text-violet-300"
          >
            <Icon name={s.icon} className="h-[18px] w-[18px]" />
          </a>
        ))}
        <span className="h-24 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </aside>
      <a
        href={portfolio.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="reveal-nav group fixed bottom-6 right-5 z-40 flex items-center gap-3 rounded-full bg-black/60 backdrop-blur md:bottom-8 md:right-10 md:bg-transparent md:backdrop-blur-0"
        aria-label="Resume"
      >
        <span className="label hidden !text-white/80 !tracking-[0.3em] md:inline">
          <SlideText>RESUME</SlideText>
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition group-hover:border-violet-400 group-hover:bg-violet-500/20">
          ↗
        </span>
      </a>
    </>
  );
}
