define(function (require, exports, module) {
	var static_url = '/static/';
	var $ = require('jquery');
	var _ = require('underscore');
	var helper = require('editor.helper');
	var Backbone = require('backbone');
	$(function () {
		var EditorPropertyView = Backbone.View.extend({
														  template: _.template(_.unescape($("#propertyPanelContentHtmlTmpl").html())),
														  initialize: function () {
															  this.listenTo(this.model, 'meshSelected', this.handleSelected);
															  this.listenTo(this.model, 'meshMoved', this.render);
															  this.render();
														  },
														  handleSelected: function () {
															  var selected = this.model.selected;
															  this.render();
														  },
														  events: {
															  'click .property-control-area .delete': 'deleteSelected'
														  },
														  deleteSelected: function () {
															  if (this.model.selected) {
																  var selected = this.model.selected;
																  if (selected.name && selected.name != '') {
																	  var editor = require('editor.app');
																	  editor.viewportProxy.dispatchDeleteMesh(selected.name);
																  }
															  }
														  },
														  render: function () {
															  console.log(this);
															  if (this.model.selected) {
																  var selected = this.model.selected;
																  var data = {mesh: selected};
																  this.$el.html(this.template(data));
																  for (var property in selected) {
																	  var view = helper.genControlForProperty(selected, property, selected[property]);
																	  if (view) {
																		  this.$(".property-list").append(view.el);
																	  }
																  }
																  this.options.panel.doLayout();
															  }
														  }
													  });
		exports.EditorPropertyView = EditorPropertyView;
		exports.editableProperties = ['position', 'scale', 'rotation', 'meshName', 'type', 'meshType', 'typeName', 'title', 'text',
			'visible', 'castShadow', 'receiveShadow', 'opacity', 'translate', 'material', 'geometry'];
	});
});