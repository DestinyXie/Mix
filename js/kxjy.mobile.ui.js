/*下拉刷新页面*/
function initIScroll(pullDownEl,wrapperID,downAction) {
    function pullDownAction () {
        Feed.refresh();
    }
    var pullDownOffset = pullDownEl.offsetHeight;
    
    var myScroll = new iScroll(wrapperID, {
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (DOM.hasClass(pullDownEl,'loading')) {
                DOM.dropClass(pullDownEl,'loading');
                $('.pullDownLabel',pullDownEl).innerHTML = '下拉刷新页面...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5) {
                $('.pullDownIcon')&&($('.pullDownIcon').style.webkitTransform='rotate(-180deg)');
                $('.pullDownLabel',pullDownEl).innerHTML = '释放刷新页面...';
                this.minScrollY = 0;
            } else if (this.y < 5) {
                if($('.pullDownIcon')){
                    if((this.y>-pullDownOffset/2)&&this.y<=0){
                        var roVal=-180*(2*this.y/pullDownOffset-1);
                        $('.pullDownIcon').style.webkitTransform='rotate('+roVal+'deg)';
                    }else if(this.y<-pullDownOffset/2){
                        $('.pullDownIcon').style.webkitTransform='rotate(0deg)';
                    }
                }

                DOM.dropClass(pullDownEl,'flip');
                $('.pullDownLabel',pullDownEl).innerHTML = '下拉刷新页面...';
                this.minScrollY = -pullDownOffset;
            }
        },
        onScrollEnd: function () {
            if ($('.pullDownLabel',pullDownEl).innerHTML == '释放刷新页面...') {
                DOM.addClass(pullDownEl,'loading');
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '载入中...';                
                if(typeof downAction=="function"){
                    downAction();
                }else{
                    pullDownAction();
                }
            }
        }
    });
    setTimeout(function () {$('#wrapper').style.left = '0'; }, 100);

    return myScroll;
}

/*时间地点部分滚动常驻顶部*/
function initDockScroll(dockSel,wrapperID,listEl){
    var wrapper=$("#"+wrapperID);
        fackDock=DOM.create("div");
    DOM.addClass(fackDock,"fackDock");
    wrapper.appendChild(fackDock);

    var dockList,calculTime=0,calculInter,calculing=false;

    function calculPos(){
        if(calculing)
            return;
        calculing=true;
        if(calculTime>10){
            clearInterval(calculInter);
            calculTime=0;
        }else{
            dockList=$$(dockSel,$(listEl)),len=dockList.length;
            var st=myScroll.y;
            if(len==0)
                return;

            if((st+dockList[0].offsetTop)>=0){
                fackDock.style.display="none";
            }else{
                fackDock.style.display="block";
                fackDock.style.width=dockList[0].offsetWidth+"px";
            }
            $.each(dockList,function(o,i){
                var op=o.offsetTop+st,
                    nt=(i+1<len)?dockList[i+1].offsetTop:1000000,
                    np=nt+st,
                    oh=o.offsetHeight;
                if(op<=0&&np>0){
                    fackDock.innerHTML="";
                    fackDock.appendChild(o.cloneNode(true));
                    fackDock.style.top="0";
                    if(np<oh){
                        fackDock.appendChild(dockList[i+1].cloneNode(true));
                        fackDock.style.top=(st+nt-oh)+"px";
                    }
                }
            });
            calculTime++;
        }
        calculing=false;
    }

    myScroll = new iScroll(wrapperID, {
        useTransition: true,
        onRefresh: function () {
        },
        onScrollStart:function(){
        },
        onScrollMove: function () {
            if(myScroll.y>=0){
                fackDock.style.display="none";
            }else{
                fackDock.style.display="block";
                calculPos();
                clearInterval(calculInter);
                calculTime=0;
                calculInter=setInterval(calculPos,300);
            }
        },
        onScrollEnd: function () {
        }
    });
    
    setTimeout(function () { wrapper.style.left = '0'; }, 100);

    return myScroll;
}

/*手机原生弹出窗接口*/
var actionSheet={
    show:function(action){
        if(!isTouch){
            toast("不支持手机原生弹出窗",4);
            return;
        }else{
            var ao=this.actionObj[action];
            uexWindow.cbActionSheet=ao[3];
            uexWindow.actionSheet(ao[0],ao[1],ao[2]);
        }
        
    },
    actionObj:{
        "search":['搜索','取消',['显示全部','只显示男','只显示女','更换地区'],function(opId,dataType,data){
            switch(data*1){
                case 0:
                    Feed.addParams="sex=2";
                    Feed.refresh();
                    break;
                case 1:
                    Feed.addParams="sex=0";
                    Feed.refresh();
                    break;
                case 2:
                    Feed.addParams="sex=1";
                    Feed.refresh();
                    break;
                case 3:
                    Tools.initArea('photo');
                    break;
            }
        }],
        "moodPhoto":[],
        "photo":['添加照片','取消',["从相册中选择","拍照"],function(opId,dataType,data){

            var imgurl,
                uopCode=2,
                uploadUrl=Tools.getSiteUrl()+"photo.php",
                isMyPhoto=/myPhoto/.test(pageEngine.curPage);

            function xmlHttpPost(){
                uexXmlHttpMgr.onPostProgress=function(uopCode,p){
                    if(p==100){
                        toast("上传完成！",2);
                        return;
                    }
                    toast("已上传"+p+"%");
                }

                function httpSuccess(uopCode,status,result){
                    if(status==1){
                        if(!/^.*\..*$/.test(result)){
                            toast(result);
                        }else{
                            if(!isMyPhoto){
                                var img=DOM.create("img");
                                img.src=result.replace("FILEID:","");
                                $(".showMoodPlus").appendChild(img);
                            }else{
                                Feed.refresh();
                            }
                        }
                    }else{
                        toast("上传出错",3)
                    }
                    uexXmlHttpMgr.close(uopCode);
                }
                uexXmlHttpMgr.onData = httpSuccess;
                uexXmlHttpMgr.open(uopCode, "POST", uploadUrl, "");
                uexXmlHttpMgr.setPostData(uopCode, "0", "upload", "1");
                uexXmlHttpMgr.setPostData(uopCode, "0", "sid", StorageMgr.sid);
                uexXmlHttpMgr.setPostData(uopCode, "0", "uid", StorageMgr.uid);
                if(!isMyPhoto){
                    uexXmlHttpMgr.setPostData(uopCode, "0", "type", "1");
                }
                
                if(imgurl){
                    uexXmlHttpMgr.setPostData(uopCode, "1", "image", imgurl);
                }
                uexXmlHttpMgr.send(uopCode);
            }
            switch(data*1){
                case 0:
                    uexImageBrowser.cbPick=function (opCode,dataType,data){
                        imgurl=data;
                        xmlHttpPost();
                    };
                    uexImageBrowser.pick();
                    break;
                case 1:
                    uexCamera.cbOpen=function(opId,dataType,data){
                        toast(dataType);
                        if(dataType==0){
                            imgurl=data;
                            xmlHttpPost();
                        }
                    };
                    uexCamera.open();
                    break;
                case 3:
                    if(!isMyPhoto)
                        $("#mood").focus();
                    break;
            }
        }]
    }
}

/*原生提示信息，默认5秒消失*/
function toast(s,t){
    if(Device.isAppcan()){
        uexWindow.toast(0,5,s,t*1000||5000);
    }else{
        Tips.show(s,null,t*1000||5000);
    }
}

/*Tips类*/
var Tips={
    hasTip:false,
    container:'#content',
    tipH:0,
    timer:null,
    destory:function(){
        var that=this;
        if(that.hasTip){
            that.hasTip=false;
            that.tipD.parentNode.removeChild(that.tipD);
            delete that.tipD;
        }
        clearTimeout(that.timer);
        Tips.timer=null;
    },
    show:function(s,cont,hideT){
        if(!Tips.hasTip){
            Tips.tipD=DOM.create('div');
            var contain=$(cont||Tips.container)||$("#pageWraper");
            contain=contain?contain:BODY;
            contain.appendChild(Tips.tipD);
            DOM.addClass(Tips.tipD,'tipsShow');
            Tips.hasTip=true;
            DOM.addEvent(Tips.tipD,CLICK_EVENT,function(){Tips.hide();});
        }
        var tipsDiv=Tips.tipD;
        tipsDiv.innerHTML=s;
        tipsDiv.style.display="block";
        Tips.tipH=tipsDiv.offsetHeight;
        // tipsDiv.bottom="-"+Tips.tipH+"px";
        clearTimeout(Tips.timer);
        Tips.timer=null;
        setTimeout(function(){tipsDiv.style.bottom="0px";},0);
        if (hideT) {
            Tips.timer=setTimeout(function(){Tips.hide();},hideT);
        }
    },
    hide:function(){
        try{
            var tipsDiv=Tips.tipD;
            tipsDiv.style.bottom="-"+Tips.tipH+"px";
            Tips.timer=setTimeout(function(){
                Tips.timer=null;
                tipsDiv.style.display="none";
            },600);
        }catch(e){}
    }
}