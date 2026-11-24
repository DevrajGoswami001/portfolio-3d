import { useLayoutEffect, useRef, type ElementType } from 'react';
import { gsap } from '../lib/gsap';

interface Props {
  text: string;
  /** words (exact match, case-insensitive) rendered with the violet gradient */
  accent?: string[];
  as?: ElementType;
  className?: string;
}

/**
 * Splits a heading into words, groups them into visual lines after layout,
 * and slides each line up (expo.out) when it scrolls into view.
 */
export default function SplitHeading({ text, accent = [], as: Tag = 'h2', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const acc = accent.map((a) => a.toLowerCase());

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const words = Array.from(el.querySelectorAll<HTMLElement>('.split-word > span'));
      // group by line (same offsetTop)
      const lines: HTMLElement[][] = [];
      let lastTop = -1;
      words.forEach((w) => {
        const top = (w.parentElement as HTMLElement).offsetTop;
        if (Math.abs(top - lastTop) > 4) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(w);
      });
      gsap.set(words, { yPercent: 110 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
      lines.forEach((line, i) => {
        tl.to(line, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.04 }, i * 0.12);
      });
    }, el);
    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="split-word" aria-hidden="true">
          <span className={acc.includes(w.toLowerCase().replace(/[^\w&]/g, '')) ? 'accent-grad' : ''}>{w}</span>
          {' '}
        </span>
      ))}
    </Tag>
  );
}
