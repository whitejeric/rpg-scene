import * as THREE from 'three';

class spark {
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-14
	 * @param { object }    s   contains radius, width and height of spark
	 * @param { Array }     o   origin of spark
	 * @param { float }     spread  amount of randomness to placement
	 * @param { object }    color
	 */
	O = [];
	constructor(s, o, spread, color) {
		let geometry = new THREE.SphereGeometry(s.r, s.w, s.h);
		let material = new THREE.MeshStandardMaterial(color);
		this.Spark = new THREE.Mesh(geometry, material);
		// console.log(o)
		o.forEach((e, i) => {
			o[i] = e + THREE.MathUtils.randFloatSpread(spread);
			this.O[i] = o[i];
		});
		this.Spark.position.set(o[0], o[1], o[2]);
	}
	/**
	 * applies a motion to the spark according to current torch light level
	 * @author EW
	 * @date 2023-01-14
	 * @param { float } intensity   current luminosity of the parent torch
	 */
	wiggle(intensity) {
		let wiggle_offset = (Math.random(10) * Math.abs(intensity - 5)) / 8;
		let y = this.Spark.position.y + wiggle_offset;
		let x = this.Spark.position.x - wiggle_offset * Math.sin(intensity);

		if (y < Math.abs(this.O[1] + 8)) {
			this.Spark.position.setY(y);
			this.Spark.position.setX(x);
		} else {
			let offset = Math.random();
			this.Spark.position.setY(this.O[1] - offset);
			this.Spark.position.setX(this.O[0] - offset / 2);
			this.Spark.position.setZ(this.O[2] - offset);
		}
	}
	get() {
		return this.Spark;
	}
}
export default spark;
