require.config({
    baseUrl: '/static/js',
    paths: {
        jquery: 'lib/jquery.min',
        "jquery.mousewheel": 'lib/jquery.mousewheel',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        "editor.app": 'editor/editor.app',
        "player": 'player',
        "editor.extapp": 'editor/editor.extapp',
        "editor.ui": 'editor/editor.ui',
        "editor.helper": 'editor/editor.helper',
		"editor.exporter": 'editor/editor.exporter',
        "editor.extra": 'editor/editor.extra',
        "editor.view": 'editor/views/editor.view',
        "editor.2dview": 'editor/views/editor.2dview',
        "editor.3dview": 'editor/views/editor.3dview',
        "editor.viewproxy": 'editor/views/editor.viewproxy',
        "editor.scenemeshsview": 'editor/views/editor.scenemeshsview',
        "editor.propertyview": 'editor/views/editor.propertyview',
        "editor.sceneModel": 'editor/models/editor.sceneModel',
        "editor.sceneModelProxy": 'editor/models/editor.sceneModelProxy',
        "editor.edit_controls": 'editor/views/editor.edit_controls'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'three': {
            deps: ['jquery'],
            exports: 'THREE'
        },
        'jquery.mousewheel': ['jquery']
    }
});

require(['editor.app']);