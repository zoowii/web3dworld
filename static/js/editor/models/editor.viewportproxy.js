define(function (require, exports, module) {
	var static_url = '/static/';
	var $ = require('jquery');
	var _ = require('underscore');
	var helper = require('editor.helper');
	var Backbone = require('backbone');
	$(function () {
		var EditorViewportProxy = Backbone.Model.extend({
															loadSceneFromJson: function (json) {
																return this.dispatchSceneJson(json);
															},
															loadScene: function (url) {
																return helper.loadSceneJson(url, _.bind(this.loadSceneFromJson, this));
															},
															dispatchSceneJson: function (json, from) {
																var floorJson, fogJson, lightsJson, skyboxJson, wallsJson;
																if (from == null) {
																	from = null;
																}
																floorJson = helper.preprocessJsonResource(json.floor, 'floor');
																wallsJson = json.walls;
																lightsJson = json.lights;
																fogJson = helper.preprocessJsonResource(json.fog, 'fog');
																skyboxJson = helper.preprocessJsonResource(json.skybox, 'skybox');
																this.dispatchMeshJson(floorJson, from);
																this.dispatchMeshJson(fogJson, from);
																this.dispatchMeshJson(skyboxJson, from);
																this.dispatchMeshArrayJson(wallsJson, 'wall', from);
																this.dispatchMeshArrayJson(lightsJson, 'light', from);
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
															dispatchGeometryOriginJson: function (json) {
																var viewports = this.get('viewports');
																json = helper.preprocessGeometryOriginJson(json);
																_.each(viewports, function (viewport) {
																	viewport.addOriginGeometryFromJson(json);
																});
															},
															dispatchMeshJson: function (json, from) {
																var viewport, _i, _len, _ref, _results;
																if (from == null) {
																	from = null;
																}
																_ref = this.get('viewports');
																_results = [];
																for (_i = 0, _len = _ref.length; _i < _len; _i++) {
																	viewport = _ref[_i];
																	if (viewport !== from) {
																		_results.push(viewport.trigger('addMeshByJson', json));
																	} else {
																		_results.push(void 0);
																	}
																}
																return this;
															},
															dispatchMeshPropertyChange: function (meshName, property, value) {
																_.each(this.get('viewports'), function (viewport) {
																	var mesh = viewport.getObject(meshName);
																	if (mesh) {
																		mesh[property] = value;
																	}
																});
															},
															dispatchMeshTextureChangeFunc: function (meshName, textureUrl) {
																_.each(this.get('viewports'), function (viewport) {
																	var mesh = viewport.getObject(meshName);
																	if (mesh && mesh.material) {
																		console.log(mesh, mesh.material);
																		var material = mesh.material;
																		var texture = THREE.ImageUtils.loadTexture(textureUrl);
																		material.map = texture;
																		material.needsUpdate = true;
																	}
																});
															},
															dispatchMeshPropertyChangeFunc: function (meshName, property, changeFunc) {
																_.each(this.get('viewports'), function (viewport) {
																	var mesh = viewport.getObject(meshName);
																	if (mesh && mesh[property]) {
																		changeFunc(mesh[property]);
																	}
																});
															},
															dispatchMeshChangeFunc: function (meshName, changeFunc) {
																_.each(this.get('viewports'), function (viewport) {
																	var mesh = viewport.getObject(meshName);
																	if (mesh) {
																		changeFunc(mesh);
																	}
																});
															},
															dispatchDeleteMesh: function (meshName) {
																_.each(this.get('viewports'), function (viewport) {
																	viewport.deleteMesh(meshName);
																})
															},
															dispatchMeshArrayJson: function (array, type, from) {
																var json, _i, _len, _results;
																if (type == null) {
																	type = 'mesh';
																}
																if (from == null) {
																	from = null;
																}
																_results = [];
																for (_i = 0, _len = array.length; _i < _len; _i++) {
																	json = array[_i];
																	json = helper.preprocessJsonResource(json, type);
																	_results.push(this.dispatchMeshJson(json, from));
																}
																return this;
															},
															dispathSimpleGeometry: function (type) {
																var viewports = this.get('viewports');
																var meshName = _.uniqueId(type);
																_.each(viewports, function (viewport) {
																	viewport.trigger('addSimpleGeometry', type, meshName);
																});
															},
															initialize: function () {
																this.set('viewports', []);
																this.on('all', function () {
																	var viewports, _arguments;
																	_arguments = _.toArray(arguments);
																	if (helper.endsWith(_arguments[0], 'ed')) {
																		return;
																	}
																	viewports = this.get('viewports');
																	return _.each(viewports, function (viewport) {
																		return viewport.trigger.apply(viewport, _arguments);
																	});
																});
															},
															startListen: function () {
																var viewport, viewports;
																viewports = this.get('viewports');
																if (viewports.length <= 0) {
																	return false;
																}
																viewport = viewports[0];
																this.listenTo(viewport, 'meshAdded', function () {
																	this.trigger('meshAdded');
																});
																this.listenTo(viewport, 'meshChanged', function () {
																	this.trigger('meshChanged');
																});
																this.listenTo(viewport, 'meshRemoved', function () {
																	this.trigger('meshRemoved');
																});
																this.listenTo(viewport, 'meshMoved', function (name, point) {
																	this.trigger('meshMoved', name, point);
																});
																_.each(viewports, function (m) {
																	this.listenTo(m, 'meshSelected', function () {
																		this.selected = m.getSelected();
																		this.trigger('meshSelected');
																	});
																}, this);
															},
															addViewport: function (viewport) {
																var viewports = this.get('viewports');
																return viewports.push(viewport);
															},
															getObjects: function () {
																var viewports = this.get('viewports');
																if (viewports) {
																	return viewports[0].get('objects');
																} else {
																	return [];
																}
															},
															exportObjectToJson: function (obj) {
																var viewport = this.get('viewports')[0];
																var object = viewport.getObject(obj.name);
																return helper.parseObject3DToJson(object);
															},
															exportObjectArrayToJson: function (objs) {
																return _.map(objs, function (obj) {
																	return this.exportObjectToJson(obj);
																}, this);
															}
														});
		exports.EditorViewportProxy = EditorViewportProxy;
	});
});