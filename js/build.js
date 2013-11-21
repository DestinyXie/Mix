({
    baseUrl: "./js",
    appDir: "../",
    dir: "../dist",
    modules: [{
        name: "main"
    }],
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
    map: {
        '*': {
            'cordova': 'cordova-2.2.0'
        }
    },
    fileExclusionRegExp: /^(r|build|main\.build)\.js|build\.sh|.gitignore|README$/,
    optimizeCss: "standard"
})