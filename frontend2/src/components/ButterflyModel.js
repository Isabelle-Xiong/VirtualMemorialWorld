import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
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

    useEffect(() => {
        if (butterflyRef.current) {
            // Apply rotation to make the butterfly upright and facing the correct direction
            butterflyRef.current.rotation.x = Math.PI / 2; // Make the butterfly upright
            butterflyRef.current.rotation.y = Math.PI; // Adjust the facing direction
        }
    }, [gltf]);

    useFrame((state) => {
        if (butterflyRef.current) {
            const t = state.clock.getElapsedTime() * 0.4; // Adjust speed here
            let newX = Math.sin(t) * 10; // Increase range here
            let newY = Math.sin(t * 1.5) * 7.5; // Increase range here
            let newZ = Math.cos(t) * 10; // Increase range here

            // Calculate the distance from the camera
            const distance = Math.sqrt(newX ** 2 + newY ** 2 + newZ ** 2);

            // If the butterfly is too close to the camera, move it farther away
            if (distance < 5) {
                const scale = 5 / distance; // Scale factor to push the butterfly away
                newX *= scale;
                newY *= scale;
                newZ *= scale;
            }

            butterflyRef.current.position.set(newX, newY, newZ);
        }
    });

    return <primitive ref={butterflyRef} object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
};

const ButterflyModel = () => {
    return (
        <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Suspense fallback={null}>
                <Model />
            </Suspense>
        </Canvas>
    );
};

export default ButterflyModel;