import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const Model = () => {
    const gltf = useLoader(GLTFLoader, '/models/animated_butterfly.glb');
    const butterflyRef = useRef();

    useEffect(() => {
        if (gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });

            const animate = () => {
                requestAnimationFrame(animate);
                mixer.update(0.01);
            };
            animate();
        }
    }, [gltf]);

    useFrame((state) => {
        if (butterflyRef.current) {
            // Update the butterfly position to fly around in a random fashion
            const t = state.clock.getElapsedTime();
            butterflyRef.current.position.x = Math.sin(t) * 2;
            butterflyRef.current.position.y = Math.sin(t * 1.5) * 1.5;
            butterflyRef.current.position.z = Math.cos(t) * 2;
        }
    });

    return <primitive ref={butterflyRef} object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
};

const ButterflyModel = () => {
    return (
        <Canvas style={{ height: '80vh', width: '50vw' }} camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Suspense fallback={null}>
                <Model />
            </Suspense>
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default ButterflyModel;