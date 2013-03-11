define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorViewport = Backbone.Model.extend({
            afterAddObject: function (obj, options) {
                if (options == null) {
                    options = {};
                }
                var objects = this.get('objects');
                if (helper.inArray(obj, objects)) {
                    return false;
                }
                if(obj.up) {
                    obj.up.set(0, 0, 1);
                }
                objects.push(obj);
                helper.extendFrom(obj, options);
                this.trigger('meshAdded');
                return this;
            },
            addMesh: function(mesh) {
                var scene = this.get('scene');
                scene.add(mesh);
                return this.afterAddObject(mesh);
            },
            addOriginGeometryFromJson: function(json) {
                var _this = this;
                helper.createObject3DFromJson(json, function(geom) {
                    var mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial);
                    mesh = helper.updateOriginMeshFromJson(mesh, json);
                    _this.addMesh(mesh);
                });
            },
            getObject: function(name) {
                var objects = this.get('objects');
                for(var i=0;i<objects.length;++i) {
                    var obj = objects[i];
                    if(obj.name == name) {
                        return obj;
                    }
                }
                return null;
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
                this.afterAddObject(floor, {
                    name: 'floorboard',
                    meshType: 'floor'
                });
                return this;
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
                geom = new THREE.CubeGeometry(json.width, json.height, json.depth, json.widthSegments, json.heightSegments, json.depthSegments);
                material = helper.loadMaterialFromJson(json.material);
                floor = new THREE.Mesh(geom, material);
                scene.add(floor);
                helper.updateMeshFromJson(floor, json);
                this.set('floor', floor);
                this.afterAddObject(floor, {
                    name: 'floor',
                    meshType: 'floor'
                });
                return this;
            },
            loadWallFromjson: function (json) {
                var scene = this.get('scene');
                var wall = helper.loadWallFromJson(json);
                scene.add(wall);
                this.afterAddObject(wall);
                return this;
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
                return this;
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
                this.afterAddObject(skybox, {
                    name: 'skybox',
                    meshType: 'skybox'
                });
                return this;
            },
            loadFogFromJson: function (json) {
                var fog, scene;
                json = helper.preprocessJsonResource(json, 'fog');
                scene = this.get('scene');
                scene.fog = fog = new THREE.FogExp2(json.color, json.density);
                this.afterAddObject(fog);
                return this;
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
                scene.add(selectionAxis);
            },
            initUtils: function () {
                this.set('jsonLoader', new THREE.JSONLoader);
            },
            initScene: function () {
                var scene;
                scene = new THREE.Scene;
                this.set('scene', scene);
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
                    case 'light':
                        return this.loadLightsFromJson(meshJson);
                    // else TODO
                }
                return this;
            },
            onMeshSelect: function (selected) {
                this.selected = selected;
                this.trigger('meshSelected');
            },
            onPassMeshMove: function(mesh, point) {
                this.proxy.trigger('meshMove', mesh, point);
            },
            onMeshMove: function(name, point) {
                var mesh = this.getObject(name);
                if(mesh == undefined || mesh.position == undefined) {
                    return;
                }
                mesh.position.copy(point);
                this.trigger('meshMoved', name, point);
            },
            onAddSimpleGeometry: function(type, meshName) {
                var scene = this.get('scene');
                var geom = null;
                switch(type) {
                    case 'plane': geom = new THREE.PlaneGeometry(200, 200); break;
                    case 'cube': geom = new THREE.CubeGeometry(200, 200, 200); break
                    case 'sphere': geom = new THREE.SphereGeometry(); break;
                    case 'cylinder': geom = new THREE.CylinderGeometry(50, 50, 200); break;
                    default: throw new Error('Unknown simple geometry type: ' + type);
                }
                var material = new THREE.MeshBasicMaterial();
                var mesh = new THREE.Mesh(geom, material);
                helper.updateMeshFromJson(mesh, {
                    name: meshName,
                    meshType: type,
                    typeName: type,
                    meshName: meshName
                });
                mesh.position.z += 100;
                scene.add(mesh);
                this.afterAddObject(mesh);
            },
           initEvents: function () {
                this.on('addMeshByJson', this.onAddMeshByJson, this);
                this.on('meshSelect', this.onMeshSelect, this);
                this.on('passMeshMove', this.onPassMeshMove, this); // mesh movement event passed from View
                this.on('meshMove', this.onMeshMove, this); // real mesh movement do here
               this.on('addSimpleGeometry', this.onAddSimpleGeometry, this);
            },
            getSelected: function () {
                return this.selected;
            }
        });
        exports.EditorViewport = EditorViewport;
    });
});