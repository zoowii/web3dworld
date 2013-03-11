define(function (require, exports, module) {
	var _ = require('underscore'),
		$ = require('jquery'),
		Backbone = require('backbone'),
		helper = require('editor.helper');
	var EditControlModel = Backbone.Model.extend({
													 initialize: function () {
														 if (this.get('type') == undefined) {
															 this.set('type', typeof(this.get('value')));
														 }
													 }
												 });
	var EditControl = Backbone.View.extend({
											   render: function () {
												   this.$el.html(this.template(this.model.attributes));
												   return this;
											   },
											   events: {
												   "keyup input": "editProxy"
											   },
											   editProxy: _.debounce(function () {
												   this.edit.apply(this, arguments);
											   }, 300)
										   });
	var SimpleEditControl = EditControl.extend({
												   className: 'edit-control-row simple',
												   template: _.template(_.unescape($("#editControlHtmlTmpl .simple").html())),
												   edit: function (e) {
													   var from = e.currentTarget,
														   $from = $(from);
													   var newVal = $from.val(),
														   originVal = $from.attr('origin-data');
													   if (newVal === originVal) {
														   return;
													   }
													   var $parent = $from.parents(".edit-control-row-content");
													   var propertyName = $parent.children(".property-name").attr('origin-data');
													   var meshName = $parent.attr('meshName');
													   var valueType = $parent.attr('valueType');
													   newVal = helper.parseValueToType(newVal, valueType);
													   if (newVal == originVal) {
														   return;
													   }
													   var editor = require('editor.app');
													   editor.viewportProxy.dispatchMeshPropertyChange(meshName, propertyName, newVal);
												   }
											   });
	var BooleanEditControl = EditControl.extend({
													className: 'edit-control-row boolean',
													template: _.template(_.unescape($("#editControlHtmlTmpl .boolean").html())),
													render: function () {
														EditControl.prototype.render.call(this);
														this.setup();
														return this;
													},
													setup: function () {
														Ext.create('Ext.form.ComboBox', {
															fieldLabel: this.model.get('name'),
															store: Ext.create('Ext.data.Store', {
																fields: ['name'],
																data: [
																	{name: 'true'},
																	{name: 'false'}
																]
															}),
															queryMode: 'local',
															displayField: 'name',
															valueField: 'name',
															allowBlank: false,
															value: this.model.get('value') + '',
															renderTo: this.$(".combobox-area")[0],
															listeners: {
																scope: this,
																'select': this.edit
															}
														});
													},
													edit: function (e) {
														console.log(e);
														// TODO
													}
												});
	var Vector3EditControl = EditControl.extend({
													className: 'edit-control-row vector3',
													template: _.template(_.unescape($("#editControlHtmlTmpl .vector3").html())),
													edit: function (e) {
														console.log(this, arguments);
														// TODO
													}
												});
	exports.EditControlModel = EditControlModel;
	exports.SimpleEditControl = SimpleEditControl;
	exports.BooleanEditControl = BooleanEditControl;
	exports.Vector3EditControl = Vector3EditControl;
});