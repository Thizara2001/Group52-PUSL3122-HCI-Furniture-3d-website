import * as THREE from 'three';

export const createRoom = (): THREE.Mesh => {
  // Define room dimensions
  const width = 20;
  const height = 10;
  const depth = 20;

  // Create a box geometry for the room
  const geometry = new THREE.BoxGeometry(width, height, depth);

  // Create a basic material with a light gray color
  const material = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    side: THREE.BackSide, // Render the inside of the box
  });

  // Create the mesh
  const room = new THREE.Mesh(geometry, material);
  room.name = 'Room';

  return room;
};
