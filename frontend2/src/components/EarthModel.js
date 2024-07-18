import React, { useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = () => {
    const gltf = useLoader(GLTFLoader, '/models/earth-model/source/earth-cartoon.glb');
    const earthRef = useRef();

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001; // Adjust the rotation speed as needed
        }
    });

    return <primitive ref={earthRef} object={gltf.scene} scale={6} position={[0, 0, 0]} />;
};

const EarthModel = () => {
    return (
        <Canvas style={{ height: '80vh', width: '50vw' }} camera={{ position: [0, 0, 20] }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Model />
            <OrbitControls enableZoom={false} /> {/* Disable zoom */}
        </Canvas>
    );
};

export default EarthModel;