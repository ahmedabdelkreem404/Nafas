import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  ContactShadows,
  useTexture,
  Html,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Product3DViewerProps {
  productName?: string;
  productColor?: string;
  onClose?: () => void;
}

const BottleModel: React.FC<{ color?: string; isOpen?: boolean }> = ({ 
  color = '#d4af37',
  isOpen = false 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    
    // Gentle rotation
    if (bottleRef.current) {
      bottleRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }

    // Cap animation when open
    if (capRef.current && isOpen) {
      capRef.current.position.y = THREE.MathUtils.lerp(
        capRef.current.position.y,
        2.5,
        0.05
      );
      capRef.current.rotation.z = THREE.MathUtils.lerp(
        capRef.current.rotation.z,
        Math.PI * 0.2,
        0.05
      );
    } else if (capRef.current) {
      capRef.current.position.y = THREE.MathUtils.lerp(
        capRef.current.position.y,
        1.5,
        0.05
      );
      capRef.current.rotation.z = THREE.MathUtils.lerp(
        capRef.current.rotation.z,
        0,
        0.05
      );
    }

    // Spray particles animation
    if (sprayRef.current && isOpen) {
      sprayRef.current.scale.y = THREE.MathUtils.lerp(
        sprayRef.current.scale.y,
        1,
        0.1
      );
    } else if (sprayRef.current) {
      sprayRef.current.scale.y = THREE.MathUtils.lerp(
        sprayRef.current.scale.y,
        0,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main bottle body */}
      <mesh ref={bottleRef} position={[0, 0, 0]} castShadow>
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
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 2, 0.7]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.3}
          transmission={0.7}
          thickness={0.8}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Cap */}
      <mesh ref={capRef} position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Cap top accent */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Label area */}
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[0.8, 1.5]} />
        <meshStandardMaterial
          color="#f5f5f5"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Spray particles */}
      <mesh ref={sprayRef} position={[0, 2.5, 0]} scale={[1, 0, 1]}>
        <coneGeometry args={[0.8, 2, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ambient particles */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[1.5, 1, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-1.2, 0.5, 0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[0.8, -0.5, -0.8]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
};

const Product3DViewer: React.FC<Product3DViewerProps> = ({ 
  productName = 'Nafas Perfume',
  productColor = '#d4af37',
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(5);
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setZoom(5);
    setIsOpen(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.max(prev - 1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.min(prev + 1, 10));
  };

  return (
    <div className="product-3d-viewer">
      <div className="product-3d-viewer__canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={50} />
          
          <Suspense fallback={
            <Html center>
              <div className="loading-spinner">Loading 3D Model...</div>
            </Html>
          }>
            <BottleModel color={productColor} isOpen={isOpen} />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={false}
          />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
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
            castShadow
          />
          <pointLight position={[0, 2, 0]} intensity={0.5} color={productColor} />

          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Ground shadow */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
        </Canvas>
      </div>

      {/* Controls overlay */}
      <div className="product-3d-viewer__controls">
        <button
          className="viewer-control-btn"
          onClick={handleReset}
          title="Reset view"
        >
          <RotateCcw size={20} />
        </button>
        <button
          className="viewer-control-btn"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="viewer-control-btn"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="viewer-control-btn"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Close bottle' : 'Open bottle'}
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Info overlay */}
      <div className="product-3d-viewer__info">
        <h3>{productName}</h3>
        <p>Drag to rotate • Scroll to zoom • Click to open</p>
      </div>
    </div>
  );
};

export default Product3DViewer;
