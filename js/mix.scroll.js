/*简易版iScroll,去掉了zoom和snap,from iScroll v4.2.2(http://cubiq.org)*/
;Mix.scroll=function (sel, options) {
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
                if (!Mix.hasTouch && e.button !== 0) return;
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

        that._checkDOMChanges();//add by destiny

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
                if(that.options.useTransition){
                    that._unbind(TRNEND_EV);
                }else{
                    cancelFrame(that.aniTime);
                }
                that.steps=[];
                that._pos(x,y);
                if(that.options.onScrollEnd)
                    that.options.onScrollEnd.call(that);
            }
        }

        that.absDistX=that.x;
        that.absDistY=that.y;

        that.startX=that.x;
        that.startY=that.y;

        that.pointX=oe.pageX;
        that.pointY=oe.pageY;

        that.startTime=e.timeStamp||Date.now();

        if(that.options.onStart)
            that.options.onStart.call(that,e);

        that._bind(MOVE_EV);
        that._bind(END_EV);
        that._bind(CANCEL_EV);//??

    },
    _move:function(e){
        var that=this,
            point = Mix.hasTouch ? e.touches[0] : e,
            deltaX=point.pageX-that.pointX,
            deltaY=point.pageY-that.pointY,
            newX=that.x+deltaX,
            newY=that.y+deltaY,
            timestamp=e.timeStamp||Date.now();

        if(that.options.onBreforeMove)
            that.options.onBreforeMove.call(that,e);

        that.pointX=point.pageX;
        that.pointY=point.pageY;

        //超界减速
        if(newX>0||newX<that.maxScrollX){
            newX=that.options.bounce?that.x+(deltaX/2):newX>=0||that.maxScrollX>=0?0:that.max;
        }
        if(newY>that.minScrollY||newY<that.maxScrollY){
            newY=that.options.bounce?that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
        }

        that.distX += deltaX;
        that.distY += deltaY;
        that.absDistX = Math.abs(that.distX);
        that.absDistY = Math.abs(that.distY);

        if (that.absDistX < 6 && that.absDistY < 6) {
            return;
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
            newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 10);
            that.scrollTo(Math.round(newPosX), Math.round(newPosY), newDuration);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        that._resetPos(200);
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
    },
    _transitionEnd:function(){
        if(e.target!=that.scroller)
            return;

        that._unbind(TRNEND_EV);
        that._startAni();
    },
    _resize:function(){
        var that=this;
        setTimeout(function(){that.refresh();},Mix.isAndroid?200:0);
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
    _momentum:function(dist,time,maxDistUpper,maxDistLower,size){
        var deceleration=.0006,
            speed=Math.abs(dist)/time,
            newDist=(speed*speed)/(2*deceleration),
            newTime=0,
            outsideDist=0;

        //出界减速
        if(dist>0&&newDist>maxDistUpper){
            outsideDist = size/(6/(newDist/speed*deceleration));
            maxDistUpper = maxDistUpper+outsideDist;
            speed       = speed*maxDistUpper/newDist;
            newDist     = maxDistUpper;
        }else{
            outsideDist  = size/(6/(newDist/speed*deceleration));
            maxDistLower = maxDistLower+outsideDist;
            speed        = speed*maxDistLower/newDist;
            newDist      = maxDistLower;
        }

        newDist=newDist*(dist<9?-1:1);
        newTime=speed/deceleration;

        return {dist:newDist,time:Math.round(newTime)};
    },
    _checkDOMChanges:function(){
        if (this.moved || this.animating ||
            (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale && this.wrapperH==this.wrapper.clientHeight)) return;

        this.refresh();
    },
    _pos:function(x,y){
        x=this.hScroll?x:0;
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
    _startAni:function(){
        var that=this,
            startX=that.x,
            startY=that.y,
            startTime=Date.now(),
            step,
            easeOut,
            animate;

        if(that.animating)
            return;

        if(!that.steps.length){
            that._resetPos(400);
            return;
        }

        step=that.steps.shift();

        if(step.x==startX&&step.y==startY)
            step.time=0;

        that.animating=true;
        that.moved=true;//?

        if (that.options.useTransition) {
            that._transitionTime(step.time);
            that._pos(step.x, step.y);
            that.animating = false;
            if (step.time) that._bind(TRNEND_EV);
            else that._resetPos(0);
            return;
        }

        animate = function () {
            var now = Date.now(),
                newX, newY;

            if (now >= startTime + step.time) {
                that._pos(step.x, step.y);
                that.animating = false;
                if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);            // Execute custom code on animation end
                that._startAni();
                return;
            }

            now = (now - startTime) / step.time - 1;
            easeOut = Math.sqrt(1 - now * now);
            newX = (step.x - startX) * easeOut + startX;
            newY = (step.y - startY) * easeOut + startY;
            that._pos(newX, newY);
            if (that.animating) that.aniTime = nextFrame(animate);
        };

        animate();
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
        var that=this;

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

        /*scrollbars*/
        that._scrollbar('h');
        that._scrollbar('v');

        if (!that.zoomed) {
            that.scroller.style[Mix.transitionDuration] = '0';
            that._resetPos(400);
        }
    },
    destroy:function(){
        var that = this;

        that.scroller.style[Mix.transform] = '';

        // Remove the scrollbars
        that.hScrollbar = false;
        that.vScrollbar = false;
        that._scrollbar('h');
        that._scrollbar('v');

        // Remove the event listeners
        that._unbind('resize', WIN);
        that._unbind(START_EV);
        that._unbind(MOVE_EV);
        that._unbind(END_EV);
        that._unbind(CANCEL_EV);
        
        if (that.options.useTransition) that._unbind(TRNEND_EV);
        
        if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
        
        if (that.options.onDestroy) that.options.onDestroy.call(that);
    },
    scrollTo:function(x,y,time,relative){
        var that=this,
            step=x;

        that.stop();
        if(!step.length)
            step=[{x:x,y:y,time:time,relative:relative}];

        for(var i=0,l=step.length;i<l;i++){
            if(step[i].relative){
                step[i].x=that.x-step[i].x;
                step[i].y=that.y-step[i].y;
            }
            that.steps.push({x:step[i].x,y:step[i].y,time:step[i].time||0});
        }

        that._startAni();
    },
    disable: function () {
        this.stop();
        this._resetPos(0);
        this.enabled = false;

        this._unbind(MOVE_EV);
        this._unbind(END_EV);
        this._unbind(CANCEL_EV);
    },
    enable: function () {
        this.enabled = true;
    },
    stop:function(){
        var that=this;
        if(that.options.useTransition){
            that._unbind(TRNEND_EV);
        }else if(that.aniTime){
            cancelFrame(that.aniTime);
        }
        that.steps=[];
        that.moved=false;
        that.animating=false;
    },
    isReady: function () {
        return !this.moved && !this.animating;
    }
};