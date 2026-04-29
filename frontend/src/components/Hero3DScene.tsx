import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useScroll } from '@react-three/drei';
import PerfumeBottle3D from './PerfumeBottle3D';
import Loading3D from './Loading3D';
import * as THREE from 'three';

interface Hero3DSceneProps {
  enableScroll?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const ScrollAnimatedBottle: React.FC = () => {
  const scroll = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useFrame(() => {
    const progress = scroll.offset;
    setScrollProgress(progress);
  });

  return <PerfumeBottle3D scrollProgress={scrollProgress} />;
};

const Hero3DScene: React.FC<Hero3DSceneProps> = ({ 
  enableScroll = false, 
  autoRotate = true,
  className = ''
}) => {
  return (
    <div className={`hero-3d-scene ${className}`} style={{ width: '100%', height: '100vh', position: 'relative' }}>
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
        
        <Suspense fallback={<Loading3D />}>
          {enableScroll ? (
            <ScrollAnimatedBottle />
          ) : (
            <PerfumeBottle3D autoRotate={autoRotate} />
          )}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={['#000000', 5, 15]} />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
