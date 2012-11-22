/*保存常用DOM及其属性值的全局变量BODYFS=BODY.style.fontSize*/
;var HEAD, BODY, BODYFS, DOC = document, WIN = window,
/*库名称*/
Mix={
    /*Browser capabilities*/
    isAndroid : (/android/gi).test(navigator.appVersion),
    isIDevice : (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad : (/hp-tablet/gi).test(navigator.appVersion)
};

(function(){//包裹局部变量
function prefix (style) {
    if ( vender === '' ) return style;

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vender + style;
}

var dummyStyle = DOC.createElement('div').style,
    vender = (function () {
    var vendors = 't,webkitT,MozT,msT,OT'.split(','),
        t,
        i = 0,
        l = vendors.length;

    for ( ; i < l; i++ ) {
        t = vendors[i] + 'ransform';
        if ( t in dummyStyle ) {
            return vendors[i].substr(0, vendors[i].length - 1);
        }
    }

    return false;
})();

Mix.cssPrefix = vender ? '-' + vender.toLowerCase() + '-' : '';

// Style properties//e.g webkit
Mix.transform = prefix('transform');//webkitTransform下同
Mix.transformOrigin = prefix('transformOrigin');
Mix.transitionProperty = prefix('transitionProperty');
Mix.transitionDuration = prefix('transitionDuration');
Mix.transitionTimingFunction = prefix('transitionTimingFunction');
Mix.transitionDelay = prefix('transitionDelay');

Mix.has3d = prefix('perspective') in dummyStyle;
Mix.hasTouch = 'ontouchstart' in WIN && !Mix.isTouchPad;
Mix.hasTransform = !!vender;
Mix.hasTransitionEnd = prefix('transition') in dummyStyle;

/* CSS3 transitions和animations的优势在于浏览器知道哪些动画将会发生，
* 所以得到正确的间隔来刷新UI
* 如果不使用transition或animation做动画
* 浏览器的(prefix)requestAnimationFrame属性能使动画更流畅
* (prefix)requestAnimationFrame接受一个参数，是一个屏幕重绘前被调用的函数
*/
Mix.nextFrame = (function() {
    return WIN.requestAnimationFrame ||
        WIN[vender+'RequestAnimationFrame']||
        function(callback) { return setTimeout(callback, 1); };
})();
Mix.cancelFrame = (function () {
    return WIN.cancelRequestAnimationFrame ||
        WIN.webkitCancelAnimationFrame ||
        WIN[vender+'CancelRequestAnimationFrame']||
        clearTimeout;
})();
Mix.cssVender=vender;
dummyStyle=null;
vender=null;
})();

/*常量设置*/
var START_EV = Mix.hasTouch ? 'touchstart' : 'mousedown',
MOVE_EV = Mix.hasTouch ? 'touchmove' : 'mousemove',
END_EV = Mix.hasTouch ? 'touchend' : 'mouseup',
CLICK_EV = Mix.hasTouch ? 'touchend' : 'click',
CANCEL_EV = Mix.hasTouch ? 'touchcancel' : 'mouseup',
WHEEL_EV = Mix.cssVender == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',
/*考虑使用观察者模式 添加相应的响应函数来重绘正在显示的各个组件*/
// RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize';
TRNEND_EV = (function () {
    if ( Mix.cssVender === false ) return false;

    var transitionEnd = {
            ''          : 'transitionend',
            'webkit'    : 'webkitTransitionEnd',
            'Moz'       : 'transitionend',
            'O'         : 'otransitionend',
            'ms'        : 'MSTransitionEnd'
        };

    return transitionEnd[Mix.cssVender];
})();

// Helpers ?? 3d更高效么?
Mix.translateZ = Mix.has3d ? ' translateZ(0)' : '';



/*扩展一个Object对象(s或o为实例化的对象时不能使用该方法)*/
function extend(d, s ,o) {
    var k;
    if(o){
        for (k in s) {
            if (o.hasOwnProperty(k)) continue;
            if (s.hasOwnProperty(k)){
                d[k] = (typeof(s[k]) == 'object' && s[k] !== null && !(s[k].nodeType) && !(s[k] instanceof Array)) ? extend({}, s[k]) : s[k];
            }
        }
        d=extend(d, o);
    }else{
        for (k in s) {
            if (s.hasOwnProperty(k)){
                d[k] = (typeof(s[k]) == 'object' && s[k] !== null && !(s[k].nodeType) && !(s[k] instanceof Array)) ? extend({}, s[k]) : s[k];
            }
        }
    }
    return d;
}

extend(Array.prototype,{
    /*判断数组中是否包含指定的值*/
    has : function (value) {
        return this.indexOf(value) !== -1;
    },
    /*去掉某个数组元素*/
    remove : function (value) {
        if(!this.has(value))
            return false;
        var idx=this.indexOf(value);
        this.splice(idx,1);
        return this;
    },
    /*数组是引用赋值,实现数组克隆可用该方法 slice不会修改数组本身而是返回一个新数组*/
    clone:function(){
       return this.slice(0);  
    }  
});

/*字符串去空*/
if(!String.prototype.trim){
    String.prototype.trim=function () {
        return this.replace(/^[　\s\t\n]*|[　\s\t\n]*$/g,'');
    };
}

/*字符串中文字符长度(英文和简单符号算0.5个)*/
String.prototype.chineseLen=function(){
    var len = 0;
    for (var i = 0; i < this.length; i++) len += this.charAt(i).charCodeAt() > 255 ? 1 : 0.5;
    return Math.abs(Math.ceil(len));
}

/*返回指定选择符的DOM集合*/
$$ = DOC.querySelectorAll? function(selector, root) {
    root = root || DOC;
    return root.querySelectorAll(selector, root);
}:function(selector, root) {
    alert('querySelectorAll not implemented');
};

/*返回指定选择符的单个DOM对象(如果选择符匹配多个DOM对象，则只返回第一个)*/
$ = DOC.querySelector? function(selector, root) {
    root = root || DOC;
    return root.querySelector(selector, root);
}:function(selector, root) {
    var els = $$(selector, root);
    return els.length > 0 ? els[0] : null;
};

/*给$扩展方法*/
(function(){//包裹toStr
    var toStr=Object.prototype.toString;
    extend($,{
        each:function(obj, callback) {
            if (obj.nodeType)
                obj = [obj];
            for (var i = obj.length; i--;) {
                callback(obj[i], i);
            }
        },
        isFunc: function(obj){
            /*window.toString.call(function)会返回[object Object]*/
            return toStr.call(obj)==="[object Function]";
        },
        isStr:function(obj){
            return toStr.call(obj)==="[object String]";
        },
        isArray:function(obj){
            return toStr.call(obj)==="[object Array]";
        },
        isPlainObject:function(obj){
            if(!obj||toStr.call(obj)!=="[object Object]"||obj.nodeType||obj.setInterval)
                return false;
            
            try{
            if(obj.constructor&&!hasOwnProperty.call(obj,"constructor")&&!hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf"))
                return false;
            }catch(e){return false;}

            var key;
            for(key in obj){}
            return key===undefined||hasOwnProperty.call(obj,key);
        }
    });
})();

/*扩展事件中的默认Event对象*/
var Event = function(e) {
    if (!e)
        return null;

    if(e.stop)
        return e;

    this.event = e;
    var changedTouches = e.changedTouches,
    ee = (changedTouches && changedTouches.length > 0) ? changedTouches[0] : e;
    for (var att = ['pageX', 'pageY', 'target'], l = att.length; l--;) {
        this[att[l]] = ee[att[l]];
    }
};
Event.prototype = {
    /*阻止事件传递*/
    stop: function() {
        if (e = this.event) {
            e.preventDefault();
            e.stopPropagation();
        }
    },
    /*返回当前事件的DOM对象集合*/
    getTargets: function(selector) {
        var els = [], target = this.target;
        if (![DOC, BODY].has(target)) {
            els = DOM.findParent(target, selector);
            if (1 == target.nodeType) {
                els.unshift(target);
            }
        }
        return els;
    }
}

/*DOM操作类*/
var DOM = {
    /*创建一个DOM对象*/
    create: function(nodeName, attributes) {
        var el = DOC.createElement(nodeName);
        if (attributes) {
            if (attributes.style) {
                DOM.setStyles(el, attributes.style);
                delete attributes.style;
            }
            extend(el, attributes);
        }
        return el;
    },
    /*移除一个DOM对象*/
    remove: function(el, animated) {
        el.parentNode.removeChild(el);
    },
    /*按选择符查找指定DOM对象的父对象*/
    findParent: function(el, selector, onlyFirst) {
        var els = [];
        if (selector) {
            var _doms = $$(selector), doms = [];
            for (var i = _doms.length; i--;) {
                doms.push(_doms[i]);
            }
        }
        while (el = el.parentNode) {
            if ([DOC, BODY].has(el))
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
        var styleStr="",
            value;
        for (var name in styles) {
            value = styles[name];
            if (value !== '' && !isNaN(value) && name!=='zoom') {
                value += 'px';
            }
            styleStr+=(name+":"+value+";");
        }
        el.style.cssText+=styleStr;
    },
    /*计算给定DOM元素的宽高
    * return:[width,height]
    */
    getSize:function(el){
        var size=[parseInt(getComputedStyle(el).width),parseInt(getComputedStyle(el).height)];
        return size;
    },
    /*计算给定DOM元素的位置
    * relEl:相对于哪个元素 default为body元素
    * return:{left:Number,top:Number}
    */
    offset:function(el,relEl){
        var relEl=relEl||BODY,
            left=el.offsetLeft,
            top=el.offsetTop,
            offsetP=el.offsetParent;

        while(offsetP&&offsetP!=relEl&&offsetP!=BODY){
            left+=offsetP.offsetLeft;
            top+=offsetP.offsetTop;
            offsetP=offsetP.offsetParent;
        }
        return {left:left,top:top};
    },
    /*判断DOM对象是否包含某个class名称*/
    hasClass: function(el, className) {
        return el.className.split(/\s+/).has(className);
    },
    /*给DOM对象添加一个class名称*/
    addClass: function(el, className) {
        $.each(el, function(_el) {
            var cls = _el.className;
            if(!DOM.hasClass(el,className)) {
                //if (!cls.split(/\s+/).has(className)) {
                _el.className += (cls ? ' ' : '') + className;
            }
        });
    },
    /*为DOM对象去掉指定的class名称*/
    removeClass: function(el, className) {
        $.each(el, function(_el) {
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
    addEvent: DOC.addEventListener ? function(el, event, fn, capture) {
        el.addEventListener(event, fn, !!capture);
    } : function(el, event, fn) {
        el.attachEvent('on' + event, fn);
    },
    /*移除DOM对象绑定事件*/
    removeEvent:DOC.removeEventListener ? function(el,event,fn,capture){
        el.removeEventListener(event,fn,!!capture);
    } : function(el, event, fn){
        el.detachEvent('on' + event,fn);
    },
    /*触发某个元素的点击(或给定)事件,测试*/
    fireClick:function(el,type){
        var ev = DOC.createEvent('MouseEvents');
        ev.initEvent(type||'click');
        // ev.initMouseEvent( type||'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null );
        el.dispatchEvent(ev);
    },
    loadJs:function(src,cb){
        var sc=DOC.createElement("script");
        sc.src=src;
        HEAD.appendChild(sc);
        sc.onload=function(){
            HEAD.removeChild(sc);
            cb&&cb();
        }
    }
};

/*实现触屏的点击事件委托
* 为了提升iscroll的效率 避免iscroll元素和DOC在手指move时同时执行各自方法
* 该处只给加了_click和_longTap属性的dom节点使用事件委托 
* 同时如果在该dom元素上移动距离超过了click的设定值 也移除DOC的move和end监听
*/
var Delegate = {
    /*初始化函数*/
    longTapTime:2000,//长按时间设置
    longTapInter:null,//长按监听
    init: function() {
        DOM.addEvent(DOC, START_EV, Delegate['start']);
    },
    /*@private触摸事件开始*/
    start: function(e) {

        if (Delegate.startEvent) {
            Delegate.end(e);
        }

        var oe=new Event(e),
            targets = oe.getTargets();

        Delegate.startEvent = e;
        Delegate.isClick    = true;
        Delegate.startPoint = [oe.pageX, oe.pageY];
        Delegate.targets    = [];
        Delegate.startTime  = e.timeStamp || Date.now();
        Delegate.hasLongTap = false;

        /*给触发点击事件的所有对象加上"active"的className, 模仿mouseover样式 */
        for (var l = targets.length, el; l--;) {
            el = targets[l];
            if (el.getAttribute('_click') || el.getAttribute('_longTap') || ['A', 'INPUT'].has(el.nodeName) ) {
                Delegate.targets.unshift(el);
            }
            if(el.getAttribute('_longTap')){
                Delegate.hasLongTap=true;
                el.event=e;
            }
        }

        if(Delegate.targets.length>0){//有需要触发点击事件的元素
            DOM.addClass(Delegate.targets[0], 'active');

            DOM.addEvent(DOC, MOVE_EV, Delegate['move']);
            DOM.addEvent(DOC, END_EV, Delegate['end']);
        }

        if(Delegate.hasLongTap){//是长按
            Delegate.longTapInter=setTimeout(function(){
                Delegate.longTap();
            },Delegate.longTapTime);
        }
    },
    /*@private手指移动事件 一秒钟60次*/
    move: function(e) {
        if (!Delegate.startEvent)
            return;
        var oe=new Event(e),
            sp = Delegate.startPoint,
            cp = [oe.pageX, oe.pageY],
            dis = Mix.base.calculPy(cp[0] - sp[0],cp[1] - sp[1]);

        if (dis > 15) {
            Delegate.isClick = false;
            Delegate.removeHover();
            Delegate.targets=[];
            Delegate.end(e);
        }
    },
    /*@private 手指移出点击对象时 去掉hover样式*/
    removeHover:function () {
        var targets=Delegate.targets;
        targets.forEach( function(el) {
            DOM.removeClass(el,'active');
        });
    },
    /*@private 长按按钮处理*/
    longTap:function(){
        var targets=Delegate.targets;
        for (var l = targets.length, el; l--;) {
            el = targets[l],
            fnAttr=el.getAttribute('_longTap');
            if (fnAttr) {
                var fn=new Function(fnAttr);
                fn.call(el);
                Delegate.isClick=false;
                Delegate.end(el.event);
            }
        }
    },
    /*@private 触摸事件结束，触发模拟点击事件*/
    end: function(e) {
        if(Delegate.hasLongTap){
            clearTimeout(Delegate.longTapInter);
        }
        e.stopPropagation();
        Delegate.removeHover();

        var targets = Delegate.targets;
        if (targets.length>0&&Delegate.isClick) {
            var target=targets[0],
                evt=target.getAttribute('_click');
            if (evt) {
                target.event = e;
                var fn = new Function(evt);
                fn.call(target);
            }
        }
        DOM.removeEvent(DOC, MOVE_EV, Delegate['move']);//end后注销move
        DOM.removeEvent(DOC, END_EV, Delegate['end']);//end后注销end
        Delegate.isClick    = false;
        Delegate.startEvent = null;
        Delegate.startPoint = [0, 0];
        Delegate.targets    = [];
        Delegate.startTime  = null;
    }
};
Delegate.init();

/*基本的一些工具类*/
Mix.base={
    /*比较两个对象是否一样,除了except数组中的对象属性*/
    sameObj:function(obj1,obj2,except){
        if(!obj1||!obj2||JSON.stringify(obj1).length!=JSON.stringify(obj2).length){
            return false;
        }
        for(var k in obj1){
            if(obj1.hasOwnProperty(k)){
                if(JSON.stringify(obj1[k])!=JSON.stringify(obj2[k])){
                    if(except&&except.has(k)){
                        continue;
                    }
                    return false;
                }
            }
        }
        return true;
    },
    /*计算直角边*/
    calculPy:function(l,w){
        return Math.sqrt(Math.pow(l, 2) + Math.pow(w, 2));
    },
    /*在当前对象光标处插入指定的内容*/
    insertAtCaret:function(ipt,textFeildValue){
        var textObj = (ipt.nodeType==1)?ipt:$(ipt);
        if(textObj.setSelectionRange){
            var rangeStart=textObj.selectionStart,
                rangeEnd=textObj.selectionEnd,
                tempStr1=textObj.value.substring(0,rangeStart),
                tempStr2=textObj.value.substring(rangeEnd);
            textObj.value=tempStr1+textFeildValue+tempStr2;
            textObj.focus();
            var len=textFeildValue.length;
            textObj.setSelectionRange(rangeStart+len,rangeStart+len);
            textObj.focus();
        } else if (document.all && textObj.createTextRange && textObj.caretPos){      
            var caretPos=textObj.caretPos;
            caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ?
            textFeildValue+'' : textFeildValue;
        } else {
            textObj.value+=textFeildValue;
        }
    },
    /*使用cookie*/
    cookie: function(name,value,expiredays) {
        var dc=document.cookie,cs,ce;
        if(value===null||value=="") {
            var exdate=new Date(),cv=Mix.base.cookie(name);
            exdate.setTime(Date.now()-1);
            if(cv)
                document.cookie=name+"="+escape(cv)+";expires="+exdate.toGMTString();
            return false;
        }
        if(arguments.length>1) {
            var exdate=new Date(),
            days=expiredays||3000;
            exdate.setTime(Date.now()+days*24*60*60*1000);
            document.cookie=name+"="+escape(value)+";expires="+exdate.toGMTString();
        } else {
            if(dc.length>0) {
                cs=dc.indexOf(name+"=");
                if(cs!="-1") {
                    cs+=name.length+1;
                    ce=dc.indexOf(";",cs);
                    if(ce==-1)
                        ce=dc.length;
                    return unescape(dc.substring(cs,ce));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    },
    /*使用cookie模拟localStorage或sessionStorage的存储接口*/
    cookieStor:{
        getItem: function(name) {
            return Mix.base.cookie(name);
        },
        setItem: function(name,value) {
            Mix.base.cookie(name,value);
        },
        removeItem: function(name) {
            Mix.base.cookie(name,null);
        },
        clear:function(){//待实现
            var dc=document.cookie,items,name;
            if(dc.length>0){
                items=dc.split(';');
                if(items.length==0){
                    return;
                }
                for (var i = items.length-1; i >= 0; i--) {
                    name=items[i].split('=')[0];
                    Tools.cookieStor.removeItem(name);
                }
            }
        }
    },
    /*本地存储*/
    storage:(function(){
        function getStorScope(scope){
            if(scope&&(scope=="session"))
                return sessionStorage||Tools.cookieStor;
            return localStorage||Tools.cookieStor;
        }
        return{
            get:function(key,scope){
                var value=getStorScope(scope).getItem(key);
                return (/^(\{|\[).*(\}|\])$/).test(value) ? JSON.parse(value) : value;
            },
            set:function(key,value,scope){
                var serializable=$.isArray(value)||$.isPlainObject(value),
                    storeValue=serializable?JSON.stringify(value):value;
                getStorScope(scope).setItem(key,storeValue);
            },
            remove:function(key,scope){
                getStorScope(scope).removeItem(key);
            },
            clear:function(scope){
                getStorScope(scope).clear();
            }
        };
    })(),
    /*转换字符串中的html特殊字符串*/
    htmlEncode:function(str){
        if(str){
            return str.replace(/&(?!amp;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&#034;');
        }else{
            return str;
        }
    },
    /*反转换字符串中的html特殊字符串*/
    htmlDecode:function(str){
        if(str){
            return str.replace(/&#034;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
        }else{
            return str;
        }
    },
    /*转换对象中字符串属性的html特殊字符串*/
    htmlEncodeObj:function(obj){
        for(key in obj){
            if(obj.hasOwnProperty(key)&&(typeof obj[key]=="string")){
                obj[key]=Mix.base.htmlEncode(obj[key]);//转换js中的HTML特殊字符串
            }
        }
        return obj;
    },
    /*将数据加入模板生成html*/
    compiTpl:function(tpl,data,cb,idx){
        /*简易模板实现(改自zy_tmpl.js)*/
        return tpl.replace(/\$\{([^\}]*)\}/g,function(m,c){
            if(c.match(/index:/)){
                return idx;
            }
            if(c.match(/cb:/) && cb){
                return cb(data,c.match(/cb:(.*)/));
            }
            return data[c]||"";
        });
    },
    /*错误log*/
    logErr:function(err,fnName,useAlert){
        var useAlert=!!useAlert,
            errType=err.name||'undefined',
            errMsg=err.message||'undefined',
            logStr="error_type:"+errType+"|  error_message:"+errMsg+"| error_function:"+fnName;

        if(useAlert){
            alert(logStr);
        }else{
            console.log(logStr);
        }
    }
}

/*简易版iScroll,去掉了zoom和snap,from iScroll v4.2.2(http://cubiq.org)*/
Mix.scroll=function (sel, options) {
    var that=this;
    that.wrapper=(sel.nodeType==1)?sel:$(sel);
    that.wrapper.style.overflow='hidden';
    that.scroller=$('.scroller',that.wrapper)||that.wrapper.children[0];

    //Default options
    that.options={
        hScroll:true,//设定滚动方向
        vScroll:true,
        x:0,//滚动位值
        y:0,
        bounce:true,//Slow down if outside of the boundaries
        bounceLock:false,
        momentum:true,
        lockDirect:true,
        useTransform:true,
        useTransition:false,
        topOffset:0,//顶部位移 minScrollY=-topOffset||0
        bottomOffset:0,//底部位移

        // Scrollbar
        hScrollbar: false,
        vScrollbar: false,
        fixedScrollbar: false,//滚动指示器长度和宽度是否计算完就固定不变了
        hideScrollbar: Mix.isIDevice,//不触发时隐藏滚动指示器
        fadeScrollbar: Mix.isIDevice && Mix.has3d,//滚动指示器渐显

        //public Events
        onRefresh:null,
        onBeforeStart:function(e){

        },
        onStart:null,
        onBreforeMove:null,
        onMove:null,
        onBeforeEnd:null,
        onScrollEnd:null,
        onTouchEnd:null,
        onDestroy:null
    };

    extend(that.options,options);

    /*starting position*/
    that.x=that.options.x;
    that.y=that.options.y;

    /*normal options*/
    that.options.hScrollbar    = that.options.hScroll&&that.options.hScrollbar;
    that.options.vScrollbar    = that.options.vScroll&&that.options.vScrollbar;
    that.options.useTransform  = Mix.hasTransform&&that.options.useTransform;
    that.options.useTransition = Mix.hasTransitionEnd&&that.options.useTransition;

    /*scroller default style*/
    that.scroller.style.display = 'none';//reflow/repaint
    that.scroller.style[Mix.transitionProperty] = that.options.useTransform?Mix.cssPrefix+'transform':'top left';
    that.scroller.style[Mix.transitionDuration] = '0';
    that.scroller.style[Mix.transformOrigin] = '0 0';

    //cubic-bezier bezier曲线
    if (that.options.useTransition) 
        that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

    if(that.options.useTransform){
        that.scroller.style[Mix.transform] = '';
    }else{
        that.scroller.style.cssText+=';position:absolute;top:'+that.y+'px;left:'+that.x+'px';
    }

    if(that.options.useTransition){//??
        that.options.fixedScrollbar=true;
    }

    that.scroller.style.display = 'block';
    that.refresh();

    that._bind('resize',WIN);
    that._bind(START_EV);
}

Mix.scroll.prototype={
    enabled:true,
    x:0,
    y:0,
    steps:[],
    curPageX:0,
    curPageY:0,
    pagesX:[],
    pagesY:[],
    aniTime:null,

    handleEvent: function (e) {
        var that = this;
        switch(e.type) {
            case START_EV:
                if (!hasTouch && e.button !== 0) return;
                that._start(e);
                break;
            case MOVE_EV: that._move(e); break;
            case END_EV:
            case CANCEL_EV: that._end(e); break;
            case 'resize': that._resize(); break;
            case WHEEL_EV: that._wheel(e); break;
            case TRNEND_EV: that._transitionEnd(e); break;
        }
    },
    _start:function(e){
        var that=this,
            oe=new Event(e),
            matrix,x,y;

        that.__checkDOMChanges();//add by destiny

        if(!that.enabled) return;

        if(that.options.onBeforeStart)
            that.options.onBeforeStart.call(that,e);

        if(that.options.useTransition)
            that._transitionTime(0)//设置动画经历时间

        that.moved=false;
        that.animating=false;
        that.distX=0;
        that.distY=0;
        that.absDistX=0;
        that.absDistY=0;
        that.dirX=0;
        that.dirY=0;

        if(that.options.momentum){
            if(that.options.useTransform){
                matrix=getComputedStyle(that.scroller,null)[transform].replace(/[^0-9\-.,]/g,'').split(',');
                x=+matrix[4];
                y=+matrix[5];
            }else{
                x=+getComputedStyle(that.scroller,null).left.replace(/[^0-9-]/g,'');
                y=+getComputedStyle(that.scroller,null).top.replace(/[^0-9-]/g,'');
            }

            if(x!=that.x||y!=that.y){
                if(that.option.useTransition){
                    that._unbind(TRNEND_EV);
                }else{
                    cancelFrame(that.aniTime);
                }
                that.steps=[];
                that._pos(x,y);
                if(that.option.onScrollEnd)
                    that.option.onScrollEnd.call(that);
            }
        }

        that.absDistX=that.x;
        that.absDistY=that.y;

        that.startX=that.x;
        that.startY=that.y;

        that.pointX=oe.PageX;
        that.pointY=oe.PageY;

        that.startTime=e.timeStamp||Date.now();

        if(that.options.onStart)
            that.options.onStart.call(that,e);

        that._bind(MOVE_EV);
        that._bind(END_EV);
        that._bind(CANCEL_EV);//??

    },
    _move:function(e){
        var that=this,
            oe=new Event(e),
            deltaX=oe.pageX-that.pointX,
            deltaY=oe.pageY-that.pointY,
            newX=that.x+deltaX,
            newY=that.y+deltaY,
            timestamp=e.timeStamp||Date.now();

        if(that.options.onBreforeMove)
            that.options.onBreforeMove.call(that,e);

        that.pointX=oe.pageX;
        that.pointY=oe.pageY;

        that.distX += deltaX;
        that.distY += deltaY;
        that.absDistX = Math.abs(that.distX);
        that.absDistY = Math.abs(that.distY);

        if (that.absDistX < 6 && that.absDistY < 6) {
            return;
        }

        //超界减速
        if(newX>0||newX<that.maxScrollX){
            newX=that.options.bounce?taht.x+(deltaX/2):newX>=0||that.maxScrollX>=0?0:that.max;
        }
        if(newY>that.minScrollY||newY<that.maxScrollY){
            newY=that.options.bounce?that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
        }

        // Lock direction
        if (that.options.lockDirection) {
            if (that.absDistX > that.absDistY + 5) {
                newY = that.y;
                deltaY = 0;
            } else if (that.absDistY > that.absDistX + 5) {
                newX = that.x;
                deltaX = 0;
            }
        }

        that.moved = true;
        that._pos(newX, newY);
        that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if(timestamp-that.startTime>300){
            that.startTime=timestamp;
            that.startX=that.x;
            that.startY=that.y;
        }

        if(that.options.onMove)
            that.options.onMove.call(that,e);

    },
    _end:function(e){
        if(Mix.hasTouch&&e.touches.length!==0)return;

        var that=this,
            oe=new Event(e),
            target,
            ev,
            momentumX={dist:0,time:0},
            momentumY={dist:0,time:0},
            duration=(e.timeStamp||Date.now())-that.startTime,
            newPosX=that.x,
            newPosY=that.y,
            distX,distY,
            newDuration;

        that._unbind(MOVE_EV);
        that._unbind(END_EV);
        that._unbind(CANCEL_EV);

        if(that.options.onBeforeEnd)
            that.options.onBeforeEnd.call(that,e);

        if(!that.moved){
            that._resetPos(400);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        if (duration < 300 && that.options.momentum) {
            momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
            momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

            newPosX = that.x + momentumX.dist;
            newPosY = that.y + momentumY.dist;

            if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
            if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
        }
        if (momentumX.dist || momentumY.dist) {
            newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);
            that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        that._resetPos(200);
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
    },
    _resetPos:function(time){
        var that = this,
            resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
            resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

        if (resetX == that.x && resetY == that.y) {
            if (that.moved) {
                that.moved = false;
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);      // Execute custom code on scroll end
            }

            if (that.hScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                that.hScrollbarWrapper.style.opacity = '0';
            }
            if (that.vScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                that.vScrollbarWrapper.style.opacity = '0';
            }

            return;
        }

        that.scrollTo(resetX, resetY, time || 0);
    },
    _transitionTime:function(time){
        time+='ms';
        this.scroller.style[transitionDuration]=time;
        if(this.hScrollbar)this.hScrollbarIndicator.style[transitionDuration]=time;
        if(this.vScrollbar)this.vScrollbarIndicator.style[transitionDuration]=time;
    },
    _checkDOMChanges:function(){
        if (this.moved || this.animating ||
            (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale && this.wrapperH==this.wrapper.clientHeight)) return;

        this.refresh();
    },
    _pos:function(x,y){
        y=this.hScroll?x:0;
        y=this.vScroll?y:0;

        if(this.options.useTransform){
            this.scroller.style[Mix.transform]='translate('+x+'px,'+y+'px)'+translateZ;
        }else{
            x=Math.round(x);
            y=Math.round(y);
            this.scroller.style.left=x+'px';
            this.scroller.style.top=y+'px';
        }

        this.x=x;
        this.y=y;

        this._scrollbarPos('h');
        this._scrollbarPos('v');
    },
    _scrollbar:function(dir){
        var that=this,
            bar,barInti,
            scrollWrap=that[dir+'ScrollbarWrapper'];

        if(!that[dir+'Scrollbar']){//无Scrollbar
            
            if(scrollWrap){//有则销毁
                if(Mix.hasTransform)
                    this[dir+'ScrollbarIndicator'].style[Mix.transform]='';
                scrollWrap.parentNode.removeChild(scrollWrap);
                that[dir+'ScrollbarWrapper']=null;
                this[dir+'ScrollbarIndicator']=null;
            }
            return;
        }

        if(!scrollWrap){//创建Scrollbar
            bar=DOM.create('div');
            var prex=Mix.cssPrefix;
            bar.style.cssText='position:absolute;z-index:100;'+(dir=='h'?'height:7px;bottom:1px;left:2px;right:'+(that.vScrollbar?'7':'2')+'px':'width:7px;bottom:'+(that.hScrollbar?'7':'2')+'px;top:2px;right:1px;')+'pointer-events:none;'+prex+'transition-property:opacity;'+prex+'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

            that[dir+'ScrollbarWrapper']=bar;

            barInti=DOM.create('div');
            barInti.style.cssText='position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + prex + 'background-clip:padding-box;' + prex + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + prex + 'border-radius:3px;border-radius:3px;pointer-events:none;' + prex + 'transition-property:' +prex + 'transform;' + prex + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + prex + 'transition-duration:0;' + prex + 'transform: translate(0,0)' + Mix.translateZ;

            that[dir+'ScrollbarWrapper'].appendChild(barInti);
            that[dir+'ScrollbarIndicator']=barInti;
            that.wrapper.appendChild(bar);
        }

        if(dir='h'){
            if (dir == 'h') {
                that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
                that.hScrollbarIndicatorSize = Math.max(Math.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
                that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
            } else {
                that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
                that.vScrollbarIndicatorSize = Math.max(Math.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
                that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
            }
        }

        //reset position
        that._scrollbarPos(dir,true);
    },
    _scrollbarPos:function(dir,hidden){
        var that=this,
            pos=dir=='h'?that.x:that.y,
            size;

        if(!that[dir+'Scrollbar'])
            return;

        pos=that[dir+'ScrollbarProp']+pos;

        if(pos<0){
            if(!that.options.fixedScrollbar){
                size=that[dir+'ScrollbarIndicatorSize']+Math.round(pos*3);
                if(size<8)size=8;
                that[dir+'ScrollbarIndicator'].style[dir=='h'?'width':'height']=siez+'px';
            }
            pos=0;
        }else if(pos>that[dir+'ScrollbarMaxScroll']){
            if(!that.options.fixedScrollbar){
                size=that[dir+'ScrollbarIndicatorSize']-Math.round((pos-that[dir+'ScrollbarMaxScroll'])*3);
                if(size<8)size=8;
                that[dir+'ScrollbarIndicator'].style[dir=='h'?'width':'height']=siez+'px';
                pos=that[dir+'ScrollbarMaxScroll']+(that[dir+'ScrollbarIndicatorSize']-size);
            }else{
                pos=that[dir+'ScrollbarMaxScroll'];
            }
        }
        that[dir+'ScrollbarWrapper'].style[Mix.transitionDelay]="0";
        that[dir+'ScrollbarWrapper'].style.opacity=hidden&&that.options.hideScrollbar?'0':'1';
        that[dir+'ScrollbarIndicator'].style[Mix.transform]='translate('+(dir=='h'?pos+'px,0':'0,'+pos+'px)')+Mix.translateZ;
    },
    _bind: function (type, el, bubble) {
        el=el || this.scroller;
        DOM.addEvent(el,type,this,bubble);
    },

    _unbind: function (type, el, bubble) {
        el=(el || this.scroller);
        DOM.removeEvent(el,type,this,bubble);
    },

    /* Public methods */
    refresh:function(){
        var that=this,
            offset;

        that.wrapperW   = that.wrapper.clientWidth||1;
        that.wrapperH   = that.wrapper.clientHeight||1;
        
        that.minScrollY = -that.options.topOffset || 0;

        that.scrollerW  = that.scroller.offsetWidth;
        that.scrollerH  = that.scroller.offsetHeight+this.minScrollY;
        that.maxScrollX = that.wrapperW-that.scrollerW;
        this.maxScrollY = that.wrapperH-that.scrollerH+that.minScrollY+(that.options.bottomOffset||0);

        that.dirX = 0;
        that.dirY = 0;

        if(that.options.onRefresh) that.options.onRefresh.call(that);

        that.hScroll = that.options.hScroll && that.maxScrollX<0;
        that.vScroll = that.options.vScroll && (!that.options.bounceLock&&!that.hScroll||that.scrollerH>that.wrapperH);

        that.hScrollbar=that.hScroll&&that.options.hScrollbar;
        that.vScrollbar=that.vScroll&&that.options.vScrollbar&&that.scrollerH>that.wrapperH;

        offset = DOM.offset(that.wrapper);

        that.wrapperOffsetLeft=offset.left;
        that.wrapperOffsetTop=offset.top;

        /*scrollbars*/
        that._scrollbar('h');
        that._scrollbar('v');
    },
    destroy:function(){

    },
    scrollTo:function(){
        
    }
}