import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center, Environment, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function FloatingToken({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
      <meshStandardMaterial
        color="#f59e0b"
        metalness={0.9}
        roughness={0.1}
        emissive="#f59e0b"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Certificate({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
        
        {/* Floating elements */}
        <RotatingCube position={[-4, 2, -2]} />
        <RotatingCube position={[4, -1, -3]} />
        <FloatingToken position={[-3, -2, -1]} />
        <FloatingToken position={[5, 3, -2]} />
        <Certificate position={[2, 1, -1]} />
        <Certificate position={[-2, -1, -2]} />
        
        {/* Sparkles for magical effect */}
        <Sparkles
          count={100}
          scale={[10, 10, 10]}
          size={2}
          speed={0.5}
          color="#6366f1"
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}