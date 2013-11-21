require.config({
    baseUrl: './js',
    paths: {
        base: 'mix.base',
        scroll: 'mix.scroll',
        swipeview: 'mix.swipeview',
        cordovaBridge: 'mix.bridge.cordova',
        X: 'mix.x',
        region: 'mix.regions',
        ui: 'mix.ui',
        action: 'app.action',
        tool: 'app.tool',
        stor: 'app.stor',
        view: 'app.view',
        home: 'app.home',
        page: 'app.page',
        feed: 'app.feed'
    },
    shim: {
        'cordova': {
            exports: 'cordova'
        }
    },
    map: {
        '*': {
            'cordova': 'cordova-2.2.0'
        }
    }
});

require(['cordova', 'base', 'scroll', 'swipeview', 'cordovaBridge',
    'region', 'ui', 'home', 'page', 'feed'
], function() {
    var App = require('home');
    App.init();
});