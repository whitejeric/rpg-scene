import * as THREE from 'three';

class spark {
    // constructor(){
    //     let geometry = new THREE.SphereGeometry(0.25, 24, 24);
    //     let material = new THREE.MeshStandardMaterial({color: 0xFF6347});
    //     this.S = new THREE.Mesh(geometry, material);
    
    //     let [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    //     this.S.position.set(-x,y,z);
    // }
    O = []
    constructor (
        s, 
        o,  //origin
        spread, 
        color){
            //size of the star object, origin of placement, scatter/spread amount
            let geometry = new THREE.SphereGeometry(s.r, s.w, s.h);
            let material = new THREE.MeshStandardMaterial(color);
            this.Spark = new THREE.Mesh(geometry, material);
        
            // let [x,y,z] = Array(3).fill().map   (() => THREE.MathUtils.randFloatSpread(spread));
            o.forEach((e, i) => {
                o[i] = e + (THREE.MathUtils.randFloatSpread(spread));
                this.O[i] = o[i];
            });
            this.Spark.position.set(o[0],o[1],o[2]);
    }
    wiggle(intensity){
        let wiggle_offset = (Math.random(10) * Math.abs(intensity-5)/8);
        let y = this.Spark.position.y + wiggle_offset
        let x = this.Spark.position.x - wiggle_offset*Math.sin(intensity)
        
        if (y < Math.abs(this.O[1] + 8) ){
            this.Spark.position.setY(y);
            this.Spark.position.setX(x);
        }
        else{
            let offset = Math.random();
            this.Spark.position.setY(this.O[1] -offset);
            this.Spark.position.setX(this.O[0] -(offset/2));
            this.Spark.position.setZ(this.O[2] -(offset));
        }
    }
    get(){
        return this.Spark
    }
  }
export default spark

// constructor (
//     s = {x: 0.25, y: 24, z: 24}, 
//     o = [0,0,0],  //origin
//     spread = 100, 
//     color = {color:0xffffff}){