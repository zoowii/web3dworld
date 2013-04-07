define(function (require, exports, module) {
    require('editor.ui');
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    $(function () {
        Ext.application({
            name: 'Web3DHouseEditor',
            launch: function () {
                var toolbar = Ext.create('Ext.toolbar.Toolbar', {
                    width: "100%"
                });

                var addMenu = new Ext.menu.Menu({
                    shadow: 'frame',
                    allowOtherMenus: true,
                    items: [
                        {
                            text: '基本几何体',
                            menu: new Ext.menu.Menu({
                                ignoreParentClicks: true,
                                items: [
                                    {text: '平面', handler: onAddPlane},
                                    {text: '长方体', handler: onAddCube},
                                    {text: '球体', handler: onAddSphere},
                                    {text: '圆柱体', handler: onAddCylinder}
                                ]
                            })
                        },
                        {text: '光源', menu: new Ext.menu.Menu({
                            ignoreParentClicks: true,
                            items: [
                                {text: '点光源(Point)'},
                                {text: '卫星光源(Spot)'},
                                {text: '平行光源(Directional)/太阳光源'},
                                {text: '半球光源(Hemisphere)'},
                                {text: '环境光源(Ambient)'}
                            ]
                        })},
                        {text: '基本装饰', menu: new Ext.menu.Menu({
                            ignoreParentClicks: true,
                            items: [
                                {text: '地板', handler: onSetFloor},
                                {text: '墙',handler: onAddWall},
                                {text: '门',handler:onAddDoor},
                                {text: '窗'},
                                {text: '阳台'},
                                {text: '屋顶', handler: onAddRoof}
                            ]
                        })},
                        {
                            text: '室内装修', menu: new Ext.menu.Menu({
                            ignoreParentClicks: true,
                            items: [
                                {text: '房间', handler: onAddRoom},
                                {text: '家具'},
                                {text: '装饰物'}
                            ]
                        })
                        },
                        {
                            text: '其他',
                            handler: onShowOther
                        },
                        {
                            text: '设置房屋基本布局',
                            handler: onSetHouseLayout
                        }
                    ]
                });


                toolbar.add(
                    {
                        text: '添加',
                        menu: addMenu
                    },
                    {
                        itemId: 'selectMenuItem',
                        text: '选择',
                        handler: function () {
                            var editor = window.editor;
                            editor['view2d'].selectionAvailable = true;
                            editor['view3d'].selectionAvailable = true;
                            toolbar.getComponent('selectMenuItem').hide();
                            toolbar.getComponent('disselectMenuItem').show();
                        }
                    },
                    {
                        itemId: 'disselectMenuItem',
                        text: '取消选择',
                        hidden: true,
                        handler: function () {
                            var editor = window.editor;
                            editor['view2d'].selectionAvailable = false;
                            editor['view3d'].selectionAvailable = false;
                            toolbar.getComponent('selectMenuItem').show();
                            toolbar.getComponent('disselectMenuItem').hide();
                        }
                    },
                    {
                        itemId: 'importObjectMenuItem',
                        text: '导入对象',
                        handler: function () {
                            var importObjHtml = $('#importObjectPanelHtmlTmpl').html();
                            var $html = $(showInfo(importObjHtml, '导入对象').getEl().dom);
                            helper.getJSON(resource_list_json_url, function (json) {
                                var $tbody = $html.find('.resource_list_table tbody');
                                $tbody.html('');
                                for (var i = 0; i < json.length; ++i) {
                                    var item = json[i];
                                    var $tr = $("<tr></tr>");
                                    $tr.append("<td>" + item.id + "</td>");
                                    $tr.append("<td class='resource-name'>" + item.name + "</td>");
                                    $tr.append("<td>" + JSON.stringify(item.tags) + "</td>");
                                    $tr.append("<td>" + item.type + "</td>");
                                    var $btnTd = $("<td></td>");
                                    var $importBtn = $("<button>导入</button>");
                                    $importBtn.addClass('btn btn-primary btn-small import-resource-btn');
                                    $btnTd.append($importBtn);
                                    $tr.append($btnTd);
                                    $tbody.append($tr);
                                }
                            });
                        }
                    },
                    {
                        itemId: 'enterFirstPersonModeItem',
                        text: '主角模式',
                        handler: function () {
                            toolbar.getComponent('leaveFirstPersonModeItem').show();
                            toolbar.getComponent('enterFirstPersonModeItem').hide();
                            // TODO: 进入上帝模式
                            var view3d = require('editor.app').editor.view3d;
                            view3d.enterFirstPersonMode();
                        }
                    },
                    {
                        itemId: 'leaveFirstPersonModeItem',
                        text: '上帝模式',
                        hidden: true,
                        handler: function () {
                            toolbar.getComponent('enterFirstPersonModeItem').show();
                            toolbar.getComponent('leaveFirstPersonModeItem').hide();
                            // TODO: 进入第一人称模式
                            var view3d = require('editor.app').editor.view3d;
                            view3d.enterGodMode();
                        }
                    },
                    '->',
                    '<a href="#">Help</a>',
                    '<a href="#">About</a>'
                );
                var propertyPanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'propertyPanel',
                    title: '属性',
                    html: $("#propertyPanelHtmlTmpl").html(),
                    collapsible: true,
                    bodyCls: ['property', 'panel'],
                    overflowY: 'auto'
                });
                var scenePanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'scenePanel',
                    title: '场景 <button class="btn btn-small btn-inverse exportSceneObjects">导出对象</button> <button class="btn btn-small btn-inverse showGroupManager">Group</button>',
                    html: $("#scenePanelHtmlTmpl").html(),
                    collapsible: true,
                    bodyCls: ['scene', 'panel'],
                    overflowY: 'auto'
                });
                var addRoofWindow = Ext.create('Ext.window.Window', {
                    title: '屋顶',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        {
                            xtype: 'panel',
                            itemId: 'addRoofPanel',
                            html: 'roof'
                        }
                    ]
                }).show().hide();
                var addRoofPanel = addRoofWindow.getComponent('addRoofPanel');
                var addOtherWindow = Ext.create('Ext.window.Window', {
                    title: '其他',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'addOtherPanel',
                            html: $("#otherPanelHtmlTmpl").html(),
                            bodyCls: ['panel'],
                            overflowY: 'auto'
                        })
                    ]
                }).show().hide();
                var addOtherPanel = addOtherWindow.getComponent('addOtherPanel');
                var addRoomWindow = Ext.create('Ext.window.Window', {
                    title: '房间',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'addRoomPanel',
                            html: $("#roomsPanelHtmlTmpl").html(),
                            overflowY: true
                        })
                    ]
                }).show().hide();
                var addRoomPanel = addRoomWindow.getComponent('addRoomPanel');
                var addWallWindow = Ext.create('Ext.window.Window', {
                    title: '墙',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'addWallPanel',
                            html: $("#wallsPanelHtmlTmpl").html()
                        })
                    ]
                }).show().hide();
                var addDoorWindow = Ext.create('Ext.window.Window', {
                    title: '门',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'addWallPanel',
                            html: '<button class ="addDoor">door1</button>'
                        })
                    ]
                }).show().hide();
                var addWallPanel = addWallWindow.getComponent('addWallPanel');
                var setFloorWindow = Ext.create('Ext.window.Window', {
                    title: '地板',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'setFloorPanel',
                            html: '<b>hi</b>'
                        })
                    ]
                }).show().hide();
                var setFloorPanel = setFloorWindow.getComponent('setFloorPanel');
                var setHouseLayoutWindow = Ext.create('Ext.window.Window', {
                    title: '设置房屋基本布局',
                    height: 600,
                    width: 500,
                    layout: 'fit',
                    closeAction: 'hide',
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            itemId: 'setHouseLayoutPanel',
                            html: '<button class ="addToScene" data-type="layout" data-url="/static/resources/layouts/layout1.json">layout1</button>'
                        })
                    ]                  //TODO:  hd
                }).show().hide();
                var setHouseLayoutPanel = setHouseLayoutWindow.getComponent('setHouseLayoutPanel');
                var controlPanel = Ext.create('Ext.panel.Panel', {
                    renderTo: 'control_panel',
                    title: '控制面板',
                    tbar: toolbar,
                    height: '100%',
                    width: '100%',
                    layout: 'fit',
                    items: [
                        scenePanel,
                        propertyPanel
                    ]
                });
                var static_url = '/static/';

                function loadResourcesToPanels() {
                    // load walls to wall panel
                    var wallEl = addWallPanel.getEl();
                    var wallDom = wallEl.dom;
                    var $wallsTable = $(wallDom).find('.walls-table');
                    var $wallsTableBody = $wallsTable.find("tbody");
                    var wallUrlsToAdd = [
                        {url: static_url + 'resources/walls/horizontalWall.json', type: 'wall'},
                        {url: static_url + 'resources/walls/verticalWall.json', type: 'wall'},
                        {url: static_url + 'resources/walls/squareWalls.json', type: 'walls'},
                        {url: static_url + 'resources/walls/walls3.json', type: 'import'}
                    ];
                    var walls = [];
                    var runAfterWallsLoaded = _.after(wallUrlsToAdd.length, function () {
                        for (var i = 0; i < walls.length; ++i) {
                            var wallObj = walls[i];
                            var wall = wallObj.json,
                                type = wallObj.type;
                            var tr = $("<tr></tr>");
                            tr.append($("<td>" + (i + 1) + "</td>"));
                            tr.append($("<td><a href='" + wall.originUrl + "'>" + wall.typeName + "</a></td>"));
                            tr.append($("<td><img src='" + wall.thumbnailUrl + "'></td>"));
                            var addBtn = $("<button class='addToScene btn btn-small btn-inverse' data-type='" + type + "' data-url='" + wall.originUrl + "'>添加</button>");
                            var addBtnTd = $("<td></td>");
                            addBtnTd.append(addBtn);
                            tr.append(addBtnTd);
                            $wallsTableBody.append(tr);
                        }
                    });
                    _.each(wallUrlsToAdd, function (obj) {
                        var url = obj.url,
                            type = obj.type;
                        helper.getJSON(url, function (json) {
                            var _json = _.clone(json);
                            _json.originUrl = url;
                            walls.push({json: _json, type: type});
                            runAfterWallsLoaded();
                        })
                    });
                    // load rooms to roomPanel
                    var roomEl = addRoomPanel.getEl();
                    var roomDom = roomEl.dom;
                    var $roomsTable = $(roomDom).find('.rooms-table');
                    var $roomsTableBody = $roomsTable.find("tbody");
                    var roomUrlsToAdd = [
                        {url: static_url + 'resources/rooms/room1.json', type: 'room'},
                        {url: static_url + 'resources/rooms/room2.json', type: 'import'},
                        {url: static_url + 'resources/rooms/room11.json', type: 'import'},
                        {url: static_url + 'resources/rooms/room12.json', type: 'import'},
                        {url: static_url + 'resources/rooms/room13.json', type: 'import'}
                    ];
                    var rooms = [];
                    var runAfterRoomsLoaded = _.after(roomUrlsToAdd.length, function () {
                        for (var i = 0; i < rooms.length; ++i) {
                            var roomObj = rooms[i];
                            var room = roomObj.json,
                                type = roomObj.type;
                            var tr = $("<tr></tr>");
                            tr.append($("<td>" + (i + 1) + "</td>"));
                            tr.append($("<td><a href='" + room.originUrl + "'>" + room.typeName + "</a></td>"));
                            tr.append($("<td><img src='" + room.thumbnailUrl + "'></td>"));
                            var addBtn = $("<button class='addToScene btn btn-small btn-inverse' data-type='" + type + "' data-url='" + room.originUrl + "'>添加</button>");
                            var addBtnTd = $("<td></td>");
                            addBtnTd.append(addBtn);
                            tr.append(addBtnTd);
                            $roomsTableBody.append(tr);
                        }
                    });
                    _.each(roomUrlsToAdd, function (obj) {
                        var url = obj.url,
                            type = obj.type;
                        helper.getJSON(url, function (json) {
                            var _json = _.clone(json);
                            _json.originUrl = url;
                            rooms.push({json: _json, type: type});
                            runAfterRoomsLoaded();
                        })
                    });
                    // load other to roomPanel
                    var otherEl = addOtherPanel.getEl();
                    var otherDom = otherEl.dom;
                    var $otherTable = $(otherDom).find('.panel-table');
                    var $otherTableBody = $otherTable.find("tbody");
                    var otherUrlsToAdd = [
                        {url: static_url + 'resources/roofs/roof1.json', type: 'import'},
                        {url: static_url + 'resources/roofs/roof2.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/safa1.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/bathtub.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/bed.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/table.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/teadesk.json', type: 'import'},
                        {url: static_url + 'resources/furnitures/toilet.json', type: 'import'}
                    ];
                    var others = [];
                    var runAfterOthersLoaded = _.after(otherUrlsToAdd.length, function () {
                        for (var i = 0; i < others.length; ++i) {
                            var obj = others[i];
                            var o = obj.json,
                                type = obj.type;
                            var tr = $("<tr></tr>");
                            tr.append($("<td>" + (i + 1) + "</td>"));
                            tr.append($("<td><a href='" + o.originUrl + "'>" + o.typeName + "</a></td>"));
                            tr.append($("<td><img src='" + o.thumbnailUrl + "'></td>"));
                            var addBtn = $("<button class='addToScene btn btn-small btn-inverse' data-type='" + type + "' data-url='" + o.originUrl + "'>添加</button>");
                            var addBtnTd = $("<td></td>");
                            addBtnTd.append(addBtn);
                            tr.append(addBtnTd);
                            $otherTableBody.append(tr);
                        }
                    });
                    _.each(otherUrlsToAdd, function (obj) {
                        var url = obj.url,
                            type = obj.type;
                        helper.getJSON(url, function (json) {
                            var _json = _.clone(json);
                            _json.originUrl = url;
                            others.push({json: _json, type: type});
                            runAfterOthersLoaded();
                        })
                    });
                }

                loadResourcesToPanels();

                function onAddPlane() {
                    addSimpleGeometry('plane');
                }

                function onAddCube() {
                    addSimpleGeometry('cube');
                }

                function onAddSphere() {
                    addSimpleGeometry('sphere');
                }

                function onAddCylinder() {
                    addSimpleGeometry('cylinder');
                }

                function addSimpleGeometry(type) {
                    var viewportProxy = require('editor.app').viewportProxy;
                    viewportProxy.dispathSimpleGeometry(type);
                }

                function showPanel(panel) {
                    _.each(controlPanel.items.items, function (item) {
                        if (item === panel) {
                            if (item.isCollapsed) {
                                item.toggleCollapse();
                            }
                        } else {
                            item.collapse(Ext.Component.DIRECTION_TOP);
                        }
                    });
                }

                function onAddWall() {
                    addWallWindow.show();
                }
                function onAddDoor()
                {
                    addDoorWindow.show();
                }
                function onAddRoom() {
                    addRoomWindow.show();
                }

                function onAddRoof() {
                    addRoofWindow.show();
                }

                function onSetFloor() {
                    setFloorWindow.show();
                }

                function onShowOther() {
                    addOtherWindow.show();
                }

                function onSetHouseLayout() {
                    setHouseLayoutWindow.show();
                }

                function showInfo(text, title) {
                    var infoInnerPanel = Ext.create('Ext.panel.Panel', {
                        html: 'info',
                        overflowX: 'auto',
                        overflowY: 'auto'
                    });

                    var infoDialog = Ext.create('Ext.window.Window', {
                        title: 'Info',
                        height: 400,
                        width: 600,
                        layout: 'fit',
                        items: infoInnerPanel
                    });
                    if (title == undefined) {
                        title = 'Info';
                    }
                    infoDialog.setTitle(title);
                    infoInnerPanel.html = text;
                    infoDialog.show();
                    return infoDialog;
                }
				$(".showGroupManager").click(function() {
					var Object3DGroup = require('editor.extra').Object3DGroup;
					var groups = Object3DGroup.getGroups();
					var str = "";
					_.each(groups, function(group) {
						str += group.name + '<br>';
					});
					showInfo(str, "Group Manager");
				});
                $(".exportSceneObjects").click(function () {
                    var temp1 = $(".meshs-list li.active");
                    var objNames = _.map(temp1, function (ele) {
                        var text = $(ele).html();
                        var temp2 = _.map(text.split(':'), function (t) {
                            return t.trim();
                        });
                        return {
                            type: temp2[0],
                            name: temp2[1]
                        }
                    });
                    var editorApp = require('editor.app');
                    var viewportProxy = editorApp.viewportProxy;
                    var json = viewportProxy.exportObjectArrayToJson(objNames);
                    showInfo(JSON.stringify(json), '导出对象');
                });
                $(document).on('click', '.material-texture .select-texture-btn', function () {
                    var importObjHtml = $('#importObjectPanelHtmlTmpl').html();
                    var $html = $(showInfo(importObjHtml, '导入对象').getEl().dom);
                    helper.getJSON('/admin/resource/json/list/type/image', function (json) {
                        var $tbody = $html.find('.resource_list_table tbody');
                        $tbody.html('');
                        for (var i = 0; i < json.length; ++i) {
                            var item = json[i];
                            var $tr = $("<tr></tr>");
                            $tr.append("<td>" + item.id + "</td>");
                            $tr.append("<td class='resource-name'>" + item.name + "</td>");
                            $tr.append("<td>" + JSON.stringify(item.tags) + "</td>");
                            $tr.append("<td>" + item.type + "</td>");
                            var $btnTd = $("<td></td>");
                            var $importBtn = $("<button>导入</button>");
                            $importBtn.addClass('btn btn-primary btn-small import-image-btn');
                            $btnTd.append($importBtn);
                            $tr.append($btnTd);
                            $tbody.append($tr);
                        }
                    });
                });
                exports.propertyPanel = propertyPanel;
            }
        });
    });
});