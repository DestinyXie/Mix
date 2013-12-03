/*页面初始化*/
define(['tool', 'stor', 'view', 'ui', 'dom'], function(UserTools, StorMgr, ViewMgr, ui, dom) {
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
                    dom.$('.pullDownLabel', pullDownEl).innerHTML = '下拉刷新页面...';
                }
            },
            onMove: function() {
                if (this.y > 5) {
                    dom.$('.pullDownIcon') && (dom.$('.pullDownIcon').style.webkitTransform = 'rotate(-180deg)');
                    dom.$('.pullDownLabel', pullDownEl).innerHTML = '释放刷新页面...';
                    this.minScrollY = 0;
                } else if (this.y < 5) {
                    if (dom.$('.pullDownIcon')) {
                        if ((this.y > -pullDownOffset / 2) && this.y <= 0) {
                            var roVal = -180 * (2 * this.y / pullDownOffset - 1);
                            dom.$('.pullDownIcon').style.webkitTransform = 'rotate(' + roVal + 'deg)';
                        } else if (this.y < -pullDownOffset / 2) {
                            dom.$('.pullDownIcon').style.webkitTransform = 'rotate(0deg)';
                        }
                    }

                    DOM.removeClass(pullDownEl, 'flip');
                    dom.$('.pullDownLabel', pullDownEl).innerHTML = '下拉刷新页面...';
                    this.minScrollY = -pullDownOffset;
                }
            },
            onScrollEnd: function() {
                if (dom.$('.pullDownLabel', pullDownEl).innerHTML == '释放刷新页面...') {
                    DOM.addClass(pullDownEl, 'loading');
                    dom.$('.pullDownLabel', pullDownEl).innerHTML = '载入中...';
                    if (dom.$.isFunc(downAction)) {
                        downAction();
                    } else {
                        pullDownAction();
                    }
                }
            }
        });
        setTimeout(function() {
            dom.$('#cont').style.left = '0';
        }, 100);
        return myScroll;
    }
    
    window['regExpObj'] = regExpObj;
    window['UserMenus'] = UserMenus;
    window['refreshIScroll'] = refreshIScroll;
});