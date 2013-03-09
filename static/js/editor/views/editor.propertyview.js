define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorPropertyView = Backbone.View.extend({
                                                          initialize: function () {
                                                              this.listenTo(this.model, 'meshSelected', this.handleSelected);
                                                              this.render();
                                                          },
                                                          handleSelected: function () {
                                                              var selected = this.model.selected;
                                                              this.render();
                                                          },
                                                          render: function () {
                                                              // TODO
                                                              if (this.model.selected)
                                                                  this.$el.html(this.model.selected.name);
                                                          }
                                                      });
        exports.EditorPropertyView = EditorPropertyView;
    });
});