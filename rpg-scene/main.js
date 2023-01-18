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
const NUM_RANDOM_MODELS = 10;
let ELAPSED_TIME = 0;
let camera_loop_time = 2000;
let focus_loop_time = 5000;
let FREE_CAM = false;
let SHADOWS_ON = false;
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
	renderer.outputEncoding = THREE.PCFShadowMap;

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

//asdasd

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
const LIGHTS = [leftLight, rightLight, topLight, bottomLight];
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
		false
	);

	const book = new custom_model(
		[2, 2, 2],
		[0, 0, 0],
		[0, t_D.height, 0],
		[t_D.x * 0.9, t_D.height, t_D.z - 2.5],
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
		false
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
		false
	);
	MODELS.push(left_torch, right_torch, table);
	// some random models scattered around
	let left_shift = -0.8;
	let left_shift_amount = 1.8 / NUM_RANDOM_MODELS;
	for (let i = 0; i < NUM_RANDOM_MODELS; i++) {
		const A = new custom_model();
		A.random(1, 360, { x: t_D.x * left_shift, y: t_D.height, z: t_D.z });
		A.focusable = true;
		left_shift = left_shift + left_shift_amount;
		MODELS.push(A);
	}
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
	rightLight.castShadow = SHADOWS_ON;
	leftLight.position.set(...left_light_position);
	leftLight.castShadow = SHADOWS_ON;
	topLight.position.set(...top_light_position);
	topLight.castShadow = SHADOWS_ON;
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

init_sparks(left_torch_sparks, left_light_position);
init_sparks(right_torch_sparks, right_light_position);
init_models();
load_models();
init_lights();
init_helpers();
init_floor();

function light_flicker(intensity) {
	return (
		(Math.random(torch_max_intensity) + intensity * (Math.random(3) + 0.5)) %
		torch_max_intensity
	);
}

function animate_flame(light, sparks = []) {
	const old_intensity = light.intensity;
	const new_intensity = light_flicker(old_intensity);
	light.intensity = (new_intensity + old_intensity) / 2;
	light.distance = new_intensity + 10;
	sparks.forEach((e) => {
		e.wiggle(new_intensity);
	});
}

const motion_dolly = new dolly([
	[t_D.x * 1, t_D.height + THREE.MathUtils.randFloat(0, 2), t_D.z * 1],
	[t_D.x * 1, t_D.height + THREE.MathUtils.randFloat(0, 2), t_D.z * -1],
	[t_D.x * -1, t_D.height + THREE.MathUtils.randFloat(0, 2), t_D.z * -1],
	[t_D.x * -1, t_D.height + THREE.MathUtils.randFloat(0, 2), t_D.z * 1],
]);
const md_draw = motion_dolly.draw({ color: 0xffffff });

const FOCALS = [];
MODELS.forEach((e) => {
	if (e.focusable) {
		FOCALS.push(e.position);
	}
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

const follow_light = new THREE.PointLight(0xff0000, 50, 10);
follow_light.castShadow = false;
scene.add(follow_light);

LIGHTS.push(follow_light);

let draw_dollys = true;

// const inner_light = new THREE.

//!box3 is bounding box
function animate() {
	ELAPSED_TIME += 1;
	const camera_time = ELAPSED_TIME % camera_loop_time;
	const focus_time = ELAPSED_TIME % focus_loop_time;

	let camera_position = motion_dolly.get_position(
		camera_time,
		camera_loop_time
	);
	const old_length = camera_position.length();
	const e = new THREE.Vector3();
	e.copy(camera_position);
	e.setLength(old_length + 3);
	camera_position = motion_dolly.get_position(camera_time, camera_loop_time);
	const camera_focus_point = focal_dolly.get_position(
		focus_time,
		focus_loop_time
	);
	follow_light.position.x = camera_focus_point.x;
	follow_light.position.y = camera_focus_point.y + 2;
	follow_light.position.z = camera_focus_point.z;
	outer_cube.position.x = camera_focus_point.x;
	outer_cube.position.y = camera_focus_point.y;
	outer_cube.position.z = camera_focus_point.z;
	inner_sphere.position.x = camera_focus_point.x;
	inner_sphere.position.y = camera_focus_point.y + 2;
	inner_sphere.position.z = camera_focus_point.z;
	if (!FREE_CAM) {
		camera.position.copy(e);
		camera.lookAt(camera_focus_point);
	}
	if (ELAPSED_TIME % 2 == 0) {
		animate_flame(leftLight, left_torch_sparks);
		animate_flame(follow_light);
	}
	if (focus_time % 2 == 0) {
		animate_flame(rightLight, right_torch_sparks);
	}
	requestAnimationFrame(animate);
	composer.render();
}

window.addEventListener('resize', onWindowResize, false);
const show_wires_button = document.getElementById('show_wires');
show_wires_button.addEventListener('click', (e) => {
	if (draw_dollys) {
		scene.add(md_draw);
		scene.add(fd_draw);
		show_wires_button.innerHTML = 'HIDE WIRES';
	} else {
		scene.remove(md_draw);
		scene.remove(fd_draw);
		show_wires_button.innerHTML = 'SHOW WIRES';
	}
	draw_dollys = !draw_dollys;
});
const free_cam_button = document.getElementById('free_cam');
free_cam_button.addEventListener('click', () => {
	if (!FREE_CAM) {
		const controls = new OrbitControls(camera, renderer.domElement);
		camera.position.set(0, 20, 10);
		controls.update();
	}
	FREE_CAM = !FREE_CAM;
	free_cam_button.innerHTML = FREE_CAM ? 'FOLLOW CAM ' : 'FREE CAM ON';
});
const shadow_switch_button = document.getElementById('shadows');
shadow_switch_button.addEventListener('click', () => {
	SHADOWS_ON = !SHADOWS_ON;
	LIGHTS.forEach((e) => {
		e.castShadow = SHADOWS_ON;
	});
	shadow_switch_button.innerHTML = SHADOWS_ON ? 'SHADOWS OFF' : 'SHADOWS ON';
});
animate();
