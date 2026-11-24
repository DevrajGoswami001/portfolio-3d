import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { mouse } from '../lib/signals';

const SKIN = '#f2c6a0';
const SKIN_SHADE = '#e0a983';
const HAIR = '#16131f';
const HOODIE = '#262033';
const HOODIE_DARK = '#1b1626';
const FRAME = '#0d0d12';

const damp = THREE.MathUtils.damp;

/**
 * Stylised cartoon developer (glasses + hoodie) built from primitives,
 * so the hero works with zero downloads. Head and pupils follow the mouse,
 * eyes blink, and the body "breathes".
 *
 * ▶ To use your own GLB instead, set `avatar.glbUrl` in src/data/portfolio.ts
 *   (see <GlbAvatar/> below).
 */
export function ProceduralAvatar() {
  const head = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group>(null);
  const lids = useRef<THREE.Group>(null);
  const nextBlink = useRef(2 + Math.random() * 3);

  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.55 }), []);
  const hoodie = useMemo(() => new THREE.MeshStandardMaterial({ color: HOODIE, roughness: 0.85 }), []);
  const hoodieDark = useMemo(() => new THREE.MeshStandardMaterial({ color: HOODIE_DARK, roughness: 0.9 }), []);
  const hair = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.7 }), []);
  const frame = useMemo(() => new THREE.MeshStandardMaterial({ color: FRAME, roughness: 0.3, metalness: 0.4 }), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, mouse.x * 0.55, 5, dt);
      head.current.rotation.x = damp(head.current.rotation.x, -mouse.y * 0.28, 5, dt);
      head.current.rotation.z = damp(head.current.rotation.z, -mouse.x * 0.06, 5, dt);
    }
    if (pupils.current) {
      pupils.current.position.x = damp(pupils.current.position.x, mouse.x * 0.028, 8, dt);
      pupils.current.position.y = damp(pupils.current.position.y, mouse.y * 0.022, 8, dt);
    }
    if (body.current) {
      body.current.scale.y = 1 + Math.sin(t * 1.6) * 0.012;
      body.current.rotation.y = damp(body.current.rotation.y, mouse.x * 0.12, 3, dt);
    }
    // blink
    if (lids.current) {
      let s = 0.02;
      const since = t - nextBlink.current;
      if (since > 0 && since < 0.16) s = Math.sin((since / 0.16) * Math.PI);
      if (since >= 0.16) nextBlink.current = t + 2.5 + Math.random() * 3.5;
      lids.current.children.forEach((c) => (c.scale.y = Math.max(0.02, s)));
    }
  });

  return (
    <group position={[0, -1.25, 0]}>
      {/* ───── body / hoodie ───── */}
      <group ref={body}>
        <mesh material={hoodie} position={[0, -0.25, 0]} scale={[1.38, 1, 0.86]} castShadow>
          <sphereGeometry args={[1, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        </mesh>
        <mesh material={hoodie} position={[0, -1.85, 0]} scale={[1.38, 1, 0.86]}>
          <cylinderGeometry args={[0.93, 1.05, 3, 48]} />
        </mesh>
        {/* hood bunched around the neck */}
        <mesh material={hoodieDark} position={[0, 0.66, -0.12]} rotation={[Math.PI / 2.15, 0, 0]}>
          <torusGeometry args={[0.42, 0.17, 20, 48]} />
        </mesh>
        <mesh material={hoodie} position={[0, 0.78, -0.42]} scale={[1, 0.9, 0.7]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {/* drawstrings */}
        {[-0.16, 0.16].map((x) => (
          <group key={x} position={[x, 0.28, 0.66]} rotation={[0.18, 0, x * 0.4]}>
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
              <meshStandardMaterial color="#d9d4ea" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.41, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.07, 10]} />
              <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
        {/* small chest logo </> as glowing bars */}
        <group position={[0.42, 0.05, 0.75]} rotation={[0.05, 0.35, 0]}>
          {[-0.07, 0, 0.07].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, i === 1 ? 0.5 : i === 0 ? 0.6 : -0.6]}>
              <boxGeometry args={[0.018, 0.1, 0.01]} />
              <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={1.4} />
            </mesh>
          ))}
        </group>
        {/* neck */}
        <mesh material={skin} position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.17, 0.19, 0.4, 24]} />
        </mesh>
      </group>

      {/* ───── head (follows mouse) ───── */}
      <group ref={head} position={[0, 1.33, 0]}>
        <mesh material={skin} scale={[1, 1.08, 0.98]} castShadow>
          <sphereGeometry args={[0.56, 64, 64]} />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} material={skin} position={[s * 0.55, 0, -0.02]} scale={[0.45, 0.85, 0.6]}>
            <sphereGeometry args={[0.13, 20, 20]} />
          </mesh>
        ))}
        {/* hair cap + fringe */}
        <mesh material={hair} position={[0, 0.06, -0.03]} rotation={[-0.28, 0, 0]} scale={[1.04, 1.06, 1.04]}>
          <sphereGeometry args={[0.575, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        {[
          [-0.26, 0.45, 0.33, 0.2],
          [-0.05, 0.52, 0.36, 0.22],
          [0.18, 0.49, 0.34, 0.21],
          [0.36, 0.38, 0.28, 0.17],
          [-0.42, 0.3, 0.22, 0.16],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} material={hair} position={[x, y, z]} scale={[1.2, 0.75, 0.9]}>
            <sphereGeometry args={[r, 20, 20]} />
          </mesh>
        ))}
        {/* eyebrows */}
        {[-1, 1].map((s) => (
          <mesh key={s} material={hair} position={[s * 0.2, 0.21, 0.5]} rotation={[0, 0, s * -0.12]}>
            <boxGeometry args={[0.16, 0.035, 0.03]} />
          </mesh>
        ))}
        {/* eyes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.19, 0.04, 0.46]} scale={[1, 1.1, 0.6]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        ))}
        <group ref={pupils}>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.19, 0.04, 0.51]}>
              <mesh>
                <sphereGeometry args={[0.048, 20, 20]} />
                <meshStandardMaterial color="#1a1030" roughness={0.1} />
              </mesh>
              <mesh position={[0.016, 0.018, 0.035]}>
                <sphereGeometry args={[0.014, 10, 10]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>
        {/* eyelids for blinking */}
        <group ref={lids}>
          {[-1, 1].map((s) => (
            <mesh key={s} material={skin} position={[s * 0.19, 0.04, 0.47]} scale={[1.05, 0.02, 0.65]}>
              <sphereGeometry args={[0.1, 20, 20]} />
            </mesh>
          ))}
        </group>
        {/* glasses */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.19, 0.04, 0.565]}>
            <mesh material={frame}>
              <torusGeometry args={[0.135, 0.018, 12, 40]} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.13, 32]} />
              <meshPhysicalMaterial color="#a78bfa" transparent opacity={0.16} roughness={0} metalness={0.2} clearcoat={1} />
            </mesh>
          </group>
        ))}
        <mesh material={frame} position={[0, 0.06, 0.575]}>
          <boxGeometry args={[0.11, 0.022, 0.02]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={frame} position={[s * 0.5, 0.06, 0.24]} rotation={[0, s * 1.35, 0]}>
            <boxGeometry args={[0.42, 0.022, 0.02]} />
          </mesh>
        ))}
        {/* nose, smile, blush */}
        <mesh position={[0, -0.08, 0.55]} scale={[1, 0.9, 0.8]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color={SKIN_SHADE} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.22, 0.5]} rotation={[0.25, 0, Math.PI]}>
          <torusGeometry args={[0.095, 0.017, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#7a2e3a" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.3, -0.12, 0.45]} rotation={[0, s * 0.5, 0]}>
            <circleGeometry args={[0.06, 20]} />
            <meshBasicMaterial color="#ff8fab" transparent opacity={0.28} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * ▶ YOUR OWN MODEL
 * Put a GLB at /public/models/avatar.glb and set `avatar.glbUrl` in portfolio.ts.
 * Works with Ready Player Me / Avaturn / Mixamo-style rigs: any bone whose name
 * contains "Head" (and optionally "Neck") is rotated toward the cursor.
 */
export function GlbAvatar({ url, scale, position }: { url: string; scale: number; position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const bones = useMemo(() => {
    let head: THREE.Object3D | undefined;
    let neck: THREE.Object3D | undefined;
    scene.traverse((o) => {
      if (!head && /head/i.test(o.name) && !/top|end/i.test(o.name)) head = o;
      if (!neck && /neck/i.test(o.name)) neck = o;
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.frustumCulled = false;
      }
    });
    return { head, neck, base: { hx: head?.rotation.x ?? 0, hy: head?.rotation.y ?? 0 } };
  }, [scene]);

  useEffect(() => () => useGLTF.clear(url), [url]);

  useFrame((_, dt) => {
    const { head, neck, base } = bones;
    if (head) {
      head.rotation.y = damp(head.rotation.y, base.hy + mouse.x * 0.5, 5, dt);
      head.rotation.x = damp(head.rotation.x, base.hx - mouse.y * 0.25, 5, dt);
    }
    if (neck) neck.rotation.y = damp(neck.rotation.y, mouse.x * 0.15, 4, dt);
  });

  return <primitive object={scene} scale={scale} position={position} />;
}
