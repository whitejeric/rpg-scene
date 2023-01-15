import './style.css'
import spark from './spark'
import camera_pipe from './camera_pipe'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CameraHelper } from 'three';
import custom_model from './custom_model';

//TODO create init function
  
  const scene = new THREE.Scene();
  const left_torch_pos = [-8,8,-2];
  const right_torch_pos = [8,8,-2];
  const spark_count = 3;
  const table_height = 4.2;
  
  // const C = new THREE.LineCurve(new THREE.Vector3(0,0,0), new THREE.Vector3(0,10,0));
  // const C_geometry = new THREE.TubeGeometry(C, 100, 2, 8, true);
  // const C_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, side: THREE.DoubleSide} );
  // const tube = new THREE.Mesh(C_geometry, C_material);
  // scene.add(tube)
  const dolly_points = [
    new THREE.Vector3(0,10,10),
    new THREE.Vector3(0,9,2),
    new THREE.Vector3(0,7,1)
  ]
  const camera_dolly = new camera_pipe(dolly_points);
  
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
  
  //move the camera back

  const composer = new EffectComposer( renderer );
  //post proc effect
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

/*
FLOOR
TODO clean up
*/
const geometry = new THREE.BoxGeometry(100, 1, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const floor = new THREE.Mesh(geometry, material);
scene.add(floor);

const MODELS = []

/**
 * initializes the custom model object for each imported 3d model in the scene
 * @author EW
 * @date 2023-01-14
 */
function init_models(){
  const table = new custom_model(
    [5,5,5], 
    [0, Math.PI/2, 0], 
    [0.5,0,0], 
    [0,5,0], 
    './models/Small_Table.glb',
    'table'
    );

  const book = new custom_model(
      [2, 2, 2], 
      [0, -Math.PI/8, 0], 
      [2, table_height, -1], 
      [0,5,0], 
      '/models/Open_Book.glb',
      'book'
    );

  MODELS.push(table,book)
}

init_models()

const loader = new GLTFLoader();

// loads all 3d models into scene through GLTFLoader
MODELS.forEach(e => {
  loader.load( e.file, 
    function ( gltf ) { //onload
      let m = gltf.scene;
      m.scale.set(...e.scale);
      m.rotation.set(...e.rotation);
      m.position.set(...e.position);
      scene.add(m)
      console.log('loaded model: ' + e.name)
    }, 
    undefined, //onprogress
    function ( error ) { //on error
      console.error( error );
    } 
  );
})

/*
LIGHT
TODO create torch class
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
TODO remove
*/
//shows where the light is
const l_lightHelper = new THREE.PointLightHelper(leftLight);
const r_lightHelper = new THREE.PointLightHelper(rightLight);
//3d grid
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(r_lightHelper, l_lightHelper, gridHelper);
//allows camera controls
// const controls = new OrbitControls(camera, renderer.domElement);
//shows 3d axis

const axesHelper = new THREE.AxesHelper( 50 ); 
scene.add( axesHelper );

/*
SPARKS
TODO: add to torch class
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
BACKGROUND
TODO replace background
*/
const bgTexture = new THREE.TextureLoader().load('space.jpg')
// scene.background = bgTexture;

camera_dolly.draw(scene)

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
  const t = document.body.getBoundingClientRect().top/1000;
  // const b = document.body.getBoundingClientRect().top/1000;
  console.log(t)
  let camera_on_dolly = camera_dolly.move_camera(Math.abs(t))
  camera.position.copy(camera_on_dolly[0])
  // camera.lookAt(camera_on_dolly[1])
}

moveCamera()
document.body.onscroll = moveCamera
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
let frame = 0
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
