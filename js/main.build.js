({
    baseUrl: ".",
    out: "../dist/js/main.built.js",
    name: "main",
    paths: {
        requireLib: 'require',
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
    include: "requireLib"
})