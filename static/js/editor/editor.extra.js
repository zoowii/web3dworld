define(function (require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var Object3DGroup = function () {
            this.name = _.uniqueId('group');
            this.items = new helper.Set();
            this.add = function (item) {
                this.items.add(item);
            };
            this.remove = function (item) {
                this.items.remove(item);
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
        exports.Object3DGroup = Object3DGroup;
    });
});