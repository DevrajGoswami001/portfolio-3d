import { portfolio } from '../data/portfolio';
import SplitHeading from '../components/SplitHeading';
import { Icon } from '../components/Icons';
import { SlideText } from '../components/Navbar';
import Magnetic from '../components/Magnetic';

export default function Contact() {
  const socials = portfolio.socials.filter((s) => s.href && s.icon !== 'mail');
  return (
    <section id="contact" className="relative overflow-hidden px-6 pb-10 pt-40 md:px-[9vw]">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[140px]" />
      <p className="label mb-8 flex items-center gap-4">
        <span className="h-px w-10 bg-violet-500" /> Contact
      </p>
      <SplitHeading
        text={portfolio.contact.heading}
        accent={['together']}
        className="text-[15vw] font-semibold leading-[0.88] tracking-[-0.05em] md:text-[9vw]"
      />
      <p className="mt-8 max-w-xl text-mute" data-speed="0.97">{portfolio.contact.sub}</p>

      <div className="mt-14 flex flex-col gap-10 border-t border-white/10 pt-10 md:flex-row md:items-end md:justify-between">
        <Magnetic strength={0.15}>
        <a href={`mailto:${portfolio.email}`} className="group block text-2xl font-medium tracking-tight md:text-4xl">
          <SlideText>{portfolio.email}</SlideText>
          <span className="mt-2 block h-px w-full origin-left scale-x-[.2] bg-violet-500 transition-transform duration-700 ease-expo group-hover:scale-x-100" />
        </a>
        </Magnetic>
        <div className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <Magnetic key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm transition hover:border-violet-400 hover:bg-violet-500/10"
            >
              <Icon name={s.icon} className="h-4 w-4" />
              <SlideText>{s.label}</SlideText>
            </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <footer className="relative mt-32 flex flex-col justify-between gap-3 pb-16 text-xs text-mute md:flex-row md:pb-0 md:pr-40">
        <span>
          Designed & developed by <span className="text-white">{portfolio.name}</span> © {new Date().getFullYear()}
        </span>
        <span>
          {portfolio.location}
          {portfolio.phone ? ` · ${portfolio.phone}` : ''}
        </span>
      </footer>
    </section>
  );
}
