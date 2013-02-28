define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('three.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorViewport = Backbone.Model.extend({
            afterAddObject: function (obj, options) {
                var objects;
                if (options == null) {
                    options = {};
                }
                objects = this.get('objects');
                if (helper.inArray(obj, objects)) {
                    return false;
                }
                objects.push(obj);
                helper.extendFrom(obj, options);
                return this.trigger('meshAdded');
            },
            addToProxy: function (proxy) {
                this.proxy = proxy;
                proxy.addViewport(this);
                return this;
            },
// loadSceneFromJson: (json) ->
// this.loadFloorFromJson json.floor
// this.loadWallsFromJson json.walls
// this.loadSkyboxFromJson json.skybox
// this.loadFogFromJson json.fog
// this.loadLightsFromJson json.lights
// loadScene: (sceneUrl) ->
// if this.get('scene') == undefined
// this.initScene()
// helper.loadSceneJson(sceneUrl, _.bind(this.loadSceneFromJson, this))
            initialize: function () {
                this.set('objects', []);
                this.initUtils();
                this.initScene();
                // this.initLight()
                this.initDerectionHelp();
                this.initControls();
                this.initEvents();
                // this.loadWall(static_url + 'json/qiangbi2.json', static_url + 'img/sicai001.jpg', 3.0, {x: 1.57, y: 0, z: 0})
                // this.initSkybox()
                // this.initFog()
                this.initFloor();
                // this.loadFloor(static_url + 'img/diban1.jpg')
                // this.loadScene(static_url + 'resources/scenes/test.json')
            },
            initFloor: function () {
                var floor, floorGeometry, floorMaterial, floorTexture, jsonLoader, proportion, scene;
                scene = this.get('scene');
                jsonLoader = this.get('jsonLoader');
                floorTexture = THREE.ImageUtils.loadTexture(static_url + 'img/checkerboard.jpg');
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.repeat.set(10, 10);
                floorMaterial = new THREE.MeshBasicMaterial({
                    map: floorTexture
                });
                floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
                floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.position.set(0, 0, 0);
                proportion = 1.0;
                helper.scaleObject3D(floor, proportion);
                floor.doubleSided = true;
                scene.add(floor);
                this.set('floorboard', floor);
                return this.afterAddObject(floor, {
                    name: 'floorboard',
                    meshType: 'floor'
                });
            },
            loadFloorFromJson: function (json) {
                var floor, floorboard, geom, material, oldFloor, scene;
                json = helper.preprocessJsonResource(json, 'floor');
                if (this.get('floorboard') === void 0) {
                    this.initFloor();
                }
                scene = this.get('scene');
                floorboard = this.get('floorboard');
                floorboard.visible = false;
                oldFloor = this.get('floor');
                if (oldFloor !== void 0) {
                    scene.remove(oldFloor);
                    this.set('floor', void 0);
                }
                geom = new THREE.PlaneGeometry(json.width, json.height, json.widthSegments, json.heightSegments);
                material = helper.loadMaterialFromJson(json.material);
                floor = new THREE.Mesh(geom, material);
                scene.add(floor);
                helper.updateMeshFromJson(floor, json);
                this.set('floor', floor);
                return this.afterAddObject(floor, {
                    name: 'floor',
                    meshType: 'floor'
                });
            },
            loadFloor: function (textureUrl, width, height) {
                var floor, floorboard, geom, material, oldFloor, scene, texture;
                if (width == null) {
                    width = 2000;
                }
                if (height == null) {
                    height = 2000;
                }
                scene = this.get('scene');
                floorboard = this.get('floorboard');
                floorboard.visible = false;
                oldFloor = this.get('floor');
                if (oldFloor !== void 0) {
                    scene.remove(oldFloor);
                    this.set('floor', void 0);
                }
                geom = new THREE.PlaneGeometry(width, height, 10, 10);
                texture = THREE.ImageUtils.loadTexture(textureUrl);
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width / 50, height / 50);
                material = new THREE.MeshBasicMaterial({
                    map: texture
                });
                floor = new THREE.Mesh(geom, material);
                floor.doubleSided = true;
                scene.add(floor);
                this.set('floor', floor);
                return this.afterAddObject(floor, {
                    name: 'floor',
                    meshType: 'floor'
                });
            },
            loadWallFromjson: function (json) {
                var scene, wall;
                scene = this.get('scene');
                wall = helper.loadWallFromJson(json);
                scene.add(wall);
                return this.afterAddObject(wall);
            },
            loadWallsFromJson: function (json) {
                var jsonLoader, scene, wallJson, _i, _len, _results;
                jsonLoader = this.get('jsonLoader');
                scene = this.get('scene');
                _results = [];
                for (_i = 0, _len = json.length; _i < _len; _i++) {
                    wallJson = json[_i];
                    _results.push(this.loadWallFromjson(wallJson));
                }
                return _results;
            },
            loadWall: function (geomUrl, textureUrl, proportion, rotation) {
                var jsonLoader, scene;
                if (proportion == null) {
                    proportion = 1.0;
                }
                if (rotation == null) {
                    rotation = {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                }
                jsonLoader = this.get('jsonLoader');
                scene = this.get('scene');
                return jsonLoader.load(geomUrl, function (geom) {
                    var material, mesh, texture;
                    texture = THREE.ImageUtils.loadTexture(textureUrl);
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(10, 10);
                    material = new THREE.MeshBasicMaterial({
                        // map: texture
                        color: 0xff0000,
                        transparent: true,
                        opacity: 0.5
                    });
                    mesh = new THREE.Mesh(geom, material);
                    mesh.receiveShadow = true;
                    mesh.doubleSided = true;
                    mesh.rotation.x = rotation.x;
                    mesh.rotation.y = rotation.y;
                    mesh.rotation.z = rotation.z;
                    mesh.scale.x *= proportion;
                    mesh.scale.y *= proportion;
                    mesh.scale.z /= proportion;
                    mesh.castShadow = true;
                    return scene.add(mesh);
                });
            },
            loadSkyboxFromJson: function (json) {
                var geom, material, scene, skybox;
                json = helper.preprocessJsonResource(json, 'skybox');
                scene = this.get('scene');
                geom = new THREE.CubeGeometry(json.width, json.height, json.depth);
                material = helper.loadMaterialFromJson(json.material);
                skybox = new THREE.Mesh(geom, material);
                helper.updateMeshFromJson(skybox, json);
                scene.add(skybox);
                this.set('skybox', skybox);
                return this.afterAddObject(skybox, {
                    name: 'skybox',
                    meshType: 'skybox'
                });
            },
            initSkybox: function () {
                var geom, material, scene, skybox;
                scene = this.get('scene');
                geom = new THREE.CubeGeometry(10000, 10000, 10000);
                material = new THREE.MeshBasicMaterial({
                    color: "#9999ff"
                });
                skybox = new THREE.Mesh(geom, material);
                skybox.flipSided = true;
                scene.add(skybox);
                return this.set('skybox', skybox);
            },
            loadFogFromJson: function (json) {
                var fog, scene;
                json = helper.preprocessJsonResource(json, 'fog');
                scene = this.get('scene');
                scene.fog = fog = new THREE.FogExp2(json.color, json.density);
                return this.afterAddObject(fog);
            },
            initFog: function () {
                var scene;
                scene = this.get('scene');
                return scene.fog = new THREE.FogExp2("#9999ff", 0.00025);
            },
            initDerectionHelp: function () {
                // 绿色为 y 轴正方向
                // 红色为 x 轴正方向
                // 蓝色为 z 轴正方向
                var scene, selectionAxis;
                scene = this.get('scene');
                helper.addAxis(scene, 2.0);
                selectionAxis = new THREE.AxisHelper(100);
                selectionAxis.material.depthTest = false;
                selectionAxis.material.transparent = true;
                selectionAxis.matrixAutoUpdate = false;
                selectionAxis.visible = false;
                return scene.add(selectionAxis);
            },
            initUtils: function () {
                return this.set('jsonLoader', new THREE.JSONLoader);
            },
            initScene: function () {
                var scene;
                scene = new THREE.Scene;
                return this.set('scene', scene);
            },
            initControls: function () {
                var intersectionPlane, scene;
                scene = this.get('scene');
                // 用来选择Mesh的辅助平面
                intersectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 8, 8));
                intersectionPlane.visible = false;
                scene.add(intersectionPlane);
                return this.set('intersectionPlane', intersectionPlane);
            },
            loadLightsFromJson: function (json) {
                var light, lightJson, lights, scene, _i, _len, _results;
                scene = this.get('scene');
                if (this.get('lights') === void 0) {
                    this.set('lights', []);
                }
                lights = this.get('lights');
                _results = [];
                for (_i = 0, _len = json.length; _i < _len; _i++) {
                    lightJson = json[_i];
                    light = helper.loadLightFromJson(lightJson);
                    lights.push(light);
                    scene.add(light);
                    helper.updateMeshFromJson(light, lightJson);
                    _results.push(this.afterAddObject(light));
                }
                return _results;
            },
            initLight: function () {
                var light, scene;
                scene = this.get('scene');
                light = new THREE.DirectionalLight("#ff0000", 1.0, 0);
                this.set('light', light);
                light.position.set(500, 250, 500);
                scene.add(light);
                return scene.add(new THREE.AmbientLight("#ff0000"));
            },
            onAddMeshByJson: function (meshJson) {
                var scene;
                scene = this.get('scene');
                switch (meshJson.meshType) {
                    case 'wall':
                        return this.loadWallFromjson(meshJson);
                    case 'walls':
                        return this.loadWallsFromJson(meshJson);
                    case 'floor':
                        return this.loadFloorFromJson(meshJson);
                    case 'fog':
                        return this.loadFogFromJson(meshJson);
                    case 'skybox':
                        return this.loadSkyboxFromJson(meshJson);
                    // else TODO
                }
            },
            onMeshSelect: function (selected) {
                this.selected = selected;
                return this.trigger('meshSelected');
            },
            initEvents: function () {
                this.on('addMeshByJson', this.onAddMeshByJson, this);
                return this.on('meshSelect', this.onMeshSelect, this);
            },
            getSelected: function () {
                return this.selected;
            }
        });
        exports.EditorViewport = EditorViewport;
    });
});