/*保存常用DOM及其属性值的全局变量BODYFS=BODY.style.fontSize*/
;var HEAD, BODY, BODYFS, DOC = document, WIN = window;

/*常量设置*/
var isTouch = ('ontouchstart' in WIN),
START_EVENT = isTouch ? 'touchstart' : 'mousedown',
MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
END_EVENT = isTouch ? 'touchend' : 'mouseup',
CLICK_EVENT = isTouch ? 'touchend' : 'click';

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
    /*阻止事件传递*/
    stoped:false,
    stop: function() {
        if (e = this.event) {
            this.stoped=true;
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
                attributes.style = null;
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
            if (1 == el.nodeType && (!doms || (doms && doms.has(el)))) {
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
    /*为DOM对象绑定事件*/
    addEvent: DOC.addEventListener ? function(el, event, fn, init) {
        //扩展默认的Event对象
        var _fn = function(e) {
            fn.call(el, new Event(e));
        };
        //如果是document的事件则将其加入委托队列
        if (!init && el == DOC && event in Delegate) {
            Delegate[event].push(_fn);
        } else {
            el.addEventListener(event, _fn, false);
        }
    } : function(el, event, fn) {
        el.attachEvent('on' + event, fn);
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

/*实现触屏的点击事件委托*/
var Delegate = {
    /*初始化函数*/
    init: function() {
        var events = {
            start: START_EVENT,
            // move: MOVE_EVENT,//start后再注册
            end: END_EVENT,
            onclick: 'click'
        }
        for (type in events) {
            Delegate[events[type]] = [];
            DOM.addEvent(DOC, events[type], Delegate[type], true);
        }
        Delegate[CLICK_EVENT] = [];
    },
    /*@private触摸事件开始*/
    start: function(e) {
        if (Delegate.startEvent) {
            Delegate.end(e);
        }

        DOC.addEventListener(MOVE_EVENT, Delegate['move'],false);//start后再注册

        Delegate.startEvent = e;
        Delegate.isClick    = true;
        Delegate.startPoint = [e.pageX, e.pageY];
        Delegate.targets    = [];
        var targets = e.getTargets();

        /*给触发点击事件的所有对象加上"active"的className, 模仿mouseover样式 */
        for (var l = targets.length, el; l--;) {
            el = targets[l];
            if (el.getAttribute('_click') || ['A', 'INPUT'].has(el.nodeName) ) {
                DOM.addClass(el, 'active');
                Delegate.targets.push(el);
                // break;
            }
        }

        for (var events = Delegate[START_EVENT], l = events.length; l--;) {
            events[l].call(null, e);
        }
    },
    onclick: function(e) {
        var targets = e.getTargets();
        targets.forEach( function(el) {
            if (el.getAttribute('_click')) {
                e.stop();
                return;
            }
        });
    },
    /*@private手指移动事件*/
    move: function(e) {
        if (!Delegate.startEvent)
            return;
        var sp = Delegate.startPoint, cp = [e.pageX, e.pageY];
        var dis = Tools.calculPy(cp[0] - sp[0],cp[1] - sp[1]);
        if (dis > 15) {
            Delegate.isClick = false;
            Delegate.removeHover();
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
        // e.stop();
        e.event.stopPropagation();
        var targets = Delegate.targets;
        if (targets) {
            targets.forEach( function(el) {
                DOM.removeClass(el, 'active');
            });
            //触发点击事件
            if (Delegate.isClick) {
                for (var target, l = targets.length; l--;) {
                    target = targets[l];
                    target.event = e;
                    /* 此处待加入缓存*/
                    if (evt = target.getAttribute('_click')) {
                        var fn = new Function(evt);
                        fn.call(target);
                    }
                    if(e.stoped){
                        break;
                    }
                }
                if(e.stoped.toString()!="true"){
                    for (var events = Delegate[CLICK_EVENT], l = events.length; l--;) {
                        events[l].call(null, e);
                    }
                }
            }

            for (var events = Delegate[END_EVENT], l = events.length; l--;) {
                events[l].call(null, e);
            }
        }
        e.stoped=false;
        DOC.removeEventListener(MOVE_EVENT, Delegate['move'],false);//end后注销move
        Delegate.isClick    = false;
        Delegate.startEvent = null;
        Delegate.startPoint = [0, 0];
        Delegate.targets    = [];
    }
};

Delegate.init();

/*工具*/
var Tools={
    /*清除缓存和一些记录的变量值,用户退出时需要*/
    refresh:function(){
        // Tools.storage.clear();//gps等信息
        Tools.storage.clear('session');
        Tools.sidUidParam=null;
        StorMgr.destroy();
    },
    sameObj:function(obj1,obj2,except){//比较两个对象是否一样,除了except数组中的属性
        if(obj1&&obj2&&JSON.stringify(obj1).length!=JSON.stringify(obj2).length){
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
    /*取sid和uid参数字符串*/
    getSidUidParams:function(gotoUrl,setParams){
        var paramStr;
        if(Tools.sidUidParam){
            return Tools.sidUidParam;
        }

        if(StorMgr.uid&&StorMgr.userKey){
            paramStr="sid="+StorMgr.sid+"&uid="+StorMgr.uid+"&userKey="+StorMgr.userKey;
            Tools.sidUidParam=paramStr;
        }else{
            paramStr="sid="+StorMgr.sid;
        }
        return paramStr;
    },
    /*从临时变量ViewMgr.tmpParams取参数值*/
    getParamVal:function(paramKey){
        var value="",
            params=ViewMgr.tmpParams.split('&');

        if(0!=params.length){
            $.each(params,function(pa){
                var rg=new RegExp(paramKey+"=(.*)");
                if(rg.test(pa)){
                    value=rg.exec(pa)[1];
                }
            });
        }

        //多次跳转页面会丢失ViewMgr.tmpParams中user_id参数
        if('user_id'==paramKey&&""==value)
            value=hisInfo['curId'];

        return value;
    },
    /*替换Url中的${param}变量*/
    compileUrl:function(url){
        var reUrl=url.replace(/\$\{(\w+)\}/g,
            function(m,c){
                if(['uid','sid','userKey'].has(c))
                    return StorMgr[c];
                return Tools.getParamVal(c);
            });
        return reUrl;
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
            var exdate=new Date(),cv=Tools.cookie(name);
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
            return Tools.cookie(name);
        },
        setItem: function(name,value) {
            Tools.cookie(name,value);
        },
        removeItem: function(name) {
            Tools.cookie(name,null);
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
    /*表情字符串正则转换图片*/
    filterMsgFace:function(str){
        if(str){return str = str.replace(/\[(face(\d+))\]/g, "<img src='"+StorMgr.siteUrl+"/images/face/$1.gif' />");}
    },
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
                obj[key]=Tools.htmlEncode(obj[key]);//转换js中的HTML特殊字符串
            }
        }
        return obj;
    },
    /*选择表情Icon*/
    setIconId:function(node,setNum){
        var node=node||$('.showMoodList'),
            imgs=$$("img",node);

        if(setNum){//设置
            setNum=("0"==setNum)?3:setNum;
            node.setAttribute('iconid',setNum);
            imgs[setNum-1].parentNode.appendChild($('.MoodSelect',node));
            return;
        }

        var evt=node.event,
            imgArr=[],
            tarImg=evt.getTargets('img')[0];

        $.each(imgs,function(img){
            imgArr.unshift(img);
        });

        var idx=imgArr.indexOf(tarImg);

        if(idx<0)
            return;

        tarImg.parentNode.appendChild($('.MoodSelect',node));
        node.setAttribute('iconid',idx+1);
    },
    /*将数据加入模板生成html*/
    compiTpl:function(tpl,data,cb,idx){
        if('sysNotice'!=Feed.page){//通知里面是需要显示html标签的
            data=Tools.htmlEncodeObj(data);
        }
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
    /*initArea弹出地区选择框*/
    initArea:function(type,defProv,defCity){
        function done(prov,city) {
            if(!prov){
                toast('未选择地区',2);
                return;
            }

            if(type&&["rank","photo"].has(type)){
                Feed.addParams="reside_province="+prov+"&reside_city="+city;
                Feed.refresh();
                if("rank"==type){
                    $(".rankAddress span").innerHTML=prov+' '+city;
                }
            }else{
                val=prov+' '+city;
                Page.setEditVal("area",val);
            }
        }
        var regObj={
            useMask:true,
            onConfirm:function(prov,city){
                done(prov,city);
            },
            onShow:function(regSel){
                Device.backFunc=function(){regSel.hide();}
            },
            hideEnd:function(regSel){
                Device.backFunc=function(){ViewMgr.back();}
            }
        };

        if(defProv){
            regObj.prov=defProv;
        }
        if(defCity){
            regObj.city=defCity;
        }
        UITools.regionSelector.show(regObj);
        return;
    },
    /*初始化目的,婚姻状况,兴趣选项*/
    initSelect:function(ipt,mul){
        var selectObj={
            multi:!!mul,
            options:dataArray[ipt],
            defOptions:$("#"+ipt).innerHTML.trim().split(' '),
            onConfirm:function(selOpts){
                if(mul){
                    if(selOpts.length<1){
                        alert('至少选择一项');
                        return false;
                    }
                    if(selOpts.length>4){
                        alert('最多只能选4项')
                        return false;
                    }
                }
                Page.setEditVal(ipt,selOpts.join(" "));
                return true;
            },
            onShow:function(regSel){
                Device.backFunc=function(){regSel.hide();}
            },
            hideEnd:function(regSel){
                Device.backFunc=function(){ViewMgr.back();}
            }
        };

        UITools.select.show(selectObj);
    },
    /*获得用户所在地址,解析地址为省,市*/
    getGpsInfo:function(cb){
        StorMgr.gpsInfo=Tools.storage.get("kxjy_my_gpsInfo");
        function parseAddr(addr){
            var prov,city,addrArr,
                provReg=/([\u4E00-\u56FC\u56FE-\u9FA3]{2,})省/,
                cityReg=/([\u4E00-\u56FC\u56FE-\u7700\u7702-\u9FA3]{2,})市/,
                areaReg=/([\u4E00-\u5E01\u5e03-\u9FA3]{2,})区/;
            if(/北京|上海|重庆|天津/.test(addr)){
                prov=cityReg.exec(addr)[1];
                city=areaReg.exec(addr)[1];
            }else{
                prov=provReg.exec(addr)[1];
                city=cityReg.exec(addr)[1];
            }
            addrArr=[prov||"",city||""];
            return addrArr;
        }
        Device.getLocation(
            function(lat,log){
                var secCb=function(addr){
                        var addrArr=parseAddr(addr),
                            gpsInfo={
                                lat:lat,
                                log:log,
                                prov:addrArr[0],
                                city:addrArr[1]
                            }
                        StorMgr.gpsInfo=gpsInfo;
                        Tools.storage.set("kxjy_my_gpsInfo",gpsInfo);

                        if($.isFunc(cb)){
                            cb();
                        }
                    },
                    errCb=function(){
                        alert("不能取得具体地址");
                    }
                Device.getAddress(lat,log,secCb,errCb);
            }
        );
    }
}