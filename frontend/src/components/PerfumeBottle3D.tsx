import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PerfumeBottle3DProps {
  scrollProgress?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

const PerfumeBottle3D: React.FC<PerfumeBottle3DProps> = ({ 
  scrollProgress = 0, 
  autoRotate = false,
  interactive = true 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  
  const { viewport } = useThree();

  // Particle system for fragrance mist
  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = Math.random() * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      scales[i] = Math.random();
    }
    
    return { positions, scales, count };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    if (autoRotate) {
      groupRef.current.rotation.y = time * 0.2;
    }

    // Scroll-based animations
    if (scrollProgress > 0) {
      // Bottle assembly animation
      if (bottleRef.current && capRef.current) {
        const assemblyProgress = Math.min(scrollProgress * 2, 1);
        
        // Cap moves down to bottle
        capRef.current.position.y = THREE.MathUtils.lerp(3, 1.5, assemblyProgress);
        
        // Bottle rotates during assembly
        bottleRef.current.rotation.y = scrollProgress * Math.PI * 2;
        
        // Scale animation
        const scale = THREE.MathUtils.lerp(0.8, 1, assemblyProgress);
        groupRef.current.scale.setScalar(scale);
      }

      // Liquid fill animation
      if (liquidRef.current && scrollProgress > 0.5) {
        const fillProgress = (scrollProgress - 0.5) * 2;
        liquidRef.current.scale.y = THREE.MathUtils.lerp(0.1, 1, fillProgress);
      }
    }

    // Floating animation
    if (groupRef.current && !scrollProgress) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Bottle */}
      <mesh ref={bottleRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 2, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#ffffff"
        />
      </mesh>

      {/* Liquid inside */}
      <mesh ref={liquidRef} position={[0, -0.5, 0]} scale={[0.9, 0.1, 0.9]}>
        <cylinderGeometry args={[0.45, 0.55, 1.8, 32]} />
        <meshPhysicalMaterial
          color="#d4af37"
          metalness={0.1}
          roughness={0.2}
          transmission={0.8}
          thickness={0.5}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Cap */}
      <mesh ref={capRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Cap top detail */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Fragrance particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={particles.count}
            array={particles.scales}
            itemSize={1}
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

      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} angle={0.3} penumbra={1} />
      <spotLight position={[-5, 5, -5]} intensity={0.5} angle={0.3} penumbra={1} />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
    </group>
  );
};

export default PerfumeBottle3D;
