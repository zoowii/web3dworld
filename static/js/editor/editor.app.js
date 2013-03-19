define(function (require, exports, module) {
	require('editor.extapp');
	var $ = require('jquery');
	require('jquery.mousewheel');
	var _ = require('underscore');
	var helper = require('editor.helper');
	var Backbone = require('backbone');
	var EditorViewport = require('editor.viewport').EditorViewport;
	var EditorViewportProxy = require('editor.viewportproxy').EditorViewportProxy;
	var Editor2DView = require('editor.2dview').Editor2DView;
	var Editor3DView = require('editor.3dview').Editor3DView;
	var SceneMeshsView = require('editor.scenemeshsview').SceneMeshsView;
	var EditorPropertyView = require('editor.propertyview').EditorPropertyView;
	$(function () {
		var editor, editor2dview, editor3dview, height, viewport2d, viewport3d, viewportProxy, width;
		var static_url = '/static/';
		window.scenes = [];
		window.floors = [];

		if (window.editor === void 0) {
			window.editor = {};
		}
		editor = window.editor;
		window.viewport2d = viewport2d = new EditorViewport({
																name: 'viewport2d'
															});
		window.viewport3d = viewport3d = new EditorViewport({
																name: 'viewport3d'
															});
		viewportProxy = new EditorViewportProxy;
		viewport2d.addToProxy(viewportProxy);
		viewport3d.addToProxy(viewportProxy);
		viewportProxy.startListen();
		viewportProxy.loadScene(static_url + 'resources/scenes/test.json');
		width = $(".editor_panel").width();
		height = $(".editor_panel").height();
		editor2dview = new Editor2DView({
											el: $(".edit_area"),
											model: viewport2d,
											width: width,
											height: height
										});
		editor3dview = new Editor3DView({
											el: $(".view_area"),
											model: viewport3d,
											width: width,
											height: height
										});
		editor['view2d'] = editor2dview;
		editor['view3d'] = editor3dview;
		var sceneMeshsView = new SceneMeshsView({
													el: $(".scene.panel .scene-panel"),
													model: viewportProxy
												});
		var meshPropertyView = new EditorPropertyView({
														  el: $(".property.panel .property-panel"),
														  model: viewportProxy
													  });
		// init dom events
		$(document).on('click', '.addToScene', function () {
			var $_this, type, url;
			$_this = $(this);
			type = $_this.attr('data-type');
			url = $_this.attr('data-url');
			switch (type) {
				case 'wall':
				{
					helper.getJSON(url, function (json) {
						return viewportProxy.dispatchMeshJson(helper.preprocessJsonResource(json, 'wall'));
					});
				}
					break;
				case 'walls':
				{
					helper.getJSON(url, function (json) {
						return viewportProxy.dispatchMeshArrayJson(json.items, 'wall');
					});
				}
					break;
				case 'room':
				{
					helper.getJSON(url, function (json) {
						return viewportProxy.dispatchMeshArrayJson(json.items, 'wall');
					});
				}
					break
			}
		});
		$(document).on('click', '.import-resource-btn', function () {
			var name = $(this).parents('tr').find('.resource-name').html();
			var resource_url = helper.getUrlForResource(name);
			helper.uncacheGetJSON(resource_url, function (json) {
				viewportProxy.dispathGeometryOriginJson(json);
			});
		});
		$(document).on('click', '.import-image-btn', function () {
			var name = $(this).parents('tr').find('.resource-name').html();
			var resource_url = helper.getUrlForResource(name);
			var meshName = meshPropertyView.$(".mesh-name-display").html();
			viewportProxy.dispatchMeshTextureChangeFunc(meshName, resource_url);
//			viewportProxy.dispatchMeshChangeFunc(meshName, function (mesh) {
//				window.mesh = mesh;
//				var material = mesh.material;
//				if (!material) {
//					return;
//				}
//				var texture = helper.loadTextureFromJson({
//															 from_type: 'url',
//															 url: resource_url
//														 });
//				material.map = texture;
//				material.needsUpdate = true;
//			});
		});
		window.proxy = viewportProxy;
//		window.scene = window.proxy.get('viewports')[1].get('scene');
//		window.cube = new THREE.CubeGeometry(200, 200, 200);
//		window.texture = THREE.ImageUtils.loadTexture('/admin/resource/get_by_name/images.buwen.buwen004.jpg');
//		window.material = new THREE.MeshBasicMaterial;
//		window.mesh1 = new THREE.Mesh(cube, material);
//		scene.add(mesh1);
//		mesh1.material.map = texture;
//		mesh1.material.needsUpdate = true;
		exports.viewportProxy = viewportProxy;
	});
});
