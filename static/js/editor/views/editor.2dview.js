define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    var EditorView = require('editor.view').EditorView;
    $(function() {
        var Editor2DView = EditorView.extend({
            initCamera: function () {
                var aspect, camera, far, near, view_angle;
                view_angle = 100;
                aspect = this.width / this.height;
                near = 1.0;
                far = 5000;
                this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
                camera.position.set(0, 0, 500);
                camera.rotation.set(-1.57, 0, 0);
                camera.up.set(0, 0, 1);
                return camera.lookAt(this.model.get('scene').position);
            },
            initEvents: function () {
                var _camera, _model;
                _model = this.model;
                _camera = this.camera;
                return this.$el.bind('mousewheel', function (event, delta) {
                    if (delta < 0) {
                        _camera.position.x *= 1.1;
                        _camera.position.y *= 1.1;
                        return _camera.position.z *= 1.1;
                    } else {
                        _camera.position.x *= 0.9;
                        _camera.position.y *= 0.9;
                        return _camera.position.z *= 0.9;
                    }
                });
            }
        });
        exports.Editor2DView = Editor2DView;
    });
});