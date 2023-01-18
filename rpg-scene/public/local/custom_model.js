import * as fs from 'fs';
import * as THREE from 'three';

const model_folder = './models/';
const model_library = [
	'Bag.glb',
	'Bone.glb',
	'Book.glb',
	'Chalice.glb',
	'Chest.glb',
	'Coin_Pouch.glb',
	'Crown.glb',
	'Fish_Bone.glb',
	'Glove.glb',
	'Gold_Ingots.glb',
	'Key-bg6e1lfNsO.glb',
	'Knife.glb',
	'Mineral.glb',
	'Necklace.glb',
	'Parchment.glb',
	'Potion_Bottle.glb',
	'Skull-ExZmhOIjka.glb',
	'Skull.glb',
	'Skull_Coin.glb',
	'Star_Coin.glb',
];

class custom_model {
	scale = Array(3);
	rotation = Array(3);
	position = Array(3);
	view = Array(3);
	file = '';
	name = '';
	focusable = false;
	/**
	 * custom model object
	 * @param {Array(3)} scale          scaling at [x,y,z]
	 * @param {Array(3)} rotation       rotation around [x,y,z] radians
	 * @param {Array(3)} position       position [x,y,z]
	 * @param {Array(3)} view_position  position for camera placement [x,y,z]
	 * @param {String} file             filepath
	 * @param {String} name
	 * @param {Boolean} focusable       whether the camera can focus on model
	 * @author EW
	 * @date 2023-01-14
	 */
	constructor(
		scale = [1, 1, 1],
		rotation = [0, 0, 0],
		position = [0, 0, 0],
		view = [0, 5, 0],
		file_path = './models/Arrow.glb',
		name = 'default_model',
		focusable = false
	) {
		this.scale = scale;
		this.rotation = rotation;
		this.position = position;
		this.view = view;
		this.file = file_path;
		this.name = name;
		this.focusable = focusable;
	}
	set(s, r, p, vp, f, n, focus) {
		this.scale = s;
		this.rotation = r;
		this.position = p;
		this.view_position = vp;
		this.file = f;
		this.name = n;
		this.focusable = focus;
	}
	random(max_scale, max_rotation, bounds, position_spread = 0.6) {
		this.file =
			model_folder +
			model_library[THREE.MathUtils.randInt(0, model_library.length)];
		this.name = this.file;
		var scale_factor = THREE.MathUtils.randFloat(1, max_scale);
		this.scale = this.scale.map((e) => e * scale_factor);
		console.log(scale_factor);
		var rotation_factor = THREE.MathUtils.degToRad(
			THREE.MathUtils.randFloat(0, max_rotation)
		);
		this.rotation[1] = rotation_factor;
		var x = bounds.x;
		// x = x + (x < 0 ? position_spread : -position_spread);
		var y = bounds.y;
		var pos_or_neg = THREE.MathUtils.randInt(0, 1);
		var sign = pos_or_neg > 0 ? -1 : 1;
		var z =
			THREE.MathUtils.randFloat(position_spread, bounds.z - position_spread) *
			sign;

		this.position = [x, y, z];
	}
}
export default custom_model;
