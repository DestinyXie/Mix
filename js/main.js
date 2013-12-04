require({
        baseUrl: './js',
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
        }
    },
    ['cordova', 'dom' ,'base', 'scroll', 'swipeview', 'device',
    'region', 'ui', 'home', 'page', 'feed', 'stor'],
    function(cordova, dom, base, scroll, swipeview, device, region, ui, home, page, feed, StorMgr) {
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
        device.menuFunc = function() {
            UserMenus('menuBtn');
        }

        var resizeT; //resize事件会执行2次
        dom.addEvent(window, Mix.event.RESIZE_EV, function() {
            if (Date.now() - resizeT < 50) {
                return;
            }
            resizeT = Date.now();
            /*通知订阅者窗口resize*/
            Mix.obs.publish('resize');
        });
    }
);

