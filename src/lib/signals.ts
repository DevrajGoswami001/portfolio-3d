/**
 * Tiny shared state used by both the DOM and the 3D canvases.
 * - mouse: normalised pointer position (-1..1) for the whole window
 * - ready/reveal events: the loader waits for the hero 3D scene, then reveals the page
 */

export const mouse = { x: 0, y: 0, clientX: 0, clientY: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}

let heroReady = false;
export const markHeroReady = () => {
  if (heroReady) return;
  heroReady = true;
  window.dispatchEvent(new Event('hero:ready'));
};
export const isHeroReady = () => heroReady;

export const REVEAL_EVENT = 'site:reveal';
export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
