/*页面初始化*/
define(['tool', 'stor', 'view'], function(UserTools, StorMgr, ViewMgr) {
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
    };

    /*记录常用正则*/
    var regExpObj = {
        email: /^.+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
        directCity: /北京|上海|重庆|天津|香港|澳门/,
        noLngLatCity: /马鞍山|朝阳|白沙|保亭|昌江|陵水|五指山|乐东|平顶山|临沧|普洱|双鸭山/
    };

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
    
    window['regExpObj'] = regExpObj;
    window['UserMenus'] = UserMenus;
    window['refreshIScroll'] = refreshIScroll;

    return App;
});