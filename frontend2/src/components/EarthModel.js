import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const EarthModel = () => {
    const gltf = useLoader(GLTFLoader, '/models/earth-model/source/earth-cartoon.glb');

    return (
        <Canvas style={{ height: '70vh', width: '70vw' }} camera={{ position: [0, 0, 20] }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <primitive object={gltf.scene} scale={6} position={[0, 0, 0]} /> {/* Adjust scale to be slightly larger */}
            <OrbitControls enableZoom={false} /> {/* Disable zoom */}
        </Canvas>
    );
};

export default EarthModel;