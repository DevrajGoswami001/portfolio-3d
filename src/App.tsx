import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './lib/gsap';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Navbar, { SocialBar } from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Career from './sections/Career';
import TechStack from './sections/TechStack';
import Work from './sections/Work';
import Contact from './sections/Contact';
import VelocityMarquee from './components/VelocityMarquee';

export default function App() {
  // subtle parallax: any element with data-speed="0.9" etc. drifts at a different rate
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '1');
        gsap.to(el, {
          yPercent: (1 - speed) * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('load', onResize);
    return () => {
      window.removeEventListener('load', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Navbar />
      <SocialBar />
      <main>
        <Hero />
        <About />
        <VelocityMarquee items={['Full-Stack', 'React', 'Node.js', 'MongoDB', 'LangChain', 'C++']} />
        <Career />
        <TechStack />
        <Work />
        <VelocityMarquee reverse items={['Open to work', 'Let’s build', 'SDE · 2026', 'Hire Devraj']} />
        <Contact />
      </main>
    </>
  );
}
