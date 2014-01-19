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

	console.log("came");
	
	container = document.getElementById("container");

	//領域の大きさ
	var w = container.offsetWidth;
	var h = container.offsetHeight;

	//カメラを準備
	var fov    = 100;		//視野角
	var aspect = w / h;		//縦横比
	var near   = 1;			//視野前
	var far    = 1000;		//視野奥
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(-100, 100, -100);

	//シーンを準備
	scene = new THREE.Scene();

/*いらない！
	(ﾟдﾟ)！
	最近気づいたのですが、BasicMaterialしか使ってなければ、Lightは必要ないようです。
	Basicには影がつかないので、当たり前でした。アホです。
	しかし、環境光すら必要ないのは衝撃でした。

	//並行光をシーンに追加
	var c = 0xffffff;		//光の色
	var intensity = 0.5;	//光の強さ
	var light = new THREE.DirectionalLight(c, intensity);
	light.position.set(1, 1, 10);
	scene.add(light);

	//環境光をシーンに追加
	c = 0x808080;			//光の色
	light = new THREE.AmbientLight(c);
    scene.add(light);
*/

	//レンダラを作ってDIVに載せる
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(new THREE.Color(0));	//背景色
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
	var x, y, z, R = 100, as, altura, col, vec, H, i;

	//色相の値を計算
	H = rgb2hsv(0x00fa9a) / 360;

	//ジオメトリ作成
	var geometry = new THREE.Geometry();
	for(as = -Math.PI, i = 0; as < Math.PI; as += Math.PI / 90, i++)
	{
		col = new THREE.Color();
		col.setHSL(H, 1.0, i / 180);
		for(altura = -Math.PI; altura < Math.PI; altura += Math.PI / 90)
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
	//マテリアル作成
	var material = new THREE.ParticleBasicMaterial({size: 1, color: 0xffd700});
	material.vertexColors = true;

	//メッシュ作成
	var mesh = new THREE.ParticleSystem(geometry, material);
	mesh.sortParticles = false;

	//シーンに追加
	scene.add(mesh);
}

