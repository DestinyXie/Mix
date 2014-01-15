/*单页面模式*/ ;
define(['action', 'tool', 'dom', 'device'], function(action, UserTools, dom, device) {
    //公共tmpl,减少代码量
    var headerBack = ['<b id="head">',
        '<b _click="ViewMgr.back()" class="btn_back"><i></i></b>'
    ].join('');

    var contTmpl = {
        'index': ['<b id="head">',
            '<h3>Mix JS</h3>',
            '</b>',
            '<b id="cont">',
            '<b class="con_item">',
            '<h3 class="welcome">Hi,here is MixJS.</h3>',
            '<i _click=\'ViewMgr.gotoPage("devTool");\'>设备功能</i>',
            '<i _click=\'ViewMgr.gotoPage("mixTool");\'>MixJS ui工具</i>',
            '</b>',
            '</b>'
        ].join(''),
        'devTool': ['${headerBack}',
            '<h3>Mix JS</h3>',
            '</b>',
            '<b id="cont">',
            '<b class="con_item">',
            '<i _click=\'Mix.ui.toast("加速计功能,需要真机");\'>加速计</i>',
            '<i _click=\'Mix.ui.toast("照相机功能,需要真机");\'>照相机</i>',
            '<i _click=\'Mix.ui.toast("未完待续");\'>等等</i>',
            '</b>',
            '</b>'
        ].join(''),
        'mixTool': ['${headerBack}',
            '<h3>Mix JS</h3>',
            '</b>',
            '<b id="cont">',
            '<b class="con_item">',
            '<i _click=\'UserMenus("menuBtn");\'>菜单</i>',
            '<i _click=\'UserTools.initArea(function(prov,city){Mix.ui.toast("你选择了:"+prov+city)});\'>地区选择</i>',
            '<i _click=\'Mix.ui.loading.show(null,function(){Mix.ui.loading.hide()},3)\'>加载中</i>',
            '<i _click=\'Mix.ui.toast("未完待续");\'>等等</i>',
            '</b>',
            '</b>'
        ].join('')
    };


    var footerTmple = {
        'main': ['<b id="foot">',
            '<i _click=\'ViewMgr.gotoPage("index");\' class="dom.${1}">i1</i>',
            '<i _click=\'ViewMgr.gotoPage("index");\' class="dom.${2}">i2</i>',
            '<i _click=\'ViewMgr.gotoPage("index");\' class="dom.${3}">i3</i>',
            '<i _click=\'ViewMgr.gotoPage("index");\' class="dom.${4}">i4</i>',
            '</b>'
        ].join('')
    };

    /*各个页面相关配置*/
    //[footerTmpl{string,boolean},
    // footerFocusIdx{number,boolean},
    // initEvent{function}],
    var pageConfig = {
        'index': [null, null,
            function() {}
        ],
        'devTool': [null, null,
            function() {}
        ],
        'mixTool': [null, null,
            function() {}
        ]
    }

    var PageEngine = function(options) {
        var that = this;

        that.destroy();
        that.options = {
            pageWrap: dom.$('#page'),
            animate: false //是否动画切换
        }

        Mix.base.extend(that.options, options);
    }

    PageEngine.prototype = {
        initUser: function() { //用户信息初始化
            var that = this;
            if (!/login/.test(that.curPage)) {
                if (that.hasUser) {
                    return;
                }
                that.hasUser = true;
            } else {
                that.hasUser = false;
            }
        },
        replacePubTmpl: function(tmplStr) { //替换公共tmpl
            var retStr = tmplStr;
            retStr = retStr.replace(/\$\{headerBack\}/, headerBack);
            return retStr;
        },
        compileTmpl: function() {
            var page = this.curPage,
                pcofig = pageConfig[page],
                ftTmpl = (pcofig[0]) ? footerTmple[pcofig[0]] : false,
                ftFocus = pcofig[1],
                htmlStr = contTmpl[page],
                ftStr = ftTmpl ? ftTmpl : "";

            //替换公共tmpl
            htmlStr = this.replacePubTmpl(htmlStr);

            if (ftFocus) {
                var fReg = new RegExp('\\dom.$\\{' + ftFocus + '\\}', 'g'),
                    aReg = new RegExp('\\dom.$\\{\\d+\\}', 'g');
                ftStr = ftStr.replace(fReg, 'select');
                ftStr = ftStr.replace(aReg, '');
            }
            return htmlStr + ftStr;
        },
        cancelPrePage: function() { //撤销前一个页面相关
            var that = this,
                delay = false;
            if (Mix.array.has(['test'], that.curPage)) {
                UserTools.fixHighlight();
                delay = true; //android input残影
            }

            if (that.checkHeight) {
                clearTimeout(that.checkHeight);
                that.checkHeight = null;
            }

            if (that.delayInter) {
                clearTimeout(that.delayInter);
                that.delayInter = null;
            }

            action.stop(); //撤销用户动作
            Mix.ui.tips.destroy(); //Tips
            device.destroy(); //撤销如上传等手机正在执行的动作
            Mix.obs.clear(); //取消对resize等的观察

            return delay;
        },
        initPage: function(page, diret) {
            var that = this,
                delay = false;

            delay = that.cancelPrePage();

            if (delay) {
                that.delayInter = setTimeout(function() {
                    that._initPage(page, diret);
                }, 200);
            } else {
                that._initPage(page, diret);
            }
        },
        _initPage: function(page, diret) {
            var that = this;
            that.prePage = that.curPage;
            that.curPage = page;

            // that.initUser();
            var tmplStr = that.compileTmpl(),
                wrap = that.options.pageWrap;

            if (that.options.animate && that.prePage != that.curPage) { //是否使用动画
                that.animate(diret, tmplStr);
            } else {
                wrap.innerHTML = "";
                wrap.innerHTML = tmplStr;
                that.fireEvent();
            }
        },
        animate: function(diret, tmplStr) { //动画切换，暂不使用
            if (dom.$('#fackWrap')) {
                dom.BODY.removeChild(dom.$('#fackWrap'));
            }
            var that = this,
                wrap = that.options.pageWrap,
                prePage = wrap.cloneNode(true);
            dom.BODY.appendChild(prePage);

            prePage.id = "fackWrap";
            wrap.innerHTML = tmplStr;
            if ('right' == diret) {
                wrap.style.left = "-" + wrap.offsetWidth + "px";
            } else {
                wrap.style.left = wrap.offsetWidth + "px";
            }
            that.fireEvent();
            dom.BODY.style[Mix.transitionProperty] = Mix.cssPrefix + "transform";
            dom.BODY.style[Mix.transitionDuration] = "300ms";

            setTimeout(function() {
                if ('right' == diret) {
                    dom.BODY.style[Mix.transform] = "translateX(" + wrap.offsetWidth + "px)";
                } else {
                    dom.BODY.style[Mix.transform] = "translateX(-" + wrap.offsetWidth + "px)";
                }
            }, 0);

            setTimeout(function() {
                wrap.style.left = "0";
                dom.BODY.style[Mix.transitionDuration] = "0";
                dom.BODY.style[Mix.transform] = "translateX(0)";
                prePage && dom.BODY.removeChild(prePage);
                delete prePage;
            }, 300);
        },
        fireEvent: function() {
            var that = this,
                page = that.curPage,
                pcofig = pageConfig[page],
                initFn = pageConfig[that.curPage][2];

            /*执行页面配置项中页面初始化代码*/
            if (Mix.base.isFunc(initFn)) {
                initFn.call(null);
            }

            that.initIScrollAndFeed();
        },
        /*执行iScroll和feed相关代码*/
        initIScrollAndFeed: function() {
            var that = this,
                feedOption = {
                    page: that.curPage,
                    cont: dom.$('.test_box'),
                    threeWrap: false,
                    onAppend: function(feed) {
                        that.checkcont();
                    },
                    cb: function() {
                        if (window['myScroll']) {
                            myScroll.refresh();
                        }
                    }
                }
            if (window['myScroll']) {
                myScroll.destroy();
                myScroll = null;
            }
            switch (that.curPage) {
                case 'test':
                    feedOption.autoLoad = true;
                    window['myScroll'] = refreshIScroll(dom.$('.pullDown'), '#cont');
                    Feed.init(feedOption);
                    that.scrollCb();
                    break;
                case 'test1':
                    feedOption.cb = function() {
                        if (dom.$('.test1')) {}
                        if (window['myScroll']) {
                            myScroll.refresh();
                        }
                    };
                    Feed.init(feedOption);
                    break;
            }

            if (feedOption.autoLoad && !window['myScroll']) {
                that.checkHeight = setTimeout(function() { //android画面残影
                    window['myScroll'] = new Mix.scroll('#cont');
                    that.scrollCb();
                }, 200);
            } else {
                that.checkcont();
                if (!Mix.array.has(['map'], that.curPage)) {
                    dom.addEvent(dom.$('#cont'), Mix.event.START_EV, function() {
                        that.checkcont();
                    });
                }
            }
        },
        checkcont: function() {
            var that = this;
            if (!window['myScroll']) {
                that.checkHeight = setTimeout(function() {
                    UserTools.checkScroll('#cont', that.scrollCb);
                }, 200);
            }
        },
        scrollCb: function() {
            if (myFeed && myFeed.autoLoad && myScroll && !myScroll.options.onMoveEnd) {
                myScroll.options.onMoveEnd = function(e) {
                    var scroll = this,
                        topY = myScroll.options.topOffset || 0;
                    if (scroll.y <= -topY && scroll.y <= scroll.maxScrollY) {
                        myFeed.loadMore();
                    }
                }
            }
        },
        display: function(dirc) {},
        destroy: function() {
            var that = this;
            // that.curPage='login';
            that.curPage = 'index';
            that.prePage = null;
            that.hasUser = false;
        }
    }
    window['PageEngine'] = PageEngine;
});