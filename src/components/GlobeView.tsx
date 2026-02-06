"use client";

import { useEffect, useRef } from "react";

export default function GlobeView() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Dynamically load three.js and fiber
        const initScene = async () => {
            try {
                const { Canvas } = await import("@react-three/fiber");
                const { OrbitControls, Sphere, Float } = await import("@react-three/drei");
                const { useFrame } = await import("@react-three/fiber");
                const THREE = await import("three");
                const React = await import("react");

                // Create a simple canvas-based visualization
                const canvas = document.createElement("canvas");
                canvas.width = containerRef.current?.clientWidth || 800;
                canvas.height = containerRef.current?.clientHeight || 400;
                containerRef.current?.appendChild(canvas);

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(
                    45,
                    canvas.width / canvas.height,
                    0.1,
                    1000
                );
                camera.position.z = 6;

                const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
                renderer.setSize(canvas.width, canvas.height);
                renderer.setPixelRatio(window.devicePixelRatio);

                // Add lights
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                const pointLight = new THREE.PointLight(0x00f2ff, 1);
                pointLight.position.set(10, 10, 10);
                scene.add(pointLight);

                // Create Earth
                const geometry = new THREE.SphereGeometry(2, 64, 64);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x1e3a8a,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3,
                    emissive: 0x3b82f6,
                    emissiveIntensity: 0.5,
                });
                const earth = new THREE.Mesh(geometry, material);
                scene.add(earth);

                // Create stars
                const starsGeometry = new THREE.BufferGeometry();
                const starsMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 0.1,
                    transparent: true,
                    opacity: 0.8,
                });

                const starsVertices = [];
                for (let i = 0; i < 5000; i++) {
                    const x = (Math.random() - 0.5) * 200;
                    const y = (Math.random() - 0.5) * 200;
                    const z = (Math.random() - 0.5) * 200;
                    starsVertices.push(x, y, z);
                }

                starsGeometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(new Float32Array(starsVertices), 3)
                );
                const stars = new THREE.Points(starsGeometry, starsMaterial);
                scene.add(stars);

                // Animation loop
                const animate = () => {
                    requestAnimationFrame(animate);
                    earth.rotation.y += 0.001;
                    renderer.render(scene, camera);
                };

                animate();

                // Handle resize
                const handleResize = () => {
                    if (!containerRef.current) return;
                    const width = containerRef.current.clientWidth;
                    const height = containerRef.current.clientHeight;
                    canvas.width = width;
                    canvas.height = height;
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                };

                window.addEventListener("resize", handleResize);

                return () => {
                    window.removeEventListener("resize", handleResize);
                    renderer.dispose();
                };
            } catch (error) {
                console.error("Failed to initialize 3D scene:", error);
            }
        };

        initScene();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[400px]" />
    );
}
