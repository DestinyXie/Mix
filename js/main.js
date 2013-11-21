require.config({
    baseUrl: './js',
    paths: {
        base: 'mix.base',
        scroll: 'mix.scroll',
        swipeview: 'mix.swipeview',
        cordovaBridge: 'mix.bridge.cordova',
        ajax: 'mix.x',
        region: 'mix.regions',
        ui: 'mix.ui',
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

require(['cordova', 'base', 'scroll', 'swipeview', 'cordovaBridge', 'ajax',
    'region', 'ui', 'home', 'page', 'feed'
], function() {
    App.init();
});