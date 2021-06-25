/*
** Seminario #1: Grafo de escena 
** @author: rvivo@upv.es
** @date: 19-02-2020
*************************************************************
** Modificado por claargar para montar encima el trabajo 1 **
*************************************************************
*/

// Variables globales estandar
var renderer, scene, camera;
var blanco = THREE.ImageUtils.loadTexture('images/blanco.jpeg');
var marron = THREE.ImageUtils.loadTexture('images/marron.png');
var natural = THREE.ImageUtils.loadTexture('images/natural.png');

// Otras variables

var conjunto;

//dependientes del tiempo
var angulo =0 ;
var antes=Date.now();
//Acciones
init();
loadScene();
render();//funcion que se va a repetir, se encola a si misma

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene(); //object 3D nodo raiz del que cuelgan todos los demas objetos

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight; //lienzo> area total del cliente, esta fraccion es la que da el aspect ratio
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );
}

function loadScene() {
	// Construye el grafo de escena
	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;

	// Cubo


	// Esfera


	// Suelo
	var geoSuelo = new THREE.PlaneGeometry(10,10,12,12);
	var matSuelo = new THREE.MeshBasicMaterial( {color:'grey', wireframe: false} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;

	// Objeto importado
	/*var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
                    objeto.scale.set(0.8,0.8,0.8);
                    objeto.position.y = -1;
		         	objeto.rotation.y = Math.PI/2;
		         	cubo.add(objeto);
		         });*/
				 
	var gloader = new THREE.GLTFLoader();
	loader.load('mueble/scene.gltf', function(gltf){
			mesa = gltf.scene.children[0];
			mesa.scale.set(0.8,0.8,0.8);
			scene.add(gltf.scene);
			animate();
	});

	var tloader = new THREE.TextureLoader();
	loader.load(
	''
	);


	// Grafo
	conjunto.add( cubo );
	cubo.add( esfera );
	scene.add( conjunto );
	scene.add( new THREE.AxesHelper(3) );
	scene.add( suelo );
}

function update()
{
	// Cambiar propiedades entre frames

	angulo += Math.PI/100;
	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}
