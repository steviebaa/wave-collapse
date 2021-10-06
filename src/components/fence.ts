import * as THREE from 'three';

/** Picket fence */
export function createFence(position: THREE.Vector3): THREE.Group {
	const geometry = new THREE.BoxGeometry(0.01, 2, 0.3);
	const material = new THREE.MeshBasicMaterial({
		color: 0xaaaaaa,
		transparent: true,
		opacity: 0.7,
	});

	const cube = new THREE.Mesh(geometry, material);
	cube.position.copy(position);

	const fence = new THREE.Group();
	for (let i = 0; i <= 2; i += 2 / 5) {
		const clonedPicket = cube.clone();
		clonedPicket.translateZ(i);
		fence.add(clonedPicket);
	}

	return fence;
}
