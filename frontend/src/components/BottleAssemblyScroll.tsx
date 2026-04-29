import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BottleAssemblyProps {
  scrollProgress: number;
}

const AssemblyBottle: React.FC<BottleAssemblyProps> = ({ scrollProgress }) => {
  const bottleRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!bottleRef.current) return;

    const time = state.clock.getElapsedTime();

    // Stage 1: Bottle appears and rotates (0 - 0.25)
    if (scrollProgress <= 0.25) {
      const stage1Progress = scrollProgress / 0.25;
      bottleRef.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, stage1Progress));
      bottleRef.current.rotation.y = stage1Progress * Math.PI * 2;
      bottleRef.current.position.y = THREE.MathUtils.lerp(-2, 0, stage1Progress);
    }

    // Stage 2: Cap descends (0.25 - 0.5)
    if (scrollProgress > 0.25 && scrollProgress <= 0.5 && capRef.current) {
      const stage2Progress = (scrollProgress - 0.25) / 0.25;
      capRef.current.position.y = THREE.MathUtils.lerp(4, 1.5, stage2Progress);
      capRef.current.rotation.z = Math.sin(stage2Progress * Math.PI * 4) * 0.2;
    }

    // Stage 3: Liquid fills (0.5 - 0.75)
    if (scrollProgress > 0.5 && scrollProgress <= 0.75 && liquidRef.current) {
      const stage3Progress = (scrollProgress - 0.5) / 0.25;
      liquidRef.current.scale.y = THREE.MathUtils.lerp(0.1, 1, stage3Progress);
      liquidRef.current.position.y = THREE.MathUtils.lerp(-1, -0.3, stage3Progress);
      
      // Liquid shimmer effect
      if (liquidRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        liquidRef.current.material.metalness = 0.2 + Math.sin(time * 2) * 0.1;
      }
    }

    // Stage 4: Label appears and final assembly (0.75 - 1)
    if (scrollProgress > 0.75 && labelRef.current) {
      const stage4Progress = (scrollProgress - 0.75) / 0.25;
      labelRef.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, stage4Progress));
      labelRef.current.material.opacity = stage4Progress;
      
      // Final rotation
      bottleRef.current.rotation.y = Math.PI * 2 + stage4Progress * Math.PI * 0.5;
    }

    // Particles animation throughout
    if (particlesRef.current && scrollProgress > 0.5) {
      particlesRef.current.rotation.y = time * 0.2;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01;
        
        // Reset particles that go too high
        if (positions[i + 1] > 3) {
          positions[i + 1] = -1;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Gentle floating when fully assembled
    if (scrollProgress >= 1) {
      bottleRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Create particles
  const particleCount = 200;
  const particlePositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 3;
    particlePositions[i3 + 1] = Math.random() * 4 - 1;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 3;
  }

  return (
    <group ref={bottleRef}>
      {/* Main bottle body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.5, 0.8]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Liquid */}
      <mesh ref={liquidRef} position={[0, -1, 0]} scale={[0.9, 0.1, 0.9]} castShadow>
        <boxGeometry args={[1.1, 2, 0.7]} />
        <meshPhysicalMaterial
          color="#d4af37"
          metalness={0.2}
          roughness={0.3}
          transmission={0.7}
          thickness={0.8}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Cap */}
      <mesh ref={capRef} position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Cap accent */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Label */}
      <mesh ref={labelRef} position={[0, 0, 0.41]}>
        <planeGeometry args={[0.8, 1.5]} />
        <meshStandardMaterial
          color="#f5f5f5"
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Fragrance particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rim light */}
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#d4af37" distance={5} />
    </group>
  );
};

const BottleAssemblyScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stages = [
    { label: 'Bottle appears', progress: 0.25 },
    { label: 'Cap descends', progress: 0.5 },
    { label: 'Liquid fills', progress: 0.75 },
    { label: 'Complete', progress: 1 },
  ];

  return (
    <div ref={containerRef} className="bottle-assembly-stage">
      <div className="bottle-assembly-canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          
          <Suspense fallback={null}>
            <AssemblyBottle scrollProgress={scrollProgress} />
          </Suspense>

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            position={[-5, 5, -5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
          />
          <pointLight position={[0, -2, 0]} intensity={0.5} color="#d4af37" />

          {/* Environment */}
          <Environment preset="city" />
          
          {/* Ground shadow */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Fog */}
          <fog attach="fog" args={['#000000', 5, 15]} />
        </Canvas>
      </div>

      {/* Progress indicator */}
      <div className="bottle-assembly-progress">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`assembly-step ${scrollProgress >= stage.progress ? 'active' : ''}`}
            title={stage.label}
          />
        ))}
      </div>
    </div>
  );
};

export default BottleAssemblyScroll;
