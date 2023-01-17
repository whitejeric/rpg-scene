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
function render_init() {
	//target location to render is bg ie the whole background
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.outputEncoding = THREE.PCFSoftShadowMap;

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

render_init();

const composer = new EffectComposer(renderer);
//post proc effect
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

let STOP = false;
document.getElementById('free_cam').addEventListener('click', () => {
	if (!STOP) {
		const controls = new OrbitControls(camera, renderer.domElement);
		camera.position.set(0, 20, 10);
		controls.update();
	}
	STOP = !STOP;
});

const t_D = { height: 4.2, x: 5.0, z: 3.3 };
const left_light_position = [-8, 8, -2];
const right_light_position = [8, 8, -2];
const top_light_position = [0, t_D.height + 5, -5];
const spark_count = 3;
const torch_max_intensity = 50;
const TABLE_HEIGHT = 4.2; //from 0 on Y

const rightLight = new THREE.PointLight(0xffa500, torch_max_intensity);
const leftLight = new THREE.PointLight(0xffa500, torch_max_intensity);
const topLight = new THREE.PointLight(0xffa500, torch_max_intensity);
const bottomLight = new THREE.PointLight(0xfbceb1, 0.5);
const ambLight = new THREE.AmbientLight(0xff5f3f, 1);
const left_torch_sparks = Array(spark_count);
const right_torch_sparks = Array(spark_count);

const MODELS = [];

/**
 * initializes the custom model object for each imported 3d model in the scene
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
		[t_D.x * 0.5, t_D.height + 2, t_D.z * 0],
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

	//some random models scattered around
	for (let i = 0; i < 20; i++) {
		const A = new custom_model();
		A.random(1, 360, { x: 20, y: t_D.height, z: 20 });
		MODELS.push(A);
	}

	MODELS.push(book, left_torch, right_torch, table);
}
// loads all 3d models into scene through GLTFLoader
function load_models() {
	const loader = new GLTFLoader();
	MODELS.forEach((e) => {
		loader.load(
			e.file,
			function (gltf) {
				//onload
				let m = gltf.scene;
				m.scale.set(...e.scale);
				m.rotation.set(...e.rotation);
				m.position.set(...e.position);
				m.traverse(function (node) {
					if (node.isMesh) {
						node.castShadow = true;
						node.receiveShadow = true;
					}
				});
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
}

function init_floor() {
	const geometry = new THREE.BoxGeometry(100, 1, 100);
	const material = new THREE.MeshStandardMaterial({ color: 0x3c280d });
	const floor = new THREE.Mesh(geometry, material);
	floor.receiveShadow = true;
	scene.add(floor);
}

function init_lights() {
	rightLight.position.set(...right_light_position);
	rightLight.castShadow = true;
	leftLight.position.set(...left_light_position);
	leftLight.castShadow = true;
	topLight.position.set(...top_light_position);
	topLight.castShadow = true;
	bottomLight.position.set(0, t_D.height - 1, -2);
	scene.add(leftLight, rightLight, bottomLight, topLight); //,ambLight
}

function init_helpers() {
	const l_lightHelper = new THREE.PointLightHelper(leftLight);
	const r_lightHelper = new THREE.PointLightHelper(rightLight);
	// scene.add(l_lightHelper, r_lightHelper);
	const gridHelper = new THREE.GridHelper(200, 50);
	// scene.add(gridHelper);
	const axesHelper = new THREE.AxesHelper(50);
	// scene.add(axesHelper);
}

function init_sparks(sparks_list, light_position) {
	for (let i = 0; i < sparks_list.length; i++) {
		sparks_list[i] = new spark(
			{ radius: 0.09, width: 3, height: 3 },
			light_position.map((e) => e),
			1,
			{ color: 0xb04125 }
		);
		scene.add(sparks_list[i].get());
	}
}

init_sparks(left_torch_sparks, left_light_position);
init_sparks(right_torch_sparks, right_light_position);
init_models();
load_models();
init_lights();
init_helpers();
init_floor();

function getScrollPercent() {
	var h = document.documentElement,
		b = document.body,
		st = 'scrollTop',
		sh = 'scrollHeight';
	var res = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
	document.getElementById('scroll_percentage').innerHTML = res;
	return res;
}

/**
 * moves the camera along the dolly following a scroll action
 * @author EW
 * @date 2023-01-15
//  */
// function moveCamera() {
// 	const scroll_p = getScrollPercent();
// 	const t = scroll_p / (100 / camera_dolly.curve_count);

// 	if (1 < camera_dolly.curve_count && !STOP) {
// 		let camera_position = camera_dolly.move_camera(frame / 100);
// 		camera.position.copy(camera_position[0]);
// 		let camera_focus = view_dolly.move_camera(frame / 100);
// 		camera.lookAt(camera_focus[1]);
// 		// console.log(t_delta, CAMERA_POSITIONS[Math.floor(t)].name,t_delta > view_epsilon)
// 	}
// }

// moveCamera();
// document.body.onscroll = moveCamera;

/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 * @param { * } intensity
 */
function light_flicker(intensity) {
	return (
		(Math.random(torch_max_intensity) + intensity * (Math.random(3) + 0.5)) %
		torch_max_intensity
	);
}

function update_light(light, sparks) {
	const L = light_flicker(light.intensity);
	light.intensity = L;
	light.distance = L + 10;
	sparks.forEach((e) => {
		e.wiggle(L);
	});
}

const motion_dolly = new dolly([
	[t_D.x * 1, t_D.height, t_D.z * 1],
	[t_D.x * 1, t_D.height + 2, t_D.z * -1],
	[t_D.x * -1, t_D.height + 1, t_D.z * -1],
	[t_D.x * -1, t_D.height + 3, t_D.z * 1],
]);
const md_draw = motion_dolly.draw({ color: 0xffffff });

const FOCALS = [];
MODELS.forEach((e) => {
	FOCALS.push(e.position);
});
const focal_dolly = new dolly(FOCALS);
const fd_draw = focal_dolly.draw();

const outer_box = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const mat = new THREE.MeshBasicMaterial({ color: 0x61120d, wireframe: true });
const outer_cube = new THREE.Mesh(outer_box, mat);
outer_cube.castShadow = true;
scene.add(outer_cube);

const inner_box = new THREE.SphereGeometry(0.1, 10, 10);
const mat2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const inner_sphere = new THREE.Mesh(inner_box, mat2);
scene.add(inner_sphere);

const outer_light = new THREE.PointLight(0xff0000, 50, 10);
outer_light.castShadow = true;
scene.add(outer_light);

let draw_dollys = true;
document.getElementById('show_wires').addEventListener('click', () => {
	if (draw_dollys) {
		scene.add(md_draw);
		scene.add(fd_draw);
	} else {
		scene.remove(md_draw);
		scene.remove(fd_draw);
	}
	draw_dollys = !draw_dollys;
});

// const inner_light = new THREE.

let frame2 = 0;
//!box3 is bounding box
function animate() {
	frame = (frame += 1) % 1000;
	frame2 = (frame2 += 1) % 12000;

	let camera_position = motion_dolly.get_position(frame, 1000);
	const old_length = camera_position.length();
	const e = new THREE.Vector3();
	e.copy(camera_position);
	e.setLength(old_length + 3);
	camera_position = motion_dolly.get_position(frame, 1000);
	const camera_focus_point = focal_dolly.get_position(frame2, 12000);
	outer_light.position.x = camera_focus_point.x;
	outer_light.position.y = camera_focus_point.y + 0.5;
	outer_light.position.z = camera_focus_point.z;
	outer_cube.position.x = camera_focus_point.x;
	outer_cube.position.y = camera_focus_point.y;
	outer_cube.position.z = camera_focus_point.z;
	inner_sphere.position.x = camera_focus_point.x;
	inner_sphere.position.y = camera_focus_point.y + 0.25;
	inner_sphere.position.z = camera_focus_point.z;
	if (!STOP) {
		camera.position.copy(e);
		camera.lookAt(camera_focus_point);
	}
	if (frame % 2 == 0) {
		update_light(leftLight, left_torch_sparks);
	}
	if (frame2 % 2 == 0) {
		update_light(rightLight, right_torch_sparks);
	}
	requestAnimationFrame(animate);
	composer.render();
}
//render loop, everytime scene is redrawn is called
window.addEventListener('resize', onWindowResize, false);
animate();
