var tests = [];
var kFiles = window.__karma__.files;
for (var file in kFiles) {
    if (kFiles.hasOwnProperty(file)) {
        if (/spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    baseUrl: '/base/js',
    paths: {
        base: 'lib/mix.base',
        dom: 'lib/mix.dom',
        scroll: 'lib/mix.scroll',
        swipeview: 'lib/mix.swipeview',
        device: 'lib/mix.bridge.cordova',
        X: 'lib/mix.x',
        region: 'lib/mix.regions',
        ui: 'lib/mix.ui',
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
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});