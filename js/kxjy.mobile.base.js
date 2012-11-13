/*保存常用DOM及其属性值的全局变量BODYFS=BODY.style.fontSize*/
;var HEAD, BODY, BODYFS, DOC = document, WIN = window;

/*常量设置*/
var isTouch = ('ontouchstart' in WIN),
START_EV = isTouch ? 'touchstart' : 'mousedown',
MOVE_EV = isTouch ? 'touchmove' : 'mousemove',
END_EV = isTouch ? 'touchend' : 'mouseup',
CLICK_EV = isTouch ? 'touchend' : 'click',
CANCEL_EV = isTouch ? 'touchcancel' : 'mouseup',
RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize';

/*扩展一个Object对象*/
function extend(d, s ,o) {
    var k;
    for (k in s) {
        if (o&&o.hasOwnProperty(k)) continue;
        if (s.hasOwnProperty(k)){
            d[k] = (typeof(s[k]) == 'object' && s[k] !== null && !(s[k].nodeType) && !(s[k] instanceof Array)) ? extend({}, s[k]) : s[k];
        }
    }
    if(o){
        d=extend(d, o);
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

/*返回选择符方法*/
_$ = DOC.querySelectorAll ? function (selector, root) {
    return root.querySelectorAll(selector);
} : function(selector, root) {
    alert('Selector not implemented');
};
/*返回指定选择符的DOM集合*/
$$ = function(selector, root) {
    root = root || DOC;
    return _$(selector, root);
};

/*返回指定选择符的单个DOM对象(如果选择符匹配多个DOM对象，则只返回第一个)*/
$ = function(selector, root) {
    var els = $$(selector, root);
    return els.length > 0 ? els[0] : null;
};

/*给$扩展方法*/
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
        return DOC.toString.call(obj)==="[object Function]";
    },
    isStr:function(obj){
        return toString.call(obj)==="[object String]";
    },
    isArray:function(obj){
        return toString.call(obj)==="[object Array]";
    },
    isPlainObject:function(obj){
        if(!obj||toString.call(obj)!=="[object Object]"||obj.nodeType||obj.setInterval)
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

/*扩展事件中的默认Event对象*/
var Event = function(e) {
    if (!e)
        return null;
    this.event = e;
    var changedTouches = e.changedTouches,
    ee = (changedTouches && changedTouches.length > 0) ? changedTouches[0] : e;
    for (var att = ['pageX', 'pageY', 'target'], l = att.length; l--;) {
        this[att[l]] = ee[att[l]];
    }
};
Event.prototype = {  
    /*事件停止标记*/
    // stoped:false,
    /*阻止事件传递*/
    stop: function() {
        if (e = this.event) {
            // this.stoped=true;
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
        var value;
        for (var name in styles) {
            value = styles[name];
            if (value !== '' && !isNaN(value) && name!=='zoom') {
                value += 'px';
            }
            try {
                el.style[name] = value;
            } catch(e) {
            }
        }
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
    /*为DOM对象绑定事件
    * 不在此处扩展Event对象 扩展了就不能使用removeEventListener
    */
    // addEvent: DOC.addEventListener ? function(el, event, fn, init) {
    addEvent: DOC.addEventListener ? function(el, event, fn, capture) {
        // //扩展默认的Event对象
        // var _fn = function(e) {
        //     fn.call(el, new Event(e));
        // };
        // //如果是document的事件则将其加入委托队列
        // if (!init && el == DOC && event in Delegate) {
        //     Delegate[event].push(_fn);
        // } else {
        //     el.addEventListener(event, _fn, !!capture);
        // }
        el.addEventListener(event, fn, !!capture);
    } : function(el, event, fn) {
        el.attachEvent('on' + event, fn);
    },
    removeEvent:DOC.removeEventListener ? function(el,event,fn,capture){
        el.removeEventListener(event,fn,!!capture);
    } : function(el, event, fn){
        el.detachEvent('on' + event,fn);
    },
    /*触发某个元素的点击(或给定)事件*/
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
            cb&&cb();
        }
    }
};

/*实现触屏的点击事件委托
* 为了提升iscroll的效率 避免iscroll元素和DOC在手指move时同时执行各自方法
* 该处只给加了_click属性的dom节点使用事件委托 
* 同时如果在该dom元素上移动距离超过了click的设定值 也移除DOC的move和end监听
*/
var Delegate = {
    /*初始化函数*/
    init: function() {
        // var events = {
        //     start: START_EV,
        //     // move: MOVE_EV,//start后再注册
        //     end: END_EV,
        //     onclick: 'click'
        // }
        // for (type in events) {
        //     Delegate[events[type]] = [];
        //     DOM.addEvent(DOC, events[type], Delegate[type], true);
        // }

        DOM.addEvent(DOC, START_EV, Delegate['start']);
        //一律使用_click属性实现点击 不在注册click事件
        // DOM.addEvent(DOC, 'click', Delegate['onclick'], true);

        // Delegate[CLICK_EV] = [];
    },
    /*@private触摸事件开始*/
    start: function(e) {

        if (Delegate.startEvent) {
            Delegate.end(e);
        }

        e=new Event(e);

        DOM.addEvent(DOC, MOVE_EV, Delegate['move']);//start后再注册
        DOM.addEvent(DOC, END_EV, Delegate['end']);//start后再注册

        Delegate.startEvent = e;
        Delegate.isClick    = true;
        Delegate.startPoint = [e.pageX, e.pageY];
        Delegate.targets    = [];
        var targets = e.getTargets();

        /*给触发点击事件的所有对象加上"active"的className, 模仿mouseover样式 */
        for (var l = targets.length, el; l--;) {
            el = targets[l];
            if (el.getAttribute('_click') || ['A', 'INPUT'].has(el.nodeName) ) {
                Delegate.targets.unshift(el);
                // break;
            }
        }
        if(Delegate.targets.length>0){
            DOM.addClass(Delegate.targets[0], 'active');
        }

        // for (var events = Delegate[START_EV], l = events.length; l--;) {
        //     events[l].call(null, e);
        // }
    },
    // onclick: function(e) {
    //     var targets = e.getTargets();
    //     targets.forEach( function(el) {
    //         if (el.getAttribute('_click')) {
    //             e.stop();
    //             return;
    //         }
    //     });
    // },
    /*@private手指移动事件
    * 因为该方法中e没有调用扩展的Event的方法 
    * 所以e既可以是传事件对象本身 也可以是new Event(事件对象),
    * 因此可以使用DOC.addEventListener添加事件监听
    * 这样也就可以用DOC.removeEventListener移除监听
    */
    move: function(e) {
        if (!Delegate.startEvent)
            return;
        var sp = Delegate.startPoint, cp = [e.pageX, e.pageY];
        var dis = BaseTools.calculPy(cp[0] - sp[0],cp[1] - sp[1]);
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
    /*@private 触摸事件结束，触发模拟点击事件*/
    end: function(e) {
        e=new Event(e);
        // e.stop();
        e.event.stopPropagation();
        var targets = Delegate.targets;
        if (targets.length>0) {
            //触发点击事件
            if (Delegate.isClick) {

                targets.forEach( function(el) {
                    DOM.removeClass(el, 'active');
                });

                var target=targets[0];
                if (evt = target.getAttribute('_click')) {
                    var fn = new Function(evt);
                    fn.call(target);
                }

                // for (var target, l = targets.length; l--;) {
                //     target = targets[l];
                //     target.event = e;
                //     /* 此处待加入缓存*/
                //     if (evt = target.getAttribute('_click')) {
                //         var fn = new Function(evt);
                //         fn.call(target);
                //     }
                //     // if(e.stoped){
                //     //     break;
                //     // }
                // }
                // if(e.stoped.toString()!="true"){
                //     for (var events = Delegate[CLICK_EV], l = events.length; l--;) {
                //         events[l].call(null, e);
                //     }
                // }
            }

            // for (var events = Delegate[END_EV], l = events.length; l--;) {
            //     events[l].call(null, e);
            // }
        }
        // e.stoped=false;
        DOM.removeEvent(DOC, MOVE_EV, Delegate['move']);//end后注销move
        DOM.removeEvent(DOC, END_EV, Delegate['end']);//end后注销end
        Delegate.isClick    = false;
        Delegate.startEvent = null;
        Delegate.startPoint = [0, 0];
        Delegate.targets    = [];
    }
};

Delegate.init();

/*基本的一些工具类*/
var BaseTools={
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
            var exdate=new Date(),cv=BaseTools.cookie(name);
            exdate.setTime(exdate.getTime()-1);
            if(cv)
                document.cookie=name+"="+escape(cv)+";expires="+exdate.toGMTString();
            return false;
        }
        if(arguments.length>1) {
            var exdate=new Date(),
            days=expiredays||3000;
            exdate.setTime(exdate.getTime()+days*24*60*60*1000);
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
            return BaseTools.cookie(name);
        },
        setItem: function(name,value) {
            BaseTools.cookie(name,value);
        },
        removeItem: function(name) {
            BaseTools.cookie(name,null);
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
                obj[key]=BaseTools.htmlEncode(obj[key]);//转换js中的HTML特殊字符串
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