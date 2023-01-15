class custom_model {
    scale = [1,1,1]
    rotation = [0,0,0]
    position = [0,0,0]
    view_position = [0,5,0]
    file = './models/Small_Table.glb'
    name = 'default_model'
    focusable = false
    /**
 * custom model object
 * @param {Array(3)} scale          THREE.js scale vector
 * @param {Array(3)} rotation       THREE.js rotation
 * @param {Array(3)} position       THREE.js position vector
 * @param {Array(3)} view_position  THREE.js camera vector for viewing object
 * @param {String} file             filepath
 * @param {String} name             
 * @param {Boolean} focusable       whether the camera can focus on model
 * @author EW
 * @date 2023-01-14
 */
    constructor(s,r,p,vp, f, n, focus){
        this.scale = s
        this.rotation = r
        this.position = p
        this.view_position = vp
        this.file = f
        this.name = n
        this.focusable = focus
   }
}
export default custom_model
// loader.load( '/models/Small Table.glb', 
//   function ( gltf ) { //onload
//     let model = gltf.scene;
//     model.scale.set(5, 5, 5);
//     model.rotation.set(0, Math.PI/2, 0);
//     model.position.set(0.5, 0, 0);
//     scene.add(model)
//   }, 
//   undefined, //onprogress
//   function ( error ) { //on error
// 	  console.error( error );
//   } 
// );