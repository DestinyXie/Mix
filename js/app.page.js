/*单页面模式*/
;(function(){
//公共tmpl,减少代码量
var headerBack=['<!--header开始-->',
    '<header id="header">',
        '<div _click="ViewMgr.back()"><img src="image/return.png" alt="返回"/></div>'].join('');

var contentTmpl={
'login':['${headerBack}',
        '<h1>welcome</h1>',
    '</header>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content">',
        '<div>',
        '<h3 class="welcome">welcome,here is mixJS.</h3>',
        '</div>',
    '</div>',
    '<!--content结束-->'].join('')
};


var footerTmple={
'main':['<footer id="footer">',
    '<i _click=\'ViewMgr.gotoPage("i1");\' class="${1}">i1</i>',
    '<i _click=\'ViewMgr.gotoPage("i2");\' class="${2}">i2</i>',
    '<i _click=\'ViewMgr.gotoPage("i3");\' class="${3}">i3</i>',
    '<i _click=\'ViewMgr.gotoPage("i4");\' class="${4}">i4</i>',
    '</footer>'].join('')
};

/*各个页面相关配置*/
//[footerTmpl{string,boolean},
// footerFocusIdx{number,boolean},
// initEvent{function}],
var pageConfig={
'login':['main',1,function(){}]
}

var PageEngine=function(options){
    var that=this;
    
    that.destroy();
    that.options={
        pageWrap:$('#pageWraper'),
        animate:false//是否动画切换
    }

    extend(that.options,options);
}

PageEngine.prototype={
    initUser:function(){//用户信息初始化
        var that=this;
        if(!/login/.test(that.curPage)){
            if(that.hasUser){
                return;
            }
            that.hasUser=true;
        }else{
            that.hasUser=false;
        }
    },
    replacePubTmpl:function(tmplStr){//替换公共tmpl
        var retStr=tmplStr;
        retStr=retStr.replace(/\$\{headerBack\}/,headerBack);
        return retStr;
    },
    compileTmpl:function(){
        var page=this.curPage,
            pcofig=pageConfig[page],
            ftTmpl=(pcofig[0])?footerTmple[pcofig[0]]:false,
            ftFocus=pcofig[1],
            htmlStr=contentTmpl[page],
            ftStr=ftTmpl?ftTmpl:"";

        //替换公共tmpl
        htmlStr=this.replacePubTmpl(htmlStr);

        if(ftFocus){
            var fReg=new RegExp('\\$\\{'+ftFocus+'\\}','g'),
                aReg=new RegExp('\\$\\{\\d+\\}','g');
            ftStr=ftStr.replace(fReg,'select');
            ftStr=ftStr.replace(aReg,'');
        }
        return htmlStr+ftStr;
    },
    cancelPrePage:function(){//撤销前一个页面相关
        var that=this,
            delay=false;
        if(['test'].has(that.curPage)){
            UserTools.fixHighlight();
            delay=true;//android input残影
        }

        if(that.checkHeight){
            clearTimeout(that.checkHeight);
            that.checkHeight=null;
        }

        if(that.delayInter){
            clearTimeout(that.delayInter);
            that.delayInter=null;
        }

        UserAction.stop();//撤销用户动作
        Mix.ui.tips.destroy();//Tips
        Device.destroy();//撤销如上传等手机正在执行的动作
        Mix.obs.clear();//取消对resize等的观察

        return delay;
    },
    initPage:function(page,diret){
        var that=this,
            delay=false;

        delay=that.cancelPrePage();

        if(delay){
            that.delayInter=setTimeout(function(){
                that._initPage(page,diret);
            },200);
        }else{
            that._initPage(page,diret);
        }
    },
    _initPage:function(page,diret){
        var that=this;
        that.prePage=that.curPage;
        that.curPage=page;

        that.initUser();
        var tmplStr=that.compileTmpl(),
            wrap=that.options.pageWrap;

        if(that.options.animate&&that.prePage!=that.curPage){//是否使用动画
            that.animate(diret,tmplStr);
        }else{
            wrap.innerHTML="";
            wrap.innerHTML=tmplStr;
            that.fireEvent();
        }
    },
    animate:function(diret,tmplStr){//动画切换，暂不使用
        if($('#fackWrap')){
            BODY.removeChild($('#fackWrap'));
        }
        var that=this,
            wrap=that.options.pageWrap,
            prePage=wrap.cloneNode(true);
        BODY.appendChild(prePage);
        
        prePage.id="fackWrap";
        wrap.innerHTML=tmplStr;
        if('right'==diret){
            wrap.style.left="-"+wrap.offsetWidth+"px";
        }else{
            wrap.style.left=wrap.offsetWidth+"px";
        }
        that.fireEvent();
        BODY.style[Mix.transitionProperty]=Mix.cssPrefix+"transform";
        BODY.style[Mix.transitionDuration]="300ms";

        setTimeout(function(){
            if('right'==diret){
                BODY.style[Mix.transform]="translateX("+wrap.offsetWidth+"px)";
            }else{
                BODY.style[Mix.transform]="translateX(-"+wrap.offsetWidth+"px)";
            }
        },0);

        setTimeout(function(){
            wrap.style.left="0";
            BODY.style[Mix.transitionDuration]="0";
            BODY.style[Mix.transform]="translateX(0)";
            prePage&&BODY.removeChild(prePage);
            delete prePage;
        },300);
    },
    fireEvent:function(){
        var that=this,
            page=that.curPage,
            pcofig=pageConfig[page],
            initFn=pageConfig[that.curPage][2];

        /*执行页面配置项中页面初始化代码*/
        if($.isFunc(initFn)){
            initFn.call(null);
        }

        that.initIScrollAndFeed();
    },
    /*执行iScroll和feed相关代码*/
    initIScrollAndFeed:function(){
        var that=this,
            feedOption={
                page:that.curPage,
                cont:$('.test_box'),
                threeWrap:false,
                onAppend:function(feed){
                    that.checkContent();
                },
                cb:function(){
                    if(WIN['myScroll']){
                        myScroll.refresh();
                    }
                }
            }
        if(WIN['myScroll']){
            myScroll.destroy();
            myScroll=null;
        }
        switch(that.curPage){
            case 'test':
                feedOption.autoLoad=true;
                WIN['myScroll']=refreshIScroll($('.pullDown'),'#content');
                Feed.init(feedOption);
                that.scrollCb();
                break;
            case 'test1':
                feedOption.cb=function(){
                    if($('.test1')){
                    }
                    if(WIN['myScroll']){
                        myScroll.refresh();
                    }
                };
                Feed.init(feedOption);
                break;
        }

        if(feedOption.autoLoad&&!WIN['myScroll']){
            that.checkHeight=setTimeout(function(){//android画面残影
                WIN['myScroll']=new Mix.scroll('#content');
                that.scrollCb();
            },200);
        }else{
            that.checkContent();
            if(!['map'].has(that.curPage)){
                DOM.addEvent($('#content'),START_EV,function(){
                    that.checkContent();
                });
            }
        }
    },
    checkContent:function(){
        var that=this;
        if(!WIN['myScroll']){
            that.checkHeight=setTimeout(function(){
                UserTools.checkScroll('#content',that.scrollCb);
            },200);
        }
    },
    scrollCb:function(){
        if(myFeed&&myFeed.autoLoad&&myScroll&&!myScroll.options.onMoveEnd){
            myScroll.options.onMoveEnd=function(e){
                var scroll=this,
                    topY=myScroll.options.topOffset||0;
                if(scroll.y<=-topY&&scroll.y<=scroll.maxScrollY){
                    myFeed.loadMore();
                }
            }
        }
    },
    display:function(dirc){},
    destroy:function(){
        var that=this;
        that.curPage='login';
        that.prePage=null;
        that.hasUser=false;
    }
}
window['PageEngine']=PageEngine;
})();