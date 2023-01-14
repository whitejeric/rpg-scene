import './style.css'
import spark from './spark'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  const scene = new THREE.Scene();
  const left_torch_pos = [-8,8,-2];
  const right_torch_pos = [8,8,-2];
  const spark_count = 3;
  const table_height = 4.2;
  //container for all visuals

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  //fov, aspect ratio, view frustrum user, view frust furthest point

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  //target location to render is bg ie the whole background
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(10);
  camera.position.setY(10);
  
  //move the camera back

  const composer = new EffectComposer( renderer );
  //post proc effect
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

/*
TORUS SHAPE
*/
const geometry = new THREE.BoxGeometry(100, 1, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const floor = new THREE.Mesh(geometry, material);
scene.add(floor);


const sceneMeshes= new THREE.Mesh();
const loader = new GLTFLoader();

loader.load( '/models/Small Table.glb', 
  function ( gltf ) { //onload
    let model = gltf.scene;
    model.scale.set(5, 5, 5);
    model.rotation.set(0, Math.PI/2, 0);
    model.position.set(0.5, 0, 0);
    scene.add(model)
  }, 
  undefined, //onprogress
  function ( error ) { //on error
	  console.error( error );
  } 
);

loader.load( '/models/Open Book.glb', 
  function ( gltf ) { //onload
    let model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.rotation.set(0, -Math.PI/8, 0);
    model.position.set(2, table_height, -1);
    scene.add(model)
  }, 
  undefined, //onprogress
  function ( error ) { //on error
	  console.error( error );
  } 
);

/*
LIGHT
*/
const rightLight = new THREE.PointLight(0xFFA500, 2);
rightLight.position.set(...right_torch_pos); //... spread operator

loader.load( '/models/Torch.glb', 
  function ( gltf ) { //onload
    let model = gltf.scene;
    model.scale.set(3, 3, 3);
    model.rotation.set(0,-Math.PI/2,Math.PI/8);
    model.position.set(...right_torch_pos);
    model.position.y -= 2
    model.position.x += 0.2
    model.position.z += 0.2
    scene.add(model)
  }, 
  undefined, //onprogress
  function ( error ) { //on error
	  console.error( error );
  } 
);


const leftLight = new THREE.PointLight(0xFFA500, 2);
leftLight.position.set(...left_torch_pos);
loader.load( '/models/Torch.glb', 
  function ( gltf ) { //onload
    let model = gltf.scene;
    model.scale.set(3, 3, 3);
    model.rotation.set(0,Math.PI/2, -Math.PI/8);
    model.position.set(...left_torch_pos);
    model.position.y -= 2
    model.position.x -= 0.2
    model.position.z += 0.2
    scene.add(model)
  }, 
  undefined, //onprogress
  function ( error ) { //on error
	  console.error( error );
  } 
);
const bottomLight = new THREE.PointLight(0xfbceb1, 4);
bottomLight.position.set(0,1,-5);
const ambLight = new THREE.AmbientLight(0xff5f3f, 1);
scene.add(leftLight, rightLight, bottomLight); //,ambLight
/*
HELPERS
*/
//shows where the light is
const l_lightHelper = new THREE.PointLightHelper(leftLight);
const r_lightHelper = new THREE.PointLightHelper(rightLight);
//3d grid
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(r_lightHelper, l_lightHelper, gridHelper);
//allows camera controls
const controls = new OrbitControls(camera, renderer.domElement);
//shows 3d axis

const axesHelper = new THREE.AxesHelper( 50 ); 
scene.add( axesHelper );

/*
SPARKS
*/
let sparks_list_left = Array(spark_count)
let sparks_list_right = Array(spark_count)
for (let i = 0; i < spark_count; i++){
  // scene.add(new spark({r: 0.15, w: 3, h:3}, [0,0,0], 6, {color:0xffffff}).get());
  sparks_list_right[i] = new spark({r: 0.09, w: 3, h:3}, right_torch_pos.map((e) => e), 1, {color:0xb04125});
  scene.add(sparks_list_right[i].get())
}
for (let j = 0; j < spark_count; j++){
  // scene.add(new spark({r: 0.15, w: 3, h:3}, [0,0,0], 6, {color:0xffffff}).get());
  sparks_list_left[j] = new spark({r: 0.09, w: 3, h:3}, left_torch_pos.map((e) => e), 1, {color:0xb04125});
  scene.add(sparks_list_left[j].get())
}



/*
TEXTURES
*/
const bgTexture = new THREE.TextureLoader().load('space.jpg')
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
function moveCamera (){
  const t = document.body.getBoundingClientRect().top;
  //getBoundClientRect gets the dimensions of the body, top is the distance we 
  //are from the top of the body in the dom


  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}


function clickwel(){
  console.log('asdasd')
}
// document.body.onscroll = moveCamera
// document.getElementById('welcome').onclick = clickwel

window.addEventListener('resize', onWindowResize, false)
/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
/*
ANIMATE LOOP
*/
camera.rotation.x = -.5;
let frame = 0
/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 * @param { * } intensity
 */
function light_flicker(intensity){
  return (intensity + Math.random() - 0.4)%5; 
}

/**
 * desc
 * @author asdasd
 * @date 2023-01-14
 */
function animate(){
  frame = (frame+=1)%60
  requestAnimationFrame(animate);
  if (frame%2==0){
    let left = leftLight.intensity;
    leftLight.intensity = light_flicker(left);
    let right = rightLight.intensity;
    rightLight.intensity = light_flicker(right);
    sparks_list_right.forEach(element => {element.wiggle(right)});
    sparks_list_left.forEach(element => {element.wiggle(left)});
  }
  // if (!frame){
  //   for (let i =0; i<200; i++){
  //     sparklist[i].wiggle()
  //   }
  // }
  
  // renderer.render(scene, camera); 
  // torus.rotation.x += 0.01;
  // torus.rotation.y -= 0.01;
  composer.render();
}
//render loop, everytime scene is redrawn is called



animate();
