require.config({
    baseUrl: '/static/js',
    paths: {
        jquery: 'lib/jquery.min',
        "jquery.mousewheel": 'lib/jquery.mousewheel',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone'
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

require(['player.index.app']);