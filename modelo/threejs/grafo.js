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


// Otras variables
//var blanco = THREE.ImageUtils.loadTexture('images/blanco.jpeg');
//var marron = THREE.ImageUtils.loadTexture('images/marron.png');
//var natural = THREE.ImageUtils.loadTexture('images/natural.png');
var conjunto;
var materialUsuario;

// Control
var cameraControls, effectControls;

//dependientes del tiempo
var angulo =0 ;
var antes=Date.now();

// Variables para video
var video, videoImage, videoImageContent, videoTexture;
var minicam

//Acciones
init();
loadScene();
setupGUI();
render();//funcion que se va a repetir, se encola a si misma

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene(); //object 3D nodo raiz del que cuelgan todos los demas objetos

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight; //lienzo> area total del cliente, esta fraccion es la que da el aspect ratio
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );
    scene.add(camera);

	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.noZoom = false;

    // Minicam .....................................................
    minicam = new THREE.OrthographicCamera(-10,10, 10,-10, -10,100);
    minicam.position.set(0,1,0);
    minicam.up.set(0,0,-1);
    minicam.lookAt(0,-1,0);
    scene.add(minicam);
    // .............................................................

	// Luces
	var ambiental = new THREE.AmbientLight(0x222222);
	scene.add(ambiental);

	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	direccional.position.set( 0,1,0 );
	scene.add( direccional );

	var puntual = new THREE.PointLight( 0xFFFFFFF, 0.3 );
	puntual.position.set( 2, 7, -4 );
	scene.add( puntual );

	var focal = new THREE.SpotLight( 0xFFFFFF, 0.5 );
	focal.position.set( -2, 7, 4 );
	focal.target.position.set( 0,0,0 );
	focal.angle = Math.PI/7;
	focal.penumbra = 0.5;
	focal.castShadow = true;

	scene.add( focal );

	// Atender eventos
	window.addEventListener( 'resize', updateAspectRatio );
}

function loadScene() {
	// Construye el grafo de escena
	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.name = 'conjunto';
	conjunto.position.y = 1;

	// Suelo
	var texSuelo = new THREE.TextureLoader().load("images/burberry_256.jpg");
	var geoSuelo = new THREE.PlaneGeometry(10,10,200,200);
	var matSuelo = new THREE.MeshLambertMaterial( {color:'gray', map:texSuelo} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
	suelo.name = 'suelo';
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;
	suelo.receiveShadow = true;

	// Objeto importado
	/*var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
                    objeto.scale.set(0.8,0.8,0.8);
                    objeto.position.y = -1;
		         	objeto.rotation.y = Math.PI/2;
		         	cubo.add(objeto);
		         });*/
		/*		 
	var gloader = new THREE.GLTFLoader();
	loader.load('mueble/scene.gltf', 
			function(gltf){
				gltf.name = 'mesa';
				gltf.position.y = 1;
				mesa = gltf.scene.children[0];
				mesa.scale.set(0.8,0.8,0.8);
				scene.add(gltf.scene);
				var txmesa = new THREE.TextureLoader().load('images/blanco.jpeg');
				gltf.material.setValues({map:txmesa});
				gltf.castShadow = true;
				//var marron = THREE.ImageUtils.loadTexture('images/marron.png');
				//var natural = THREE.ImageUtils.loadTexture('images/natural.png');
				
				animate();
	});
	*/
	const gloader = new GLTFLoader();
	const muebleLoader = new MUEBLELoader();
	loader.setMUEBLELoader(muebleLoader);
	loader.load('mueble/scene.gltf', 
			function(gltf){
				scene.add(gltf.scene);
				gltf.name = 'mesa';
				gltf.position.y = 1;
				var txmesa = new THREE.TextureLoader().load('images/blanco.jpeg');
				gltf.material.setValues({map:txmesa});
				gltf.castShadow = true;
				//var marron = THREE.ImageUtils.loadTexture('images/marron.png');
				//var natural = THREE.ImageUtils.loadTexture('images/natural.png');
				animate();
				function ( xhr ) {
						console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

				},
				function ( error ) {
						console.log( 'An error happened' );
				}
	});
	// Habitacion
	var shader = THREE.ShaderLib.cube;
    var entorno = [ "lib/posx.jpg" , "lib/negx.jpg",
	                "lib/posy.jpg" , "lib/negy.jpg",
	                "lib/posz.jpg" , "lib/negz.jpg"];

	var matParedes = new THREE.ShaderMaterial( {
						vertexShader: shader.vertexShader,
						fragmentShader: shader.fragmentShader,
						uniforms: shader.uniforms,
						depthWrite: false,
						side: THREE.BackSide
	} );

	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(30,30,30), matParedes );
    habitacion.name = 'habitacion';

	// Grafo
	scene.add( conjunto );
	scene.add( new THREE.AxesHelper(3) );
	scene.add( suelo );
	scene.add( habitacion );
}

function update()
{
	// Cambiar propiedades entre frames

	angulo += Math.PI/100;
	mueble.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;
	
	// Cambio por demanda de usuario
	conjunto.position.y = effectControls.posY;
	mesa.position.x = -effectControls.separacion;
	materialUsuario.setValues( {color:effectControls.color} );
	
	
}
function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara

	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Para la perspectiva
	camera.aspect = aspectRatio;
	// Para la ortografica
	// camera.top = 10/aspectRatio;
	// camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function setupGUI()
{
	// Interfaz grafica de usuario 

	// Controles
	effectControls = {
		color: [],
		caja: true,
		color: "rgb(255,0,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Cambiar color mueble");
	var aux = {
		folder.add( effectControls, "color", {
		Blanco: 
		var txmesa = new THREE.TextureLoader().load('images/blanco.jpeg');
		gltf.material.setValues({map:txmesa});
		,Marron:
		var txmesa = new THREE.TextureLoader().load('images/marron.png');
		gltf.material.setValues({map:txmesa});
		,Natural:
		var txmesa = new THREE.TextureLoader().load('images/natural.png');
		gltf.material.setValues({map:txmesa});
		
		} ).name("Color");
		
	}
	folder.add( effectControls, "caja" ).name("Ver mueble 3D");
	
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();
    renderer.clear();
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render( scene, camera );
    renderer.setViewport( 10,10,200,200 );
    renderer.render( scene, minicam );
}
