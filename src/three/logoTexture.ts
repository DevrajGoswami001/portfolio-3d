import * as THREE from 'three';
import type { Tech } from '../data/portfolio';

/**
 * Generates a crisp logo "badge" texture in a canvas so the balls work with no
 * image downloads. To use real logos instead, add `logo: '/logos/react.png'`
 * to an item in src/data/portfolio.ts (file goes in /public/logos/).
 */
export function makeLogoTexture(t: Tech): THREE.Texture {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, S, S);

  // rounded badge
  const r = 96;
  const pad = 70;
  g.fillStyle = t.bg;
  g.beginPath();
  g.roundRect(pad, pad, S - pad * 2, S - pad * 2, r);
  g.fill();

  g.fillStyle = t.fg;
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  if (t.name === 'React') {
    // atom
    g.strokeStyle = t.fg;
    g.lineWidth = 14;
    for (let i = 0; i < 3; i++) {
      g.save();
      g.translate(S / 2, S / 2);
      g.rotate((i * Math.PI) / 3);
      g.beginPath();
      g.ellipse(0, 0, 150, 58, 0, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }
    g.beginPath();
    g.arc(S / 2, S / 2, 26, 0, Math.PI * 2);
    g.fill();
  } else if (t.name === 'MongoDB') {
    // leaf
    g.beginPath();
    g.moveTo(S / 2, 120);
    g.bezierCurveTo(360, 210, 340, 330, S / 2, 400);
    g.bezierCurveTo(172, 330, 152, 210, S / 2, 120);
    g.fill();
    g.fillStyle = t.bg;
    g.fillRect(S / 2 - 5, 200, 10, 210);
  } else {
    const len = t.label.length;
    const size = len <= 2 ? 200 : len === 3 ? 160 : len === 4 ? 128 : 104;
    g.font = `700 ${size}px "Space Grotesk", Arial, sans-serif`;
    g.fillText(t.label, S / 2, S / 2 + 8);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
