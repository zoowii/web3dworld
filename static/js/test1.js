$(function () {
    var camera, draw, height, initCamera, initLight, initScene, initThree, jsonLoader, light, render, renderer, scene, start, width;

    renderer = null;

    camera = null;

    scene = null;

    light = null;

    width = window.innerWidth;

    height = window.innerHeight;

    initThree = function () {
        renderer = new THREE.WebGLRenderer({
                                               antialias: true,
                                               precision: 'highp',
                                               alpha: true,
                                               preserveDrawingBuffer: true,
                                               maxLights: 5
                                           });
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 0.1); // 设置canvas背景色，透明度
        return document.body.appendChild(renderer.domElement);
    };

    initScene = function () {
        return scene = new THREE.Scene;
    };

    initCamera = function () {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
        camera.position.set(0, 50, 100);
        camera.up.x = 0;
        camera.up.y = 1; // 设置相机的上为「y」轴方向
        camera.up.z = 0;
        return camera.lookAt({
                                 x: 0,
                                 y: 0,
                                 z: 0
                             });
    };

    initLight = function () {
        light = new THREE.PointLight(0xff0000, 1.0, 0);
        light.position.set(50, 50, 50);
        scene.add(light);
        return scene.add(new THREE.AmbientLight(0xff0000));
    };

    jsonLoader = new THREE.JSONLoader;

    jsonLoader.load('/static/json/ta1.json', function (geo) {
        var mesh, proportion;
        mesh = new THREE.Mesh(geo); // , new THREE.MeshBasicMaterial {color: 'red'}
        proportion = 1.0; // 缩放程度
        mesh.receiveShadow = true;
        mesh.scale.x *= proportion;
        mesh.scale.y *= proportion;
        mesh.scale.z *= proportion;
        scene.add(mesh);
        return mesh.position.set(10, -40, -10);
    });

    draw = function () {
        // cube.rotation.x += 0.1
        // cube.rotation.y += 0.1
    };

    render = function () {
        requestAnimationFrame(render);
        draw();
        return renderer.render(scene, camera);
    };

    start = function () {
        initThree();
        initScene();
        initCamera();
        initLight();
        return render();
    };

    start();

});
