import * as THREE from 'three';

class spark {
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-14
	 * @param { object }    dim   	dimensions; contains radius, width and height of spark
	 * @param { Array }     origin  origin of spark, [x,y,z]
	 * @param { float }     spread  amount of randomness to placement
	 * @param { object }    color
	 */
	O = [];
	constructor(
		dim = { radius: 1, width: 1, height: 1 },
		origin = [1, 1, 1],
		spread = 10,
		color = '0xffffff'
	) {
		let geometry = new THREE.SphereGeometry(dim.radius, dim.width, dim.height);
		let material = new THREE.MeshStandardMaterial(color);
		this.Spark = new THREE.Mesh(geometry, material);
		origin.forEach((e, i) => {
			origin[i] = e + THREE.MathUtils.randFloatSpread(spread);
			this.O[i] = origin[i];
		});
		this.Spark.position.set(origin[0], origin[1], origin[2]);
	}
	/**
	 * applies a motion to the spark according to current torch light level
	 * @author EW
	 * @date 2023-01-14
	 * @param { float } intensity   current luminosity of the parent torch
	 * @param { float } factor   	semi-magic number for creating randomness
	 */
	wiggle(intensity, factor = 25) {
		let wiggle_offset =
			(Math.random(factor) * Math.abs(intensity - factor * 0.5)) /
			(factor * 0.8);
		let y = this.Spark.position.y + wiggle_offset;
		let x = this.Spark.position.x - wiggle_offset * Math.sin(intensity);

		if (y < Math.abs(this.O[1] + factor * 0.8)) {
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
