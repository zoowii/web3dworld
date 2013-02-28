define(function (require, exports, module) {
    require('editor.ui');
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('three.helper');
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
                                    {text: '平面', handler: function () {
                                        console.log('plane')
                                    }},
                                    {text: '长方体'},
                                    {text: '球体'},
                                    {text: '圆柱体'}
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
                                {text: '地板'},
                                {text: '墙',
                                    handler: onAddWall},
                                {text: '门'},
                                {text: '窗'},
                                {text: '阳台'}
                            ]
                        })},
                        {
                            text: '室内装修', menu: new Ext.menu.Menu({
                            ignoreParentClicks: true,
                            items: [
                                {text: '房间', menu: new Ext.menu.Menu({
                                    ignoreParentClicks: true,
                                    items: [
                                        {text: 'Living Room'},
                                        {text: 'Bedroom'},
                                        {text: 'Dining Room'},
                                        {text: 'Office'},
                                        {text: 'Kitchen'},
                                        {text: 'Bathroom'},
                                        {text: '其他'}
                                    ]
                                })},
                                {text: '家具'},
                                {text: '装饰物'}
                            ]
                        })
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
                    '->',
                    '<a href="#">Help</a>',
                    '<a href="#">About</a>'
                );
                var setHouseLayoutPanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'setHouseLayoutPanel',
                    title: '设置房屋基本布局',
                    html: 'hi',
                    collapsible: true
                });
                var propertyPanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'propertyPanel',
                    title: '属性',
                    html: $("#propertyPanelHtmlTmpl").html(),
                    collapsible: true
                });
                var scenePanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'scenePanel',
                    title: '场景',
                    html: $("#scenePanelHtmlTmpl").html(),
                    collapsible: true,
                    bodyCls: ['scene', 'panel']
                });
                var controlPanel = Ext.create('Ext.panel.Panel', {
                    renderTo: 'control_panel',
                    title: '控制面板',
                    tbar: toolbar,
                    height: '100%',
                    width: '100%',
                    layout: 'fit',
                    items: [
                        scenePanel,
                        propertyPanel,
                        setHouseLayoutPanel,
                        {
                            itemId: 'setFloorPanel',
                            title: '地板',
                            html: '<b>hi</b>',
                            collapsible: true
                        },
                        {
                            itemId: 'addWallPanel',
                            title: '墙',
                            html: $("#wallsPanelHtmlTmpl").html(),
                            collapsible: true
                        },
                        {
                            itemId: 'addRoomPanel',
                            title: '添加房间',
                            html: '<b>hi</b>',
                            collapsible: true
                        }
                    ]
                });
                var static_url = '/static/';
                var addWallPanel = controlPanel.getComponent('addWallPanel');

                function loadResourcesToPanels() {
                    // load walls to wall panel
                    var wallEl = addWallPanel.getEl();
                    var wallDom = wallEl.dom;
                    var $wallsTable = $(wallDom).find('.walls-table');
                    var $wallsTableBody = $wallsTable.find("tbody");
                    var wallUrlsToAdd = [
                        static_url + 'resources/walls/horizontalWall.json',
                        static_url + 'resources/walls/verticalWall.json',
                        static_url + 'resources/walls/squareWalls.json'
                    ];
                    var walls = [];
                    var runAfterWallsLoaded = _.after(wallUrlsToAdd.length, function () {
                        for (var i = 0; i < walls.length; ++i) {
                            var wall = walls[i];
                            var tr = $("<tr></tr>");
                            tr.append($("<td>" + (i + 1) + "</td>"));
                            tr.append($("<td><a href='" + wall.originUrl + "'>" + wall.typeName + "</a></td>"));
                            tr.append($("<td><img src='" + wall.thumbnailUrl + "'></td>"));
                            var addBtn = $("<button class='addToScene btn btn-small btn-inverse' data-type='wall' data-url='" + wall.originUrl + "'>添加</button>");
                            var addBtnTd = $("<td></td>");
                            addBtnTd.append(addBtn);
                            tr.append(addBtnTd);
                            $wallsTableBody.append(tr);
                        }
                    });
                    _.each(wallUrlsToAdd, function (url) {
                        helper.getJSON(url, function (json) {
                            var _json = _.clone(json);
                            _json.originUrl = url;
                            walls.push(_json);
                            runAfterWallsLoaded();
                        })
                    });

                }

                loadResourcesToPanels();
                function onAddPlane() {

                }

                function onAddWall() {
                    _.each(controlPanel.items.items, function (item) {
                        if (item === addWallPanel) {
                            if (item.isCollapsed) {
                                item.toggleCollapse();
                            }
                        } else {
                            item.collapse(Ext.Component.DIRECTION_TOP);
                        }
                    });
                }

//                            $.getScript('/static/js/editor.js'); // TODO: 使用模块化工具如require.js, sea.js等模块化从而避免这样做

            }
        });
    });
});