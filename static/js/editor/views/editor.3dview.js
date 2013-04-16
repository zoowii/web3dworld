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
                EditorView.prototype.initialize.apply(this, arguments);
//				this.preventMove = true;
            },
            enterFirstPersonMode: function () {
                this.savedCameraPosition = this.camera.position.clone();
                this.savedCameraUp = this.camera.up.clone();
                var camera = this.camera;
                var movingCube = this.model.movingCube;
                camera.position.set(-320, -244, 136.4);
                camera.up.set(0.59, 0.48, 0.73);
                this.controls.holdLookAt = movingCube;
                function getKey(e) {
                    const moveDistance = 30;
                    switch (e.keyCode) {
                        case 119:
                        { // w
                            movingCube.translateX(-moveDistance);
                        }
                            break;
                        case 97:
                        { // a
                            movingCube.translateY(-moveDistance);
                        }
                            break;
                        case 100:
                        { // d
                            movingCube.translateY(moveDistance);
                        }
                            break;
                        case 115:
                        { // s
                            movingCube.translateX(moveDistance);
                        }
                            break;
                        default:
                        {
                            return;
                        }
                    }
                    var relativeCameraOffset = new THREE.Vector3(200, 200, 100);
                    var cameraOffset = relativeCameraOffset.applyMatrix4(movingCube.matrixWorld);
                    camera.position.x = cameraOffset.x;
                    camera.position.y = cameraOffset.y;
                    camera.position.z = cameraOffset.z;
//                    camera.up.set(1, 1, 0);
                    camera.lookAt(movingCube.position);
                }

                document.addEventListener('keypress', getKey, false);
                this.unbindKeyupEvent = function () {
                    document.removeEventListener('keypress', getKey);
                };
            },
            enterGodMode: function () {
                this.camera.position.copy(this.savedCameraPosition);
                this.camera.up.copy(this.savedCameraUp);
                this.unbindKeyupEvent();
                this.controls.holdLookAt = false;
                var movingCube = this.model.movingCube;
                movingCube.position.set(0, 0, 0)
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
                EditorView.prototype.initEvents.call(this);
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