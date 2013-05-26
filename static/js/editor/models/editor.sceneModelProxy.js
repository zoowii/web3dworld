define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
	var exporter = require('editor.exporter');
    var Backbone = require('backbone');
    var Object3DGroup = require('editor.extra').Object3DGroup;
    $(function () {
        var EditorSceneModelProxy = Backbone.Model.extend({
            loadSceneFromJson: function (json) {
                return this.dispatchSceneJson(json);
            },
            loadScene: function (url) {
                return helper.loadSceneJson(url, _.bind(this.loadSceneFromJson, this));
            },
            dispatchSceneJson: function (json, from) {
                if (from == null) {
                    from = null;
                }
                var floorJson = helper.preprocessJsonResource(json.floor, 'floor');
                var wallsJson = json.walls;
                var lightsJson = json.lights;
                var fogJson = helper.preprocessJsonResource(json.fog, 'fog');
                var skyboxJson = helper.preprocessJsonResource(json.skybox, 'skybox');
                var itemsJson = json.items;
                this.dispatchMeshJson(floorJson, from);
                this.dispatchMeshJson(fogJson, from);
                this.dispatchMeshJson(skyboxJson, from);
                this.dispatchMeshArrayJson(wallsJson, 'wall', from);
                this.dispatchMeshArrayJson(lightsJson, 'light', from);
                this.dispatchMeshArrayJson(itemsJson, 'mesh', from, false);
                return this;
            },
            dispatchGeometryOriginJsonFromUrl: function (url, options) {
                var _this = this;
                helper.getJSON(url, function (json) {
                    if (options) {
                        json['__options__'] = options;
                    }
                    _this.dispatchGeometryOriginJson(json);
                });
            },
            dispatchLayoutArrayJson: function (array) {
                var _i, _len, json;
                for (_i = 0, _len = array.length; _i < _len; _i++) {
                    json = array[_i];
                    if (json.type == 'import') {
                        this.dispatchGeometryOriginJsonFromUrl(json.geometry_url, json);
                    }
                    else {
                        this.dispatchMeshJson(helper.preprocessJsonResource(json, 'wall'));
                    }
                }
            },                               //TODO:  hd
            dispatchGeometryOriginJson: function (json) {
                var sceneModels = this.get('sceneModels');
                delete json.originJson;
                json = helper.preprocessGeometryOriginJson(json);
                _.each(sceneModels, function (sceneModel) {
                    sceneModel.addOriginGeometryFromJson(json);
                });
            },
            dispatchMeshJson: function (json, from) {
                var sceneModel, _i, _len, _ref, _results;
                if (from == null) {
                    from = null;
                }
                _ref = this.get('sceneModels');
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    sceneModel = _ref[_i];
                    if (sceneModel !== from) {
                        _results.push(sceneModel.trigger('addMeshByJson', json));
                    } else {
                        _results.push(void 0);
                    }
                }
                return this;
            },
            dispatchMeshPropertyChange: function (meshName, property, value, subproperty) {
                _.each(this.get('sceneModels'), function (sceneModel) {
                    var mesh = sceneModel.getObject(meshName);
                    if (mesh) {
						console.log(mesh, property, value)
						window.mesh = mesh;
						if(subproperty) {
							if(mesh[subproperty]) {
								mesh[subproperty][property] = value;
							}
						} else {
                        	mesh[property] = value;
						}
                    }
                });
            },
            dispatchMeshTextureChangeFunc: function (meshName, textureUrl) {
                _.each(this.get('sceneModels'), function (sceneModel) {
                    var mesh = sceneModel.getObject(meshName);
                    if (mesh && mesh.material) {
                        var material = mesh.material;
                        var texture = THREE.ImageUtils.loadTexture(textureUrl);
                        material.map = texture;
                        material.needsUpdate = true;
                    }
                });
            },
            dispatchMeshPropertyChangeFunc: function (meshName, property, changeFunc, subproperty) {
				if(subproperty === undefined) {
					subproperty = false;
				}
                _.each(this.get('sceneModels'), function (sceneModel) {
                    var mesh = sceneModel.getObject(meshName);
                    if (mesh && mesh[property]) {
						if(subproperty && mesh[subproperty] && mesh[subproperty][property]) {
							changeFunc(mesh[subproperty][property]);
						} else if(!subproperty && mesh[property]) {
                        	changeFunc(mesh[property]);
						}
                    }
                });
            },
            dispatchMeshChangeFunc: function (meshName, changeFunc) {
                _.each(this.get('sceneModels'), function (sceneModel) {
                    var mesh = sceneModel.getObject(meshName);
                    if (mesh) {
                        changeFunc(mesh);
                    }
                });
            },
            dispatchDeleteMesh: function (meshName) {
                _.each(this.get('sceneModels'), function (sceneModel) {
                    sceneModel.deleteMesh(meshName);
                })
            },
            dispatchMeshArrayJson: function (array, type, from, new_group) {
                if (new_group === undefined) {
                    new_group = true;
                }
                var json, _i, _len, _results;
                if (type == null) {
                    type = 'mesh';
                }
                if (from == null) {
                    from = null;
                }
                _results = [];
                // create a group
                if (new_group) {
                    var group = new Object3DGroup();
                }
                for (_i = 0, _len = array.length; _i < _len; _i++) {
                    json = array[_i];
                    if (new_group) {
                        json['__group__'] = group;
                    }
                    json = helper.preprocessJsonResource(json, type);
                    var result = null;
                    if (json.geometry_url) {
                        result = this.dispatchGeometryOriginJsonFromUrl(json.geometry_url, json);
                    } else {
                        result = this.dispatchMeshJson(json, from);
                    }
                    _results.push(result);
                }
                return this;
            },
            dispatchLight:function(type){
                var sceneModels = this.get('sceneModels');
                var meshName = _.uniqueId(type);
                _.each(sceneModels,function(sceneModel){
                    sceneModel.trigger('addLight',type,meshName);
                })
            },
            dispathSimpleGeometry: function (type) {
                var sceneModels = this.get('sceneModels');
                var meshName = _.uniqueId(type);
                _.each(sceneModels, function (sceneModel) {
                    sceneModel.trigger('addSimpleGeometry', type, meshName);
                });
            },
            initialize: function () {
                this.set('sceneModels', []);
                this.on('all', function () {
                    var sceneModels, _arguments;
                    _arguments = _.toArray(arguments);
                    if (helper.endsWith(_arguments[0], 'ed')) {
                        return;
                    }
                    sceneModels = this.get('sceneModels');
                    return _.each(sceneModels, function (sceneModel) {
                        return sceneModel.trigger.apply(sceneModel, _arguments);
                    });
                });
            },
            startListen: function () {
                var sceneModel, sceneModels;
                sceneModels = this.get('sceneModels');
                if (sceneModels.length <= 0) {
                    return false;
                }
                sceneModel = sceneModels[0];
                this.listenTo(sceneModel, 'meshAdded', function () {
                    this.trigger('meshAdded');
                });
                this.listenTo(sceneModel, 'meshChanged', function () {
                    this.trigger('meshChanged');
                });
                this.listenTo(sceneModel, 'meshRemoved', function () {
                    this.trigger('meshRemoved');
                });
                this.listenTo(sceneModel, 'meshMoved', function (name, point) {
                    this.trigger('meshMoved', name, point);
                });
                _.each(sceneModels, function (m) {
                    this.listenTo(m, 'meshSelected', function () {
                        this.selected = m.getSelected();
                        this.trigger('meshSelected');
                    });
                }, this);
            },
            addSceneModel: function (sceneModel) {
                var sceneModels = this.get('sceneModels');
                return sceneModels.push(sceneModel);
            },
            getObjects: function () {
                var sceneModels = this.get('sceneModels');
                if (sceneModels) {
                    return sceneModels[0].get('objects');
                } else {
                    return [];
                }
            },
            exportObjectToJson: function (obj) {
                var sceneModel = this.get('sceneModels')[0];
                var object = sceneModel.getObject(obj.name);
                return helper.parseObject3DToJson(object);
            },
            exportObjectArrayToJson: function (objs) {
                return _.map(objs, function (obj) {
                    return this.exportObjectToJson(obj);
                }, this);
            },
            exportFloorToJson: function(obj) {
                var json = this.exportObjectToJson(obj);
                json.name = 'floor';
                helper.directExtendObjProperties(json, obj.geometry, ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments']);
                delete json.meshType;
                delete json.meshName;
                delete json.xtype;
                return json;
            },
			exportSceneToJson: function() {
				var sceneModel = this.get('sceneModels')[0];
				var sceneJson = {
					items: []
				};
				var scene = sceneModel.get('scene');
                var exported = [];
				window.scene = scene;
                window.sceneModel = sceneModel;
//				console.log(scene, sceneModel);
				if(scene.fog) {
					sceneJson.fog = exporter.parseFogToJson(scene.fog);
                    exported.push(scene.fog);
				}
				if(scene.skybox) {
					sceneJson.skybox = exporter.parseSkyboxToJson(scene.skybox);
                    exported.push(scene.skybox);
				}
                var walls = helper.filterMeshTypeFromSceneModel(sceneModel, 'wall');
                var _this = this;
                var wallJsons = _.map(walls, function(wall) {
                    return _this.exportObjectToJson(wall);
                });
                exported = _.union(exported, walls);
                sceneJson.walls = wallJsons;
                var lights = helper.filterMeshTypeFromSceneModel(sceneModel, 'light');
                // TODO: export lights
                exported = _.union(exported, lights);
                var floor = sceneModel.get('floor');
                if(floor) {
//                    var floorJson = this.exportObjectToJson(floor);
                    var floorJson = this.exportFloorToJson(floor);
                    console.log('floorJson:', floorJson);
                    sceneJson.floor = floorJson; // TODO: FIX: BUG, when export meshes with no meshType
                    exported = _.union(exported, floor);
                }
                // items exporter must be the last ones to be exported, because it exports anything not exported before
                var items = _.difference(helper.filterNotMeshTypeFromSceneModel(sceneModel, ['wall', 'light', 'floor', 'floorboard']), exported);
                var itemJsons = _.map(items, function(item) {
                    return _this.exportObjectToJson(item);
                });
                sceneJson.items = itemJsons;
                exported = _.union(exported, items);

				// TODO: export items, lights, walls, floor etc.
				// TODO: change the code of load fog and skybox to beauty.
				// Now the code is too old to load mesh(skybox is also a mesh)
				// And even the fog and skybox should have a name, so they should be dispatched by SceneModelProxy
				return sceneJson;
			}
        });
        exports.EditorSceneModelProxy = EditorSceneModelProxy;
    });
});