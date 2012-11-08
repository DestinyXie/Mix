/*下拉刷新页面*/
;function initIScroll(pullDownEl,wrapperID,downAction) {
    function pullDownAction () {
        Feed.refresh();
    }
    var pullDownOffset = pullDownEl.offsetHeight;
    
    var myScroll = new iScroll(wrapperID, {
        useTransform: false,//使用Transform的时候 在手机上点击地区选择的select应用会卡死
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (DOM.hasClass(pullDownEl,'loading')) {
                DOM.removeClass(pullDownEl,'loading');
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

                DOM.removeClass(pullDownEl,'flip');
                $('.pullDownLabel',pullDownEl).innerHTML = '下拉刷新页面...';
                this.minScrollY = -pullDownOffset;
            }
        },
        onScrollEnd: function () {
            if ($('.pullDownLabel',pullDownEl).innerHTML == '释放刷新页面...') {
                DOM.addClass(pullDownEl,'loading');
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '载入中...';                
                if($.isFunc(downAction)){
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
        if(calculTime>3){
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
                calculInter=setInterval(calculPos,500);
            }
        },
        onScrollEnd: function () {
        }
    });
    
    setTimeout(function () { wrapper.style.left = '0'; }, 100);

    return myScroll;
}

/*appcan模拟ios actionSheet弹出框接口*/
var actionSheet={
    show:function(action){
        if(!Device.isMobi()){
            toast("不支持手机原生弹出窗，因为你不是webapp",4);
            return;
        }else{
            var ao=this.actionObj[action];
            Device.actionSheet(ao);
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
            Device.opCode++;
            var imgurl,
                uopCode=Device.opCode,
                uploadUrl="http://"+StorMgr.siteHost+StorMgr.siteUrl+"/photo.php",
                isMyPhoto=/myPhoto/.test(pageEngine.curPage);

            function xmlHttpPost(size){
                if(StorMgr.filesAllowed<=0){
                    alert("您上传的照片数量已经达到上限！");
                    return;
                }
                if(!/\.jpg$|\.jpeg$|\.gif$/.test(imgurl)){
                    alert("只能上传jpg，jpeg，gif格式的照片");
                    return;
                }
                if(size>1024*3){
                    alert("上传单个文件最大尺寸为3MB，请重新选择");
                    return;
                }

                function onProgress(uopCode,p){
                    if(p==100){
                        toast("上传结束！",1);
                        return;
                    }
                    toast("已上传"+p+"%",10);
                }

                function httpSuccess(uopCode,status,result){
                    if(status==1){
                        if(!/^FILEID:/.test(result)){
                            alert(result);
                        }else{
                            StorMgr.filesAllowed--;
                            if(isMyPhoto){
                                Feed.refresh();
                            }else{
                                var img=DOM.create("img");
                                img.src=result.replace("FILEID:","");
                                $(".showMoodPlus").appendChild(img);
                            }
                        }
                    }else{
                        toast("上传出错",2);
                    }
                    Device.xmlHttpClose(uopCode);
                }

                var sendObj={
                    'opCode':uopCode,
                    'src':uploadUrl,
                    'method':"POST",
                    'plainPara':"upload=1&sid="+StorMgr.sid+"&uid="+StorMgr.uid,
                    'progressCb':onProgress,
                    'secCb':httpSuccess
                };
                
                if(!isMyPhoto){
                    sendObj.plainPara+="&type=1";
                }
                if(imgurl){
                    sendObj.sourcePara="image="+imgurl;
                }
                Device.xmlHttp(sendObj);
            }
            switch(data*1){
                case 0:
                    function imageBrowserCb(opCode,dataType,data){
                        imgurl=data;
                        Device.getFileSize(data,xmlHttpPost);
                    }
                    Device.imageBrowser(imageBrowserCb);
                    break;
                case 1:
                    function cameraCb(opId,dataType,data){
                        if(dataType==0){
                            imgurl=data;
                            Device.getFileSize(data,xmlHttpPost);
                        }
                    }
                    Device.camera(cameraCb);
                    break;
                case 3:
                    if(!isMyPhoto)
                        $("#mood").focus();
                    break;
            }
        }],
        "menu":['','取消',['注销用户','退出应用'],function(opId,dataType,data){
            switch(data*1){
                case 0:
                    UserAction.logOut();
                    break;
                case 1:
                    Device.exit();
                    break;
            }
        }]
    }
}

/*原生提示信息，默认2,3秒消失*/
function toast(s,t){
    if(Device.isMobi()){
        Device.toast(s,t);
    }else{
        Tips.show(s,null,t*1000||3000);
    }
}

/*Tips类*/
var Tips={
    hasTip:false,
    container:'#content',
    tipH:0,
    timer:null,
    destroy:function(){
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

/**UI工具类**/
var UITools={};
/*背景遮罩*/
UITools.mask={
    /*option{cont}*/
    show:function(){
        var that=this,
            option={//default config
                cont:'body',
                maskClickCb:null//点击背景遮罩方法
            };
        if(arguments.length>0){
            extend(option,arguments[0]);
        }
        if(!$('.pageMask')){
            that.container=$(option.cont),
            that.maskDom=DOM.create('div',{className:'pageMask'});
            that.container.appendChild(that.maskDom);
        }

        if(option.maskClickCb){
            DOM.addEvent(that.maskDom,CLICK_EVENT,option.maskClickCb);
        }
    },
    hide:function(){
        var that=this;
        that.container.removeChild(that.maskDom);
        delete that.maskDom;
        delete that.container;
    }
}

/*所有弹出层的公共类*/
UITools.popLayer={
    domStr:['<div class="">',
            '</div>'],
    reset:function(){
        var that=this;
        that.option={
            domId:'layerSel',//弹出层DOM id
            domCls:'layerSelWrap',//弹出层DOM class
            useMask:true,//是否显示背景遮罩
            clickMaskHide:true,//是否点击背景遮罩隐藏
            canScroll:false,//弹出层内容是否可以滚动
            contSel:'body',//没有遮罩时，弹出层显示的容器选择器
            onShow:null,//params:this{object}
            hideEnd:null//params:void
        }
        delete that.regionDom;
        delete that.container;
        if(that.scroller){
            that.scroller.destroy();
            delete that.scroller;
        }
        that.subReset&&that.subReset();//执行子类的reset方法
    },
    show:function(cusOption){
        var that=this;
        that.reset();
        if(cusOption){
            extend(that.option,cusOption);
        }
        if($("#"+that.option.domId)){
            return;
        }

        that.option.onShow&&that.option.onShow.call(null,that);
        that.regionDom=DOM.create('div',{id:that.option.domId,className:that.option.domCls});
        that.regionDom.innerHTML=that.domStr.join('');

        if(that.option.useMask){
            var maskOpt={};
            if(that.option.clickMaskHide){
                maskOpt={maskClickCb:function(ev){
                    if(ev.target==UITools.mask.maskDom)
                        that.hide();
                }}
            }
            UITools.mask.show(maskOpt);
            that.container=UITools.mask.maskDom;

        }else{
            that.container=$(that.option.contSel);
        }
        that.container.innerHTML="";
        that.container.appendChild(that.regionDom);

        if(that.option.canScroll){
            that.scroller=new iScroll(that.option.domId);
        }

        that.subShow&&that.subShow();//执行子类的show方法
    },
    hide:function(){
        var that=this;

        that.container.removeChild(that.regionDom);
        that.option.useMask&&UITools.mask.hide();

        that.option.hideEnd&&that.option.hideEnd.call(null);
        that.subHide&&that.subHide();//执行子类的hide方法
        that.reset();
    }
}

/*地区选择(extend UITools.popLayer)*/
UITools.regionSelector=extend({},UITools.popLayer,{
    domStr:['<div class="selectWrap clearfix">',
            '<select class="provSel">',
            '</select>',
            '<select class="citySel">',
            '</select>',
            '</div>',
            '<div class="chooseWrap clearfix">',
                '<a class="confirm" _click="UITools.regionSelector.confirm()">确认</a>',
                '<a class="cancel" _click="UITools.regionSelector.cancel()">取消</a>',
            '</div>'],
    subReset:function(){//重置地区选择对象和option值
        var that=this,
            option={
                prov:"",//省份
                city:"",//城市
                domId:'regionSel',//选择框DOM id
                domCls:'regionSelWrap',//选择框DOM class
                provProm:'选择省份',//省份选择提示
                cityProm:'选择城市',//城市选择提示
                onConfirm:null,//params:option.prov{string},option.city{string}
                onCancel:null,//params:this{object}
            }
        extend(that.option,option);
        delete that.provSel;
        delete that.citySel;
        delete that.confirmBtn;
        delete that.cancelBtn;
    },
    subShow:function(){
        var that=this;
        
        that.provSel=$('.provSel',that.regionDom);
        that.citySel=$('.citySel',that.regionDom);
        that.confirmBtn=$('.confirm',that.regionDom);
        that.cancelBtn=$('.cancel',that.regionDom);
        that.conbProv(that.option.prov);
        that.conbCity(that.option.prov,that.option.city);
    },
    conbProv:function(defProv){
        var that=this,
            options=that.conbOpt(provinces,that.option.provProm);

        function checkProv(){
            if(that.option.provProm==that.provSel.value){
                that.option.prov="";
            }else{
                that.option.prov=that.provSel.value;
            }
            that.option.city="";
            that.conbCity(that.option.prov);
        }
        that.provSel.innerHTML=options;
        that.provSel.value=defProv||that.option.provProm;
        DOM.addEvent(that.provSel,"change",checkProv);
    },
    conbCity:function(prov,defCity){
        var that=this,
            citys=show_next_flod(prov)||[];
            options=that.conbOpt(citys,that.option.cityProm);

        function checkCity(){
            if(that.option.cityProm==that.citySel.value){
                that.option.city="";
            }else{
                that.option.city=that.citySel.value;
            }
        }
        that.citySel.innerHTML=options;
        that.citySel.value=defCity||that.option.cityProm;
        DOM.addEvent(that.citySel,"change",checkCity);
    },
    conbOpt:function(arr,prompt){
        var ops=[];
        $.each(arr,function(item,idx){
            ops.unshift("<option value='"+item+"'>"+item+"</option>");
        });
        ops.unshift("<option value='"+prompt+"'>"+prompt+"</option>");
        return ops.join("");
    },
    confirm:function(){
        var that=this;
        that.option.onConfirm&&that.option.onConfirm(that.option.prov,that.option.city);
        that.hide();
    },
    cancel:function(){
        var that=this;
        that.option.onCancel&&that.option.onCancel();
        that.hide();
    }
});

/*单选、多选框(extend UITools.popLayer)*/
UITools.select=extend({},UITools.popLayer,{
    domStr:['<div><ul class="optWrapper"></ul></div>',
            '<div class="chooseWrap clearfix">',
                '<a class="confirm" _click="UITools.select.confirm()">确认</a>',
                '<a class="cancel" _click="UITools.select.cancel()">取消</a>',
            '</div>'],
    subReset:function(){
        var that=this,
            option={
            domId:'selectSel',//选择框DOM id
            domCls:'selectSelWrap',//选择框DOM class
            options:[],//选项集合
            defOptions:[],//默认选项集合
            selOptions:[],//选中项集合
            multi:false,//是否为多选
            canScroll:true//可以滚动
        }
        extend(that.option,option);
    },
    subShow:function(){
        var that=this,
            optStr=[];
        if(that.option.options.length===0){
            toast('没有可供选择的项目');
            return;
        }
        if(that.option.multi){
            DOM.addClass(that.regionDom,"multiSelect");
        }
        if(that.option.defOptions){
            that.option.selOptions=that.option.defOptions;
        }
        $.each(that.option.options,function(opt,idx){
            var clsStr='';
            if(that.option.defOptions&&that.option.defOptions.has(opt)){
                clsStr=' class="selected"';
            }
            optStr.unshift('<li'+clsStr+' _click="UITools.select.select(this,'+idx+')">'+opt+'</li>');
        });
        $('.optWrapper',that.regionDom).innerHTML=optStr.join('');

    },
    select:function(item,idx){
        var that=this,
            selVal=that.option.options[idx];

        if(!that.option.multi){
            DOM.removeClass($$('.optWrapper li',that.regionDom),'selected');
            this.option.selOptions=[selVal];
            that.confirm();
        }else{
            if(!this.option.selOptions.has(selVal)){
                DOM.addClass(item,'selected');
                this.option.selOptions.push(selVal);
            }else{
                DOM.removeClass(item,'selected');
                this.option.selOptions.remove(selVal);
            }
        }
    },
    confirm:function(){
        var that=this,
            check=that.option.onConfirm&&that.option.onConfirm(that.option.selOptions);
        
        check&&that.hide();
    },
    cancel:function(){
        var that=this;
        that.option.onCancel&&that.option.onCancel();
        that.hide();
    }
});