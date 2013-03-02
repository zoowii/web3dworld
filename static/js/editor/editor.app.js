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
        window.sceneMeshsView = new SceneMeshsView({
            el: $(".scene.panel .scene-panel"),
            model: viewportProxy
        });
        // init dom events
        $(document).on('click', '.addToScene', function () {
            var $_this, type, url;
            $_this = $(this);
            type = $_this.attr('data-type');
            url = $_this.attr('data-url');
            if (_.indexOf(['wall'], type) >= 0) {
                return helper.getJSON(url, function (json) {
                    return viewportProxy.despatchMeshJson(helper.preprocessJsonResource(json, 'wall'));
                });
            }
        });
        exports.viewportProxy = viewportProxy;
    });
});
