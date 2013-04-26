define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorViewport = Backbone.Model.extend({
            afterDeleteObject: function (obj) {
                var objects = this.get('objects');
                objects = _.without(objects, obj);
                this.set('objects', objects);
            },
            afterAddObject: function (obj, options) {
                if (obj['__options__']) {
                    helper.updateMeshFromJson(obj, obj['__options__']);
                }
                if (options == null) {
                    options = {};
                }
                var objects = this.get('objects');
                if (helper.inArray(obj, objects)) {
                    return false;
                }
                if (obj.up) {
                    obj.up.set(0, 0, 1);
                }
                objects.push(obj);
                helper.extendFrom(obj, options);
                if (options['__group__']) {
                    options['__group__'].add(obj);
                }
                this.trigger('meshAdded');
                return this;
            },
            addMesh: function (mesh) {
                var scene = this.get('scene');
                scene.add(mesh);
                return this.afterAddObject(mesh);
            },
            addOriginGeometryFromJson: function (json) {
                var _this = this;
                helper.createObject3DFromJson(json, function (geom) {
                    if (json['__options__'] && json['__options__']['material']) {
                        var material = helper.loadMaterialFromJson(json['__options__']['material']);
                    } else {
                        var material = new THREE.MeshBasicMaterial;
                    }
                    var mesh = new THREE.Mesh(geom, material);
                    mesh = helper.updateOriginMeshFromJson(mesh, json);
                    if (json['__options__'] && json['__options__']['groupName']) {
                        var Object3DGroup = require('editor.extra').Object3DGroup;
                        var group = Object3DGroup.getOrCreate(json['__options__']['groupName']);
                        group.add(mesh);
                    }
                    _this.addMesh(mesh);
                });
            },

            getObject: function (name) {
                var objects = this.get('objects');
                for (var i = 0; i < objects.length; ++i) {
                    var obj = objects[i];
                    if (obj.name == name) {
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
                skybox.name = 'skybox';
                this.set('skybox', skybox);
                scene.skybox = skybox;
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
                fog.name = 'fog';
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
                // moving cube or moving person
                var cube = new THREE.CubeGeometry(100, 100, 100);
                var mesh = new THREE.Mesh(cube, new THREE.MeshBasicMaterial);
                mesh.position.set(0, 0, 100.1);
                mesh.visible = false;
                scene.add(mesh);
                this.movingCube = mesh;
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
                var scene = this.get('scene');
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
                    default:
                    {
                        if (meshJson.xtype === 'base') {
                            return this.onAddSimpleGeometry(meshJson.meshType, meshJson.meshName);
                        } else {
                            console.log("unknown meshType: ", meshJson);
                        }
                    }
                }
                return this;
            },
            onMeshSelect: function (selected) {
                this.selected = selected;
                this.trigger('meshSelected');
            },
            onPassMeshMove: function (mesh, point) {
                this.proxy.trigger('meshMove', mesh, point);
            },
            onMeshMove: function (name, point) {
                var mesh = this.getObject(name);
                if (mesh == undefined || mesh.position == undefined) {
                    return;
                }
                if (mesh['__group__']) {
                    var group = mesh['__group__'];
                    var offset = point.clone();
                    offset.sub(mesh.position);
                    _.each(group.getItems(), function (item) {
                        var t1 = offset.clone();
                        t1.add(item.position);
                        item.position.copy(t1);
                    });
                } else {
                    mesh.position.copy(point);
                }
                this.trigger('meshMoved', name, point);
            },
            onAddLight: function (type, meshName) {
                type = type.toLowerCase();
                switch (type) {
                    case 'point':
                    {
                        var scene = this.get('scene');
                        var light = null;
                        var color = 0xffffff;
                        var intensity = 2;
                        var distance = 0;

                        light = new THREE.PointLight(color, intensity, distance);
                        //light.position.set(100,100,100);
                        light.position.z += 600;
                        light.position.y -= 200;
                        light.position.x -= 200;
                        helper.updateMeshFromJson(light, {
                            name: meshName,
                            meshType: type,
                            typeName: type,
                            meshName: meshName
                        });
                        light.shadowCameraVisible = true;
                        light.castShadow = true;
                        light.shadowDarkness = 0.95;
                        light.position.z += 600;
                        light.position.y -= 200;
                        light.position.x -= 200;
                        this.afterAddObject(light);
                        var sphereSize = 100;

                        var lightGizmo = new THREE.PointLightHelper(light, sphereSize);
                        scene.add(lightGizmo);

                        light.properties.helper = lightGizmo;
                        light.properties.pickingProxy = lightGizmo.lightSphere;

                        this.afterAddObject(lightGizmo.lightSphere);
                        scene.add(light);

                        this.updateMaterials(scene);
                    }
                        break;
                    case'spot':
                    {
                        var scene = this.get('scene');
                        var light = null;
                        var color = 0xffffff;
                        var intensity = 1;
                        var distance = 0;
                        var angle = Math.PI * 0.1;
                        var exponent = 10;

                        var light = new THREE.SpotLight(color, intensity, distance, angle, exponent);
                        light.position.z += 600;
                        light.position.y -= 200;
                        light.position.x -= 200;
                        this.afterAddObject(light);
                        scene.add(light);
                        var sphereSize = 5;

                        var lightGizmo = new THREE.SpotLightHelper(light, sphereSize);
                        scene.add(lightGizmo);
                        scene.add(lightGizmo.targetSphere);
                        scene.add(lightGizmo.targetLine);

                        light.properties.helper = lightGizmo;
                        light.properties.pickingProxy = lightGizmo.lightSphere;
                        light.target.properties.pickingProxy = lightGizmo.targetSphere;
                        this.updateMaterials(scene);
                        //    this.afterAddObject( lightGizmo.lightSphere );
                        //        this.afterAddObject( lightGizmo.targetSphere );
                        //  this.afterAddObject( lightGizmo.targetLine );

                    }
                        break;
                    case'directional':
                    {

                    }
                        break;
                    case'hemisphere':
                    {

                    }
                        break;
                    case'ambient':
                    {

                    }
                        break;

                }

            },
            createSimpleMesh: function (type, meshName) {
                var geom = null;
                switch (type) {
                    case 'plane':
                        geom = new THREE.PlaneGeometry(200, 200);
                        break;
                    case 'cube':
                        geom = new THREE.CubeGeometry(200, 200, 200);
                        break;
                    case 'sphere':
                        geom = new THREE.SphereGeometry();
                        break;
                    case 'cylinder':
                        geom = new THREE.CylinderGeometry(50, 50, 200);
                        break;
                    default:
                        throw new Error('Unknown simple geometry type: ' + type);
                }
                var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(static_url + 'img/checkerboard.jpg')
                });
                var mesh = new THREE.Mesh(geom, material);
                helper.updateMeshFromJson(mesh, {
                    name: meshName,
                    meshType: type,
                    typeName: type,
                    meshName: meshName
                });
                mesh.xtype = 'base';
                mesh.position.z += 100;
                return mesh;
            },
            updateMaterials: function (root) {
                root.traverse(function (node) {

                    if (node.material) {

                        node.material.needsUpdate = true;

                    }

                    if (node.geometry && node.geometry.materials) {

                        for (var i = 0; i < node.geometry.materials.length; i++) {

                            node.geometry.materials[ i ].needsUpdate = true;

                        }

                    }

                });

            },
            onAddSimpleGeometry: function (type, meshName) {
                var scene = this.get('scene');
                var mesh = this.createSimpleMesh(type, meshName);
                scene.add(mesh);
                this.afterAddObject(mesh);
            },
            initEvents: function () {
                this.on('addMeshByJson', this.onAddMeshByJson, this);
                this.on('meshSelect', this.onMeshSelect, this);
                this.on('passMeshMove', this.onPassMeshMove, this); // mesh movement event passed from View
                this.on('meshMove', this.onMeshMove, this); // real mesh movement do here
                this.on('addSimpleGeometry', this.onAddSimpleGeometry, this);
                this.on('addLight', this.onAddLight, this);
            },
            getSelected: function () {
                return this.selected;
            },
            deleteMesh: function (name) {
                var scene = this.get('scene');
                var mesh = this.getObject(name);
                if (mesh) {
                    scene.remove(mesh);
                    this.afterDeleteObject(mesh);
                }
            }
        });
        exports.EditorViewport = EditorViewport;
    });

});