import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const MAX_ROTATION = THREE.MathUtils.degToRad(10);

function BottleMesh({ accent = 'gold' }: { accent?: string }) {
  const bottleRef = useRef<THREE.Group>(null);

  const tint = useMemo(() => {
    const accentColor: Record<string, string> = {
      gold: '#c9a04e',
      amber: '#be7222',
      copper: '#a0522d',
      rose: '#c08888',
    };

    return accentColor[accent] || accentColor.gold;
  }, [accent]);

  useFrame((state) => {
    if (!bottleRef.current) {
      return;
    }

    const targetY = THREE.MathUtils.clamp(
      Math.sin(state.clock.elapsedTime * 0.4) * 0.08 + state.mouse.x * 0.07,
      -MAX_ROTATION,
      MAX_ROTATION,
    );
    const targetX = THREE.MathUtils.clamp(
      state.mouse.y * -0.06,
      -MAX_ROTATION,
      MAX_ROTATION,
    );

    bottleRef.current.rotation.y = targetY;
    bottleRef.current.rotation.x = targetX;
  });

  return (
    <group ref={bottleRef} scale={1.4} position={[0, -0.12, 0]}>
      <RoundedBox args={[1, 2.2, 0.55]} radius={0.12} smoothness={4} position={[0, 0, 0]}>
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          roughness={0.04}
          transmission={0.96}
          ior={1.52}
          chromaticAberration={0.03}
          color={tint}
          background={new THREE.Color('#0a0812')}
        />
      </RoundedBox>

      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.84, 1.4, 0.38]} />
        <meshStandardMaterial color={tint} transparent opacity={0.22} roughness={0.1} />
      </mesh>

      <RoundedBox args={[0.78, 0.38, 0.44]} radius={0.06} smoothness={4} position={[0, 1.29, 0]}>
        <meshStandardMaterial color="#1a1520" metalness={0.6} roughness={0.25} />
      </RoundedBox>

      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.26, 20]} />
        <meshStandardMaterial color="#1a1520" metalness={0.4} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.1, 0.285]}>
        <planeGeometry args={[0.72, 1.1]} />
        <meshStandardMaterial color={tint} transparent opacity={0.06} roughness={0.8} />
      </mesh>
    </group>
  );
}

type Bottle3DProps = {
  accent?: 'gold' | 'amber' | 'copper' | 'rose';
  className?: string;
  height?: number | string;
};

export default function Bottle3D({ accent = 'gold', className, height = '100%' }: Bottle3DProps) {
  return (
    <div className={className} style={{ width: '100%', height, position: 'relative' }} aria-hidden="true">
      <Canvas
        camera={{ fov: 34, position: [0, 0.08, 4.15] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 3]} intensity={1.1} color="#e8c87a" />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#c08888" />
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#c9a04e" />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.02} floatIntensity={0.18}>
            <BottleMesh accent={accent} />
          </Float>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
