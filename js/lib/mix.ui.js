define(['dom', 'device'], function(dom, device) {
    /**UI工具类**/
    UI = {};

    /*tips提示类*/
    UI.tips = {
        destroy: function() {
            var that = this;

            if (that.hasTip) {
                that.container.removeChild(that.tipDom);
                delete that.hasTip;
                delete that.container;
                delete that.tipDom;
            }
            that.reset();
        },
        reset: function() {
            var that = this;
            that.option = {
                msg: '',
                contSel: 'body',
                pos: 'bottom',
                tipH: 0,
                hideT: 5000
            };
            if (that.timer) {
                clearTimeout(that.timer);
                delete that.timer;
            }
        },
        show: function(cusOpt) {
            var that = this;
            that.reset(); !! cusOpt && Mix.base.extend(that.option, cusOpt);

            if (!that.option.msg) {
                return;
            }

            if (!that.hasTip) {
                that.tipDom = dom.create('b', {
                    className: 'tipsShow'
                });
                that.container = dom.$(that.option.contSel) || dom.BODY;
                that.container.appendChild(that.tipDom);
                that.hasTip = true;
                dom.addEvent(that.tipDom, Mix.event.CLICK_EV, function() {
                    if ('middle' != that.option.pos) {
                        that.hide();
                    }
                });
            }

            if ('middle' == that.option.pos) {
                dom.addClass(that.tipDom, 'middle');
            } else {
                dom.removeClass(that.tipDom, 'middle');
            }

            that.tipDom.innerHTML = that.option.msg;
            that.tipDom.style.display = "block";
            that.option.tipH = that.tipDom.offsetHeight; //intresting set

            if ('middle' != that.option.pos) {
                setTimeout(function() {
                    that.tipDom && (that.tipDom.style.bottom = "0px");
                }, 0);
            } else {
                that.tipDom.style.bottom = "auto";
            }

            if (that.option.hideT) {
                that.timer = setTimeout(function() {
                    that.hide();
                }, that.option.hideT);
            }
        },
        hide: function() {
            var that = this;
            try {
                if ('middle' != that.option.pos) {
                    that.tipDom.style.bottom = "-" + that.option.tipH + "px";
                }
                that.reset();
                that.timer = setTimeout(function() {
                    delete that.timer;
                    that.tipDom.style.display = "none";
                }, 600);
            } catch (e) {
                Mix.base.logErr(e, 'UI.tips.hide');
            }
        }
    };


    /*背景遮罩*/
    UI.mask = function(opts) {
        this.show(opts);
        return this;
    };

    UI.mask.prototype = {
        /*option{cont}*/
        show: function() {
            var that = this,
                option = { //default config
                    cont: 'body',
                    maskClickCb: null //点击背景遮罩方法
                };
            if (arguments.length > 0) {
                Mix.base.extend(option, arguments[0]);
            }

            that.container = dom.$(option.cont),
            that.maskDom = dom.create('b', {
                className: 'pageMask'
            });
            that.container.appendChild(that.maskDom);

            if (option.maskClickCb) {
                dom.addEvent(that.maskDom, Mix.event.CLICK_EV, option.maskClickCb);
            }
        },
        hide: function() {
            var that = this;
            that.container.removeChild(that.maskDom);
            delete that.maskDom;
            delete that.container;
        }
    };

    /*loading*/
    UI.loading = {
        show: function(cont, timeoutFn, timeoutTime, type) {
            var that = this,
                cont = cont || dom.BODY,
                loadingDom;


            if (timeoutFn) {
                timeoutTime = timeoutTime || 15;
                if (that.outInter) {
                    clearTimeout(that.outInter);
                }
                that.outInter = setTimeout(timeoutFn, timeoutTime * 1000);
            }

            if (dom.$('#ui_load')) {
                dom.remove(dom.$('#ui_load'));
            }
            if (type && 'word' == type) {
                loadingDom = dom.create('b', {
                    id: 'ui_load',
                    innerHTML: '<b>L</b><b>O</b><b>A</b><b>D</b><b>I</b><b>N</b><b>G</b>'
                });
            } else {
                loadingDom = dom.create('b', {
                    id: 'ui_load',
                    className: 'ui_load_circle'
                });
            }
            cont.appendChild(loadingDom);
        },
        hide: function() {
            var that = this;
            dom.$('#ui_load') && dom.remove(dom.$('#ui_load'));
            if (that.outInter) {
                clearTimeout(that.outInter);
                that.outInter = null;
            }
        }
    };

    /*@private所有弹出层的公共类*/
    UI.popLayer = {
        className: 'popLayer', //当前UI工具类名
        domStr: ['<b class="">',
            '</b>'
        ],
        reset: function() {
            var that = this;
            that.option = {
                domId: 'layerSel', //弹出层DOM id
                domCls: 'layerSelWrap', //弹出层DOM class
                title: false, //是否有标题
                hasConfirm: false, //是否有确认按钮
                useMask: true, //是否显示背景遮罩
                clickMaskHide: true, //是否点击背景遮罩隐藏
                canScroll: false, //弹出层内容是否可以滚动
                contSel: 'body', //没有遮罩时，弹出层显示的容器选择器
                onShow: null, //params:this{object}
                hideEnd: null //params:void
            }
            delete that.layerDom;
            delete that.container;
            if (that.scroller) {
                that.scroller.destroy();
                delete that.scroller;
            }

            if (that.token) {
                Mix.obs.unsubscribe(that.token);
                that.token = null;
            }

            that.subReset && that.subReset(); //执行子类的reset方法
        },
        show: function(cusOpt) {
            var that = this;
            var domStrArr = Mix.array.clone(that.domStr);
            that.reset();

            !! cusOpt && Mix.base.extend(that.option, cusOpt);

            that.preShow && that.preShow(); //执行子类的preShow方法

            if (dom.$("#" + that.option.domId)) {
                dom.$("#" + that.option.domId).parentNode.removeChild(dom.$("#" + that.option.domId));
                that.option.useMask && that.mask.hide();
                that.option.hideEnd && that.option.hideEnd.call(null);
            }
            if (that.option.title) {
                domStrArr.push('<h3 class="pop_title">',
                    that.option.title,
                    '</h3>');
            }
            if ('popLayer' != that.className && that.option.hasConfirm) {
                domStrArr.push('<b class="pop_confirm clear">',
                    '<a class="confirm" _click="UI.' + that.className + '.confirm()">确认</a>',
                    '<a class="cancel" _click="UI.' + that.className + '.cancel()">取消</a>',
                    '</b>');
            }

            that.option.onShow && that.option.onShow.call(null, that);
            that.layerDom = dom.create('b', {
                id: that.option.domId,
                className: that.option.domCls
            });
            dom.addClass(that.layerDom, 'pop_layer'); //公用类
            that.layerDom.innerHTML = domStrArr.join('');

            if (that.option.useMask) {
                var maskOpt = {};
                if (that.option.clickMaskHide) {
                    maskOpt = {
                        maskClickCb: function(ev) {
                            if (ev.target == that.mask.maskDom) {
                                that.hide();
                                that.option.onCancel && that.option.onCancel();
                            }
                        }
                    }
                }
                that.mask = new UI.mask(maskOpt);
                that.container = that.mask.maskDom;

            } else {
                that.container = dom.$(that.option.contSel);
            }

            that.layerDom.style.display = 'none'; //减少repaint/reflow

            that.container.appendChild(that.layerDom);

            that.subShow && that.subShow(); //执行子类的show方法

            that.layerDom.style.display = 'block';

            var scrollOpt = {
                vScrollbar: true
            };
            if (that.option.title) {
                var offsetTop = dom.$('.pop_title', that.layerDom).offsetHeight;
                scrollOpt.topOffset = -offsetTop;
                dom.$('b', that.layerDom).style.paddingTop = offsetTop + "px";
            }


            if (that.option.canScroll) {
                that.scroller = new Mix.scroll(that.option.domId, scrollOpt);
                var scrT = dom.create('b', {
                    className: 'pop_scr_top'
                });
                var scrB = dom.create('b', {
                    className: 'pop_scr_btm'
                });
                that.layerDom.appendChild(scrT);
                that.layerDom.appendChild(scrB);
            }

            if (that.setSizePos) {
                that.token = Mix.obs.subscribe('resize', function() {
                    that.setSizePos();
                });
            }
        },
        hide: function() {
            var that = this;
            that.container.removeChild(that.layerDom);
            that.option.useMask && that.mask.hide();
            that.option.hideEnd && that.option.hideEnd.call(null);
            that.subHide && that.subHide(); //执行子类的hide方法
        }
    }

    /*菜单类*/
    UI.menu = Mix.base.extend({}, UI.popLayer, {
        className: 'menu',
        domStr: [
            '<b class="">',
            '</b>'
        ],
        subReset: function() {
            var that = this,
                option = {
                    domId: 'menuSel', //选择框DOM id
                    domCls: 'menuLayer', //选择框DOM class
                    pos: 'bottom', //菜单的位置(bottom,middle,top)
                    useMask: true,
                    items: [], //菜单项
                    direct: 'horizon' //菜单项排列方向horizon,vertical
                }
            delete that.ancEl;
            Mix.base.extend(that.option, option);
        },
        preShow: function() {
            if (dom.$('#selectSel')) { //如果有选择框在页面上，弹出其它框前先去掉选择框
                UI.select.hide();
            }
        },
        subShow: function() {
            var that = this,
                opts = that.option,
                itemsStr = [];
            if (opts.items.length < 1) {
                return;
            }

            Mix.base.each(that.option.items, function(item, idx) {
                itemsStr.unshift('<i _click="UI.menu.select(this,' + idx + ')">' + item + '</i>');
            });
            dom.$('b', that.layerDom).innerHTML = itemsStr.join('');

            that.setSizePos();
        },
        setSizePos: function() {
            try {
                var that = this,
                    opts = that.option,
                    vertiDire = ('vertical' == that.option.direct),
                    itemWidth,
                    contW = dom.getSize(that.container)[0],
                    contH = dom.getSize(that.container)[1],
                    layerDom = that.layerDom,
                    itemsDom = dom.$$('i', that.layerDom),
                    itemLen = opts.items.length,
                    //相对中间的那个选项在宽度无法均分时设置其宽度相对最大
                    midItemIdx = Math.ceil(itemLen / 2),
                    perItemW;

                dom.addClass(that.layerDom, opts['pos']);
                if (vertiDire) {
                    dom.addClass(that.layerDom, 'vertiDirect');
                }

                if (!vertiDire) {
                    perItemW = Math.floor(contW / itemLen);
                    Mix.base.each(itemsDom, function(item, idx) {
                        item.style.width = perItemW + "px";
                    });
                    itemsDom[midItemIdx].style.width = (contW - perItemW * (itemLen - 1)) + "px";
                }

                layerDom.style.display = "block";

                if (dom.$('i', layerDom).offsetHeight > layerDom.offsetHeight) {
                    layerDom.style.height = contH + "px";
                    that.option.canScroll = true;
                }
            } catch (e) {
                Mix.base.logErr(e, 'UI.menu.setSizePos');
            }
        },
        select: function(item, idx) {
            var that = this;
            that.hide();
            that.option.onSelect && that.option.onSelect(idx);
        }
    });

    /*地区选择(extend UI.popLayer)*/
    UI.region = Mix.base.extend({}, UI.popLayer, {
        className: 'region',
        domStr: ['<b class="selectWrap clear">',
            '<i class="provSel" _click="UI.region.chooseProv()">',
            '</i>',
            '<i class="citySel" _click="UI.region.chooseCity()">',
            '</i>',
            '</b>'
        ],
        subReset: function() { //重置地区选择对象和option值
            var that = this,
                option = {
                    prov: "", //省份
                    city: "", //城市
                    domId: 'regionSel', //选择框DOM id
                    domCls: 'regionLayer', //选择框DOM class
                    hasConfirm: true,
                    provProm: '选择省份', //省份选择提示
                    cityProm: '选择城市', //城市选择提示
                    clickMaskHide: false,
                    onConfirm: null, //params:option.prov{string},option.city{string}
                    onCancel: null //params:this{object}
                }
            Mix.base.extend(that.option, option);
            if (dom.$("#selectSel")) {
                UI.select.hide();
            }
            delete that.provSel;
            delete that.citySel;
        },
        subShow: function() {
            var that = this;

            that.provSel = dom.$('.provSel', that.layerDom);
            that.citySel = dom.$('.citySel', that.layerDom);
            that.provSel.innerHTML = that.option.prov || that.option.provProm;
            that.citySel.innerHTML = that.option.city || that.option.cityProm;
        },
        chooseProv: function() {
            var that = this;
            var provs = Mix.array.clone(Mix.regions.provinces);

            provs = Mix.array.remove(provs, '台湾', '海外'); //暂时
            function checkProv(selOpts) {
                that.provSel.innerHTML = selOpts[0];
                that.citySel.innerHTML = that.option.cityProm;
                if (that.option.provProm == selOpts[0]) {
                    that.option.prov = "";
                } else {
                    that.option.prov = selOpts[0];
                }

                that.option.city = "";
            }
            UI.select.show({
                useMask: false,
                options: provs,
                defOptions: [that.option.prov || that.option.provProm],
                onConfirm: checkProv,
                onShow: function(UIselect) {
                    device.backFunc.unshift(function() {
                        UIselect.hide();
                    });
                },
                hideEnd: function(UIselect) {
                    device.backFunc.shift(0);
                    if (device.backFunc.length <= 0) {
                        device.backFunc = [
                            function() {
                                ViewMgr.back();
                            }
                        ];
                    }
                }
            });
        },
        chooseCity: function() {
            var that = this;

            function checkCity(selOpts) {
                that.citySel.innerHTML = selOpts[0];
                if (that.option.cityProm == selOpts[0]) {
                    that.option.city = "";
                } else {
                    that.option.city = selOpts[0];
                }
            }
            if (!that.option.prov) {
                UI.toast("需先选择省份");
                return;
            }
            UI.select.show({
                useMask: false,
                options: Mix.regions.getCity(that.option.prov) || [],
                defOptions: [that.option.city || that.option.cityProm],
                onConfirm: checkCity,
                onShow: function(UIselect) {
                    device.backFunc.unshift(function() {
                        UIselect.hide();
                    });
                },
                hideEnd: function(UIselect) {
                    device.backFunc.shift(0);
                    if (device.backFunc.length <= 0) {
                        device.backFunc = [
                            function() {
                                ViewMgr.back();
                            }
                        ];
                    }
                }
            });
        },
        confirm: function() {
            var that = this;
            that.hide();
            that.option.onConfirm && that.option.onConfirm(that.option.prov, that.option.city);
        },
        cancel: function() {
            var that = this;
            that.hide();
            that.option.onCancel && that.option.onCancel();
        }
    });

    /*单选、多选框(extend UI.popLayer)*/
    UI.select = Mix.base.extend({}, UI.popLayer, {
        className: 'select',
        domStr: ['<b class="scroller"><b class="optWrap"></b></b>'],
        subReset: function() {
            var that = this,
                option = {
                    domId: 'selectSel', //选择框DOM id
                    domCls: 'selectLayer', //选择框DOM class
                    hasConfirm: false,
                    options: [], //选项集合
                    defOptions: [], //默认选项集合
                    selOptions: [], //选中项集合
                    multi: false, //是否为多选
                    canScroll: true //可以滚动
                }
            Mix.base.extend(that.option, option);
        },
        preShow: function() {
            if (this.option.multi) {
                this.option.hasConfirm = true;
            }
        },
        subShow: function() {
            var that = this,
                optStr = [];
            if (that.option.options.length === 0) {
                UI.toast('没有可供选择的项目');
                return;
            }
            if (that.option.multi) {
                dom.addClass(that.layerDom, "multiSelect");
            }
            if (that.option.defOptions) {
                that.option.selOptions = that.option.defOptions;
            }
            Mix.base.each(that.option.options, function(opt, idx) {
                var clsStr = '';
                if (that.option.defOptions && Mix.array.has(that.option.defOptions, opt)) {
                    clsStr = ' class="selected"';
                }
                optStr.unshift('<i' + clsStr + ' _click="UI.select.select(this,' + idx + ')">' + opt + '</i>');
            });
            dom.$('.optWrap', that.layerDom).innerHTML = optStr.join('');

            that.layerDom.style.display = 'block';

            if (that.layerDom.offsetHeight - dom.BODYFS * .5 >= dom.$('.optWrap', that.layerDom).offsetHeight) {
                that.option.canScroll = false;
            }

        },
        select: function(item, idx) {
            var that = this,
                selVal = that.option.options[idx];

            if (!that.option.multi) {
                dom.removeClass(dom.$$('.optWrap i', that.layerDom), 'selected');
                this.option.selOptions = [selVal];
                that.confirm();
            } else {
                if (!Mix.array.has(this.option.selOptions, selVal)) {
                    dom.addClass(item, 'selected');
                    this.option.selOptions.push(selVal);
                } else {
                    dom.removeClass(item, 'selected');
                    Mix.array.remove(this.option.selOptions, selVal);
                }
            }
        },
        confirm: function() {
            var that = this,
                check = that.option.onConfirm && that.option.onConfirm(that.option.selOptions);

            (check || !that.option.multi) && that.hide();
        },
        cancel: function() {
            var that = this;
            that.hide();
            that.option.onCancel && that.option.onCancel();
        }
    });

    /*原生提示信息，默认2,3秒消失*/
    UI.toast = function(s, t) {
        if (device.isMobi()) {
            if (!device.toast(s, t)) {
                UI.tips.show({
                    msg: s,
                    pos: 'middle',
                    contSel: "#page",
                    hideT: t * 1000 || 3000
                });
            }
        } else {
            UI.tips.show({
                msg: s,
                contSel: "#page",
                hideT: t * 1000 || 3000
            });
        }
    }

    return Mix.ui = UI;
});