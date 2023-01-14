import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

const scene = new THREE.Scene();
//container for all visuals

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
//fov, aspect ratio, view frustrum user, view frust furthest point

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
//target location to render is bg ie the whole background

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(760);
//move the camera back

const composer = new EffectComposer( renderer );
//post proc effect
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

/*
TORUS SHAPE
*/
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

/*
LIGHT
*/
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
const ambLight = new THREE.AmbientLight(0xff5f3f, 0.1);
scene.add(pointLight,ambLight); //,ambLight

/*
HELPERS
*/
//shows where the light is
const lightHelper = new THREE.PointLightHelper(pointLight);
//3d grid
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
//allows camera controls
// const controls = new OrbitControls(camera, renderer.domElement);
//shows 3d axis
const axesHelper = new THREE.AxesHelper( 50 ); 
scene.add( axesHelper );

/*
STARS
*/
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);



/*
TEXTURES
*/
const bgTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = bgTexture;

const ericTexture = new THREE.TextureLoader().load('eric.png');

const eric = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:ericTexture})
);

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('moon_norm.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap: normalTexture
  })
);

moon.position.z = 30;
moon.position.setX(-10);

scene.add(eric);
scene.add(moon);

function moveCamera (){
  const t = document.body.getBoundingClientRect().top;
  //getBoundClientRect gets the dimensions of the body, top is the distance we 
  //are from the top of the body in the dom
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  eric.rotation.y += 0.01;
  eric.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

function clickwel(){
  console.log('asdasd')
}
document.body.onscroll = moveCamera
document.getElementById('welcome').onclick = clickwel

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
/*
ANIMATE LOOP
*/
function animate(){
  requestAnimationFrame(animate);
  // renderer.render(scene, camera); 
  torus.rotation.x += 0.01;
  torus.rotation.y -= 0.01;
  composer.render();
}
//render loop, everytime scene is redrawn is called



animate();
