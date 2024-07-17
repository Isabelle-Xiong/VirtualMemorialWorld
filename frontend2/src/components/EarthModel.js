// src/components/EarthModel.js
import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const EarthModel = () => {
    const gltf = useLoader(GLTFLoader, '/models/earth-model/source/earth-cartoon.glb');

    return (
        <Canvas>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <primitive object={gltf.scene} scale={0.5} />
            <OrbitControls />
        </Canvas>
    );
};

export default EarthModel;