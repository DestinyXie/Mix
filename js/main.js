require.config({
    baseUrl: './js',
    paths: {
        base: 'lib/mix.base',
        dom: 'lib/mix.dom',
        scroll: 'lib/mix.scroll',
        swipeview: 'lib/mix.swipeview',
        cordovaBridge: 'lib/mix.bridge.cordova',
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
    }
});

require(['cordova', 'dom' ,'base', 'scroll', 'swipeview', 'cordovaBridge',
    'region', 'ui', 'home', 'page', 'feed'
], function(cordova, dom, base, scroll, swipeview, cordovaBridge, region, ui, home, page, feed) {
    ui.loading.show(dom.$('#page'));
    /*全局变量赋值*/
    dom.init();

    /*加载weinre debug工具*/
    // dom.loadJs("http://192.168.40.28:8081/target/target-script.js",function(){alert('weinre test ok!')});

    /*取得GPS信息*/
    UserTools.getGpsInfo();

    StorMgr.siteUrl = 'http://desmix.com';

    /*页面历史管理初始化*/
    ViewMgr.init();

    /*设置menu键*/
    Device.menuFunc = function() {
        UserMenus('menuBtn');
    }

    var resizeT; //resize事件会执行2次
    dom.addEvent(WIN, RESIZE_EV, function() {
        if (Date.now() - resizeT < 50) {
            return;
        }
        resizeT = Date.now();
        /*通知订阅者窗口resize*/
        Mix.obs.publish('resize');
    });
});

