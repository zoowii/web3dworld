define(function (require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    $(function () {
        var Object3DGroup = function (name) {
            if (name === undefined || Object3DGroup.findByName(name) != null) {
                this.name = _.uniqueId('group');
            } else {
                this.name = name;
            }
            this.items = new helper.Set();
            this.add = function (item) {
                this.items.add(item);
                if (!item['__group__']) {
                    item['__group__'] = this;
                }
            };
            this.remove = function (item) {
                this.items.remove(item);
                if (item['__group__']) {
                    delete item['__group__'];
                }
            };
            this.applyToAll = function (func, params) {
                if (params === undefined ||
                    params === null) {
                    params = [];
                }
                var items = this.getItems();
                _.each(items, function (item) {
                    func.apply(item, params);
                });
            };
            this.getItems = function () {
                var data = [];
                _.each(this.items.data, function (item) {
                    if (item) {
                        data.push(item);
                    }
                });
                this.items.data = data;
                return data;
            };
            Object3DGroup.groupSet.add(this);
        };
        Object3DGroup.groupSet = new helper.Set();
        Object3DGroup.getGroups = function () {
            var data = [];
            _.each(Object3DGroup.groupSet.data, function (group) {
                if (group) {
                    data.push(group);
                }
                Object3DGroup.groupSet.data = data;
            });
            return data;
        };
        Object3DGroup.findByName = function (name) {
            for (var i = 0; i < Object3DGroup.groupSet.data.length; ++i) {
                var group = Object3DGroup.groupSet.data[i];
                if (group && group.name == name) {
                    return group;
                }
            }
            return null;
        };
        Object3DGroup.getOrCreate = function (name) {
            var group = Object3DGroup.findByName(name);
            if (!group) {
                if(!name) {
                    name = _.uniqueId('group');
                }
                group = new Object3DGroup(name);
            }
            return group;
        };
        exports.Object3DGroup = Object3DGroup;
    });
});