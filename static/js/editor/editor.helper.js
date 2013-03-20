define(function (require, exports, module) {
	var _ = require('underscore');

	var Set, defaultSceneJson, defaultSceneJsonUrl, directExtendObjProperties, helper, jsonStore, processLoadedSceneJson, static_url, store;

	if (window.helper === void 0) {
		window.helper = {};
	}

	helper = window.helper;

	// store cache here. TODO: now needn't here
	store = {};

	jsonStore = {};

	// store ajax got json object here. TODO: delete some too old cache when memory limit, and retrive and store them when needed again
	helper.getJSON = function (url, handler) {
		if (jsonStore[url] !== void 0) {
			return handler(jsonStore[url]);
		} else {
			return $.getJSON(url, function (json) {
				jsonStore[url] = json;
				return handler(json);
			});
		}
	};

	// get json with no cache
	helper.uncacheGetJSON = function (url, handler) {
		return $.getJSON(url, function (json) {
			jsonStore[url] = json;
			return handler(json);
		});
	};

	helper.storeSet = function (name, obj) {
		return store[name] = obj;
	};

	helper.storeGet = function (name) {
		return store[name];
	};

	helper.endsWith = function (str, end) {
		return _.isString(str) && str.length === str.indexOf(end) + end.length;
	};

	helper.scaleObject3D = function (mesh, proportion) {
		if (proportion == null) {
			proportion = 1.0;
		}
		mesh.scale.x *= proportion;
		mesh.scale.y *= proportion;
		mesh.scale.z *= proportion;
	};

	helper.scaleObject3DWithPosition = function (mesh, proportion) {
		if (proportion == null) {
			proportion = 1.0;
		}
		mesh.scale.x *= proportion;
		mesh.scale.y *= proportion;
		mesh.scale.z *= proportion;
		mesh.position.x *= proportion;
		mesh.position.y *= proportion;
		mesh.position.z *= proportion;
	};

	helper.addAxis = function (scene, proportion) {
		var axisLenght, axisWidth, xUpD, yUpD, zUpD;
		if (proportion == null) {
			proportion = 1.0;
		}
		axisWidth = 5;
		axisLenght = 5000;
		xUpD = new THREE.Mesh(new THREE.CubeGeometry(axisLenght, axisWidth, axisWidth), new THREE.MeshBasicMaterial({
																														color: '#ff0000'
																													}));
		yUpD = new THREE.Mesh(new THREE.CubeGeometry(axisWidth, axisLenght, axisWidth), new THREE.MeshBasicMaterial({
																														color: '#00ff00'
																													}));
		zUpD = new THREE.Mesh(new THREE.CubeGeometry(axisWidth, axisWidth, axisLenght), new THREE.MeshBasicMaterial({
																														color: '#0000ff'
																													}));
		scene.add(xUpD);
		scene.add(yUpD);
		scene.add(zUpD);
		xUpD.position.set(axisLenght / 2, 0, 0);
		yUpD.position.set(0, axisLenght / 2, 0);
		zUpD.position.set(0, 0, axisLenght / 2 + 0);
		helper.scaleObject3DWithPosition(xUpD, proportion);
		helper.scaleObject3DWithPosition(yUpD, proportion);
		helper.scaleObject3DWithPosition(zUpD, proportion);
		return {
			x: xUpD,
			y: yUpD,
			z: zUpD
		};
	};

	// task: 要执行的函数, times: 要执行的次数, interval: 间隔的时间
	helper.runTimes = function (task, times, interval) {
		var newTask;
		if (times == null) {
			times = 1;
		}
		if (interval == null) {
			interval = 0;
		}
		if (times <= 0) {
			return;
		}
		task();
		interval = interval < 0 ? 0 : interval;
		newTask = function () {
			return helper.runTimes(task, times - 1, interval);
		};
		return setTimeout(newTask, interval);
	};

	helper.Set = Set = (function () {

		function Set() {
			this.data = [];
		}

		Set.prototype.add = function (ele) {
			if (!(_.contains(this.data, ele))) {
				return this.data.push(ele);
			}
		};

		Set.prototype.remove = function (ele) {
			if (_.contains(this.data, ele)) {
				return this.data = this.data.filter(function (e) {
					return e !== ele;
				});
			}
		};

		return Set;

	})();

	helper.bindMouseDrag = function (el, handler) {
		var $el, delta, isMouseDown, lastPosition, nowPosition;
		isMouseDown = false;
		lastPosition = {
			x: 0,
			y: 0
		};
		nowPosition = {
			x: 0,
			y: 0
		};
		delta = {
			x: 0,
			y: 0
		};
		$el = $(el);
		return $el.mousedown(function (e) {
			lastPosition.x = e.offsetX;
			lastPosition.y = e.offsetY;
			return isMouseDown = true;
		}).mousemove(function (e) {
						 var oldLastPosition;
						 if (isMouseDown) {
							 nowPosition.x = e.offsetX;
							 nowPosition.y = e.offsetY;
							 delta = {
								 x: nowPosition.x - lastPosition.x,
								 y: nowPosition.y - lastPosition.y
							 };
							 oldLastPosition = _.clone(lastPosition);
							 lastPosition = _.clone(nowPosition);
							 return handler(oldLastPosition, nowPosition, delta);
						 }
					 }).mouseup(function () {
									return isMouseDown = false;
								}).mouseleave(function () {
												  return isMouseDown = false;
											  });
	};

	defaultSceneJson = null;

	static_url = '/static/';

	defaultSceneJsonUrl = static_url + 'resources/scenes/default.json';

	processLoadedSceneJson = function (json, handler) {
		json = _.extend({}, defaultSceneJson, json);
		return handler(json);
	};

	helper.loadSceneJson = function (url, handler) {
		return helper.getJSON(url, function (json) {
			if (defaultSceneJson === null) {
				return helper.getJSON(defaultSceneJsonUrl, function (_json) {
					defaultSceneJson = _json;
					return processLoadedSceneJson(json, handler);
				});
			} else {
				return processLoadedSceneJson(json, handler);
			}
		});
	};

	helper.loadTextureFromJson = function (json) {
		var texture;
		if (json.from_type === 'url') {
			texture = THREE.ImageUtils.loadTexture(json.url);
			if (json.repeat) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(json.repeat.width, json.repeat.height);
			}
			return texture;
		}
	};

	directExtendObjProperties = function (desObj, srcObj, properties) {
		var property, _i, _len, _results;
		_results = [];
		for (_i = 0, _len = properties.length; _i < _len; _i++) {
			property = properties[_i];
			if (srcObj[property] !== void 0) {
				_results.push(desObj[property] = srcObj[property]);
			} else {
				_results.push(void 0);
			}
		}
		return _results;
	};

	// 可以使用extend: <name> 等方式减少资源重复量，
	// 但使用加载的json数据前先要调用此方法预处理一下还原成完整的对象
	helper.preprocessJsonResource = function (json, options) {
		if (_.isString(options)) {
			options = {
				meshType: options
			};
		}
		if (!options.meshType) {
			options.meshType = 'mesh';
		}
		if (!options.name) {
			options.name = _.uniqueId(options.meshType);
		}
		return _.extend({}, options, json);
	};

	var jsonLoader = new THREE.JSONLoader;
	helper.jsonLoad3D = function (url, callback) {
		jsonLoader.load(url, callback);
	};

	helper.createObject3DFromJson = function (json, callback) {
		jsonLoader.createModel(json, function (geom) {
			geom = helper.updateOriginGeometryFromJson(geom, json);
			callback(geom);
		});
	};

	helper.updateOriginGeometryFromJson = function (geom, json) {
		geom['__type__'] = 'origin';
		geom['__from__'] = json;
		return geom;
	};

	helper.updateOriginMeshFromJson = function (mesh, json) {
		mesh['__type__'] = 'origin';
		mesh['__from__'] = json;
		if (mesh.name === undefined || mesh.name == '') {
			if (json.originJson['__name__'] === undefined) {
				json.originJson['__name__'] = _.uniqueId('mesh');
			}
			mesh.name = json.originJson['__name__'];
		}
		if(json['__options__']) {
			mesh['__options__'] = json['__options__'];
		}
		return mesh;
	};

	helper.preprocessGeometryOriginJson = function (json) {
		if (json.originJson == undefined) {
			json.originJson = {
				__type__: '__origin__',
				__meshType__: '__geometry__',
				__name__: _.uniqueId('mesh')
			};
		}
		return json;
	};

	helper.loadMaterialFromJson = function (json) {
		var material, materialClass, params, texture;
		if (json.type === 'basic') {
			materialClass = THREE.MeshBasicMaterial;
		} else {
			materialClass = THREE.MeshNormalMaterial;
		}
		params = {};
		if (json.map) {
			texture = helper.loadTextureFromJson(json.map);
			params.map = texture;
		}
		directExtendObjProperties(params, json, ['version', 'color', 'transparent', 'opacity']);
		material = new materialClass(params);
		material.originJson = json;
		return material;
	};

	helper.extendFrom = function (des, src) {
		_.extend(des, src, des);
		return des;
	};

	helper.loadWallFromJson = function (_json) {
		var geom, json, material, mesh;
		json = helper.preprocessJsonResource(_json, 'wall');
		if (json.type === 'basic') {
			geom = new THREE.CubeGeometry(json.width, json.height, json.depth);
			material = helper.loadMaterialFromJson(json.material);
			mesh = new THREE.Mesh(geom, material);
			helper.updateMeshFromJson(mesh, json);
			mesh.position.z += 200;
			return mesh;
		} else {
			return console.log('unsupported yet');
		}
	};

	helper.loadLightFromJson = function (_json) {
		var json, light;
		json = helper.preprocessJsonResource(_json, 'light');
		if (json.type === 'directional') {
			light = new THREE.DirectionalLight(json.color, json.intensity, json.distance);
		} else if (json.type === 'point') {
			light = new THREE.SpotLight(json.color, json.intensity, json.distance);
		} else if (json.type === 'ambient') {
			light = new THREE.AmbientLight(json.color);
		} else {
			false;
		}
		helper.updateMeshFromJson(light, json);
		helper.extendFrom(light, {
			meshType: 'light',
			name: _.uniqueId('light')
		});
		return light;
	};

	helper.updateMeshFromJson = function (mesh, json) {
		mesh.originJson = json;
		if (json.position) {
			mesh.position.set(json.position.x, json.position.y, json.position.z);
		}
		if (json.rotation) {
			mesh.rotation.set(json.rotation.x, json.rotation.y, json.rotation.z);
		}
		if (json.scale) {
			mesh.scale.set(json.scale.x, json.scale.y, json.scale.z);
		}
		directExtendObjProperties(mesh, json, ['version', 'doubleSided', 'flipSided', 'castShadow', 'name', 'typeName', 'meshType', 'meshName', 'typeName']);
		if (mesh.name === void 0) {
			if (json.name) {
				mesh.name = json.name;
			} else {
				mesh.name = _.uniqueId('Mesh');
			}
		}
	};

	helper.inArray = function (item, array) {
		if (_.indexOf(array, item) >= 0) {
			return true;
		} else {
			return false;
		}
	};

	helper.parseRGBToNumber = function (rgb) {
		var r = rgb.r,
			g = rgb.g,
			b = rgb.b;
		var color = r * 255 * 256 * 256 + g * 255 * 256 + b * 255;
		var color16 = color.toString(16);
		return '#' + color16;
	};

	helper.parseMaterialToJson = function (material) {
		var json = {};
		json.type = material.originJson.type;
		json.color = helper.parseRGBToNumber(material.color);
		directExtendObjProperties(json, material, ['transparent', 'opacity']);
		return json;
	};

	helper.parseVector3ToObj = function (vector) {
		var json = {};
		json.x = vector.x;
		json.y = vector.y;
		json.z = vector.z;
		return json;
	}

	helper.parseObject3DToJson = function (obj) {
		var json = {};
		json.meshType = obj.meshType;
		switch (obj.meshType) {
			case 'wall':
			{
				directExtendObjProperties(json, obj.originJson, ['typeName', 'type', 'thumbnailUrl']);
				directExtendObjProperties(json, obj, ['receiveShadow', 'doubleSided', 'castShadow', 'meshName']);
				directExtendObjProperties(json, obj.geometry, ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments']);
				json.material = helper.parseMaterialToJson(obj.material);
				json.position = helper.parseVector3ToObj(obj.position);
				json.rotation = helper.parseVector3ToObj(obj.rotation);
				json.scale = helper.parseVector3ToObj(obj.scale);
				console.log(obj);
				return json;
			}
		}
	};

	helper.getUrlForResource = function (name) {
		return '/admin/resource/get_by_name/' + name;
	};

	helper.getObjectClassName = function (obj) {
		if (obj && obj.constructor && obj.constructor.toString) {
			var arr = obj.constructor.toString().match(/function\s*(\w+)/);
			if (arr && arr.length == 2) {
				return arr[1];
			}
		}
		return undefined;
	};

	helper.parseValueToType = function (val, type) {
		switch (type) {
			case 'number':
				return parseFloat(val);
			case 'string':
				return val + '';
			case 'boolean':
				return val == 'true';
			default:
				return val;
		}
	};

	// 给属性面板增加的控件，根据传入的属性名、属性值和类型返回不同类型的控件
	helper.genControlForProperty = function (mesh, propertyName, propertyValue) {
		var editableProperties = require('editor.propertyview').editableProperties;
		if (!helper.inArray(propertyName, editableProperties)) {
			return;
		}
		var editControls = require('editor.edit_controls'),
			SimpleEditControl = editControls.SimpleEditControl,
			BooleanEditControl = editControls.BooleanEditControl,
			Vector3EditControl = editControls.Vector3EditControl,
			MaterialEditControl = editControls.MaterialEditControl,
			EditControlModel = editControls.EditControlModel;
		var model = new EditControlModel({
											 mesh: mesh,
											 name: propertyName,
											 value: propertyValue
										 });
		if (_.isString(propertyValue) || _.isNumber(propertyValue)) {
			var view = new SimpleEditControl({
												 model: model
											 });
			return view.render();
		} else if (_.isBoolean(propertyValue)) {
			var view = new BooleanEditControl({
												  model: model
											  });

			return view.render();
		} else if (propertyValue instanceof THREE.Vector3) {
			model.set('type', 'vector3');
			var view = new Vector3EditControl({
												  model: model
											  });
			return view.render();
		} else if (propertyValue instanceof THREE.Material) {
			model.set('type', 'material');
			var view = new MaterialEditControl({
												   model: model
											   });
			return view.render();
		}
	};

	_.extend(exports, helper);

});
