import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Decal, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { portfolio, type Tech } from '../data/portfolio';
import { makeLogoTexture } from './logoTexture';

const sphere = new THREE.SphereGeometry(1, 48, 48);
const pearl = new THREE.MeshPhysicalMaterial({
  color: '#f5f3ff',
  roughness: 0.16,
  metalness: 0.05,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  sheen: 0.4,
  sheenColor: new THREE.Color('#c4b5fd'),
});

function useTechTexture(t: Tech) {
  const [tex] = useMemo(() => {
    if (!t.logo) return [makeLogoTexture(t)];
    // real logo image from /public/logos — loaded through three's loading manager
    const l = new THREE.TextureLoader().load(t.logo);
    l.colorSpace = THREE.SRGBColorSpace;
    l.anisotropy = 8;
    return [l];
  }, [t]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Ball({ tech, scale, start }: { tech: Tech; scale: number; start: [number, number, number] }) {
  const api = useRef<RapierRigidBody>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const tex = useTechTexture(tech);

  // gently pull every ball toward the centre
  useFrame((_, delta) => {
    const b = api.current;
    if (!b) return;
    const d = Math.min(0.1, delta);
    const p = b.translation();
    vec.set(p.x, p.y, p.z).normalize().multiply({ x: -50 * d * scale, y: -120 * d * scale, z: -50 * d * scale } as THREE.Vector3);
    b.applyImpulse(vec, true);
  });

  return (
    <RigidBody ref={api} colliders={false} position={start} linearDamping={0.75} angularDamping={0.15} friction={0.2} restitution={0.3}>
      <BallCollider args={[scale]} />
      <mesh geometry={sphere} material={pearl} scale={scale} castShadow receiveShadow>
        <Decal position={[0, 0, 1]} rotation={[0, 0, 0]} scale={1.05} map={tex} />
        <Decal position={[0, 0, -1]} rotation={[0, Math.PI, 0]} scale={1.05} map={tex} />
      </mesh>
    </RigidBody>
  );
}

/** Invisible kinematic collider that follows the cursor and shoves the balls */
function Pointer() {
  const ref = useRef<RapierRigidBody>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(v.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0));
  });
  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[0, 50, 0]}>
      <BallCollider args={[1.3]} />
    </RigidBody>
  );
}

function Balls({ mobile }: { mobile: boolean }) {
  const { viewport } = useThree();
  const items = mobile ? portfolio.techstack.slice(0, 10) : portfolio.techstack;
  const balls = useMemo(
    () =>
      items.map((t, i) => ({
        tech: t,
        scale: (mobile ? 0.8 : 1) * [1, 0.9, 1.15, 0.95, 1.25][i % 5],
        // start well above the view so they "drop in"
        start: [THREE.MathUtils.randFloatSpread(viewport.width * 0.7), 14 + i * 1.6, THREE.MathUtils.randFloatSpread(4)] as [number, number, number],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mobile],
  );
  return (
    <>
      <Pointer />
      {balls.map((b) => (
        <Ball key={b.tech.name} {...b} />
      ))}
    </>
  );
}

export default function TechBalls() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <Canvas
      dpr={[1, 1.6]}
      resize={{ offsetSize: true }} // ignore CSS transforms (GSAP scales the wrapper)
      shadows={false}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, mobile ? 30 : 20], fov: 32.5, near: 1, far: 80 }}
    >
      <ambientLight intensity={0.9} />
      <spotLight position={[20, 20, 25]} penumbra={1} angle={0.25} intensity={2} color="#ffffff" />
      <pointLight position={[0, 0, 8]} intensity={40} distance={30} color="#8b5cf6" />
      <directionalLight position={[0, 5, -4]} intensity={2} color="#a78bfa" />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Balls mobile={mobile} />
      </Physics>

      {/* studio environment built from light-formers (no HDR download needed) */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring" color="#8b5cf6" intensity={80} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
        </group>
      </Environment>
    </Canvas>
  );
}
