define(function (requrie, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var ViewProxy = function () {
            this.views = new helper.Set();
            this.addView = function (view) {
                return this.views.add(view);
            };
            this.removeView = function (view) {
                return this.views.remove(view);
            };
            this.dispatchFunc = function (func, params) {
                for (var i = 0; i < this.views.data.length; ++i) {
                    var view = this.views.data[i];
                    func.apply(view, params);
                }
            };
        };
        exports.ViewProxy = ViewProxy;
    });
});