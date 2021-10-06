import { GridHelper, Vector3 } from 'three';

export function createGrid(position: Vector3) {
	const gridHelper = new GridHelper(10, 10);
	gridHelper.position.copy(position);
	return gridHelper;
}
