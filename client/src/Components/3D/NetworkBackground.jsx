import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Sparkles, Float } from '@react-three/drei';

const AnimatedShape = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
                <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={true}
                />
            </Sphere>
            <Sphere args={[0.9, 32, 32]} scale={1.5}>
                <meshStandardMaterial
                    color="#8b5cf6"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.5}
                />
            </Sphere>
        </Float>
    );
};

const NetworkBackground = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#a78bfa" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
                
                <AnimatedShape />
                
                {/* Background Particles */}
                <Sparkles count={400} scale={12} size={1.5} speed={0.4} opacity={0.6} color="#c084fc" />
                <Sparkles count={200} scale={8} size={2.5} speed={0.2} opacity={0.3} color="#818cf8" />
                
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    autoRotate 
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
};

export default NetworkBackground;
