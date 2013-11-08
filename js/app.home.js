/*页面初始化*/ ;
var App = {
    init: function() {
        Mix.ui.loading.show($('#page'));
        /*全局变量赋值*/
        HEAD = $('head');
        BODY = DOC.body;
        BODYFS = parseInt(getComputedStyle(BODY).fontSize);

        /*加载weinre debug工具*/
        // DOM.loadJs("http://192.168.40.28:8081/target/target-script.js",function(){alert('weinre test ok!')});

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
        DOM.addEvent(WIN, RESIZE_EV, function() {
            if (Date.now() - resizeT < 50) {
                return;
            }
            resizeT = Date.now();
            /*通知订阅者窗口resize*/
            Mix.obs.publish('resize');
        });
    }
}

Device.onLoad(App.init);

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

        delete WIN['pageEngine'];
        Device.disetBackBtn();
        WIN['pageEngine'] = new PageEngine();
        ViewMgr.views = [that.firstPage];
        if (storEmail && storPwd) {
            UserAction.sendLogin(storEmail, storPwd, null, ok, fail);
        } else {
            fail();
        }

        Device.backFunc = [
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
                Device.disetBackBtn();
            } else {
                Device.setBackBtn();
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
}

/*缓存资料管理*/
var StorMgr = {
    myInfo: null,
    destroy: function() {
        StorMgr.myInfo = null;
    },
    getMyInfo: function(force, cb) {
        var that = this,
            url = StorMgr.siteUrl + '/user/info?ajax=1&callback=?';

        if (!force && that.myInfo) {
            cb && cb(that.myInfo);
            return;
        } else if (that.myInfo) {
            cb && cb(that.myInfo);
        }

        function load(data) {
            that.myInfo = data;
            cb && cb(data);
        }
        UserAction.sendAction(url, null, null, load);
    }
};

/*记录常用正则*/
var regExpObj = {
    email: /^.+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
    directCity: /北京|上海|重庆|天津|香港|澳门/,
    noLngLatCity: /马鞍山|朝阳|白沙|保亭|昌江|陵水|五指山|乐东|平顶山|临沧|普洱|双鸭山/
};

/*用户执行的一些服务器请求*/
var UserAction = {
    x: null,
    stop: function() {
        this.removeLoading(true);
        this.sendingLogin = false;
        this.sendingRegist = false;
        this.sendingResetPwd = false;
        this.x && this.x.abort();
    },
    /*登陆验证*/
    checkLogin: function(nSel, pSel, node) {
        var nickVal = $(nSel).value,
            passVal = $(pSel).value;

        if (nickVal.length == 0) {
            toast("请输入您的昵称！", 2);
            return;
        }
        if (passVal.length == 0) {
            toast("请输入您的密码！", 2);
            return;
        }

        UserAction.sendLogin(nickVal, passVal, node);
    },
    sendLogin: function(nick, pwd, btn, ok, fail) {
        if (UserAction.sendingLogin) { //防止重复发送
            return;
        }

        var checkUrl = StorMgr.siteUrl + "/login?ajax=1&callback=?",
            params = 'nickname=' + encodeURIComponent(nick) + '&password=' + encodeURIComponent(pwd),
            secCb = function(a) {
                UserTools.refresh(); //刷新数据check

                Mix.base.storage.set('app_my_nick', nick);
                Mix.base.storage.set('app_my_pwd', pwd);

                ViewMgr.gotoPage('test');
                if ($.isFunc(ok)) {
                    ok();
                }
                Device.setMenuBtn();
                UserAction.sendingLogin = false;
            },
            errCb = function(e) {
                if ($.isFunc(fail)) {
                    fail(e.errStr);
                } else {
                    toast(e.errStr);
                }
                UserAction.sendingLogin = false;
            };

        UserAction.sendingLogin = true;
        UserAction.sendAction(checkUrl, params, "get", secCb, errCb);
    },
    /*注册*/
    userRegist: function() {
        var that = this,
            email = $("#regEmail").value,
            nickname = $("#regNickName").value,
            password = $("#regPwd").value,
            passwordR = $("#regPwdR").value;

        that._userRegist(email, nickname, password, passwordR);
    },
    _userRegist: function(email, nickname, password, passwordR) {
        if (UserAction.sendingRegist) { //防止重复发送
            return;
        }
        var url = StorMgr.siteUrl + "/register?ajax=1&callback=?",
            secCb = function(a) {
                if (0 != a.errCode * 1) {
                    toast(a.errStr);
                    UserAction.sendingRegist = false;
                    return;
                }
                toast('注册成功。', 0.6);
                setTimeout(function() {
                    UserAction.sendingRegist = false;
                    UserAction.sendLogin(nickname, password);
                }, 500);
            }, errCb = function(a) {
                if (0 != a.errCode * 1) {
                    toast(a.errStr);
                    UserAction.sendingRegist = false;
                    return;
                }
            };

        function checkReg() {
            if (0 == nickname.length) {
                throw {
                    msg: '请输入您的昵称'
                };
            }
            if (nickname.chineseLen() > 50) {
                throw {
                    msg: '昵称超过指定长度'
                };
            }
            if (/\s+/.test(nickname)) {
                throw {
                    msg: '昵称中不得使用空格'
                };
            }
            if (0 == email.length) {
                throw {
                    msg: '请输入您的邮箱地址'
                };
            }
            if (!regExpObj['email'].test(email)) {
                throw {
                    msg: '邮箱地址有误'
                };
            }
            if (/\s+/.test(nickname)) {
                throw {
                    msg: '昵称中不得使用空格'
                };
            }
            if (0 == password.trim().length) {
                throw {
                    msg: '请输入您的密码'
                };
            }
            if (password != passwordR) {
                throw {
                    msg: '两次密码不一致'
                };
            }
        }
        try {
            checkReg();
            var nickVal = encodeURIComponent(nickname),
                pwdVal = encodeURIComponent(password);
            url += "&nickname=" + nickVal + "&password=" + pwdVal + "&email=" + email;
            UserAction.sendingRegist = true;
            UserAction.sendAction(url, "", "get", secCb, errCb);
        } catch (e) {
            toast(e.msg);
        }
    },
    /*用户退出*/
    logOut: function() {
        Device.confirm('确定注销用户？', function() {
            UserTools.refresh();
            Mix.base.storage.clear('session');
            Mix.base.storage.clear();
            ViewMgr.init();
            Device.disetMenuBtn();
        }, null, null, '注销提示');
    },
    /*执行ajax请求*/
    sendAction: function(url, data, method, secCb, errCb) {
        var that = this,
            x = new Mix.x({
                method: method || 'get',
                dataType: 'json'
            });
        that.addLoading();
        x.onLoad = function() {
            that.removeLoading();
            var resp = x.response;
            if (resp.errCode && resp.errCode * 1 != 0) {
                errCb ? errCb(resp) : toast(resp.errStr);
                return;
            }
            try {
                secCb && secCb(resp);
            } catch (e) {}
        }
        x.onFail = function() {
            that.removeLoading();
            if (errCb && x.response) {
                errCb(x.response);
            } else {
                pageEngine.initPage('noNet');
            }
        }
        x.send(url, data);
        that.x = x;
        return x;
    },
    addLoading: function() {
        UserAction.LoadingCount = UserAction.LoadingCount || 0;
        UserAction.LoadingCount++;
        Mix.ui.loading.show($('#cont'), function() {
            UserAction.LoadingCount = 0;
            Mix.ui.loading.hide();
            toast('请求服务器超时。请检查网络或稍后再试。', 5);
        }, 10);
    },
    removeLoading: function(all) {
        UserAction.LoadingCount--;
        if (all || 0 >= UserAction.LoadingCount) {
            UserAction.LoadingCount = 0;
            Mix.ui.loading.hide();
        }
    }
}

/*涉及到应用的一些工具类*/
var UserTools = {
    /*清除缓存和一些记录的变量值,用户退出时需要*/
    refresh: function() {
        // Mix.base.storage.clear();//gps等信息
        Mix.base.storage.clear('session');
        StorMgr.destroy();

        UserTools.endPreLoad = true;
        if (UserTools.preLoadInter) {
            clearTimeout(UserTools.preLoadInter);
        }
    },
    getUrlVal: function(url, name) {
        var reg = new RegExp(name + '=([^&]+)');
        if (reg.exec(url)) {
            return reg.exec(url)[1];
        }
        return null;
    },
    /*从临时变量ViewMgr.tmpParams取参数值*/
    getParamVal: function(paramKey) {
        var value = "",
            params = ViewMgr.tmpParams.split('&');

        if (0 != params.length) {
            $.each(params, function(pa) {
                var rg = new RegExp(paramKey + "=(.*)");
                if (rg.test(pa)) {
                    value = rg.exec(pa)[1];
                }
            });
        }

        return value;
    },
    /*initArea弹出地区选择框*/
    initArea: function(cb, defProv, defCity) {
        if (StorMgr.gpsInfo && StorMgr.gpsInfo.prov && StorMgr.gpsInfo.city) {
            defProv = StorMgr.gpsInfo.prov;
            defCity = StorMgr.gpsInfo.city;
        }
        // if(Mix.map.searchProv){
        //     defProv=Mix.map.searchProv;
        //     defCity="";
        // }
        // if(Mix.map.searchCity){
        //     defCity=Mix.map.searchCity;
        // }
        function done(prov, city) {
            if (!prov) {
                toast('未选择地区', 2);
                return;
            }

            cb(prov, city);
        }
        var regObj = {
            useMask: true,
            onConfirm: function(prov, city) {
                done(prov, city);
            },
            onShow: function(regSel) {
                Device.backFunc.unshift(function() {
                    regSel.hide();
                });
            },
            hideEnd: function(regSel) {
                Device.backFunc.shift(0);
                if (Device.backFunc.length <= 0) {
                    Device.backFunc = [
                        function() {
                            ViewMgr.back();
                        }
                    ];
                }
            }
        };

        if (defProv) {
            regObj.prov = defProv;
        }
        if (defCity && !regExpObj['directCity'].test(defCity)) {
            regObj.city = defCity;
        }
        Mix.ui.region.show(regObj);
        return;
    },
    /*获得用户所在经纬度*/
    getGpsInfo: function(cb) {
        StorMgr.gpsInfo = Mix.base.storage.get("app_my_gpsInfo");
        // StorMgr.gpsInfo={};
        // StorMgr.gpsInfo.lat=31.233;
        // StorMgr.gpsInfo.lng=121.491;
        // StorMgr.gpsInfo.prov='上海';
        // StorMgr.gpsInfo.city='上海';
        Device.getLocation(
            function(lat, lng) {
                var gpsInfo = {
                    lat: lat,
                    lng: lng
                }
                StorMgr.gpsInfo = gpsInfo;
                Mix.base.storage.set("app_my_gpsInfo", gpsInfo);

                Mix.map.getProvCity(lng, lat, StorMgr.gpsInfo);

                if ($.isFunc(cb)) {
                    cb();
                }
            }
        );
    },
    /*检查容器是否应该滚动*/
    checkScroll: function(contSel, cb) {
        if (!$(contSel) || WIN['myScroll'] || !$(contSel + '>div')) {
            return;
        }
        if ($(contSel + '>div').offsetHeight > $(contSel).offsetHeight) {
            if (['login'].has(pageEngine.curPage)) {
                WIN['myScroll'] = new Mix.scroll(contSel, {
                    useTransform: false
                });
            } else {
                WIN['myScroll'] = new Mix.scroll(contSel);
            }
            cb && cb();
        }
    },
    /*处理textarea和input的残留*/
    fixHighlight: function() {
        DOC.activeElement.blur();
    },
    /*预加载资源图片*/
    preLoadResource: function(imgs, cb, hasProgress) {
        UserTools.endPreLoad = false;
        if (imgs.length <= 0) {
            cb && cb();
            return;
        }

        var loadDom = DOM.create('div', {
            style: {
                'position': 'absolute',
                'height': '0',
                'left': '10000em'
            }
        }),
            loadedNum = 0,
            totleNum = imgs.length,
            startT = Date.now(),
            finished = false;

        UserTools.preLoadInter = setTimeout(function() {
            finishLoad();
        }, 10000);

        BODY.appendChild(loadDom);
        UserAction.addLoading();

        if (hasProgress) {
            var progressDom = DOM.create('div', {
                className: 'ui_progress'
            }),
                progressInte = DOM.create('div', {
                    className: 'inner'
                }),
                proTxt = DOM.create('div', {
                    className: 'text'
                });

            progressDom.appendChild(progressInte);
            progressDom.appendChild(proTxt);
            BODY.appendChild(progressDom);
        }

        function oneLoad() {
            loadedNum++;
            if (hasProgress) {
                var p = Math.ceil(loadedNum * 100 / totleNum) + "%";
                proTxt.innerHTML = p;
                progressInte.style.width = p;
            }
            if (loadedNum >= totleNum) {
                if (hasProgress) {
                    progressDom.style.opacity = 0;
                }
                if (!UserTools.endPreLoad) {
                    cb && cb();
                }
                finishLoad();
            }
        }

        function finishLoad() {
            if (finished)
                return;
            clearTimeout(UserTools.preLoadInter);
            if (hasProgress) {
                BODY.removeChild(progressDom);
            }
            BODY.removeChild(loadDom);
            UserAction.removeLoading();
            finished = true;
        }

        $.each(imgs, function(imgUrl, idx) {
            var img = new Image();
            img.src = imgUrl;
            img.onload = function() {
                if (UserTools.endPreLoad) {
                    finishLoad();
                    return;
                }
                oneLoad();
            }
            loadDom.appendChild(img);
        });
    }
}

/*用到的菜单*/
    function UserMenus(name) {
        var menuOpt = {
            pos: "middle",
            onShow: function(UImenu) {
                Device.backFunc.unshift(function() {
                    UImenu.hide();
                });
            },
            hideEnd: function(UImenu) {
                Device.backFunc.shift(0);
                if (Device.backFunc.length <= 0) {
                    Device.backFunc = [
                        function() {
                            ViewMgr.back();
                        }
                    ];
                }
            }
        };

        switch (name) {
            case 'menuBtn':
                menuOpt.pos = "bottom";
                menuOpt.items = ['注销用户', '退出应用'];
                menuOpt.onSelect = function(idx) {
                    switch (idx * 1) {
                        case 0:
                            UserAction.logOut();
                            break;
                        case 1:
                            Device.exit();
                            break;
                    }
                };
                break;
        }
        Mix.ui.menu.show(menuOpt);
    }

    /*下拉刷新页面*/
    function refreshIScroll(pullDownEl, wrapperID, downAction) {
        function pullDownAction() {
            Feed.refresh();
        }
        var pullDownOffset = pullDownEl.offsetHeight;

        var myScroll = new Mix.scroll(wrapperID, {
            bounce: true,
            useTransform: false, //使用Transform的时候 在手机上点击地区选择的取消无效
            topOffset: pullDownOffset,
            onRefresh: function() {
                if (DOM.hasClass(pullDownEl, 'loading')) {
                    DOM.removeClass(pullDownEl, 'loading');
                    $('.pullDownLabel', pullDownEl).innerHTML = '下拉刷新页面...';
                }
            },
            onMove: function() {
                if (this.y > 5) {
                    $('.pullDownIcon') && ($('.pullDownIcon').style.webkitTransform = 'rotate(-180deg)');
                    $('.pullDownLabel', pullDownEl).innerHTML = '释放刷新页面...';
                    this.minScrollY = 0;
                } else if (this.y < 5) {
                    if ($('.pullDownIcon')) {
                        if ((this.y > -pullDownOffset / 2) && this.y <= 0) {
                            var roVal = -180 * (2 * this.y / pullDownOffset - 1);
                            $('.pullDownIcon').style.webkitTransform = 'rotate(' + roVal + 'deg)';
                        } else if (this.y < -pullDownOffset / 2) {
                            $('.pullDownIcon').style.webkitTransform = 'rotate(0deg)';
                        }
                    }

                    DOM.removeClass(pullDownEl, 'flip');
                    $('.pullDownLabel', pullDownEl).innerHTML = '下拉刷新页面...';
                    this.minScrollY = -pullDownOffset;
                }
            },
            onScrollEnd: function() {
                if ($('.pullDownLabel', pullDownEl).innerHTML == '释放刷新页面...') {
                    DOM.addClass(pullDownEl, 'loading');
                    $('.pullDownLabel', pullDownEl).innerHTML = '载入中...';
                    if ($.isFunc(downAction)) {
                        downAction();
                    } else {
                        pullDownAction();
                    }
                }
            }
        });
        setTimeout(function() {
            $('#cont').style.left = '0';
        }, 100);
        return myScroll;
    }