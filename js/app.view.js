define(['device', 'action'], function(device, action) {
    /*页面历史管理类,控制历史记录,页面跳转*/
    var ViewMgr = {
        tmpParams: "", //临时记录参数值
        recordLen: 10, //记录历史页面最大长度
        pageParams: {}, //记录进入页面时所带的参数(如果有的话),便于回退时使用
        firstPage: 'index',
        init: function() { //取得历史页面
            var that = this,
                storEmail = Mix.base.storage.get('app_my_nick'),
                storPwd = Mix.base.storage.get('app_my_pwd'),
                ok = null,
                fail = function() {
                    pageEngine.initPage(that.firstPage);
                    Mix.base.storage.remove("app_view_history", "session");
                };

            delete window['pageEngine'];
            device.disetBackBtn();
            window['pageEngine'] = new PageEngine();
            ViewMgr.views = [that.firstPage];
            if (storEmail && storPwd) {
                action.sendLogin(storEmail, storPwd, null, ok, fail);
            } else {
                fail();
            }

            device.backFunc = [

                function() {
                    ViewMgr.back();
                }
            ];
        },
        gotoPage: function(page, params) {
            var isBack = false,
                that = ViewMgr;
            page = page.replace("\.html", "");
            var viewLen = that.views.length;
            if (that.views[viewLen - 2] == page) { //back
                that.views.pop(1);
                isBack = true;
            } else {
                if (viewLen >= that.recordLen)
                    that.views.shift(1);
                that.views.push(page);
            }
            Mix.base.storage.set("app_view_history", ViewMgr.views, "session");

            try {
                if (1 == that.views.length) { //设置返回按钮为历史回退
                    device.disetBackBtn();
                } else {
                    device.setBackBtn();
                }
            } catch (e) {}


            if ( !! params) {
                ViewMgr.tmpParams = params;
                this.pageParams[page] = params;
            } else {
                ViewMgr.tmpParams = '';
                this.pageParams[page] = '';
            }

            that.setUrl(page, params, isBack);
        },
        /*切换页面*/
        setUrl: function(url, params, back) {
            if (back) {
                pageEngine.initPage(url, 'right');
            } else {
                pageEngine.initPage(url);
            }
        },
        back: function(late) { //返回上一个历史页面
            var that = ViewMgr,
                backPage = that.views[that.views.length - 2];

            function doBack() {
                if (backPage) {
                    that.gotoPage(backPage, that.pageParams[backPage]);
                }
            }
            if (late) {
                setTimeout(doBack, 500);
            } else {
                doBack();
            }
        }
    };

    return window['ViewMgr'] = ViewMgr;
});