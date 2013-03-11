define(function (require, exports, module) {
	var static_url = '/static/';
	var $ = require('jquery');
	var _ = require('underscore');
	var helper = require('editor.helper');
	var Backbone = require('backbone');
	$(function () {
		var EditorPropertyView = Backbone.View.extend({
														  initialize: function () {
															  var tmplStr = _.unescape(this.$el.parent().children('.property-panel-content-tmpl').html());
															  this.template = _.template(tmplStr);
															  this.listenTo(this.model, 'meshSelected', this.handleSelected);
															  this.render();
														  },
														  handleSelected: function () {
															  var selected = this.model.selected;
															  this.render();
														  },
														  render: function () {
															  // TODO
															  if (this.model.selected) {
																  var data = {mesh: this.model.selected};
																  this.$el.html(this.template(data));
															  }
//																  this.$el.html(this.model.selected.name);
														  }
													  });
		exports.EditorPropertyView = EditorPropertyView;
	});
});