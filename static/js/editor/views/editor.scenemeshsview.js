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
				var meshName = $(this).html().split(":")[1].trim();
				if (!meshName) {
					return;
				}
				var viewportProxy = require('editor.app').viewportProxy;
				var menu = Ext.create('Ext.menu.Menu', {
					items: [
						{
							text: 'Remove from group',
							handler: function () {
								var viewport0 = viewportProxy.get('viewports')[0];
								var mesh = viewport0.getObject(meshName);
								if (mesh) {
									if (mesh['__group__']) {
										if (confirm("Mesh " + meshName + " is in group " + mesh['__group__'].name + " now, sure to remove from the group?")) {
											viewportProxy.dispatchMeshChangeFunc(meshName, function (mesh) {
												if (!mesh) {
													return;
												}
												var group = mesh['__group__'];
												if (group) {
													group.remove(mesh);
												}
											});
											viewportProxy.trigger('meshChanged');
										} else {
											return false;
										}
									} else {
										alert("The mesh " + meshName + " isn't in any group now!");
										return false;
									}
									return true;
								} else {
									alert("Can't find the mesh named " + meshName + "!");
									return false;
								}
							}
						},
						{
							text: 'Add to group',
							handler: function () {
								var viewport0 = viewportProxy.get('viewports')[0];
								var mesh = viewport0.getObject(meshName);
								if (mesh) {
									if (mesh['__group__']) {
										alert("The mesh is now already in a group named " + mesh['__group__'].name + "!");
										return false;
									} else {
										var groupName = prompt("Input the group name:");
										if(groupName === null) {
											return false;
										}
										var Object3DGroup = require('editor.extra').Object3DGroup;
										var group = Object3DGroup.findByName(groupName);
										if (group) {
											viewportProxy.dispatchMeshChangeFunc(meshName, function (mesh) {
												if (!mesh) {
													return;
												}
												group.add(mesh);
											});
											viewportProxy.trigger('meshChanged');
										} else {
											alert("Can't find the group named " + groupName + "!");
											return false;
										}
									}
									return true;
								} else {
									alert("Can't find the mesh named " + meshName + "!");
									return false;
								}
							}
						},
						{
							text: 'Create Group',
							handler: function() {
								var groupName = prompt("Input the new group name:");
								if(groupName === null) {
									return false;
								}
								if(groupName && groupName.length > 0) {
									var Object3DGroup = require('editor.extra').Object3DGroup;
									var group = Object3DGroup.findByName(groupName);
									if(group) {
										alert("The group name " + groupName + " has existed!");
										return false;
									}
									var newGroup = new Object3DGroup(groupName);
									alert("New group named " + newGroup.name + " has been created!");
									return true;
								} else {
									alert("The group name can't be empty!");
									return false;
								}
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