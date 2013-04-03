define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var SceneMeshsView = Backbone.View.extend({
            initialize: function () {
                this.items = [];
                this.listenTo(this.model, 'meshAdded meshChanged meshRemoved', this.render);
                this.listenTo(this.model, 'meshSelected', this.handleSelected);
                this.render();
            },
            handleSelected: function () {
                var item, _i, _len;
                var selected = this.model.selected;
                var founded = false;
                var _ref = this.items;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    if (item.obj === selected || (selected.name !== '' && item.obj.name === selected.name)) {
                        item.$el.addClass('active');
                        founded = true;
                    } else {
                        item.$el.removeClass('active');
                    }
                }
                if (!founded && this.items.length > 0) {
                    this.items[0].$el.addClass('active');
                }
            },
            render: function () {
                var i, item, listView, obj, objects, panel, str, _i, _ref;
                objects = this.model.getObjects();
                this.items = [];
                panel = this.$(".meshs-list-panel");
                listView = $("<ul></ul>");
                listView.addClass('meshs-list');
                for (i = _i = 0, _ref = objects.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    obj = objects[i];
                    var displayText = (obj.meshType ? obj.meshType : 'Object3D') + ': ' + (obj.name ? obj.name : _.uniqueId('object3d'));
                    if (obj['__group__']) {
                        var group = obj['__group__'];
//                        displayText += "[group=" + group.name + "]";
                    }
                    str = '<li>' + displayText + '</li>';
                    item = $(str);
                    this.items.push({
                        obj: obj,
                        el: item[0],
                        $el: item
                    });
                    if (i === 0) {
                        item.addClass('active');
                    }
                    listView.append(item);
                }
                panel.html('');
                return panel.append(listView);
            }
        });
        $(document).on('mousedown', '#control_panel .meshs-list li', function (e) {
            if (e.button === 0) { // left mouse click
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            } else if (e.button === 1) { // middle mouse click
                var _this = this;
                _.each($("#control_panel .meshs-list li"), function (li) {
                    if (li == _this) {
                        $(li).addClass('active');
                    } else {
                        $(li).removeClass('active');
                    }
                });
                var menu = Ext.create('Ext.menu.Menu', {
                    items: [
                        {
                            text: 'Remove from group',
                            handler: function() {

                            }
                        },
                        {
                            text: 'Add to group',
                            handler: function() {

                            }
                        }
                    ]
                });
                var e1 = Ext.EventObject;
                e1.stopEvent();
                menu.showAt(e1.getPoint());
            } else {

            }
        });
        $(document).on('contextmenu', '#control_panel .meshs-list', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
//        Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
        exports.SceneMeshsView = SceneMeshsView;
    });
});