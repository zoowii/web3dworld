define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorView = Backbone.View.extend({
            initRenderer: function () {
                var renderer;
                this.renderer = renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    precision: 'highp',
                    alpha: true,
                    preserveDrawingBuffer: true,
                    maxLights: 5
                });
                renderer.setSize(this.width, this.height);
                renderer.setClearColor(0xffffff, 0.1);
                // 设置canvas背景色，透明度
                return this.el.appendChild(renderer.domElement);
            },
            initCamera: function () {
            },
            initProjector: function () {
                var cameraChanged, helpersVisible, intersectionPlane, offset, picked, projector, ray, scene, selected, _this;
                scene = this.model.get('scene');
                // TODO: move these code to Model
                intersectionPlane = this.model.get('intersectionPlane');
                ray = new THREE.Raycaster();
                projector = new THREE.Projector();
                offset = new THREE.Vector3();
                cameraChanged = false;
                helpersVisible = true;
                picked = null;
                selected = this.camera;
                _this = this;
                this.$el.mousedown(function (event) {
                    var intersects, root, vector;
                    _this.el.focus();
                    if (!_this.selectionAvailable) {
                        return;
                    }
                    if (event.button === 0) {
                        vector = new THREE.Vector3((event.offsetX / _this.width) * 2 - 1, -(event.offsetY / _this.height) * 2 + 1, 0.5);
                        projector.unprojectVector(vector, _this.camera);
                        ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize());
                        intersects = ray.intersectObjects(scene.children, true);
                        // objects
                        if (intersects.length > 0) {
                            if (_this.controls) {
                                _this.controls.enabled = false;
                            }
                            picked = intersects[0].object;
                            if (picked.properties.isGizmo) {
                                root = picked.properties.gizmoRoot;
                                selected = picked.properties.gizmoSubject;
                            } else {
                                root = picked;
                                selected = picked;
                            }
                            intersectionPlane.position.copy(root.position);
                            intersectionPlane.lookAt(_this.camera.position);
                            console.log('mouse down: ', selected);
                            _this.handleSelected(selected);
                            // selected is the mesh your mouse selected
                            // TODO dispatch the mousedown event to the selected mesh
                            // intersects = ray.intersectObject(intersectionPlane)
                            // offset.copy(intersects[ 0 ].point).sub(intersectionPlane.position)
                            return _this.mousemoveAvailable = _this.mouseupavailable = true;
                        }
                    }
                });
                this.$el.mousemove(function (event) {
                    var intersects, vector;
                    if (_this.mousemoveAvailable && !_this.preventMove) {
                        // do the tasks after mouse down
                        vector = new THREE.Vector3((event.offsetX / _this.width) * 2 - 1, -(event.offsetY / _this.height) * 2 + 1, 0.5);
                        projector.unprojectVector(vector, _this.camera);
                        ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize());
                        intersects = ray.intersectObject(intersectionPlane);
                        // TODO: shouldn't move at the z direction
                        if (intersects.length > 0) {
                            intersects[0].point.sub(offset);
                            if (picked.properties.isGizmo) {
                                intersects[0].point.z = picked.position.z; // Only x, y direction can be moved
//                                picked.properties.gizmoRoot.position.copy(intersects[0].point);
//                                picked.properties.gizmoSubject.position.copy(intersects[0].point);
                                console.log('gizmo?');
                                _this.dispatchMeshMove(picked.name, intersects[0].point);
                                // TODO: use mouse move subject
//                                console.log('mouse move subject1: ', picked.properties.gizmoSubject);
                            } else {
                                intersects[0].point.z = picked.position.z; // Only x, y direction can be moved
                                // 移动选中的
//                                picked.position.copy(intersects[0].point);
                                _this.dispatchMeshMove(picked.name, intersects[0].point);
                                // TODO: use mouse move subject
//                                console.log('mouse move subject2: ', picked.properties.gizmoSubject);
                            }
                            return _this.update();
                        }
                    }
                });
                return this.$el.mouseup(function (event) {
                    if (_this.mouseupavailable) {
                        _this.mousemoveAvailable = false;
                        _this.mouseupavailable = false;
                        if (_this.controls !== void 0) {
                            return _this.controls.enabled = true;
                        }
                    }
                });
            },
            handleSelected: function (selected) {
                return this.model.trigger('meshSelect', selected);
            },
            dispatchMeshMove: function (name, point) {
                this.model.trigger('passMeshMove', name, point);
            },
            update: function () {
                return this.renderOnce();
            },
            initialize: function () {
                this.width = this.options.width;
                this.height = this.options.height;
                this.selectionAvailable = false;
                this.preventMove = false;
                this.initCamera();
                this.initProjector();
                this.initRenderer();
                this.initEvents();
                this.animate();
            },
            animate: function () {
                return animate(this);
            },
            renderOnce: function () {
                return this.renderer.render(this.model.get('scene'), this.camera);
            },
            initEvents: function () {
                var _camera, _model;
                _model = this.model;
                _camera = this.camera;
                // comment below codes because use TracckballControls.js's control system
                // this.$el.bind('mousewheel', (event, delta) ->
                // if delta < 0
                //       _camera.position.x *= 1.1
                //  _camera.position.y *= 1.1
                //   _camera.position.z *= 1.1
                // else
                //   _camera.position.x *= 0.9
                //   _camera.position.y *= 0.9
                //  _camera.position.z *= 0.9
                // )
            }
        });
        var animate = function (view) {
            requestAnimationFrame(function () {
                return animate(view);
            });
            return view.update();
        };
        exports.EditorView = EditorView;
    });
});