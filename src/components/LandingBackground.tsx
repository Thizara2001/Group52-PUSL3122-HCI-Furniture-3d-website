import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createBackgroundFurniture } from "../data/furniture.ts";

const LandingBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000020); // Dark blue background

    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add renderer to DOM
    const mountedElement = mountRef.current;
    if (mountedElement) {
      mountedElement.appendChild(renderer.domElement);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Add furniture items
    const furnitureItems = createBackgroundFurniture();

    // Position furniture in a circle
    const radius = 8;
    furnitureItems.forEach((item, index) => {
      const angle = (index / furnitureItems.length) * Math.PI * 2;
      item.position.x = Math.cos(angle) * radius;
      item.position.z = Math.sin(angle) * radius;
      scene.add(item);
    });

    // Animation loop
    const rotationSpeed = 0.003;
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate furniture around the center
      furnitureItems.forEach((item) => {
        const x = item.position.x;
        const z = item.position.z;

        item.position.x = x * Math.cos(rotationSpeed) - z * Math.sin(rotationSpeed);
        item.position.z = z * Math.cos(rotationSpeed) + x * Math.sin(rotationSpeed);

        // Make furniture rotate on its own axis
        item.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      if (mountedElement) {
        mountedElement.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default LandingBackground;
