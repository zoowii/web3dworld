define(function (require, exports, module) {
    require('editor.extapp');
    var $ = require('jquery');
    require('jquery.mousewheel');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    var EditorSceneModel = require('editor.sceneModel').EditorSceneModel;
    var EditorSceneModelProxy = require('editor.sceneModelProxy').EditorSceneModelProxy;
    var Editor2DView = require('editor.2dview').Editor2DView;
    var Editor3DView = require('editor.3dview').Editor3DView;
    var SceneMeshsView = require('editor.scenemeshsview').SceneMeshsView;
    var EditorPropertyView = require('editor.propertyview').EditorPropertyView;
    $(function () {
        var editor, editor2dview, editor3dview, sceneModel2d, sceneModel3d, sceneModelProxy;
        var static_url = '/static/';
        window.scenes = [];
        window.floors = [];

        if (window.editor === void 0) {
            window.editor = {};
        }
        editor = window.editor;
        window.sceneModel2d = sceneModel2d = new EditorSceneModel({
            name: 'sceneModel2d'
        });
        window.sceneModel3d = sceneModel3d = new EditorSceneModel({
            name: 'sceneModel3d'
        });
        sceneModelProxy = new EditorSceneModelProxy;
        sceneModel2d.addToProxy(sceneModelProxy);
        sceneModel3d.addToProxy(sceneModelProxy);
        sceneModelProxy.startListen();
        var scene_src = window.scene_src;

        if(window.play_src) { // when it's a player, not editor
            scene_src = window.play_src;
            require('player');
        }

        sceneModelProxy.loadScene(scene_src);
		var width2d = $(".edit_area").width(), height2d = $(".edit_area").height(), width3d = $(".view_area").width(), height3d = $(".view_area").height();;
        editor2dview = new Editor2DView({
            el: $(".edit_area"),
            model: sceneModel2d,
            width: width2d,
            height: height2d
        });
        editor3dview = new Editor3DView({
            el: $(".view_area"),
            model: sceneModel3d,
            width: width3d,
            height: height3d
        });
        var ViewProxy = require('editor.viewproxy').ViewProxy;
        var viewProxy = new ViewProxy();
        viewProxy.addView(editor2dview);
        viewProxy.addView(editor3dview);
        editor['view2d'] = editor2dview;
        editor['view3d'] = editor3dview;
        var sceneMeshsView = new SceneMeshsView({
            el: $(".scene.panel .scene-panel"),
            model: sceneModelProxy
        });
        var extapp = require('editor.extapp');
        var meshPropertyView = new EditorPropertyView({
            el: $(".property.panel .property-panel"),
            model: sceneModelProxy,
            panel: extapp.propertyPanel
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
                        return sceneModelProxy.dispatchMeshJson(helper.preprocessJsonResource(json, 'wall'));
                    });
                }
                    break;
                case 'walls':
                {
                    helper.getJSON(url, function (json) {
                        return sceneModelProxy.dispatchMeshArrayJson(json.items, 'wall');
                    });
                }
                    break;
                case 'room':
                {
                    helper.getJSON(url, function (json) {
                        return sceneModelProxy.dispatchMeshArrayJson(json.items, 'wall');
                    });
                }
                    break ;
                case 'import':
                {
                    helper.getJSON(url, function (json) {
                        sceneModelProxy.dispatchGeometryOriginJsonFromUrl(json.geometry_url, json);
                    });
                }
                    break;
                case 'layout':
                {
                    helper.getJSON(url, function(json){
                         sceneModelProxy.dispatchLayoutArrayJson(json.items);
                    });
                }                                       //TODO:hd
            }
        });
        $(document).on('click', '.import-resource-btn', function () {
            var name = $(this).parents('tr').find('.resource-name').html();
            var resource_url = helper.getUrlForResource(name);
            helper.uncacheGetJSON(resource_url, function (json) {
                sceneModelProxy.dispatchGeometryOriginJson(json);
            });
        });
        $(document).on('click', '.addDoor', function () {
            var url = '/static/resources/doors/door1.json';
            helper.getJSON(url, function (json) {
                return sceneModelProxy.dispatchMeshArrayJson(json.items, 'wall');
            });
        });//TODO:hd
        $(document).on('click', '.import-image-btn', function () {
            var name = $(this).parents('tr').find('.resource-name').html();
            var resource_url = helper.getUrlForResource(name);
            var meshName = meshPropertyView.$(".mesh-name-display").html();
            sceneModelProxy.dispatchMeshTextureChangeFunc(meshName, resource_url);
//			sceneModelProxy.dispatchMeshChangeFunc(meshName, function (mesh) {
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
        window.proxy = sceneModelProxy;
//		window.scene = window.proxy.get('sceneModels')[1].get('scene');
//		window.cube = new THREE.CubeGeometry(200, 200, 200);
//		window.texture = THREE.ImageUtils.loadTexture('/admin/resource/get_by_name/images.buwen.buwen004.jpg');
//		window.material = new THREE.MeshBasicMaterial;
//		window.mesh1 = new THREE.Mesh(cube, material);
//		scene.add(mesh1);
//		mesh1.material.map = texture;
//		mesh1.material.needsUpdate = true;
        exports.sceneModelProxy = sceneModelProxy;
        exports.viewProxy = viewProxy;
        exports.editor = editor;
    });
});
