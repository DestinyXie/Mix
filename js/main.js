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
        'cordova-2.2.0': {
            exports: 'cordova'
        }
    }
});

require(['cordova-2.2.0', 'base', 'scroll', 'swipeview', 'cordovaBridge', 'ajax',
    'region', 'ui', 'home', 'page', 'feed'
], function() {
    App.init();
    console.log(cordova);
});