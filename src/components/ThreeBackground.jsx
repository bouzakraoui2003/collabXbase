import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

export default function ThreeBackground() {
    const containerRef = useRef(null);
    const { theme } = useTheme();
    const particlesMeshRef = useRef(null);
    const materialRef = useRef(null);
    const containerStyleRef = useRef(null); // To manipulate style directly if needed

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        containerStyleRef.current = container;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Particles
        const geometry = new THREE.BufferGeometry();
        // More particles in dark mode
        const isDark = theme === 'dark'; // Initial state might be stale in closure? 
        // We will update in separate effect, but init here
        const particlesCount = 1200; // Use max and hide/show or just fixed high count
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            color: isDark ? 0xe879f9 : 0x7c3aed,
            transparent: true,
            opacity: isDark ? 1.0 : 0.8,
            sizeAttenuation: true
        });
        materialRef.current = material;

        const particlesMesh = new THREE.Points(geometry, material);
        particlesMeshRef.current = particlesMesh;
        scene.add(particlesMesh);

        camera.position.z = 5;

        // Mouse
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // Animate
        const clock = new THREE.Clock();
        let animationId;

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = mouseY * 0.5;
            particlesMesh.rotation.y += mouseX * 0.5;

            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, []); // Run once on mount

    // Theme Effect
    useEffect(() => {
        if (materialRef.current && containerRef.current) {
            const isDark = theme === 'dark';
            const darkColor = 0xe879f9;
            const lightColor = 0x7c3aed;

            materialRef.current.color.setHex(isDark ? darkColor : lightColor);
            materialRef.current.opacity = isDark ? 1.0 : 0.8;
            materialRef.current.needsUpdate = true;

            // Container opacity
            containerRef.current.style.opacity = isDark ? '1.0' : '0.6';
            if (isDark) {
                containerRef.current.classList.add('dark-mode-canvas');
                containerRef.current.style.zIndex = '0';
            } else {
                containerRef.current.classList.remove('dark-mode-canvas');
            }
        }
    }, [theme]);

    return (
        <div
            id="canvas-container"
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-300"
            style={{ zIndex: 0 }}
        >
        </div>
    );
}
