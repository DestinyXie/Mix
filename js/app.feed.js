define(function() {
    /*列表模板*/
    var feedTemplate = {
        'test': '<div>${content}</div>'
    };

    /*列表数据接口*/
    var pageFeedUrl = {
        'test': 'desmix.com/test'
    };

    /*列表类*/
    var Feed = function(options) {
        /*options项
         * page 页面名;
         * cont 容器DOM;
         * cb   数据加载完成回调函数;
         */
        var option = {
            index: 0,
            isLoading: false,
            isRefresh: false,
            dataCount: 0,
            totalPage: 0,
            isDestroyed: false,
            autoLoad: false,
            onAppend: false,
            addParam: null,
            noDataStr: '暂无数据',
            addMoreStr: '点击或向上拖动加载更多',
            noMoreStr: '没有更多了',
            addingMoreStr: '正在加载...'
        }
        this.destroy();
        extend(this, option, options);

        this.refresh();
    }

    Feed.init = function(options) {
        if (WIN['myFeed']) {
            myFeed.destroy();
        }
        WIN['myFeed'] = new Feed(options);

        /*订阅窗口resize*/
        Mix.obs.subscribe('resize', function() {
            myFeed.refreshSize();
        });
    }
    Feed.refresh = function(setParam) {
        if (!WIN['myFeed']) {
            return false;
        }
        WIN['myFeed'].refresh(setParam);
    }
    Feed.prototype = {
        reset: function() {
            var that = this;
            that.isRefresh = false;
            that.isLoading = false;
            if (typeof that.cb == "function") {
                that.cb();
            }
            if (that.autoLoad && that.noMoreStr != that.moreEl.innerHTML) {
                that.moreEl.innerHTML = that.addMoreStr;
            }
        },
        destroy: function() {
            var that = this;
            delete that.page;
            delete that.cont;
            delete that.onePageNum;
            delete that.cb;

            that.isDestroyed = true;
            if (that.loadXhr) {
                that.loadXhr.abort();
            }
            delete that.loadXhr;
        },
        refresh: function(setParam) {
            var that = this;
            if (that.isRefresh) {
                return;
            }
            if (that.beforeRefersh) {
                that.beforeRefersh();
            }
            that.index = 0;
            that.isRefresh = true;
            that.isLoading = false;
            if (that.loadXhr) {
                that.loadXhr.abort();
            }

            if (this.autoLoad) {
                this.moreEl = DOM.create('div', {
                    innerHTML: this.addMoreStr,
                    className: 'feed_more'
                });
                this.moreEl.setAttribute('_click', 'myFeed.loadMore()');
            }

            that.loadMore(setParam);
        },
        loadMoreSecc: function(a) {
            var that = this,
                lists;

            if (0 !== a.errCode * 1) {
                that.reset();
                toast(a.errStr);
                return;
            }

            that.index++;

            if (that.isRefresh) { //清除内容移至数据出来前
                that.cont.innerHTML = "";
            }

            that.dataCount = a.allcount || (a.list && a.list.length) || 0;
            that.totalPage = a.pagecount || 0;

            that.seccEnd(a);

            lists = a.list;
            that.fullFillFeed(lists);
        },
        seccEnd: function(a) { //成功后处理一些事情
        },
        loadMore: function(setParam) {
            var that = this;
            if (that.isLoading)
                return;
            that.isLoading = true;

            if (that.autoLoad) {
                that.moreEl.innerHTML = that.addingMoreStr;
            }

            if (!that.isRefresh && (typeof that.totalPage == "number") && that.index >= that.totalPage) {
                if (that.autoLoad) {
                    that.moreEl.innerHTML = that.noMoreStr;
                    that.moreEl.removeAttribute('_click');
                }
                that.reset();
                return false;
            }

            if (!setParam && that.addParam) {
                setParam = that.addParam;
            }

            var dataUrl = that.getUrl(),
                params = that.setParams(setParam);

            dataUrl = StorMgr.siteUrl + dataUrl;

            that.sendRequest(dataUrl, params);
        },
        sendRequest: function(dataUrl, params) {
            var that = this,
                secCb = function(a) {
                    that.loadMoreSecc(a);
                },
                errCb = function(m) {
                    that.reset();
                };

            that.loadXhr = UserAction.sendAction(dataUrl, params, "get", secCb, errCb);
        },
        getUrl: function() {
            var url = pageFeedUrl[this.page];
            return url + "&sid=" + StorMgr.sid;
        },
        setParams: function(setParam) {
            var that = this,
                params = "page=" + (that.index + 1);

            if (setParam) {
                params += "&" + setParam;
            }

            return params;
        },
        fullFillFeed: function(data) {
            var that = this;

            if (that.isRefresh && (!data || data.length == 0)) {
                that.cont.innerHTML = "<div style='color:#333;padding:1em;text-align:center'>" + that.noDataStr + "</div>";
                that.reset();
                return;
            } else {
                that.reset();
            }

            if (that.autoLoad && $('.feed_more')) {
                that.cont.removeChild(that.moreEl);
            }

            var len = data.length;
            if (!that.onePageNum)
                that.onePageNum = len;

            for (var i = 0; i < len; i++) {
                var item = DOM.create("div");
                item.innerHTML = that.compileTmpl(data[i], i);
                for (var j = 0, chiLen = item.children.length; j < chiLen; j++) {
                    that.cont.appendChild(item.firstElementChild);
                }
                delete item;
            }

            if (that.autoLoad) {
                that.cont.appendChild(that.moreEl);

                if (that.index >= that.totalPage) {
                    that.moreEl.innerHTML = that.noMoreStr;
                    that.moreEl.removeAttribute('_click');
                }
            }

            if (that.onAppend) {
                that.onAppend.call(that);
            }
        },
        refreshSize: function() {
            var that = this,
                wrapW = that.cont.offsetWidth;
        },
        compileTmpl: function(data, i) {
            var that = this,
                tmpl = feedTemplate[that.page],
                idx = (that.onePageNum * (that.index - 1)) + i + 1,
                tmplStr = "";

            switch (that.page) {
                case "test":
                    tmplStr = Mix.base.compiTpl(tmpl, data, function(o, t) {}, idx);
                    break;
                default:
                    tmplStr = Mix.base.compiTpl(tmpl, data, null, idx);
            }
            return tmplStr;
        }
    };
    return window["Feed"] = Feed;
});