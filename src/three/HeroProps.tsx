import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mouse } from '../lib/signals';

const damp = THREE.MathUtils.damp;

/** Draws a glowing code snippet into a canvas texture for the holographic panels */
function codeTexture(lines: [string, string][], title: string) {
  const W = 720;
  const H = 460;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, 'rgba(76, 29, 149, 0.55)');
  bg.addColorStop(1, 'rgba(10, 8, 25, 0.35)');
  g.fillStyle = bg;
  g.beginPath();
  g.roundRect(4, 4, W - 8, H - 8, 28);
  g.fill();
  g.strokeStyle = 'rgba(196, 181, 253, 0.65)';
  g.lineWidth = 3;
  g.stroke();
  // title bar
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(42 + i * 28, 40, 8, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.font = '500 22px "Space Grotesk", monospace';
  g.fillText(title, 140, 48);
  g.font = '500 27px Consolas, "Courier New", monospace';
  lines.forEach(([txt, col], i) => {
    g.fillStyle = col;
    g.fillText(txt, 40, 112 + i * 44);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Panel({ position, rotation, lines, title, phase }: { position: [number, number, number]; rotation: [number, number, number]; lines: [string, string][]; title: string; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => codeTexture(lines, title), [lines, title]);
  useFrame((s, dt) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime + phase;
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.06;
    ref.current.rotation.y = damp(ref.current.rotation.y, rotation[1] + mouse.x * 0.12, 3, dt);
    ref.current.rotation.x = damp(ref.current.rotation.x, rotation[0] - mouse.y * 0.08, 3, dt);
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[1.35, 0.86]} />
      <meshBasicMaterial map={tex} transparent opacity={0.9} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Two floating "hologram" code windows behind the avatar */
export function CodePanels() {
  const left = useMemo<[string, string][]>(
    () => [
      ['const dev = {', '#e9d5ff'],
      ["  name: 'Devraj',", '#c3e88d'],
      ["  stack: 'MERN',", '#c3e88d'],
      ['  ships: true,', '#82aaff'],
      ['};', '#e9d5ff'],
      ['dev.build();  // 🚀', '#a78bfa'],
    ],
    [],
  );
  const right = useMemo<[string, string][]>(
    () => [
      ["app.get('/api', auth,", '#e9d5ff'],
      ['  async (req, res) => {', '#82aaff'],
      ['    const ai = await', '#e9d5ff'],
      ['      chain.call(req);', '#c3e88d'],
      ['    res.json(ai);', '#e9d5ff'],
      ['});', '#e9d5ff'],
    ],
    [],
  );
  return (
    <>
      <Panel position={[-1.95, 1.3, -1.3]} rotation={[0.05, 0.38, -0.04]} lines={left} title="developer.ts" phase={0} />
      <Panel position={[1.95, 1.05, -1.4]} rotation={[0.05, -0.38, 0.04]} lines={right} title="server.js" phase={1.7} />
    </>
  );
}

/** Laptop at the bottom of the frame — glowing lid logo faces the camera */
export function Laptop() {
  const lidLogo = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#c4b5fd';
    g.font = '700 120px "Space Grotesk", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('</>', 128, 132);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group position={[0, -1.62, 1.25]} rotation={[0.12, 0, 0]}>
      {/* base */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[1.36, 0.04, 0.85]} />
        <meshStandardMaterial color="#2a2735" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* lid (back faces the viewer) */}
      <group position={[0, 0.02, -0.25]} rotation={[-0.32, 0, 0]}>
        {/* thin glowing rim around the lid */}
        <mesh position={[0, 0.45, -0.005]}>
          <boxGeometry args={[1.39, 0.89, 0.03]} />
          <meshBasicMaterial color={new THREE.Color(1.4, 0.9, 3)} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.36, 0.86, 0.04]} />
          <meshStandardMaterial color="#2b2838" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.47, 0.025]}>
          <planeGeometry args={[0.36, 0.36]} />
          <meshBasicMaterial map={lidLogo} transparent toneMapped={false} color={new THREE.Color(2.2, 1.8, 3.2)} />
        </mesh>
        {/* screen light spilling onto the avatar */}
        <pointLight position={[0, 0.5, -0.4]} intensity={4} distance={2.5} color="#a5b4fc" />
      </group>
    </group>
  );
}

/** Holograms + laptop on wide screens only (they crowd the text on phones) */
export function HeroExtras() {
  const { size } = useThree();
  if (size.width / size.height < 0.9) return null;
  return (
    <>
      <CodePanels />
      <Laptop />
    </>
  );
}
