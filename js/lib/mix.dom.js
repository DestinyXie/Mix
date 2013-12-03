define(function() {
    /*DOM操作类*/
    var DOM = {
        init: function() {
            /*保存常用DOM及其属性值的全局变量BODYFS=BODY.style.fontSize*/ ;
            this.HEAD = this.$('head');
            this.BODY = document.body;
            this.BODYFS = parseInt(getComputedStyle(this.BODY).fontSize);
        },
        /*创建一个DOM对象*/
        create: function(nodeName, attributes) {
            var el = document.createElement(nodeName);
            if (attributes) {
                if (attributes.style) {
                    this.setStyles(el, attributes.style);
                    delete attributes.style;
                }
                extend(el, attributes);
            }
            return el;
        },
        /*移除一个DOM对象*/
        remove: function(el) {
            el.parentNode.removeChild(el);
        },
        /*按选择符查找指定DOM对象的父对象*/
        findParent: function(el, selector, onlyFirst) {
            var els = [];
            if (selector) {
                var _doms = this.$$(selector),
                    doms = [];
                for (var i = _doms.length; i--;) {
                    doms.push(_doms[i]);
                }
            }
            while (el = el.parentNode) {
                if ([document, this.BODY].has(el))
                    break;
                if (1 == el.nodeType && (!selector || (doms && doms.has(el)))) {
                    if (onlyFirst)
                        return el;
                    els.push(el);
                }
            }
            return els;
        },
        /*给DOM对象设置样式*/
        setStyles: function(el, styles) {
            var styleStr = "",
                value;
            for (var name in styles) {
                value = styles[name];
                if (value !== '' && !isNaN(value) && name !== 'zoom' && name !== 'z-index') {
                    value += 'px';
                }
                styleStr += (name + ":" + value + ";");
            }
            el.style.cssText += styleStr;
        },
        /*计算给定DOM元素的宽高
         * return:[width,height]
         */
        getSize: function(el) {
            var size = [parseInt(getComputedStyle(el).width), parseInt(getComputedStyle(el).height)];
            return size;
        },
        /*计算给定DOM元素的位置
         * relEl:相对于哪个元素 default为body元素
         * return:{left:Number,top:Number}
         */
        offset: function(el, relEl) {
            var relEl = relEl || this.BODY,
                left = el.offsetLeft,
                top = el.offsetTop,
                offsetP = el.offsetParent;

            while (offsetP && offsetP != relEl && offsetP != this.BODY) {
                left += offsetP.offsetLeft;
                top += offsetP.offsetTop;
                offsetP = offsetP.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        },
        /*判断DOM对象是否包含某个class名称*/
        hasClass: function(el, className) {
            return el.className.split(/\s+/).has(className);
        },
        /*给DOM对象添加一个class名称*/
        addClass: function(el, className) {
            Mix.base.each(el, function(_el) {
                var cls = _el.className;
                if (!DOM.hasClass(el, className)) {
                    //if (!cls.split(/\s+/).has(className)) {
                    _el.className += (cls ? ' ' : '') + className;
                }
            });
        },
        /*为DOM对象去掉指定的class名称*/
        removeClass: function(el, className) {
            Mix.base.each(el, function(_el) {
                var classes = _el.className.split(/\s+/);
                if (className && classes.has(className)) {
                    classes.splice(classes.indexOf(className), 1);
                }
                _el.className = classes.join(' ');
            });
        },
        /*判断是否第一个DOM对象是否在结构上包含第二个DOM对象*/
        contains: function(el, target) {
            while (target) {
                if (target == el) {
                    return true;
                }
                target = target.parentNode;
            }
            return false;
        },
        /*为DOM对象绑定事件*/
        addEvent: document.addEventListener ? function(el, event, fn, capture) {
            el.addEventListener(event, fn, !! capture);
        } : function(el, event, fn) {
            el.attachEvent('on' + event, fn);
        },
        /*移除DOM对象绑定事件*/
        removeEvent: document.removeEventListener ? function(el, event, fn, capture) {
            el.removeEventListener(event, fn, !! capture);
        } : function(el, event, fn) {
            el.detachEvent('on' + event, fn);
        },
        /*触发某个元素的点击(或给定)事件, FIXME*/
        fireClick: function(el, type) {
            var ev = document.createEvent('MouseEvents');
            ev.initEvent(type || 'click');
            // ev.initMouseEvent( type||'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null );
            el.dispatchEvent(ev);
        },
        loadJs: function(src, cb) {
            var sc = document.createElement("script");
            sc.src = src;
            this.HEAD.appendChild(sc);
            sc.onload = function() {
                this.HEAD.removeChild(sc);
                cb && cb();
            }
        },
        loadCss: function(src, cb) {
            var css = document.createElement("link");
            css.rel = "stylesheet";
            css.type = "text/css";
            css.href = src;
            this.HEAD.appendChild(css);
            css.onload = function() {
                cb && cb();
            }
        }
    };

    /*返回指定选择符的DOM集合*/
    DOM.$$ = document.querySelectorAll ? function(selector, root) {
        root = root || document;
        return root.querySelectorAll(selector, root);
    } : function(selector, root) {
        Mix.base.logErr({
            name: 'loss of function',
            message: 'querySelectorAll not implemented.'
        }, 'querySelectorAll', true);
    };

    /*返回指定选择符的单个DOM对象(如果选择符匹配多个DOM对象，则只返回第一个)*/
    DOM.$ = document.querySelector ? function(selector, root) {
        root = root || document;
        return root.querySelector(selector, root);
    } : function(selector, root) {
        var els = DOM.$$(selector, root);
        return els.length > 0 ? els[0] : null;
    };

    return DOM;
})