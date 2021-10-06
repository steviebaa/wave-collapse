import {
	BufferGeometry,
	CatmullRomCurve3,
	Line,
	LineBasicMaterial,
} from 'three';

/** Create a wave */
export function createWave(
	positions: THREE.Vector3[],
	color: number
): [
	points: THREE.Vector3[],
	waveLine: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>
] {
	const curve = new CatmullRomCurve3(positions);
	const points = curve.getPoints(positions.length);

	const geometry = new BufferGeometry();
	const material = new LineBasicMaterial({ color });

	const waveLine = new Line(geometry, material);

	return [points, waveLine];
}
