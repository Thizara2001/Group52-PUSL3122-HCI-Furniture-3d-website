import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { setupControls } from "./components/Controls";
import { Furniture } from "./models/furniture/furniture.ts";
import { Room } from "./models/rooms/room.ts";

interface ThreeSceneProps {
  view: "2d" | "3d";
  furniture?: Furniture;
  room: Room;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ view, furniture, room }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [scene] = useState<THREE.Scene>(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    return scene;
  });
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  });
  const [perspectiveCamera] = useState<THREE.PerspectiveCamera>(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 20, 20);
    camera.lookAt(0, 0, 0);
    return camera;
  });
  const [orthographicCamera] = useState<THREE.OrthographicCamera>(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -aspect * 10,
      aspect * 10,
      10,
      -10,
      0.1,
      1000,
    );
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    return camera;
  });
  const [camera, setCamera] = useState<THREE.Camera>(perspectiveCamera);

  // Append renderer to the DOM
  useEffect(() => {
    const mountedElement = mountRef.current;
    if (mountedElement) {
      mountedElement.appendChild(renderer.domElement);
    }

    // Clean up
    return () => {
      mountedElement?.removeChild(renderer.domElement);
    };
  }, [renderer, mountRef]);

  // Add lights to the scene
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Clean up
    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);

  // Add objects to the scene
  useEffect(() => {
    // Room
    scene.add(room.getModel());

    // Furniture
    if (furniture) scene.add(furniture.getModel());

    // Clean up
    return () => {
      scene.remove(room.getModel());
      if (furniture) scene.remove(furniture.getModel());
    };
  }, [furniture, room, scene]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      const floorY = room.getFloorY();
      furniture?.refresh(floorY);
      room.refresh();
      renderer.render(scene, camera);
    };
    animate();
  }, [camera, furniture, renderer, room, scene]);

  // Setup Controls
  useEffect(() => {
    if (view == "2d") {
      return setupControls(
        renderer.domElement,
        camera,
        scene,
        furniture ? [furniture.getModel()] : [],
        room.getModel(),
      );
    }
  }, [camera, furniture, renderer, room, scene, view]);

  // Change camera
  useEffect(() => {
    if (view === "2d") {
      setCamera(orthographicCamera);
    } else {
      setCamera(perspectiveCamera);
    }
  }, [view, orthographicCamera, perspectiveCamera]);

  // // Handle window resize
  // useEffect(() => {
  //   if (camera instanceof THREE.PerspectiveCamera) {
  //     const handleResize = () => {
  //       camera.aspect = window.innerWidth / window.innerHeight;
  //       camera.updateProjectionMatrix();
  //     };
  //
  //     window.addEventListener("resize", handleResize);
  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   } else if (camera instanceof THREE.OrthographicCamera) {
  //     const handleResize = () => {
  //       const aspect = window.innerWidth / window.innerHeight;
  //       camera.left = -aspect * 10;
  //       camera.right = aspect * 10;
  //       camera.top = 10;
  //       camera.bottom = -10;
  //       camera.updateProjectionMatrix();
  //     };
  //
  //     window.addEventListener("resize", handleResize);
  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }
  // }, [camera]);

  // Setup OrbitControls
  useEffect(() => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = view === "3d";
    controls.enablePan = true;
    controls.enableZoom = true;
    return () => {
      controls.dispose();
    };
  }, [camera, renderer, view]);

  return (
    <div
      ref={mountRef}
      className={"w-full h-full flex items-center justify-center"}
    />
  );
};

export default ThreeScene;
