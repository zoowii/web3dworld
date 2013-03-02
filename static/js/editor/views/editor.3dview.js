define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    var EditorView = require('editor.view').EditorView;
    $(function () {
        var Editor3DView = EditorView.extend({
            initialize: function () {
                return EditorView.prototype.initialize.apply(this, arguments);
            },
            initCamera: function () {
                var aspect, camera, controls, far, near, view_angle;
                view_angle = 50;
                aspect = this.width / this.height;
                near = 1.0;
                far = 5000;
                this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
                camera.position.set(500, 1500, 500);
                camera.rotation.set(-0.46, 0.73, 0.32);
                camera.up.set(0, 0, 1);
                camera.lookAt(this.model.get('scene').position);
                this.controls = controls = new THREE.TrackballControls(camera, this.el);
                return controls.enabled = true;
            },
            initEvents: function () {
            },
            animate: function () {
                return editor3dviewanimate(this);
            }
        });
        var editor3dviewanimate = function (view) {
            requestAnimationFrame(function () {
                return editor3dviewanimate(view);
            });
            view.update();
            return view.controls.update();
        };
        exports.Editor3DView = Editor3DView;
    });
});