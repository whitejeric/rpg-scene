import * as THREE from 'three';

class dolly {
	track = new THREE.CurvePath();
	curve_count = 0;
	c = 0;
	n = 0;
	step = 0;
	camera = new THREE.PerspectiveCamera();
	/**
	 * a series of tubes the camera follows along the scene ie surface of the table
	 * @author EW
	 * @date 2023-01-14
	 * @param { Array }     arc_list  array of three.js vectors detailing corners of tubing
	 */
	constructor(arc_list) {
		for (let i = 0; i < arc_list.length; i++) {
			if (arc_list[i].length > 2) {
				var a = arc_list[i][0];
				var b = arc_list[i][1];
				var c = arc_list[i][2];
			} else {
				//interpolate a third point in the middle to smooth out the tube
				var a = arc_list[i][0];
				var c = arc_list[i][1];
				var b = new THREE.Vector3();
				b.lerpVectors(a, c, 0.8);
				var len = b.length();
				b.setLength(len + 1);
				console.log(a, b, c);
			}

			var arc = new THREE.QuadraticBezierCurve3(a, b, c);
			console.log(arc);
			this.track.add(arc);
			this.curve_count += 1;
		}
		this.step = this.curve_count / 1000;
	}
	get() {
		return this.track;
	}
	draw(scene) {
		let checkered = [0x00ffff, 0xff0000];
		let flip_color = true;
		this.track.curves.forEach((curve) => {
			let C_geometry = new THREE.TubeGeometry(curve, 10, 0.15, 8, true);
			let C_material = new THREE.MeshBasicMaterial({
				color: flip_color ? checkered[0] : checkered[1],
				wireframe: true,
				side: THREE.DoubleSide,
			});
			scene.add(new THREE.Mesh(C_geometry, C_material));
			flip_color = !flip_color;
		});
	}
	move_camera(current_position) {
		//current_poisiton will be between 0 and 100
		//current curve is int floor of current position
		if (current_position < this.curve_count) {
			let current_curve = Math.floor(current_position);
			let next_position = current_position % 1; //has to be between 0,1
			this.c = current_curve;
			this.n = next_position;
		}
		let t1 = this.track.curves[this.c].getPointAt(this.n);
		let t2 = this.track.curves[this.c].getPointAt(this.n + this.step);
		return [t1, t2];
	}
}
export default dolly;
