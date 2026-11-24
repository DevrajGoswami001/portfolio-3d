import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { HeroExtras } from './HeroProps';
import * as THREE from 'three';
import { GlbAvatar, ProceduralAvatar } from './Avatar';
import { markHeroReady, mouse } from '../lib/signals';
import { portfolio } from '../data/portfolio';

// Report real asset loading (GLB, textures) to the DOM loader.
const report = (progress: number, active: boolean) =>
  window.dispatchEvent(new CustomEvent('load:progress', { detail: { progress, active } }));
THREE.DefaultLoadingManager.onStart = () => report(0, true);
THREE.DefaultLoadingManager.onProgress = (_u, loaded, total) => report((loaded / total) * 100, true);
THREE.DefaultLoadingManager.onLoad = () => report(100, false);

/** Soft purple halo behind the avatar (radial gradient sprite) */
function Halo() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(167,139,250,0.95)');
    grd.addColorStop(0.35, 'rgba(139,92,246,0.45)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.scale.setScalar(4.4 + Math.sin(s.clock.elapsedTime * 0.8) * 0.15);
  });
  return (
    <mesh ref={ref} position={[0, 0.25, -1.6]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/** Thin glowing orbit ring for a bit of "tech" depth */
function Orbit() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.15;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, 1.25 + mouse.y * 0.1, 3, dt);
    ref.current.position.y = 0.1 + Math.sin(s.clock.elapsedTime) * 0.03;
  });
  return (
    <mesh ref={ref} position={[0, 0.1, -0.2]} rotation={[1.25, 0, 0]}>
      <torusGeometry args={[1.85, 0.006, 8, 160]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.5} />
    </mesh>
  );
}

function CameraRig() {
  useFrame((s, dt) => {
    // pull the camera back on tall/narrow screens so the avatar fits
    const aspect = s.size.width / s.size.height;
    const z = aspect < 0.8 ? 10.5 : aspect < 1.2 ? 8.6 : 7.2;
    s.camera.position.z = THREE.MathUtils.damp(s.camera.position.z, z, 4, dt);
    s.camera.position.x = THREE.MathUtils.damp(s.camera.position.x, mouse.x * 0.25, 2, dt);
    s.camera.position.y = THREE.MathUtils.damp(s.camera.position.y, 0.35 + mouse.y * 0.12, 2, dt);
    s.camera.lookAt(0, 0.25, 0);
  });
  return null;
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { glbUrl, scale, position } = portfolio.avatar;

  // pause rendering when the hero is off-screen (keeps the rest of the page at 60fps)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        resize={{ offsetSize: true }} // ignore CSS transforms (GSAP scales the wrapper)
        camera={{ position: [0, 0.35, 7.2], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => requestAnimationFrame(() => markHeroReady())}
      >
        <CameraRig />
        <ambientLight intensity={0.35} />
        {/* key + fill studio lights */}
        <directionalLight position={[2.5, 3, 4]} intensity={2.1} color="#fff4ea" />
        <directionalLight position={[-3, 1, 2]} intensity={0.5} color="#c7d2fe" />
        {/* purple rim lights behind the avatar */}
        <pointLight position={[-1.8, 1.4, -1.6]} intensity={22} distance={8} color="#8b5cf6" />
        <pointLight position={[1.9, 0.8, -1.5]} intensity={18} distance={8} color="#a78bfa" />
        <spotLight position={[0, 4, -3]} angle={0.6} penumbra={1} intensity={30} color="#7c3aed" />

        <Halo />
        <Orbit />
        <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.25}>
          <Suspense fallback={<ProceduralAvatar />}>
            {glbUrl ? <GlbAvatar url={glbUrl} scale={scale} position={position} /> : <ProceduralAvatar />}
          </Suspense>
        </Float>
        <HeroExtras />
        {/* floating violet dust */}
        <Sparkles count={70} scale={[9, 5, 4]} position={[0, 0.6, -1]} size={2.2} speed={0.35} opacity={0.8} color="#c4b5fd" />
        <Sparkles count={30} scale={[6, 4, 2]} position={[0, 0.4, 0.5]} size={1.2} speed={0.2} opacity={0.5} color="#ffffff" />

        {/* cinematic glow: bright parts (rim light, halo, holograms) bloom */}
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.25} radius={0.75} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
