$(function () {
    Ext.application({
                        name:'Web3DHouseEditor',
                        launch:function () {
                            var toolbar = Ext.create('Ext.toolbar.Toolbar', {
                                width:"100%"
                            });

                            var addMenu = new Ext.menu.Menu({
                                                                shadow:'frame',
                                                                allowOtherMenus:true,
                                                                items:[
                                                                    {
                                                                        text:'基本几何体',
                                                                        menu:new Ext.menu.Menu({
                                                                                                   ignoreParentClicks:true,
                                                                                                   items:[
                                                                                                       {text:'平面', handler:function () {
                                                                                                           console.log('plane')
                                                                                                       }},
                                                                                                       {text:'长方体'},
                                                                                                       {text:'球体'},
                                                                                                       {text:'圆柱体'}
                                                                                                   ]
                                                                                               })
                                                                    },
                                                                    {text:'光源', menu:new Ext.menu.Menu({
                                                                                                           ignoreParentClicks:true,
                                                                                                           items:[
                                                                                                               {text:'点光源(Point)'},
                                                                                                               {text:'卫星光源(Spot)'},
                                                                                                               {text:'平行光源(Directional)/太阳光源'},
                                                                                                               {text:'半球光源(Hemisphere)'},
                                                                                                               {text:'环境光源(Ambient)'}
                                                                                                           ]
                                                                                                       })},
                                                                    {text:'基本装饰', menu:new Ext.menu.Menu({
                                                                                                             ignoreParentClicks:true,
                                                                                                             items:[
                                                                                                                 {text:'地板'},
                                                                                                                 {text:'门'},
                                                                                                                 {text:'窗'},
                                                                                                                 {text:'阳台'}
                                                                                                             ]
                                                                                                         })},
                                                                    {
                                                                        text:'室内装修', menu:new Ext.menu.Menu({
                                                                                                                ignoreParentClicks:true,
                                                                                                                items:[
                                                                                                                    {text:'房间', menu:new Ext.menu.Menu({
                                                                                                                                                           ignoreParentClicks:true,
                                                                                                                                                           items:[
                                                                                                                                                               {text:'Living Room'},
                                                                                                                                                               {text:'Bedroom'},
                                                                                                                                                               {text:'Dining Room'},
                                                                                                                                                               {text:'Office'},
                                                                                                                                                               {text:'Kitchen'},
                                                                                                                                                               {text:'Bathroom'},
                                                                                                                                                               {text:'其他'}
                                                                                                                                                           ]
                                                                                                                                                       })},
                                                                                                                    {text:'家具'},
                                                                                                                    {text:'装饰物'}
                                                                                                                ]
                                                                                                            })
                                                                    }
                                                                ]
                                                            });


                            toolbar.add(
                                {
                                    text:'添加',
                                    menu:addMenu
                                },
                                {
                                    text:'选择',
                                    handler: function() {
                                        var editor = window.editor;
                                        editor['view2d'].selectionAvailable = true;
                                        editor['view3d'].selectionAvailable = true;
                                    }
                                },
                                {
                                    text:'取消选择',
                                    handler: function() {
                                        var editor = window.editor;
                                        editor['view2d'].selectionAvailable = false;
                                        editor['view3d'].selectionAvailable = false;
                                    }
                                },
                                '->',
                                '<a href="#">Help</a>',
                                '<a href="#">About</a>'
                            );
                            var setHouseLayoutPanel = Ext.create('Ext.panel.Panel', {
                                itemId:'setHouseLayoutPanel',
                                title:'设置房屋基本布局',
                                html:'hi',
                                collapsible:true
                            });
                            var propertyPanel = Ext.create('Ext.panel.Panel', {
                                itemId:'propertyPanel',
                                title:'属性',
                                html:$("#propertyPanelHtmlTmpl").html(),
                                collapsible:true
                            });
                            var controlPanel = Ext.create('Ext.panel.Panel', {
                                renderTo:'control_panel',
                                title:'控制面板',
                                tbar:toolbar,
                                collapsible:true,
                                height:'100%',
                                width:'100%',
                                layout:'fit',
                                items:[
                                    propertyPanel,
                                    setHouseLayoutPanel,
                                    {
                                        itemId:'setFloorPanel',
                                        title:'地板',
                                        html:'<b>hi</b>',
                                        collapsible:true
                                    },
                                    {
                                        itemId:'addRoomPanel',
                                        title:'添加房间',
                                        html:'<b>hi</b>',
                                        collapsible:true
                                    }
                                ]
                            });

                            function onAddPlane() {

                            }
                        }
                    });
});