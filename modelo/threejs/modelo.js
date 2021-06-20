/**
  @file  modelo.js
  @brief modelo mesa y sillas 3D
  @author claargar@inf.upv.es
*/

var renderer, scene, camera, mesa, silla;
var cameraControls;
var angulo = -0.01;

init();
render();


function init()
{
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
  camera.position.set( 1, 1.5, 2 );

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );
  loader.load('scene.gltf', function(gltf){
	  scene.add(gltf.scene);
	  renderer.render(scene,camera);
	  
  });
}


/**
function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
**/

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}
init();