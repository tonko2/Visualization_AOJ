/*--

	だら＄らいぶらりぃ～

	three.js
		パーティクル／点

	Autor. banjo

--*/

//------------------------------------------
//	変数
//------------------------------------------
var container;		//レンダラを載せるDIV
var renderer;		//レンダラ
var scene;			//シーン
var camera;			//カメラ
var trackball;		//マウスでカメラを動かす

//------------------------------------------
//	開始
//------------------------------------------
function main()
{
	init();
	drawObject();
	animate();
}

//------------------------------------------
//	舞台を作成
//------------------------------------------
function init()
{
	window.addEventListener( 'resize', onWindowResize, false );
	container = document.getElementById("container");

	//console.log(container);


	//領域の大きさ
	//var w = container.offsetWidth;
	//var h = container.offsetHeight;

	var w = window.innerWidth;
	var h = window.innerHeight;

	//カメラを準備
	var fov    = 100;		//視野角
	var aspect = w / h;		//縦横比
	var near   = 1;			//視野前
	var far    = 1000;		//視野奥
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(-100, 100, -100);

	//シーンを準備
	scene = new THREE.Scene();


	//レンダラを作ってDIVに載せる
	renderer = new THREE.WebGLRenderer({antialias: true});
//	renderer.setClearColor(new THREE.Color(0));	//背景色
	renderer.setClearColor(0xffffff,1);
	renderer.setSize(w, h);						//描画領域サイズ
	container.appendChild(renderer.domElement);

	//カメラをマウスで制御する
	trackball = new THREE.TrackballControls(camera, renderer.domElement);
	trackball.rotateSpeed = 1.0;
	trackball.zoomSpeed = 1.2;
	trackball.panSpeed = 0.8;
	trackball.noZoom = false;
	trackball.noPan = false;
	trackball.staticMoving = true;
	trackball.dynamicDampingFactor = 0.3;
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );
	//render();

}

//--------------------------------
//	アニメーション
//--------------------------------
function animate() 
{
	//カメラの位置を更新
	//	マウスでぐりぐり動かしてると、物体を動かしている気になるが、
	//	実は物体は動いてなくて、カメラが周りをぐるぐる回っているだけ
	trackball.handleResize();
	trackball.update();

	//レンダリング
	renderer.render(scene, camera);

	//再呼び出し
	requestAnimationFrame(animate);
}

//---------------------------------------------------------
//	パーティクルとは、１つの物体の中に無数の点がある状態
//---------------------------------------------------------
function drawObject()
{
	var x, y, z, R = 100, altura, col, vec, H;

	//色相の値を計算
	H = rgb2hsv(0x00fa9a) / 360;
	//console.log(H);

	//ジオメトリ作成
	var geometry = new THREE.Geometry();


	var cnt = 0;


/*
	var phi = Math.PI / 180.0;

	for(var i = -Math.PI, j = 0; i<=Math.PI; i += Math.PI / 200, j++){
		col = new THREE.Color();

		if(j % 2 == 0)
			col.setHSL(H, 1.0, 0.1);

		if(j % 2 == 1)
			col.setHSL(H, 1.0, 0.7);

		x = R * Math.sin(i) * Math.cos(phi);
		y = R * Math.sin(i) * Math.sin(phi);
		z = R * Math.cos(i);
		vec = new THREE.Vector3(x, y, z);
		geometry.vertices.push(vec);
		geometry.colors.push(col);
	}


*/

	var cnt = 0;
	var MAX = 200;
	var total = MAX * MAX * 4;

	for(var as = -Math.PI, i = 0; as < Math.PI; as += Math.PI / MAX, i++)
	{

		col = new THREE.Color();
		col.setHSL(H, 1.0, i / 180);


		for(altura = -Math.PI; altura < Math.PI; altura += Math.PI / MAX)
		{

			x = R * Math.sin(as) * Math.cos(altura);
			y = R * Math.sin(as) * Math.sin(altura);
			z = R * Math.cos(as);

			//点を追加
			vec = new THREE.Vector3(x, y, z);
			geometry.vertices.push(vec);
			
			//色を追加
			geometry.colors.push(col);
		}
	}

	console.log(total);


	//マテリアル作成
	var material = new THREE.ParticleBasicMaterial({size: 0.8, color: 0xffd700});
	material.vertexColors = true;

	//メッシュ作成
	var mesh = new THREE.ParticleSystem(geometry, material);
	mesh.sortParticles = false;

	//シーンに追加
	scene.add(mesh);
}

