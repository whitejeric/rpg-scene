import * as THREE from 'three';

class dolly {
	vectors = [];
	track = {};
	constructor(
		points = [
			[0, 0, 0],
			[10, 10, 10],
		]
	) {
		points.forEach((point) => {
			this.vectors.push(new THREE.Vector3(...point));
		});
		this.track = new THREE.CatmullRomCurve3(this.vectors, true);
	}
	draw(color = { color: 0xff0000 }) {
		const points = this.track.getPoints(500);
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial(color);
		return new THREE.Line(geometry, material);
	}
	get_position(t = 0, loop_length) {
		return this.track.getPointAt(t / loop_length);
	}
}

export default dolly;
