import * as THREE from 'three';
import './style.css';

import custom_model from './public/local/custom_model';
import dolly from './public/local/dolly';
import spark from './public/local/spark';

import { CameraHelper } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//TODO create init function
let frame = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});
//target location to render is bg ie the whole background
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const composer = new EffectComposer(renderer);
//post proc effect
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const left_light_position = [-8, 8, -2];
const right_light_position = [8, 8, -2];
const spark_count = 3;
const TABLE_HEIGHT = 4.2; //from 0 on Y
const t_D = { height: 4.2, x: 5.0, z: 3.3 };

// const dolly_arcs = [
// 	[
// 		new THREE.Vector3(t_D.x * 0.0, t_D.height * 2.5, t_D.z * 3.3),
// 		new THREE.Vector3(t_D.x * 0.0, t_D.height * 2.0, t_D.z * 0.33),
// 	],
// 	[
// 		new THREE.Vector3(t_D.x * 0.0, t_D.height * 2.0, t_D.z * 0.33),
// 		new THREE.Vector3(t_D.x * 1, t_D.height * 1.2, t_D.z * 1),
// 	],
// 	[
// 		new THREE.Vector3(t_D.x * 1, t_D.height * 1.2, t_D.z * 1),
// 		new THREE.Vector3(t_D.x * -1, t_D.height * 1.3, t_D.z * -1),
// 	],

// 	[
// 		new THREE.Vector3(t_D.x * -1, t_D.height * 1.3, t_D.z * -1),
// 		new THREE.Vector3(t_D.x * -1, t_D.height * 1.4, t_D.z * 1),
// 	],
// 	[
// 		new THREE.Vector3(t_D.x * -1, t_D.height * 1.4, t_D.z * 1),
// 		new THREE.Vector3(t_D.x * 1, t_D.height * 1.4, t_D.z * -1),
// 	],
// ];
let STOP = false;
document.getElementById('free_cam').addEventListener('click', () => {
	STOP = true;
	const controls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(0, 20, 10);
	controls.update();
});

// const camera_dolly = new dolly(dolly_arcs);
// camera_dolly.draw(scene);
document
	.getElementById('show_wires')
	.addEventListener('click', () => camera_dolly.draw(scene));

/*
FLOOR
TODO clean up
*/
const geometry = new THREE.BoxGeometry(100, 1, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x006347 });
const floor = new THREE.Mesh(geometry, material);
scene.add(floor);

const MODELS = [];
const FOCAL_POINTS = [
	{
		name: 'camera_start',
		position: new THREE.Vector3(0, 10, 2),
		viewing_position: new THREE.Vector3(5, 9, 2),
	},
];

/**
 * initializes the custom model object for each imported 3d model in the scene
 * TODO add torches
 * @author EW
 * @date 2023-01-14
 */
function init_models() {
	const table = new custom_model(
		[5, 5, 5],
		[0, Math.PI / 2, 0],
		[0.5, 0, 0],
		[0, 5, 0],
		'./models/Small_Table.glb',
		'table',
		true
	);

	const book = new custom_model(
		[2, 2, 2],
		[0, -Math.PI / 8, 0],
		[t_D.x - 2, t_D.height, t_D.z - 2],
		[t_D.x - 2.5, t_D.height + 0.5, t_D.z - 2.5],
		'/models/Open_Book.glb',
		'book',
		true
	);

	const left_torch = new custom_model(
		[3, 3, 3],
		[0, Math.PI / 2, -Math.PI / 8],
		[
			left_light_position[0],
			left_light_position[1] - 2,
			left_light_position[2],
		],
		[
			left_light_position[0] + 2,
			left_light_position[1] - 2,
			left_light_position[2] + 2,
		],
		'/models/Torch.glb',
		'LTorch',
		true
	);

	const right_torch = new custom_model(
		[3, 3, 3],
		[0, -Math.PI / 2, Math.PI / 8],
		[
			right_light_position[0],
			right_light_position[1] - 2,
			right_light_position[2],
		],
		[
			right_light_position[0] - 2,
			right_light_position[1] - 2,
			right_light_position[2] - 2,
		],
		'/models/Torch.glb',
		'LTorch',
		true
	);

	for (let i = 0; i < 20; i++) {
		const A = new custom_model();
		A.random(1, 360, { x: 20, y: t_D.height, z: 20 });
		MODELS.push(A);
	}

	MODELS.push(book, left_torch, right_torch);
}

/**
 * establishes which models will be focusable and where
 * TODO add start camera position, feed dolly camera setups
 * @author EW
 * @date 2023-01-14
 */
function init_focal_points() {
	for (let i = 0; i < MODELS.length; i++) {
		let m = MODELS[i];
		if (m.focusable) {
			FOCAL_POINTS.push({
				name: m.name,
				position: new THREE.Vector3(...m.position),
				viewing_position: new THREE.Vector3(...m.view),
			});
		}
	}
	for (let j = 1; j <= FOCAL_POINTS.length - 1; j++) {
		FOCAL_POINTS[j].previous = FOCAL_POINTS[j - 1].position;
	}
	FOCAL_POINTS[0].previous = FOCAL_POINTS[FOCAL_POINTS.length - 1].position;
	console.log(FOCAL_POINTS);
}

init_models();
init_focal_points();

const focal_arcs = [];
const follow_arcs = [];

for (let k = 0; k < FOCAL_POINTS.length; k++) {
	focal_arcs.push([FOCAL_POINTS[k].previous, FOCAL_POINTS[k].position]);
	follow_arcs.push([
		FOCAL_POINTS[k].viewing_position.clone(),
		FOCAL_POINTS[k].previous.clone(),
	]);
}

const view_dolly = new dolly(focal_arcs);
view_dolly.draw(scene);
const camera_dolly = new dolly(follow_arcs);

const loader = new GLTFLoader();

// loads all 3d models into scene through GLTFLoader
MODELS.forEach((e) => {
	loader.load(
		e.file,
		function (gltf) {
			//onload
			let m = gltf.scene;
			m.scale.set(...e.scale);
			m.rotation.set(...e.rotation);
			m.position.set(...e.position);
			scene.add(m);
			console.log('loaded model: ' + e.name + m.position);
		},
		undefined, //onprogress
		function (error) {
			//on error
			console.error(error);
		}
	);
});

/*
LIGHT
TODO create torch class
*/
const rightLight = new THREE.PointLight(0xffa500, 2);
rightLight.position.set(...right_light_position); //... spread operator

const leftLight = new THREE.PointLight(0xffa500, 2);
leftLight.position.set(...left_light_position);

const bottomLight = new THREE.PointLight(0xfbceb1, 4);
bottomLight.position.set(0, 1, -5);
const ambLight = new THREE.AmbientLight(0xff5f3f, 1);
scene.add(leftLight, rightLight, bottomLight, ambLight); //,ambLight
/*
!!!!!!!!!!!!HELPERS !!!!!!!!!!!!!!!
TODO remove
*/
//shows where the light is
// const l_lightHelper = new THREE.PointLightHelper(leftLight);
// const r_lightHelper = new THREE.PointLightHelper(rightLight);
//3d grid
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);
//allows camera controls

//shows 3d axis

const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

/*
SPARKS
TODO: add to torch class
*/

let sparks_list_left = Array(spark_count);
let sparks_list_right = Array(spark_count);
for (let i = 0; i < spark_count; i++) {
	// scene.add(new spark({r: 0.15, w: 3, h:3}, [0,0,0], 6, {color:0xffffff}).get());
	sparks_list_right[i] = new spark(
		{ r: 0.09, w: 3, h: 3 },
		right_light_position.map((e) => e),
		1,
		{ color: 0xb04125 }
	);
	scene.add(sparks_list_right[i].get());
}

for (let j = 0; j < spark_count; j++) {
	// scene.add(new spark({r: 0.15, w: 3, h:3}, [0,0,0], 6, {color:0xffffff}).get());
	sparks_list_left[j] = new spark(
		{ r: 0.09, w: 3, h: 3 },
		left_light_position.map((e) => e),
		1,
		{ color: 0xb04125 }
	);

	scene.add(sparks_list_left[j].get());
}

/*
BACKGROUND
TODO replace background
*/
// const bgTexture = new THREE.TextureLoader().load('space.jpg')
// scene.background = bgTexture;

//asdasd

/**
 * desc
 * @author asdasd
 * * asd
 * ? asdasd
 * ! asdasd
 * TODO asdasd
 * @date 2023-01-14
 */

function getScrollPercent() {
	var h = document.documentElement,
		b = document.body,
		st = 'scrollTop',
		sh = 'scrollHeight';
	var res = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
	document.getElementById('scroll_percentage').innerHTML = res;
	return res;
}
const view_epsilon = 0.3;

/**
 * moves the camera along the dolly following a scroll action
 * @author EW
 * @date 2023-01-15
 */
function moveCamera() {
	const scroll_p = getScrollPercent();
	const t = scroll_p / (100 / camera_dolly.curve_count);

	if (1 < camera_dolly.curve_count && !STOP) {
		let camera_position = camera_dolly.move_camera(frame / 100);
		camera.position.copy(camera_position[0]);
		let camera_focus = view_dolly.move_camera(frame / 100);
		camera.lookAt(camera_focus[1]);
		// console.log(t_delta, CAMERA_POSITIONS[Math.floor(t)].name,t_delta > view_epsilon)
	}
}

// moveCamera();
// document.body.onscroll = moveCamera;

window.addEventListener('resize', onWindowResize, false);
/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 * @param { * } intensity
 */
function light_flicker(intensity) {
	return (intensity + Math.random() - 0.4) % 5;
}

/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 */

function animate() {
	frame = (frame += 1) % 600;

	requestAnimationFrame(animate);
	if (frame % 2 == 0) {
		moveCamera();
		let left = leftLight.intensity;
		leftLight.intensity = light_flicker(left);
		let right = rightLight.intensity;
		rightLight.intensity = light_flicker(right);
		sparks_list_right.forEach((element) => {
			element.wiggle(right);
		});
		sparks_list_left.forEach((element) => {
			element.wiggle(left);
		});
	}
	//mouse follow

	composer.render();
}
//render loop, everytime scene is redrawn is called

animate();
