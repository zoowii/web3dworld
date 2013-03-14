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
												   "keyup input": "editProxy",
												   "change input": "editProxy"
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
													   var newVal = $from.val().trim(),
														   originVal = $from.attr('origin-data').trim();
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
													   $from.attr('origin-data', newVal);
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
														var from = e.container.dom,
															$from = $(from);
														var newVal = e.value;
														var $parent = $from.parents(".edit-control-row-content");
														var oldVal = $parent.attr('origin-data').trim();
														if (oldVal == newVal || newVal === '') {
															return;
														}
														var propertyName = $parent.attr('property-name');
														newVal = (newVal == 'true');
														var editor = require('editor.app');
														var meshName = $parent.attr('meshName');
														editor.viewportProxy.dispatchMeshPropertyChange(meshName, propertyName, newVal);
														$parent.attr('origin-data', newVal + '');
													}
												});
	var Vector3EditControl = EditControl.extend({
													className: 'edit-control-row vector3',
													template: _.template(_.unescape($("#editControlHtmlTmpl .vector3").html())),
													edit: function (e) {
														var from = e.currentTarget,
															$from = $(from),
															$parent = $from.parents('.edit-control-row-content');
														var propertyName = $parent.find('.property-name').attr('origin-data');
														var xyzName = $from.attr('name-data');
														var oldVal = parseFloat($from.attr('origin-data'));
														var newVal = parseFloat($from.val());
														if (oldVal == newVal) {
															return;
														}
														var meshName = $parent.attr('meshName');
														var editor = require('editor.app');
														editor.viewportProxy.dispatchMeshPropertyChangeFunc(meshName, propertyName, function (val) {
															val[xyzName] = newVal;
														});
														$from.attr('origin-data', newVal);
													}
												});
	var MaterialEditControl = EditControl.extend({
													 className: 'edit-control-row material',
													 template: _.template(_.unescape($("#editControlHtmlTmpl .material").html())),
													 edit: function (e) {
														 var from = e.currentTarget,
															 $from = $(from),
															 $outer = $from.parents('.edit-line'),
															 $parent = $outer.parents('.edit-control-row-content');
														 var propertyName = $parent.attr('property-name');
														 var meshName = $parent.attr('meshName');
														 var newVal = $from.val();
														 if (newVal === '') {
															 return;
														 }
														 var materialType = 'color';
														 if ($outer.attr('sub-name') === 'map') {
															 materialType = 'texture';
														 }
														 var oldVal = $outer.attr('origin-data');
														 console.log(meshName, propertyName, newVal, materialType, oldVal);
													 }
												 });
	exports.EditControlModel = EditControlModel;
	exports.SimpleEditControl = SimpleEditControl;
	exports.BooleanEditControl = BooleanEditControl;
	exports.Vector3EditControl = Vector3EditControl;
	exports.MaterialEditControl = MaterialEditControl;
});