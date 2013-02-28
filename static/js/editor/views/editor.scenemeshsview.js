define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('three.helper');
    var Backbone = require('backbone');
    $(function () {
        var SceneMeshsView = Backbone.View.extend({
            initialize: function () {
                this.items = [];
                this.listenTo(this.model, 'meshAdded meshChanged meshRemoved', this.render);
                this.listenTo(this.model, 'meshSelected', this.handleSelected);
                return this.render();
            },
            handleSelected: function () {
                var founded, item, selected, _i, _len, _ref;
                selected = this.model.selected;
                founded = false;
                _ref = this.items;
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
                    return this.items[0].$el.addClass('active');
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
                    str = '<li>' + (obj.meshType ? obj.meshType : 'Object3D') + ': ' + (obj.name ? obj.name : _.uniqueId('object3d')) + '</li>';
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
        exports.SceneMeshsView = SceneMeshsView;
    });
});