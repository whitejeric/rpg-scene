import * as THREE from 'three';
import spark from './spark';

/**
 * !UNIMPLEMENTED
 */
class sparkler {
	origin = Array(3);
	bounds = { left: 0, right: 0, up: 0, down: 0, in: 0, out: 0 };
	reference_object = {};
	spark_count = 0;
	spark_props = {};
	sparks = [];
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 * @param { * } parm1
	 * @param { * } parm2
	 * @param { * } parm3
	 * @param { * } parm4
	 * @param { * } parm5
	 */
	constructor(
		origin = [0, 0, 0],
		bounding_box = { width: 5, height: 5, depth: 5 },
		spark_count = 3,
		reference_object = { prop: 'default_sparkler' },
		spark_props = {
			dim: { radis: 1, width: 1, height: 1 },
			origin: [0, 0, 0],
			spread: 10,
			color: '0xffffff',
		}
	) {
		this.origin = origin;
		this.bounds.left = origin[0] - bounding_box.width;
		this.bounds.right = origin[0] + bounding_box.width;
		this.bounds.up = origin[1] + bounding_box.height;
		this.bounds.down = origin[1] - bounding_box.height;
		this.bounds.in = origin[2] - bounding_box.depth;
		this.bounds.out = origin[2] + bounding_box.depth;
		this.spark_count = spark_count;
		this.reference_object = reference_object;
		this.spark_props = spark_props;
	}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 */
	populate() {
		for (let i = 0; i < this.spark_count; i++) {
			this.sparks.push(
				new spark(
					this.spark_props.dim,
					this.spark_props.origin,
					this.spark_props.spread,
					this.spark_props.color
				)
			);
		}
	}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 * @param { * } spark_index
	 */
	pop(spark_index) {}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 * @param { * } spark_index
	 */
	fizzle(spark_index) {}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 * @param { * } point
	 * @param { * } min
	 * @param { * } max
	 */
	is_in_bound(point, min, max) {
		return point >= min && point <= max;
	}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 * @param { * } spark
	 */
	is_in_bounds(spark) {
		let s_x = spark.position.x;
		let s_y = spark.position.y;
		let s_z = spark.position.z;
		if (
			!is_in_bound(s_x, this.bounds.left, this.bounds.right) ||
			!is_in_bound(s_y, this.bounds.up, this.bounds.down) ||
			!is_in_bound(s_z, this.bounds.in, this.bounds.out)
		) {
			return false;
		}
		return true;
	}
	/**
	 * desc
	 * @author EW
	 * @date 2023-01-16
	 */
	update() {
		for (let j = 0; j < this.sparks.length; j++) {
			if (!is_in_bounds(sparks[j])) {
				fizzle(j);
			} else sparks[j].wiggle(this.reference_object.intensity);
		}
	}
}
