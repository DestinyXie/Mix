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
    map: {
        '*': {
            'cordova': 'cordova-2.2.0'
        }
    },
    fileExclusionRegExp: /^(r|build|main\.build|Gruntfile)\.js|build\.sh|.gitignore|README|node_modules$/,
    optimizeCss: "standard"
})