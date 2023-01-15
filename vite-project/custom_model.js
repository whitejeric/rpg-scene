class custom_model {
    scale = [1,1,1]
    rotation = [0,0,0]
    position = [0,0,0]
    view_position = [0,5,0]
    file = './models/Small_Table.glb'
    name = 'default_model'
    /**
 * custom model object
 * @param {Array(3)} scale
 * @param {Array(3)} rotation
 * @param {Array(3)} position
 * @param {Array(3)} view_position  
 * @param {String} file
 * @param {String} name
 * @author EW
 * @date 2023-01-14
 */
    constructor(s,r,p,vp, f, n){
        this.scale = s
        this.rotation = r
        this.position = p
        this.view_position = vp
        this.file = f
        this.name = n
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