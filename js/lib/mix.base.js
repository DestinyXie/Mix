define(['dom'], function(dom) {
    /*库名称,抛出的唯一全局变量*/
    var Mix = {
        /*Browser capabilities*/
        isAndroid: (/android/gi).test(navigator.appVersion),
        isIDevice: (/iphone|ipad/gi).test(navigator.appVersion)
    };

    var DOC = document;
    var WIN = window;

    function prefix(style) {
        if (vender === '') return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vender + style;
    }

    var dummyStyle = dom.create('div').style;
    var vender = (function() {
        var vendors = 't,webkitT,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = vendors.length;

        for (; i < l; i++) {
            t = vendors[i] + 'ransform';
            if (t in dummyStyle) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })();

    Mix.cssPrefix = vender ? '-' + vender.toLowerCase() + '-' : '';

    // Style properties//e.g webkit
    Mix.transform = prefix('transform'); //webkitTransform下同
    Mix.transformOrigin = prefix('transformOrigin');
    Mix.transitionProperty = prefix('transitionProperty');
    Mix.transitionDuration = prefix('transitionDuration');
    Mix.transitionTimingFunction = prefix('transitionTimingFunction');
    Mix.transitionDelay = prefix('transitionDelay');

    Mix.has3d = prefix('perspective') in dummyStyle;
    Mix.hasTouch = 'ontouchstart' in WIN;
    Mix.hasTransform = !! vender;
    Mix.hasTransitionEnd = prefix('transition') in dummyStyle;

    /* CSS3 transitions和animations的优势在于浏览器知道哪些动画将会发生，
     * 所以得到正确的间隔来刷新UI
     * 如果不使用transition或animation做动画
     * 浏览器的(prefix)requestAnimationFrame属性能使动画更流畅
     * (prefix)requestAnimationFrame接受一个参数，是一个屏幕重绘前被调用的函数
     */
    Mix.nextFrame = (function() {
        return WIN.requestAnimationFrame ||
            WIN[vender + 'RequestAnimationFrame'] ||
            function(callback) {
                return setTimeout(callback, 1000 / 60);
        };
    })();
    Mix.cancelFrame = (function() {
        return WIN.cancelRequestAnimationFrame ||
            WIN.webkitCancelAnimationFrame ||
            WIN[vender + 'CancelRequestAnimationFrame'] ||
            clearTimeout;
    })();
    Mix.cssVender = vender;
    dummyStyle = null;
    vender = null;

    /*事件对象*/
    Mix.event = {
        START_EV: Mix.hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV: Mix.hasTouch ? 'touchmove' : 'mousemove',
        END_EV: Mix.hasTouch ? 'touchend' : 'mouseup',
        CLICK_EV: Mix.hasTouch ? 'touchend' : 'click',
        CANCEL_EV: Mix.hasTouch ? 'touchcancel' : 'mouseup',
        WHEEL_EV: Mix.cssVender == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',
        //对webapp来说直接使用window的resize比onorientationchange效果更好
        RESIZE_EV: 'resize'
    };
    Mix.event.TRNEND_EV = (function() {
        if (Mix.cssVender === false) return false;

        var transitionEnd = {
            '': 'transitionend',
            'webkit': 'webkitTransitionEnd',
            'Moz': 'transitionend',
            'O': 'otransitionend',
            'ms': 'MSTransitionEnd'
        };

        return transitionEnd[Mix.cssVender];
    })();
    
    /*扩展事件中的默认Event对象*/
    Mix.event.Event = function(e) {
        if (!e) {
            return null;
        }

        if (e.stop) {
            return e;
        }

        this.event = e;
        var changedTouches = e.changedTouches;
        var ee = (changedTouches && changedTouches.length > 0) ? changedTouches[0] : e;
        for (var att = ['pageX', 'pageY', 'target'], l = att.length; l--;) {
            this[att[l]] = ee[att[l]];
        }
    };
    Mix.event.Event.prototype = {
        /*阻止事件传递*/
        stop: function() {
            if (e = this.event) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        /*返回当前事件的DOM对象集合*/
        getTargets: function(selector) {
            var els = [],
                target = this.target;
            if (!Mix.array.has([dom.DOC, dom.BODY], target)) {
                els = dom.findParent(target, selector);
                if (1 == target.nodeType) {
                    els.unshift(target);
                }
            }
            return els;
        }
    };

    // Helpers 3d更高效么?
    Mix.translateZ = Mix.has3d ? ' translateZ(0)' : '';

    /*基本的一些工具类*/
    var toStr = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    Mix.base = {
        each: function(obj, callback) {
            if (!obj || !callback) {
                return;
            }
            if (obj.nodeType)
                obj = [obj];
            for (var i = obj.length; i--;) {
                callback(obj[i], i);
            }
        },
        isFunc: function(obj) {
            /*window.toString.call(function)会返回[object Object]*/
            return toStr.call(obj) === "[object Function]";
        },
        isStr: function(obj) {
            return toStr.call(obj) === "[object String]";
        },
        isArray: function(obj) {
            return toStr.call(obj) === "[object Array]";
        },
        isPlainObject: function(obj) {
            if (!obj || toStr.call(obj) !== "[object Object]" ||
                obj.nodeType || obj.setInterval) {
                return false;
            }

            try {
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key);
        },
        /*扩展一个Object对象(s或o为实例化的对象时不能使用该方法)*/
        extend: function(d, s, o) {
            var k;
            if (o) {
                for (k in s) {
                    if (hasOwn.call(o, k)) continue;
                    if (hasOwn.call(s, k)) {
                        d[k] = (typeof(s[k]) == 'object' && s[k] !== null && !(s[k].nodeType) && !(s[k] instanceof Array)) ? this.extend({}, s[k]) : s[k];
                    }
                }
                d = this.extend(d, o);
            } else {
                for (k in s) {
                    if (hasOwn.call(s, k)) {
                        d[k] = (typeof(s[k]) == 'object' && s[k] !== null && !(s[k].nodeType) && !(s[k] instanceof Array)) ? this.extend({}, s[k]) : s[k];
                    }
                }
            }
            return d;
        },
        /*比较两个对象是否一样,除了except数组中的对象属性*/
        sameObj: function(obj1, obj2, except) {
            if (!obj1 || !obj2 || JSON.stringify(obj1).length != JSON.stringify(obj2).length) {
                return false;
            }
            for (var k in obj1) {
                if (hasOwn.call(obj1, k)) {
                    if (JSON.stringify(obj1[k]) != JSON.stringify(obj2[k])) {
                        if (except && Mix.array.has(except, k)) {
                            continue;
                        }
                        return false;
                    }
                }
            }
            return true;
        },
        /*计算直角边*/
        calculPy: function(l, w) {
            return Math.sqrt(Math.pow(l, 2) + Math.pow(w, 2));
        },
        /*在当前对象光标处插入指定的内容*/
        insertAtCaret: function(ipt, textFeildValue) {
            var textObj = (ipt.nodeType == 1) ? ipt : $(ipt);
            if (textObj.setSelectionRange) {
                var rangeStart = textObj.selectionStart,
                    rangeEnd = textObj.selectionEnd,
                    tempStr1 = textObj.value.substring(0, rangeStart),
                    tempStr2 = textObj.value.substring(rangeEnd);
                textObj.value = tempStr1 + textFeildValue + tempStr2;
                textObj.focus();
                var len = textFeildValue.length;
                textObj.setSelectionRange(rangeStart + len, rangeStart + len);
                textObj.focus();
            } else if (document.all && textObj.createTextRange && textObj.caretPos) {
                var caretPos = textObj.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ?
                    textFeildValue + '' : textFeildValue;
            } else {
                textObj.value += textFeildValue;
            }
        },
        /*使用cookie*/
        cookie: function(name, value, expiredays) {
            var dc = document.cookie,
                cs, ce;
            if (value === null || value == "") {
                var exdate = new Date(),
                    cv = Mix.base.cookie(name);
                exdate.setTime(Date.now() - 1);
                if (cv)
                    document.cookie = name + "=" + escape(cv) + ";expires=" + exdate.toGMTString();
                return false;
            }
            if (arguments.length > 1) {
                var exdate = new Date(),
                    days = expiredays || 3000;
                exdate.setTime(Date.now() + days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
            } else {
                if (dc.length > 0) {
                    cs = dc.indexOf(name + "=");
                    if (cs != "-1") {
                        cs += name.length + 1;
                        ce = dc.indexOf(";", cs);
                        if (ce == -1)
                            ce = dc.length;
                        return unescape(dc.substring(cs, ce));
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        },
        /*使用cookie模拟localStorage或sessionStorage的存储接口*/
        cookieStor: {
            getItem: function(name) {
                return Mix.base.cookie(name);
            },
            setItem: function(name, value) {
                Mix.base.cookie(name, value);
            },
            removeItem: function(name) {
                Mix.base.cookie(name, null);
            },
            clear: function() { //待实现
                var dc = document.cookie,
                    items, name;
                if (dc.length > 0) {
                    items = dc.split(';');
                    if (items.length == 0) {
                        return;
                    }
                    for (var i = items.length - 1; i >= 0; i--) {
                        name = items[i].split('=')[0];
                        Mix.base.cookieStor.removeItem(name);
                    }
                }
            }
        },
        /*本地存储*/
        storage: (function() {
            function getStorScope(scope) {
                if (scope && (scope == "session"))
                    return sessionStorage || Mix.base.cookieStor;
                return localStorage || Mix.base.cookieStor;
            }
            return {
                get: function(key, scope) {
                    var value = getStorScope(scope).getItem(key);
                    return (/^(\{|\[).*(\}|\])$/).test(value) ? JSON.parse(value) : value;
                },
                set: function(key, value, scope) {
                    var serializable = Mix.base.isArray(value) || Mix.base.isPlainObject(value),
                        storeValue = serializable ? JSON.stringify(value) : value;
                    getStorScope(scope).setItem(key, storeValue);
                },
                remove: function(key, scope) {
                    getStorScope(scope).removeItem(key);
                },
                clear: function(scope) {
                    getStorScope(scope).clear();
                }
            };
        })(),
        /*转换字符串中的html特殊字符串*/
        htmlEncode: function(str) {
            if (str) {
                return str.replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#034;');
            } else {
                return str;
            }
        },
        /*反转换字符串中的html特殊字符串*/
        htmlDecode: function(str) {
            if (str) {
                return str.replace(/&#034;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            } else {
                return str;
            }
        },
        /*转换对象中字符串属性的html特殊字符串*/
        htmlEncodeObj: function(obj) {
            for (key in obj) {
                if (hasOwn.call(obj, key) && (typeof obj[key] == "string")) {
                    obj[key] = Mix.base.htmlEncode(obj[key]);
                }
            }
            return obj;
        },
        /*将数据加入模板生成html*/
        compiTpl: function(tpl, data, cb, idx) {
            /*简易模板实现(改自zy_tmpl.js)*/
            return tpl.replace(/\$\{([^\}]*)\}/g, function(m, c) {
                if (c.match(/index:/)) {
                    return idx;
                }
                if (c.match(/cb:/) && cb) {
                    return cb(data, c.match(/cb:(.*)/));
                }

                var arr = c.split('.');
                var ret = data;
                for (var i = 0, len = arr.length; i < len; i++) {
                    ret = ret[arr[i]];
                }
                if (0 == ret * 1) {
                    return 0;
                }

                return ret || "";
            });
        },
        /*错误log*/
        logErr: function(err, fnName, useAlert) {
            var useAlert = !! useAlert,
                errType = err.name || 'undefined',
                errMsg = err.message || 'undefined',
                logStr = "error_type: " + errType + "\nerror_message: " + errMsg +
                    "\nerror_function: " + fnName;

            if (useAlert) {
                alert(logStr);
            } else {
                console.log(logStr);
            }
        }
    };

    /*数组工具*/
    Mix.array = {
        /*判断数组中是否包含指定的值*/
        has: function(arr, value) {
            return arr.indexOf(value) !== -1;
        },
        /*去掉数组中的元素*/
        remove: function(arr) {
            var removeItems = [].slice.call(arguments, 1);
            Mix.base.each(removeItems, function(item) {
                if (Mix.array.has(arr, item)) {
                    var idx = arr.indexOf(item);
                    arr.splice(idx, 1);
                }
            });
            return arr;
        },
        /*数组是引用赋值,实现数组克隆可用该方法 slice不会修改数组本身而是返回一个新数组*/
        clone: function(arr) {
            return arr.slice(0);
        }
    };

    /*字符串工具*/
    Mix.string = {
        trim: function(str) {
            return str.replace(/^[　\s\t\n]*|[　\s\t\n]*$/g, '');
        },
        /*字符串中文字符长度(英文和简单符号算0.5个)*/
        chineseLen: function(str) {
            var len = 0;
            for (var i = 0; i < this.length; i++) {
                len += str.charAt(i).charCodeAt() > 255 ? 1 : 0.5;
            }
            return Math.abs(Math.ceil(len));
        }
    };

    /**
     * 实现触屏的点击事件委托
     * 为了提升iscroll的效率 避免iscroll元素和DOC在手指move时同时执行各自方法
     * 该处只给加了_click,_move和_longTap属性的dom节点使用事件委托
     * 同时如果在该dom元素上移动距离超过了click的设定值 也移除DOC的move和end监听
     */
    var Delegate = {
        longTapTime: 1500, //长按时间设置
        longTapInter: null, //长按监听
        /*初始化函数*/
        init: function() {
            dom.addEvent(DOC, Mix.event.START_EV, Delegate['start']);
        },
        /*@private触摸事件开始*/
        start: function(e) {

            if (Delegate.startEvent) {
                Delegate.end(e);
            }

            var oe = new Mix.event.Event(e);
            var targets = oe.getTargets();

            Delegate.startEvent = e;
            Delegate.isClick = true;
            Delegate.startPoint = [oe.pageX, oe.pageY];
            Delegate.targets = [];
            Delegate.startTime = e.timeStamp || Date.now();
            Delegate.hasLongTap = false;
            Delegate.hasMoveFn = false;

            /*给触发点击事件的所有对象加上"active"的className, 模仿mouseover样式 */
            for (var l = targets.length, el; l--;) {
                el = targets[l];
                if (el.getAttribute('_click') || el.getAttribute('_longTap') || el.getAttribute('_move') || Mix.array.has(['A', 'INPUT'], el.nodeName)) {
                    Delegate.targets.unshift(el);
                } else {
                    continue;
                }
                if (el.getAttribute('_longTap')) {
                    Delegate.hasLongTap = true;
                    el.event = e;
                }
                if (el.getAttribute('_move')) {
                    Delegate.hasMoveFn = true;
                    Delegate.moveDom = el;
                    Delegate.moveDom.moveName = Delegate.moveDom.getAttribute('_move');
                    Delegate.moveDom.originPos = [parseInt(getComputedStyle(el).left), parseInt(getComputedStyle(el).top)];
                    Delegate.moveDom.event = e;
                    oe.stop();
                }
            }

            if (Delegate.targets.length > 0) { //有需要触发事件的元素
                dom.addClass(Delegate.targets[0], 'active');

                dom.addEvent(DOC, Mix.event.MOVE_EV, Delegate['move']);
                dom.addEvent(DOC, Mix.event.END_EV, Delegate['end']);
            }

            // if(!Mix.array.has(['INPUT','TEXTAREA'], oe.event.target.tagName)){
            //     // oe.stop();//android长按会触发选择
            // }

            if (!Delegate.hasMoveFn && Delegate.hasLongTap) { //是长按
                Delegate.longTapInter = setTimeout(function() {
                    Delegate.longTap();
                }, Delegate.longTapTime);
            }
        },
        /*@private手指移动事件 一秒钟60次*/
        move: function(e) {
            if (!Delegate.startEvent) {
                return;
            }
            var oe = new Mix.event.Event(e);
            var sp = Delegate.startPoint;
            var cp = [oe.pageX, oe.pageY];
            var dis = Mix.base.calculPy(cp[0] - sp[0], cp[1] - sp[1]);

            if (Delegate.hasMoveFn) {
                Delegate.moveDom.moveDist = [cp[0] - sp[0], cp[1] - sp[1]];
                Mix.obs.publish(Delegate.moveDom.moveName, Delegate.moveDom);
                return;
            }

            if (dis > 15) {
                Delegate.isClick = false;
                Delegate.removeHover();
                Delegate.targets = [];
                Delegate.end(e);
            }
        },
        /*@private 手指移出点击对象时 去掉hover样式*/
        removeHover: function() {
            var targets = Delegate.targets;
            targets.forEach(function(el) {
                dom.removeClass(el, 'active');
            });
        },
        /*@private 长按按钮处理*/
        longTap: function() {
            var targets = Delegate.targets;
            for (var l = targets.length, el; l--;) {
                el = targets[l],
                fnAttr = el.getAttribute('_longTap');
                if (fnAttr) {
                    var fn = new Function(fnAttr);
                    fn.call(el);
                    Delegate.isClick = false;
                    Delegate.end(el.event);
                }
            }
        },
        /*@private 触摸事件结束，触发模拟点击事件*/
        end: function(e) {
            if (Delegate.hasLongTap) {
                clearTimeout(Delegate.longTapInter);
            }
            Delegate.removeHover();

            var targets = Delegate.targets;
            if (targets.length > 0 && Delegate.isClick) {
                var target = targets[0],
                    evt = target.getAttribute('_click');
                if (evt) {
                    target.event = e;
                    var fn = new Function(evt);
                    fn.call(target);
                }
            }

            if (Delegate.hasMoveFn) {
                Mix.obs.publish(Delegate.moveDom.moveName + '_end', Delegate.moveDom);
            }

            dom.removeEvent(DOC, Mix.event.MOVE_EV, Delegate['move']);
            dom.removeEvent(DOC, Mix.event.END_EV, Delegate['end']);
            Delegate.isClick = false;
            Delegate.startEvent = null;
            Delegate.startPoint = [0, 0];
            Delegate.targets = [];
            Delegate.startTime = null;
            Delegate.hasLongTap = false;
            Delegate.hasMoveFn = false;
        }
    };
    Delegate.init();

    /*观察者工具*/
    Mix.obs = {};
    (function(o) {
        var topics = {},
            uid = -1;

        function _throwE(e) {
            return function() {
                throw e;
            };
        }

        function _notify(topic, data) {
            var subscibers = topics[topic];

            for (var i = 0, j = subscibers.length; i < j; i++) {
                try {
                    subscibers[i].func(topic, data);
                } catch (e) {
                    setTimeout(_throwE(e), Mix.isAndroid ? 200 : 0);
                }
            }
        }

        function _publish(topic, data) {
            if (!hasOwn.call(topics, topic)) {
                return false;
            }
            setTimeout(function() {
                _notify(topic, data)
            }, 0);
            return true;
        }

        o.publish = function(topic, data) {
            return _publish(topic, data);
        };

        o.subscribe = function(topic, func) {
            if (!hasOwn.call(topics, topic)) {
                topics[topic] = [];
            }

            var token = (++uid).toString();
            topics[topic].push({
                token: token,
                func: func
            });
            return token;
        };

        o.unsubscribe = function(token) {
            for (var m in topics) {
                if (hasOwn.call(topics, m)) {
                    for (var i = 0, j = topics[m].length; i < j; i++) {
                        if (topics[m][i].token === token) {
                            topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        }
        /*设定观察的topic就清除该topic的订阅，否则清除全部topic的所有订阅*/
        o.clear = function(name) {
            if (name) {
                topics[name] = [];
            } else {
                topics = {};
                uid = -1;
            }
        }
    })(Mix.obs);

    window['Mix'] = Mix;
    return Mix;
});
