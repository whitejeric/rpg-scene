import * as THREE from 'three';

class torch {
	// constructor(){
	//     let geometry = new THREE.SphereGeometry(0.25, 24, 24);
	//     let material = new THREE.MeshStandardMaterial({color: 0xFF6347});
	//     this.S = new THREE.Mesh(geometry, material);

	//     let [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
	//     this.S.position.set(-x,y,z);
	// }
	constructor(
		s,
		o, //origin
		spread,
		color
	) {
		//size of the star object, origin of placement, scatter/spread amount
		let geometry = new THREE.SphereGeometry(s.r, s.w, s.h);
		let material = new THREE.MeshStandardMaterial(color);
		this.S = new THREE.Mesh(geometry, material);

		// let [x,y,z] = Array(3)s.fill().map(() => THREE.MathUtils.randFloatSpread(spread));
		o.forEach((e, i) => (o[i] = e + THREE.MathUtils.randFloatSpread(spread)));
		console.log('as');
		this.S.position.set(o[0], o[1], o[2]);
	}
	get() {
		return this.S;
	}
}
export default spark;

// constructor (
//     s = {x: 0.25, y: 24, z: 24},
//     o = [0,0,0],  //origin
//     spread = 100,
//     color = {color:0xffffff}){
