import * as THREE from "three";
import { Camera, Mesh, Scene } from "three";
import { DragControls } from "three/addons/controls/DragControls.js";

export const setupControls = (
  domElement: HTMLCanvasElement,
  camera: Camera,
  _scene: Scene,
  furnitureItems: Mesh[],
  room: Mesh,
) => {
  const dragControls = new DragControls(furnitureItems, camera, domElement);

  const dragListener: THREE.EventListener<
    { object: THREE.Object3D },
    "drag",
    DragControls
  > = (event) => {
    const draggedObject = event.object;

    // Compute bounding box of the dragged object
    const draggedBox = new THREE.Box3().setFromObject(draggedObject);

    // Check for collisions with other furniture
    for (const item of furnitureItems) {
      if (item === draggedObject) continue;
      const itemBox = new THREE.Box3().setFromObject(item);
      if (draggedBox.intersectsBox(itemBox)) {
        // Simple collision response: revert position
        draggedObject.position.copy(draggedObject.userData.previousPosition);
        return;
      }
    }

    // Check for collisions with room boundaries
    const roomBox = new THREE.Box3().setFromObject(room);
    if (!roomBox.containsBox(draggedBox)) {
      // Revert position if outside room
      draggedObject.position.copy(draggedObject.userData.previousPosition);
      return;
    }

    // Store the current position as the last valid position
    draggedObject.userData.previousPosition = draggedObject.position.clone();
  };

  // Initialize previous positions
  furnitureItems.forEach((item) => {
    item.userData.previousPosition = item.position.clone();
  });

  dragControls.addEventListener("drag", dragListener);

  // Cleanup event listeners
  return () => {
    dragControls.removeEventListener("drag", dragListener);
    dragControls.dispose();
  };
};
