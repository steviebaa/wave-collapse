import { Component } from 'react';
import './App.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createFence } from './three-components/fence';
import { createWave } from './three-components/wave';
import { createGrid } from './three-components/grid';
import {
	BufferGeometry,
	Line,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
} from 'three';
import { createPoints } from './utils/points';
import { LineBasicMaterial } from 'three';

// Globals
const aspect = window.innerWidth / window.innerHeight;
const camera: PerspectiveCamera = new PerspectiveCamera(55, aspect, 0.01, 100);
const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
const scene: Scene = new Scene();
let points1: Vector3[] = [];
let points2: Vector3[] = [];
let wave1: Line;
let wave2: Line;
let waveLength: number = 2 * Math.PI;
let connectorLine: Line;

class App extends Component {
	componentDidMount() {
		this.init();
	}

	init() {
		/** General scene setup */
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setAnimationLoop(this.animation);

		/** Determine position to look at */
		const lookAt = new Vector3(waveLength, 0, 0);

		/** Set the controls and update the controls target */
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target = lookAt;

		/** Set the camera position */
		camera.position.set(0, 5, 10);
		camera.lookAt(lookAt);

		/** Grid to help user's perception of orientation */
		const gridPosition = new Vector3(waveLength, -1, 0);
		const grid = createGrid(gridPosition);
		scene.add(grid);

		/** Add renderer to app container */
		const appContainer = document.querySelector('.App');
		if (!appContainer) {
			return console.error("Couldn't get app container");
		}
		appContainer.appendChild(renderer.domElement);

		/** Create points along line */
		const entryWavePoints = createPoints(0, waveLength, 0.1);
		const exitWavePoints = createPoints(waveLength, 2 * waveLength, 0.1);

		/** Create first wave */
		[points1, wave1] = createWave(entryWavePoints, 0x449aff);
		scene.add(wave1);

		/** Create second wave */
		[points2, wave2] = createWave(exitWavePoints, 0x9a44ff);
		scene.add(wave2);

		/** Connecting line */
		connectorLine = new Line(
			new BufferGeometry(),
			new LineBasicMaterial({ color: 0x448aff })
		);
		scene.add(connectorLine);

		/** Picket fence */
		const fence = createFence(new Vector3(waveLength, 0, -1));
		scene.add(fence);
	}

	animation(time: number) {
		/** Angles */
		const waveAngle = -time / 1000;
		const rotationAngle = waveAngle / 2;

		/** Amplitude collapse  */
		const amplitudeMultiplier = Math.cos(rotationAngle);

		// Helper
		const getPtY = (pt: Vector3) => Math.sin(waveAngle + Math.PI * pt.x);

		/** Wave one adjustments */
		// Positions
		points1.forEach((pt) => {
			pt.y = getPtY(pt);
		});
		wave1.geometry.setFromPoints(points1);

		// Rotation of wave about it's length
		wave1.rotation.set(rotationAngle, 0, 0);

		/** Wave two adjustments */
		// Positions
		points2.forEach((pt) => {
			pt.y = getPtY(pt) * Math.abs(amplitudeMultiplier);
		});
		wave2.geometry.setFromPoints(points2);

		/** Connector line */
		// TODO:  fix this coordinate translation...
		// const start = wave1.localToWorld(points1[points1.length - 1]);
		// const stop = points2[0];
		// connectorLine.geometry.setFromPoints([start, stop]);

		// Re-render scene
		renderer.render(scene, camera);
	}

	render() {
		return <div className='App'></div>;
	}
}

export default App;
