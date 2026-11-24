import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Cycles through words, morphing between them with a text-scramble effect. */
export default function ScrambleText({ words, interval = 2800, className = '' }: { words: string[]; interval?: number; className?: string }) {
  const [out, setOut] = useState(words[0]);
  const idx = useRef(0);
  const cur = useRef(words[0]);

  useEffect(() => {
    let raf = 0;
    let timer = 0;
    const scrambleTo = (next: string) => {
      const from = cur.current;
      cur.current = next;
      const len = Math.max(from.length, next.length);
      const queue = Array.from({ length: len }, (_, i) => {
        const start = Math.floor(Math.random() * 18);
        return { from: from[i] ?? '', to: next[i] ?? '', start, end: start + 12 + Math.floor(Math.random() * 18), ch: '' };
      });
      let frame = 0;
      const update = () => {
        let done = 0;
        const s = queue
          .map((q) => {
            if (frame >= q.end) {
              done++;
              return q.to;
            }
            if (frame >= q.start) {
              if (!q.ch || Math.random() < 0.28) q.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              return q.ch;
            }
            return q.from;
          })
          .join('');
        setOut(s);
        if (done < queue.length) {
          frame++;
          raf = requestAnimationFrame(update);
        }
      };
      update();
    };
    timer = window.setInterval(() => {
      idx.current = (idx.current + 1) % words.length;
      scrambleTo(words[idx.current]);
    }, interval);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [words, interval]);

  return (
    <span className={className} aria-label={words.join(' / ')}>
      {out}
    </span>
  );
}
