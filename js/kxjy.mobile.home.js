/*页面初始化*/
;function executeLoad(){
    /*全局变量赋值*/
    HEAD = $('head');
    BODY = DOC.body;
    BODYFS = parseInt(getComputedStyle(BODY).fontSize);

    /*加载weinre debug工具*/
    // DOM.loadJs("http://192.168.40.28:8081/target/target-script.js",function(){alert('weinre test ok!')});
    
    /*取得GPS信息*/
    UserTools.getGpsInfo();

    /*预加载所有图片资源*/
    UserAction.preLoadResource(function(){
        /*页面历史管理初始化*/
        ViewMgr.init();
    });

    /*设置menu键*/
    Device.menuFunc=function(){
        UserMenus('menuBtn');
    }
}

Device.onLoad(executeLoad);

/*页面历史管理类,控制历史记录,页面跳转*/
var ViewMgr={
    tmpParams:"",//临时记录参数值
    recordLen:10,//记录历史页面最大长度
    pairPages:['mainPhoto','mainList','myPhoto','myList','hisPhoto','hisList'],//成双的页面
    getMsg:true,
    getDataInter:null,//轮询信息中心数据及Tips
    getDataTime:50000,//轮询信息中心数据,个人信息及Tips时间间隔 50秒 由于切换页面既取数据 间隔时间可以拉长以节省流量
    showTipsTimeout:null,
    // getTipsXhr:null,
    // getMsgXhr:null,
    init:function(){//取得历史页面
        delete WIN['pageEngine'];
        Device.disetBackBtn();
        WIN['pageEngine']=new PageEngine();
        ViewMgr.views=['login'];

        var storEmail=Mix.base.storage.get('kxjy_my_email'),
            storPwd=Mix.base.storage.get('kxjy_my_pwd'),
            ok=null,
            fail=function(){
                pageEngine.initPage('login');
                Mix.base.storage.remove("kxjy_view_history","session");
            };
        if(storEmail&&storPwd){
            UserAction.sendLogin(storEmail,storPwd,null,ok,fail);
        }else{
            fail();
        }

        Device.backFunc=[function(){ViewMgr.back();}];
    },
    gotoPage:function(page,params){
        var isBack=false,
            that=ViewMgr;
        that.stopGetData();
        page=page.replace("\.html","");
        var viewLen=that.views.length;
        if(that.checkLast(page)){
            if(/Photo/.test(page)){
                isBack=true;
            }
            that.views[viewLen-1]=page;
        }else if(that.views[viewLen-2]==page){//back
            that.views.pop(1);
            isBack=true;
        }else{
            if(viewLen>=that.recordLen)
                that.views.shift(1);
            that.views.push(page);
        }
        Mix.base.storage.set("kxjy_view_history",ViewMgr.views,"session");
        
        try{
            if(1==that.views.length){//设置返回按钮为历史回退
                pageEngine.initPage('login');
                Device.disetBackBtn();
            }else{
                Device.setBackBtn();    
            }
        }catch(e){}

        that.setUrl(page,params,isBack);
    },
    /*切换页面*/
    setUrl:function(url,params,back){
        if(!!params)
            ViewMgr.tmpParams=params;

        if(back){
            pageEngine.initPage(url,'right');    
        }else{
            pageEngine.initPage(url);    
        }
    },
    back:function(){//返回上一个历史页面
        var that=ViewMgr;
        that.stopGetData();
        var backPage=that.views[that.views.length-2];
        if(backPage){
            that.gotoPage(backPage);
        }
    },
    checkLast:function(page){//判断上一个页面是否因记录为同一个历史(e.g:mainPhoto和mainList不因重复记入历史)或者同一个页面
        var that=ViewMgr,
            lastPage=that.views[that.views.length-1];
        if(!that.pairPages.has(lastPage)){
            if(lastPage==page)
                return true;
            return false;
        }else{
            try{
                if(that.pairPages.has(page)&&/^(his|my|main)\w+/.exec(lastPage)[1]==/^(his|my|main)\w+/.exec(page)[1])
                return true;
            }catch(e){}
            return false;
        }
    },
    getData:function(init,cb){//轮询信息中心数据及Tips
        var that=ViewMgr;
        // that.stopGetData();//check if it'll make mistakes
        if(init){
            that.getMsgTips(init,cb);
        }else{
            that.getDataInter=setTimeout(
            function(){
                that.getMsgTips(false,cb);
            },that.getDataTime);
        }
    },
    stopGetData:function(){
        var that=ViewMgr;
        that.showingTips=false;//check

        if(that.getDataXhr){
            that.getDataXhr.abort();
            delete that.getDataXhr;
        }

        ViewMgr.isIniting=false;
        clearTimeout(that.getDataInter);
        clearTimeout(that.showTipsTimeout);
    },
    getMsgTips:function(init,cb){
        /*infoCenter*/
        if(ViewMgr.getMsg){
            if(init&&StorMgr.infoCenter){
                ViewMgr.noInfoNumDom=false;
                ViewMgr.infoNumDom=null;
                ViewMgr.hasFilledInfoCen=false;
                ViewMgr.showMsg(StorMgr.infoCenter);
            }
        }
        if(ViewMgr.isIniting){//防止过快切换页面发起重复请求
            return;
        }
        ViewMgr.isIniting=true;

        /*合并的接口*/
        var type=init?"1,2,3":"1,3",
            dataUrl=StorMgr.siteUrl+'/do.php?action=getInfo&type='+type+'&sid='+StorMgr.sid,
            secCb=function(data) {
                ViewMgr.isIniting=false;
                if(""==data.error){
                    ViewMgr.addTips(data.feed_flow);
                    ViewMgr.showMsg(data.centerInfo);
                    if(init){//初始时取个人信息
                        var encodeInfo=Mix.base.htmlEncodeObj(data.myInfo);
                        StorMgr.setMyInfo(encodeInfo);
                    }
                    cb&&cb();
                }
                ViewMgr.getData();
            },
            errCb=function(m) {
                ViewMgr.isIniting=false;
                ViewMgr.getData();
            };
        ViewMgr.getDataXhr=UserAction.sendAction(dataUrl,"","get",secCb,errCb);

    },
    showMsg:function(data){
        var that=ViewMgr;
        if(!data){return;}
        StorMgr.setInfoCenter(data);
        if(!that.hasFilledInfoCen||StorMgr.infoCenterChange){
            if('infoCenter'==pageEngine.curPage){
                InfoCenter.fill(data);
                that.hasFilledInfoCen=true;    
            }
        }

        if(that.noInfoNumDom)
            return;

        if(!that.infoNumDom){
            var ftLis=$$('#footer>div>div'),infoDiv;
            if(ftLis&&ftLis.length==5){
                infoDiv=ftLis[3];
            }else{
                that.noInfoNumDom=true;
                return;
            }

            if(infoDiv.children.length==3){
                that.infoNumDom=infoDiv.children[0];
            }else{
                var numDom=DOM.create('div');
                numDom.className="us uinl b-wh uba1 c-m1 c-red uc-a2 t-wh ulev-1 uinn1 newAmount";
                infoDiv.insertBefore(numDom,infoDiv.firstElementChild);
                that.infoNumDom=numDom;
            }
        }
        if(data.remindNum==0){
            that.infoNumDom.style.display="none";
        }else{
            that.infoNumDom.style.display="block";
        }
        if(that.infoNumDom.innerHTML!=data.remindNum)
            that.infoNumDom.innerHTML=data.remindNum;
    },
    addTips:function(data){//添加Tips
        var that=ViewMgr;
        that.tipsArray=that.tipsArray||[];
        if(data&&$.isArray(data)&&data.length>0){
            that.tipsArray=that.tipsArray.concat(data);
        }
        if(that.tipsArray.length>0&&!that.showingTips){
            that.showTips();
        }
    },
    showTips:function(){//显示Tips
        var that=ViewMgr;
        that.showingTips=false;
        if(!that.tipsArray.length){
            return;
        }

        var msg=that.tipsArray.shift();
        if(msg){
            that.showingTips=true;
            Mix.ui.tips.show({
                msg:'<img _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id='+msg.fromuid+'\')" style="height:2.5em" src="'+msg.avatarPicUrl+'" alt="" /> '+msg.nickname+' '+msg.content,
                contSel:"#content",
                hideT:5000});
            that.showTipsTimeout=setTimeout(function(){ViewMgr.showTips();},2000);
        }
    }
}

/*缓存资料管理*/
var StorMgr={
    myInfo:null,
    infoCenter:null,
    gpsInfo:null,
    myPic:null,//缓存我的照片
    myMood:null,//缓存我的心情
    mainPhoto:null,//缓存附近照片
    mainMood:null,//缓存附近动态
    destroy:function(){
        delete this.myInfo;
        delete this.myPhoto;
        delete this.myMood;
        delete this.mainPhoto;
        delete this.mainMood;
        delete this.infoCenter;
        delete this.myTodayExp;
    },
    initStor:function(){//初始化需要的缓存资料
        if(!this.myInfo||!this.infoCenter){
            ViewMgr.getData(true);
        }

        if(!this.gpsInfo){
            this.gpsInfo=Mix.base.storage.get("kxjy_my_gpsInfo");
        }
    },
    getMyInfo:function(cb){//取得我的信息并保存
        var that=StorMgr;
        ViewMgr.getData(true,function(){
            if(cb&&that.myInfo){
                cb(that.myInfo);
            }
        });
    },
    setMyInfo:function(o){
        Mix.base.storage.set("kxjy_my_myInfo",o,"session");
        this.myInfo=o;
    },
    setInfoCenter:function(o){
        if(Mix.base.sameObj(StorMgr.infoCenter,o)){
            this.infoCenterChange=false;
            return;
        }
        this.infoCenterChange=true;
        Mix.base.storage.set("kxjy_my_infoCenter",o,"session");
        this.infoCenter=o;
    }
}


/*信息中心相关*/
var InfoCenter={
    fill:function(data){
        var arr =['visitor_total','admirer_total','mood_lover_total','admire_each_other_total','commentor_total','last_rank','received_flowers_total','visit','comment','block','loved_mood','admire'],
            arrup =['privateMsg','notice','visitor','admirer','mood_lover','admire_each_other','commentor','current_rank','received_flowers'],
            numDoms=$$('.ulev-1'),
            key,
            val;

        for(var i=0,len=arr.length;i<len;i++){
            key=arr[i],
            val=data[key];
            if(key=='last_rank'){
                numDoms[i+2].innerHTML=(val==0)?"无排名":val;
                continue;
            }
            numDoms[i+2].className="tx-r t-blu ulev-1";
            numDoms[i+2].innerHTML=val;
        }

        for(var i=0,len=arrup.length;i<len;i++){
            key=arrup[i],
            val=data[arrup[i]];
            if(key=='current_rank'&&val!=data['last_rank']){
                var isUp=(val*1<data['last_rank']*1);
                numDoms[i].innerHTML='<img style="width:1em;" src="'+StorMgr.siteUrl+'/template/mobile/css/images/'+(isUp?'Rise':'Decline')+'.png" alt="排名"/> '+val;
                continue;
            }
            if('notice'==key&&val*1==0){
                numDoms[i].className="tx-r t-blu ulev-1";
                numDoms[i].innerHTML=0;
            }
            if(val*1>0&&key!='current_rank'){
                numDoms[i].innerHTML="+"+val;
                numDoms[i].className="us uinl b-wh uba1 c-m1 c-red uc-a2 t-wh ulev-1 uinn1";
            }
        }
    },
    clearUrl:{//清除信息中心的相关数据
        myList:'/allMood.php?ajax=1&${siduid}',
        attract:'/crush.php?ajax=1&${siduid}',
        commentMe:'/meComment.php?ajax=1&${siduid}',
        flowersList:'/flowersList.php?ajax=1&${siduid}'
    },
    clear:function(page,cb,ecb){
        if(!this.clearUrl[page])
            return;

        var clearUrl=InfoCenter.clearUrl[page].replace(/\$\{siduid\}/,UserTools.getSidUidParams()),
            url=StorMgr.siteUrl+clearUrl;

        UserAction.sendAction(url,"",'get',cb,ecb);
    }
}

/*他人信息记录缓存*/
var hisInfo={
    maxLength:5,//最多缓存人数
    storIDs:[],
    storInfos:{},
    storPics:{},
    storMoods:{},
    init:function(){
        var that=hisInfo,
            storId=Mix.base.storage.get("kxjy_his_storId");
        that.storIDs=storId?storId:[];
        that.curId=UserTools.getParamVal("user_id")||that.storIDs[0];

        //只取当前的,提升效率
        that.storInfos[that.curId]=that.get(that.curId);
    },
    get:function(id){
        var retObj=this.storInfos[id]||Mix.base.storage.get("kxjy_his_info_"+id);
        return retObj;
    },
    set:function(id,data){
        var that=hisInfo;
        Mix.base.storage.set("kxjy_his_info_"+id,data);
        that.storInfos[id]=data;

        var popId=that.storIDs[that.storIDs.length-1];
        if(that.storIDs.length>that.maxLength&&popId!=id){
            that.storIDs.pop(1);
            Mix.base.storage.remove("kxjy_his_info_"+popId);
            delete that.storInfos[that.curId];
            delete hisInfo.storPics[that.curId];
            delete hisInfo.storMoods[that.curId];
        }

        that.storIDs.remove(id);
        that.storIDs.unshift(id);
        Mix.base.storage.set("kxjy_his_storId",that.storIDs);
    }
}

/*页面内容管理
* 'myPhoto','myList','editInfo','myDetail','hisPhoto','hisList','hisDetail'使用
*/
var Page={
    init:function(name){
        var that=Page;
        that.destroy();
        that.name=name;
        that.getUserData();
    },
    refresh:function(){
        var that=Page;
        if(that.name){
            that.init(that.name);    
        }
    },
    dataUrlObj:{
        myDetail:'/mood.php?ajax=1&wid=${wid}&sid=${sid}',
        hisPhoto:'/profile.php?ajax=1&sid=${sid}&user_id=${user_id}',
        hisList:'/profile.php?ajax=1&sid=${sid}&user_id=${user_id}',
        hisDetail:'/moodHe.php?ajax=1&wid=${wid}&sid=${sid}'
    },
    destroy:function(){
        this.userData=null;
        this.name="";
        this.loadedMore=false;
        this.editedValues=[];
        this.editedErrors=[];
        this.dataXhr&&this.dataXhr.abort();
    },
    fullFillInfo:function(){
        var that=Page;
        if(!that.name||!that.userData){
            // toast("页面信息不充分，无法载入资料",2);
            return;
        }
        if('editInfo'==that.name){
            that.fullFillEditInfo();
            return;
        }

        var data=that.userData;

        //昵称
        var nickName=data.nickname||"&nbsp;";
        $('#header h1').innerHTML=/动态详情/.test($('#header h1').innerHTML)?nickName+"的动态详情":nickName;

        //达人
        if(data.colorPng&&data.colorPng!=""){
            $(".DynamicTrank").innerHTML='<img src="'+data.colorPng+'" alt="" />';
        }

        //头像
        if(data.avatar_file){
            var avatarDom=$('.myTitleAvatar')||$('.DynamicAvatar');
            avatarDom.innerHTML='<img src="'+data.avatar_file+'" alt="" />';
        }

        if($('.myTitleMenu')!=null){
            //排名
            var myRank,
                rankStr="<br />无排名";
            if(["myPhoto","myList"].has(that.name)){
                try{myRank=StorMgr.infoCenter['current_rank'];}
                catch(e){}                    
            }else{
                myRank=data.myRank;
            }
            if(myRank&&"无排名"!=myRank&&myRank*1!=0){
                    rankStr=myRank+"<br />排名";
            }
            $('#titleMenu-rank span').innerHTML=rankStr;
        }

        //加心
        if(["hisPhoto","hisList"].has(that.name)){
            if(data.islove==1){
                DOM.addClass($("#footer-love"),"select");
            }else{
                DOM.removeClass($("#footer-love"),"select");
            }
                
            if(data.friendnum&&data.friendnum>0){
                $("#footer-love .ulev-2").innerHTML="喜欢("+data.friendnum+")";
            }else{
                $("#footer-love .ulev-2").innerHTML="喜欢(0)";
            }
                
            if(data.isBlocked){
                DOM.addClass($("#footer-shield"),"select");
            }else{
                DOM.removeClass($("#footer-shield"),"select");
            }
        }

        if(["myDetail","hisDetail"].has(that.name)){
            $('.DynamicName').innerHTML=data.nickname;
            $('.DynamicNav .time').nextSibling.replaceWholeText(data.create_time||"不详");
            $('.DynamicNav .place').nextSibling.replaceWholeText(data.area||"不详");
            $('.DynamicText p').innerHTML=data.mood||"";
            if(data.iconid&&data.iconid!=0){
                $('.DynamicMood').innerHTML=('<img src="${siteUrl}/template/mobile/css/images/f_'+data.iconid+'.png" alt="xx" />').replace(/\$\{siteUrl\}/,StorMgr.siteUrl);
            }
            $('.DynamicImg').innerHTML=data.fileimg?'<img src="'+data.fileimg+'" alt="xx" />':"";

            if(data.islove){
                DOM.addClass($('.DynamicMenu .love'),'active');
            }

            $('.DynamicMenu .love').nextSibling.replaceWholeText(data.lovecount||0);
            $('.DynamicMenu .comment').nextSibling.replaceWholeText(data.commentcount||0);
        }else{
            $('.DynamicName').innerHTML=data.level?("&nbsp;LV"+data.level):"没有等级";
        }

        if(["myList","hisList","myDetail","hisDetail"].has(that.name)){
            return;
        }

        //地区，年龄，性别
        var address=(data.reside_province||data.reside_city)?data.reside_province+" "+data.reside_city:"地区不详";
        var age=(data.age)?data.age+"岁":"年龄不详";
        var gender=(typeof data.sex!="undefined")?dataArray.sex[data.sex]:"性别不详";
        $('#myInfo-1').innerHTML=[address,age,gender].join("/");

        //交友目的
        var target=(data.target&&0!=data.target*1)?"交友目的:"+dataArray.target[data.target-1]:"交友目的:不详";
        $('#myInfo-2').innerHTML=target;

        //个人描述
        var note=(data.note)?"个人描述:"+data.note:"个人描述:不详";
        $('#myInfo-3').innerHTML=note;
    },
    /*填充编辑资料内容*/
    fullFillEditInfo:function(){
        var that=Page,
            data=that.userData;

        that.editedValues=[];
        that.editedErrors=[];

        that.setEditVal("nickname",data.nickname||"",true);
        that.setEditVal("sex",dataArray.sex[data.sex
            ]||"",true);
        that.setEditVal("area",[data.reside_province,data.reside_city].join(" ")||"",true);
        that.setEditVal("birthDay",("0"!=data.birthyear&&"0"!=data.birthmonth&&"0"!=data.birthday)?[data.birthyear,data.birthmonth,data.birthday].join('-'):"",true);
        that.setEditVal("marry",dataArray.marry[data.marry-1]||"",true);
        that.setEditVal("target",dataArray.target[data.target-1]||"",true);
        that.setEditVal("note",data.note||"",true);
        that.setEditVal("qq",data.qq||"",true);
        that.setEditVal("mobile",data.mobile||"",true);

        var interestArr=data.interest?data.interest.sort(function(a,b){return a-b;}):[],
            interestStr=[];
        $.each(interestArr,function(num){
            interestStr.unshift(dataArray.interest[num-1]);
        });
        that.setEditVal("interest",interestStr.join(" "),true);
    },
    setEditVal:function(id,value,init){
        var that=Page,
            ipt=$("#"+id);
        if(init){
            ipt.setAttribute('default',value);
            ipt.innerHTML=value;
        }else{
            if(ipt.getAttribute('default')!=value){
                if(!that.editedValues.has(id))
                    that.editedValues.push(id);
            }else{
                that.editedValues.remove(id);
            }
            ipt.innerHTML=Mix.base.htmlEncode(value);
        }
    },
    submitEditInfo:function(){
        var that=Page,
            editedIds=that.editedValues;
        that.editedErrors=[];

        if(editedIds.length<=0){
            alert('你没有改变资料');
            return;
        }

        for(var len=editedIds.length;len--;){
            var id=editedIds[len],
                ipt=$("#"+id),
                iptVal=encodeURIComponent(Mix.base.htmlDecode(ipt.innerHTML));
            switch(id){
                case 'nickname':
                case 'note':
                case 'qq':
                case 'mobile':
                    that.sendEditVal(id+"="+iptVal,id);
                    break;
                case 'sex':
                case 'marry':
                case 'target':
                    var idx=dataArray[id].indexOf(ipt.innerHTML);
                    if('sex'!=id)
                        idx++;
                    that.sendEditVal(id+"="+idx,id);
                    break;
                case 'interest':
                    var inters=ipt.innerHTML.split(" "),
                        sels=[];
                    $.each(inters,function(inter){
                        var idx=dataArray['interest'].indexOf(inter);
                        sels.unshift(idx+1);
                    });
                    if(sels.length>0){
                        that.sendEditVal(id+"="+sels.join(','),'interest');
                    }
                    break;
                case 'birthDay':
                    var datas=ipt.innerHTML.split("-");
                    if(datas.length==3)
                        that.sendEditVal("birthyear="+datas[0]+"&birthmonth="+datas[1]+"&birthday="+datas[2],'birthDay');
                    break;
                case 'area':
                    var datas=ipt.innerHTML.split(" ");
                    if(datas.length==2)
                        that.sendEditVal("reside_province="+datas[0]+"&reside_city="+datas[1],'area');
                    break;
            }
        }
    },
    sendEditVal:function(params,id){
        var that=Page;
        function check(){//检查是否保存完成
            if(that.editedValues.length<=0){
                if(that.editedErrors.length>0){
                    toast(that.editedErrors.join("\n"));
                }else{
                    toast('保存成功!');
                    setTimeout(function(){
                        ViewMgr.gotoPage('myPhoto');//编辑成功后返回个人主页
                    },1500);
                    
                }
                that.editedErrors=[];
                that.editedValues=[];
            }
        }

        var ipt=$("#"+id),
            dataUrl=StorMgr.siteUrl+"/do.php",
            param="action=setting&sid="+StorMgr.sid+"&"+params,
            secCb=function(a){
                that.editedValues.remove(id);
                if(a.error){
                    ipt.innerHTML=ipt.getAttribute("default");
                    var errMsg=that.filterError(a.error);
                    that.editedErrors.push(errMsg);
                }else{
                    ipt.setAttribute("default",ipt.innerHTML);    
                }
                check();
            },
            errCb=function(m){
                that.editedValues.remove(id);
                ipt.innerHTML=ipt.getAttribute("default");
                var errMsg=that.filterError(m.error);
                    that.editedErrors.push(errMsg);
                check();
            };
        that.dataXhr=UserAction.sendAction(dataUrl,param,"post",secCb,errCb);
    },
    filterError:function(errMsg){//明确报错内容
        var reMsg="";
        if(/不能超过12个字符/.test(errMsg)){
            reMsg="昵称不能超过12个字符";
        }else{
            reMsg=errMsg;
        }
        return reMsg;
    },
    showMore:function(){
        var that=Page,
            infoUl=$('ul.myInfo'),
            moreBtn=$("#titleMenu_more span");
        
        function insertLi(info){
            var li=DOM.create('li');
            li.className="insertLi";
            li.innerHTML=info;
            infoUl.appendChild(li);
        }

        if(!that.name||!that.userData){
            // toast("页面信息不充分，无法载入资料");
            return;
        }

        if(that.loadedMore){
            if(DOM.hasClass(infoUl,'showMore')){
                DOM.removeClass(infoUl,'showMore');
                moreBtn.innerHTML="更多资料";
            }else{
                DOM.addClass(infoUl,'showMore');
                moreBtn.innerHTML="收起更多";
            }
            return;
        }

        var data=that.userData;

        dataArray.blood[data.blood-1]&&insertLi("血型:"+dataArray.blood[data.blood-1]);
        dataArray.ethnic[data.ethnic-1]&&insertLi("民族:"+dataArray.ethnic[data.ethnic-1]);
        (data.tall&&data.tall!="0")&&insertLi("身高:"+data.tall+"cm");
        (data.birth_province||data.birth_city)&&insertLi("籍贯:"+data.birth_province+" "+data.birth_city);
        (data.weight&&data.weight!="0")&&insertLi("体重:"+data.weight+"kg");

        //个性
        if(data.personality.length>0){
            var persStr=[];
            $.each(data.personality,function(o,i){
                persStr.push(dataArray.personality[o-1]);
            });
            insertLi("个性:"+persStr.join(","));
        }
        DOM.addClass(infoUl,'showMore');
        moreBtn.innerHTML="收起更多";
        that.loadedMore=true;
    },
    getUserData:function(){
        var that=Page,
            dataUrl,
            secCb=function(a){
                if(a.error){toast(a.error,3);
                    return;
                }

                that.userData=a.myInfo||a.userInfo;
                if(a.moodContent){//动态详情加入心情信息
                    extend(that.userData,a.moodContent);
                }

                that.userData=Mix.base.htmlEncodeObj(that.userData);//html,js转义

                if(['hisPhoto','hisList'].has(that.name)){
                    extend(that.userData,{myRank:a.myRank,isBlocked:a.isBlocked});
                    if(Mix.base.sameObj(that.userData,hisInfo.get(hisInfo.curId),['update_time','lastlogintime'])){
                        return;
                    }
                    hisInfo.set(hisInfo.curId,that.userData);
                }
                that.fullFillInfo();
            },
            errCb=function(){};

        that.userData=null;

        //取缓存数据
        if(['myPhoto','myList','editInfo'].has(that.name)){
            that.userData=StorMgr.myInfo;
            StorMgr.getMyInfo(function(data){
                if(!Mix.base.sameObj(data,that.userData,['update_time','lastlogintime'])){
                    that.userData=data;
                    that.fullFillInfo();
                }
            },true);
        }else{
            dataUrl=StorMgr.siteUrl+UserTools.compileUrl(that.dataUrlObj[that.name]);
            that.dataXhr=UserAction.sendAction(dataUrl,"","get",secCb,errCb);
        }

        if(['hisPhoto','hisList'].has(that.name)){
            hisInfo.init();
            that.userData=hisInfo.get(hisInfo.curId);
        }
        if(!!that.userData){
            that.fullFillInfo();
        }
        UserAction.getPicMood(pageEngine.curPage);
    },
    setDataNum:function(){
        var that=Page;
        if(['myPhoto','hisPhoto'].has(that.name)&&$('.myTitleMenu')!=null){
            $('#titleMenu-pic span').innerHTML=Feed.dataCount+"<br />照片";
        }
        if(['myList','hisList'].has(that.name)&&$('.myTitleMenu')!=null){
            $('#titleMenu-mood span').innerHTML=Feed.dataCount+"<br />心情";
        }
    }
}


/*相关信息对应数组*/
var dataArray={
    sex:['男','女'],
    target:['找男孩','找女孩','约会','友谊','玩伴','激情','艳遇','亲密关系','真情','婚姻'],
    ethnic:['阿昌族','白族','保安族','布朗族','布依族','朝鲜族','达斡尔族','傣族','德昂族','侗族','东乡族','独龙族','鄂伦春族','俄罗斯族','鄂温克族','高山族','仡佬族','哈尼族','哈萨克族','赫哲族','回族','基诺族','京族','景颇族','柯尔克孜族','拉祜族','黎族','傈僳族','珞巴族','满族','毛南族','门巴族','蒙古族','苗族','仫佬族','纳西族','怒族','普米族','羌族','撒拉族','畲族','水族','塔吉克族','塔塔尔族','土族','土家族','佤族','锡伯族','乌兹别克族','瑶族','彝族','裕固族','藏族','维吾尔族','壮族','其它','汉族'],
    blood:['A型','B型','AB型','O型','其它'],
    personality:['温柔','浪漫','成熟','腼腆','幽默','善良','可爱','忠厚','前卫','热辣','豪放'],
    interest:['上网','摄影','音乐','动漫','电玩','汽车','写作','影视','购物','唱歌','跳舞','读书','运动','动物','园艺','烹饪','投资','手工艺','绘画','美食','旅游','其他'],
    marry:['单身','已婚','同居','分居','离婚','不想说']
}

/*记录常用正则*/
var regExpObj={
    email:/^.+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
}

/*用户执行的一些服务器请求*/
var UserAction={
    x:null,
    stop:function(){
        UserAction.sendingMood=false;
        UserAction.sendingDelete=false;
        UserAction.sendingLove=false;
        UserAction.sendingShield=false;
        UserAction.sendingLogin=false;
        UserAction.sendingRegist=false;
        UserAction.sendingResetPwd=false;
        UserAction.sendingFeedBack=false;
        this.x&&this.x.abort();
    },
    /*秀心情*/
    showMood:function(imgDom,iconDom,moodDom){
        if(UserAction.sendingMood){//防止重复发送
            return;
        }

        var hasImg=(imgDom.childNodes.length>0),
            actionUrl=StorMgr.siteUrl,
            iconid=iconDom.getAttribute('iconid'),
            title=moodDom.value,
            params;

        if(!hasImg&&title==""){
            toast('你还没有编辑心情',2);
            return;
        }
        
        if(hasImg){
            actionUrl+="/do.php?sid="+StorMgr.sid+"&uploadFlag=1&";
            params="action=addweibo&type=1";
        }else{
            actionUrl+="/weibo.php?sid="+StorMgr.sid+"&";
            params="action=addweibo&type=2";
        }

        title=title.trim();
        if(title.chineseLen()>139){
            toast('心情内容过长',2);
            return;
        }

        params+="&title="+encodeURIComponent(title)+"&iconid="+iconid;

        if(StorMgr.gpsInfo){//加入经纬度
            params+="&latitude="+StorMgr.gpsInfo['lat']+"&longitude="+StorMgr.gpsInfo['log'];
        }

        secCb=function(){
            toast('发布成功!',1.5);
            imgDom.innerHTML="";
            moodDom.value="";
            setTimeout(function(){
                ViewMgr.gotoPage('myList');//秀心情成功后返回个人主页-心情
                UserAction.sendingMood=false;
            },1500);
        }

        errCb=function(m){
            toast(m.error);
            UserAction.sendingMood=false;
        }

        UserAction.sendingMood=true;
        UserAction.sendAction(actionUrl,params,"get",secCb,errCb);

    },
    /*删除照片,心情或评论*/
    deleteData:function(type,node,wid,cb){
        if(UserAction.sendingDelete){//防止重复发送
            return;
        }
        var actionUrl=StorMgr.siteUrl+"/weibo.php?"+UserTools.getSidUidParams(),
            params="",secCb,errCb,paraLi,msg,doneMsg;
        if(type=="pic"){
            msg='确定删除该照片么?';
            doneMsg='已删除该照片！';
            paraLi=DOM.findParent(node,'.mainList',true);
            params="action=selectdel&type=1&wid[]="+wid;
        }else if(type=="mood"){
            msg='确定删除该心情么?';
            doneMsg='已删除该心情！';
            if(!!wid){
                paraLi=DOM.findParent(node,'.DynamicMoodBox',true);
                params="action=del&type=2&wid="+wid;
            }else{
                params="action=del&type=2&wid="+UserTools.getParamVal('wid');
            }
        }else if(type=="comment"){
            msg='确定删除该评论么?';
            doneMsg='已删除该评论！';
            paraLi=node;
            params="action=del&wid="+wid;
        }

        secCb=function(){
            toast(doneMsg,2);

            cb&&cb();

            if(!!wid){
                Page.refresh();
                Feed.refresh();
            }else{
                ViewMgr.back();
            }
            UserAction.sendingDelete=false;
        }

        errCb=function(m){
            if(m.error){
                toast(m.error);
            }else{//check
                if(/myDetail/.test(pageEngine.curPage)){
                    ViewMgr.back();    
                }
            }
            UserAction.sendingDelete=false;
        }

        Device.confirm(msg,function(){
            UserAction.sendingDelete=true;
            //附带删除照片check
            try{
                var picParams=params.replace('action=del&type=2&wid','action=selectdel&type=1&wid[]'),
                    sendCb=function(){
                        UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
                    };
                UserAction.sendAction(actionUrl,picParams,"get",sendCb,sendCb);
            }catch(e){UserAction.sendingDelete=false;}
        });
    },
    /*举报*/
    reportData:function(type,node,wid){
        var actionUrl=StorMgr.siteUrl+"/weibo.php",
            params="sid="+StorMgr.sid+"&action=report&wid="+(wid||UserTools.getParamVal('wid')),
            reportDom=node.lastChild,
            secCb=function(){
                toast('举报心情操作成功!',2);
                var repNum=/举报\((\d+)\)/.exec(reportDom.wholeText)[1];
                reportDom.replaceWholeText("举报("+(parseInt(repNum)+1)+")");
            },
            errCb=function(m){
                toast(m.error);
            }
        UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
    },
    /*喜欢人或心情*/
    loveData:function(type,node,wid){
        if(UserAction.sendingLove){//防止重复发送
            return;
        }

        var actionUrl,
            params="",
            secCb,
            errCb,
            userInfo=Page.userData,
            loveDom;

        if(type=='mood'){//心心情
            var loveIcon=node.firstElementChild;
            if(DOM.hasClass(loveIcon,"active")){
                toast('你已经心过这条心情!',2);
            }else{
                actionUrl=StorMgr.siteUrl+"/weibo.php?action=love&sid="+StorMgr.sid+"&wid="+(wid||UserTools.getParamVal('wid'));
                loveDom=node.lastChild;
                secCb=function(){
                    var loveNum=loveDom.wholeText;
                    loveDom.replaceWholeText(parseInt(loveNum)+1);
                    DOM.addClass(loveIcon,"active");
                    if(['myDetail','hisDetail'].has(pageEngine.curPage)){
                        Page.refresh();
                        Feed.refresh();
                    }
                    UserAction.sendingLove=false;
                },
                errCb=function(m){
                    toast(m.error);
                    UserAction.sendingLove=false;
                }
                UserAction.sendingLove=true;
                UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
            }
        }

        if(type=='people'){//心人
            actionUrl=StorMgr.siteUrl+"/do.php";
            params="sid="+StorMgr.sid+"&user_id="+UserTools.getParamVal('user_id');
            loveDom=$("#footer-love .ulev-2");

            if(!userInfo)
                return;
            if(userInfo.islove!=1){
                params+="&action=admire";
                secCb=function(m){
                    DOM.addClass(node,"select");
                    userInfo.friendnum++;
                    userInfo.islove=1;
                    hisInfo.storInfos[hisInfo.curId].friendnum=userInfo.friendnum;
                    hisInfo.storInfos[hisInfo.curId].islove=1;
                    loveDom.innerHTML="喜欢("+userInfo.friendnum+")";
                    UserAction.sendingLove=false;
                }
                errCb=function(m){
                    toast(m.error);
                    UserAction.sendingLove=false;
                }
                UserAction.sendingLove=true;
                UserAction.sendAction(actionUrl,params,"post",secCb,errCb);
            }else{
                params+="&action=disadmire";
                secCb=function(m){
                    DOM.removeClass(node,"select");
                    userInfo.friendnum--;
                    userInfo.islove=0;
                    hisInfo.storInfos[hisInfo.curId].friendnum=userInfo.friendnum;
                    hisInfo.storInfos[hisInfo.curId].islove=0;
                    loveDom.innerHTML="喜欢("+userInfo.friendnum+")";
                    UserAction.sendingLove=false;
                }
                errCb=function(m){
                    toast(m);
                    UserAction.sendingLove=false;
                }
                UserAction.sendingLove=true;
                Device.confirm('你确定要取消心TA吗?',function(){
                    UserAction.sendAction(actionUrl,params,"post",secCb,errCb);
                });
            }
        }
    },
    /*取消心人(相互吸引页面)*/
    disadmire:function(type,node,user_id){
        if(type=="people"){
            var actionUrl=StorMgr.siteUrl+"/do.php",
                params="action=disadmire&sid="+StorMgr.sid+"&user_id="+user_id;
            secCb=function(m){
                Feed.removeFeed(node.parentNode);
                if(hisInfo.storInfos[hisInfo.curId]){
                    hisInfo.storInfos[hisInfo.curId].islove=0;
                    hisInfo.storInfos[hisInfo.curId].lovecount--;
                }
            }
            errCb=function(m){
                toast(m);
            }
            Device.confirm('你确定要取消心TA吗?',function(){
                UserAction.sendAction(actionUrl,params,"post",secCb,errCb);
            });
        }
    },
    /*送鲜花*/
    sendFlower:function(){
        toast('暂未提供送鲜花功能',2);
    },
    /*屏蔽,取消屏蔽*/
    shieldPerson:function(type,node,user_id){
        if(UserAction.sendingShield){//防止重复发送
            return;
        }
        var actionUrl=StorMgr.siteUrl+"/do.php",
            params="sid="+StorMgr.sid,
            secCb,
            errCb,
            msg='你确定要屏蔽TA吗?';

        secCb=function(m){
            if(type=="del"){
                Feed.removeFeed(node);
                hisInfo.storInfos[user_id].isBlocked=false;
                toast('已取消屏蔽',2);
            }else{
                if(DOM.hasClass(node,"select")){
                    hisInfo.storInfos[hisInfo.curId].isBlocked=false;
                    DOM.removeClass(node,"select");
                }else{
                    hisInfo.storInfos[hisInfo.curId].isBlocked=true;
                    DOM.addClass(node,"select");
                    toast("屏蔽成功",1);
                    setTimeout(function(){ViewMgr.back();},1000);
                }
            }
            UserAction.sendingShield=false;
        }
        errCb=function(m){
            toast(m.error);
            UserAction.sendingShield=false;
        }

        if(type=="del"){//取消屏蔽
            params+="&user_id="+user_id+"&type=del&action=block_user&id="+user_id;
            Device.confirm('确认取消屏蔽?',function(){
                UserAction.sendingShield=true;
                UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
            });
        }else{
            if(DOM.hasClass(node,"select")){
                params+="&user_id="+UserTools.getParamVal('user_id')+"&type=del&action=block_user&id="+UserTools.getParamVal('user_id');
                Device.confirm('确认取消屏蔽?',function(){
                    UserAction.sendingShield=true;
                    UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
                });
                
            }else{
                params+="&user_id="+UserTools.getParamVal('user_id')+"&action=block_user";
                Device.confirm(msg,function(){
                    UserAction.sendingShield=true;
                    UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
                });
            }
        }
    },
    /*登陆验证*/
    checkLogin:function(nSel,pSel,node){
        var mailVal = $(nSel).value,
            passVal = $(pSel).value;
        
        if(mailVal.length==0){
            toast("请输入您的邮箱地址！",2);
            return;
        }
        if(!regExpObj['email'].test(mailVal)){
            toast("邮箱地址有误！",2);
            return;
        }
        if(passVal.length==0){
            toast("请输入您的密码！",2);
            return;
        }

        UserAction.sendLogin(mailVal,passVal,node);
    },
    sendLogin:function(mail,pwd,btn,ok,fail){
        if(UserAction.sendingLogin){//防止重复发送
            return;
        }
       
        var checkUrl=StorMgr.siteUrl+"/userLogin.php",
            params='email='+encodeURIComponent(mail)+'&password='+encodeURIComponent(pwd),
            secCb=function(a) {
                if(a.msg){
                    toast(a.msg);
                    if($.isFunc(fail)){
                        fail();
                    }
                    UserAction.sendingLogin=false;
                    return;
                }

                UserTools.refresh();//刷新数据check

                Mix.base.storage.set('kxjy_my_email',mail);
                Mix.base.storage.set('kxjy_my_pwd',pwd);

                StorMgr.uid=a.uid;
                StorMgr.userKey=a.userKey;

                ViewMgr.gotoPage('mainPhoto');
                if($.isFunc(ok)){
                    ok();
                }
                Device.setMenuBtn();
                UserAction.sendingLogin=false;
            },
            errCb=function(e){
                toast(e.msg);
                if($.isFunc(fail)){
                    fail();
                }
                UserAction.sendingLogin=false;
            };

        if(StorMgr.gpsInfo){//加入经纬度
            params+="&latitude="+StorMgr.gpsInfo['lat']+"&longitude="+StorMgr.gpsInfo['log'];
        }

        UserAction.sendingLogin=true;
        UserAction.sendAction(checkUrl,params,"get",secCb,errCb);
    },
    getVerify:function(){//获得验证码
        var veriNode=$("#verify"),
            url=StorMgr.siteUrl+"/verify.php?sid="+StorMgr.sid+"&time="+new Date().getTime(),
            img=$("img",veriNode);
            
        if(!img){
            img=DOM.create('img');
            img.src=url;
            veriNode.appendChild(img);    
        }else{
            img.src=url;
        }
    },
    /*注册*/
    userRegist:function(){
        if(UserAction.sendingRegist){//防止重复发送
            return;
        }
        var sex=$("#regSex").value,
            email=$("#regEmail").value,
            nickname=$("#regNickName").value,
            password=$("#regPwd").value,
            passwordR=$("#regPwdR").value,
            imgcode=$("#regVeri").value,
            url=StorMgr.siteUrl+"/register.php?sid="+StorMgr.sid,
            secCb=function(a){
                if(1==a.error){
                    toast(a.msg);
                    UserAction.getVerify();
                    UserAction.sendingRegist=false;
                    return;
                }
                toast('注册成功,将自动登陆',0.6);
                setTimeout(function(){
                    UserAction.sendingRegist=false;
                    UserAction.sendLogin(email,password);
                },500);
            },errCb=function(a){
                if(1==a.error){
                    toast(a.msg);
                    UserAction.getVerify();
                    UserAction.sendingRegist=false;
                    return;
                }
            };

        function checkReg(){
            if(0==email.length){
                throw {msg:'请输入您的邮箱地址'};
            }
            if(!regExpObj['email'].test(email)){
                throw {msg:'邮箱地址有误'};
            }
            if(0==nickname.length){
                throw {msg:'请输入您的昵称'};
            }
            if(nickname.chineseLen()>6){
                throw {msg:'昵称超过指定长度'};
            }
            if(0==password.trim().length){
                throw {msg:'请输入您的密码'};
            }
            if(password!=passwordR){
                throw {msg:'两次密码不一致'};
            }
            if(0==imgcode){
                throw {msg:'请输入验证码'};
            }
            if(4!=imgcode.length){
                throw {msg:'验证码有误'};
            }
        }
        try{
            checkReg();
            var emailVal=encodeURIComponent(email),
                nickVal=encodeURIComponent(nickname),
                pwdVal=encodeURIComponent(password),
                imgVal=encodeURIComponent(imgcode);
            url+="&sex="+sex+"&email="+emailVal+"&nickname="+nickVal+"&password="+pwdVal+"&imgcode="+imgVal;
            if(StorMgr.gpsInfo){//加入经纬度
                url+="&latitude="+StorMgr.gpsInfo['lat']+"&longitude="+StorMgr.gpsInfo['log'];
            }
            UserAction.sendingRegist=true;
            UserAction.sendAction(url,"","get",secCb,errCb);
        }catch(e){
            toast(e.msg);
        }
    },
    /*验证密码*/
    checkPassword:function(psw,ok,err){
        var checkUrl=StorMgr.siteUrl+"/userLogin.php",
            params='email='+encodeURIComponent(StorMgr.myInfo.email)+'&password='+encodeURIComponent(psw),
            secCb=function(a) {
                if(a.msg){
                    err(a.msg);
                    return;
                }
                ok();
            },
            errCb=function(e){
                err(e.msg);
            };

        UserAction.sendAction(checkUrl,params,"get",secCb,errCb);
    },
    /*修改密码*/
    changePassword:function(oSel,nSel,cSel){
        var oVal=$(oSel).value,
            nVal=$(nSel).value,
            cVal=$(cSel).value;
        if(oVal.length==0||nVal.length==0||cVal.length==0){
            toast("请填完所有输入框",2);
            return;
        }
        if(0==oVal.trim().length){
            toast("当前密码为空",2);
            return;
        }
        if(0==nVal.trim().length){
            toast("请输入新密码",2);
            return;
        }
        if(nVal!=cVal){
            toast("两次新密码不相同",2);
            return;
        }
        var setUrl=StorMgr.siteUrl+"/do.php?action=account_setting&sid="+StorMgr.sid,
            params='password='+encodeURIComponent(nVal),
            secCb=function(a){
                if(a.error)
                    toast(a.error)
                reset();
            },
            errCb=function(e){
                toast(e.msg);
            };
        /*修改成功*/
        function reset(){
            toast('密码已经修改！',2);
            $(oSel).value="";
            $(nSel).value="";
            $(cSel).value="";
            setTimeout(function(){
                    ViewMgr.back();//返回
                },2000);
            
        }
        /*发送修改请求*/
        function sendModiPwd(){
            UserAction.sendAction(setUrl,params,"get",secCb,errCb);
        }
        /*能取得email就验证旧密码*/
        if(StorMgr.myInfo.email){
            UserAction.checkPassword(oVal,sendModiPwd,function(m){
                if("密码错误"==m){
                    toast("当前密码错误");
                }else{
                    toast(m);    
                }
            });
        }else{
            sendModiPwd();
        }
    },
    /*取得mood或picture
    * 'myPhoto','myList','hisPhoto','hisList'
    */
    getPicMood:function(page){
        if(!['myPhoto','myList','hisPhoto','hisList'].has(page)){
            return;
        }
        var picUrl=UserTools.compileUrl(pageFeedUrl[page].replace(/&type=\d+/,'&type=1')),
            moodUrl=UserTools.compileUrl(pageFeedUrl[page].replace(/&type=\d+/,'&type=2')),
            sendUrl,
            secCb=function(a){
                if('myList'==page){
                    StorMgr.myPhoto=JSON.stringify(a);
                }
                if('hisList'==page){
                    hisInfo.storPics[hisInfo.curId]=JSON.stringify(a);
                }
                try{$('#titleMenu-pic span').innerHTML=a.datacount+"<br/>照片";}catch(e){}
            };
        if(/List/.test(page)){
            sendUrl=StorMgr.siteUrl+picUrl;
        }else{
            sendUrl=StorMgr.siteUrl+moodUrl;
            secCb=function(a){
                if('myPhoto'==page){
                    StorMgr.myMood=JSON.stringify(a);
                }
                if('hisPhoto'==page){
                    hisInfo.storMoods[hisInfo.curId]=JSON.stringify(a);
                }
                try{$("#titleMenu-mood span").innerHTML=a.datacount+"<br/>心情";}catch(e){}
            }
        }
        
        var cacheData=null;
        switch(page){
            case 'myPhoto':
                cacheData=StorMgr.myMood;
                break;
            case 'myList':
                cacheData=StorMgr.myPhoto;
                break;
            case 'hisPhoto':
                cacheData=hisInfo.storMoods[hisInfo.curId];
                break;
            case 'hisList':
                cacheData=hisInfo.storPics[hisInfo.curId];
                break;
        }
        if(cacheData){
            secCb(JSON.parse(cacheData));
            return;
        }

        UserAction.sendAction(sendUrl,"","get",secCb,null);
    },
    /*重置密码*/
    resetPwd:function(emailIpt){
        if(UserAction.sendingResetPwd){//防止重复发送
            return;
        }
        var findUrl=StorMgr.siteUrl+"/findPassword.php?email=",
            emailVal=emailIpt.value,
            secCb=function(a){
                if(a.error){
                    toast(a.msg||"未能正确发送新密码！",2);
                    UserAction.sendingResetPwd=false;
                }else{
                    toast("新密码已发送！",1);
                    setTimeout(function(){
                        ViewMgr.back();
                        UserAction.sendingResetPwd=false;
                    },1000);
                }
            },
            errCb=function(a){
                toast(a.msg||"未能正确发送新密码！",2);
                UserAction.sendingResetPwd=false;
            };
        if(0==emailVal.length){
            toast('请输入您的邮箱地址！',2);
            return;
        }
        if(!regExpObj['email'].test(emailVal)){
            toast("邮箱地址有误！",2);
            return;
        }
        UserAction.sendingResetPwd=true;
        UserAction.sendAction(findUrl+encodeURIComponent(emailVal),"","get",secCb,errCb);
    },
    /*发送意见反馈*/
    sendFeedBack:function(fbIpt){
        if(UserAction.sendingFeedBack){//防止重复发送
            return;
        }
        var fbUrl=StorMgr.siteUrl+"/help.php?ajax=1&type=1&sid="+StorMgr.sid,
            fb=fbIpt.value,
            secCb=function(a){
                if(a.error){
                    toast(a.error,1);
                }else{
                    toast("提交成功!",1);
                    setTimeout(function(){ViewMgr.back();},1000);
                }
                UserAction.sendingFeedBack=false;
            },
            errCb=function(a){
                toast(a.error,2);
                UserAction.sendingFeedBack=false;
            };
        if(0==fb.length){
            toast('发送内容不能为空！',2);
            return;
        }
        UserAction.sendingFeedBack=true;
        UserAction.sendAction(fbUrl,"message="+encodeURIComponent(fb),"post",secCb,errCb);
    },
    /*检测应用是否有新版本*/
    checkAppVersion:function(){
        var checkUrl=StorMgr.siteUrl+"/mobileVersion.php?ver=",
            secCb=function(a){
                if(0==a.newVersion){
                    toast("您当前为最新版本。",2);
                }else if(1==a.newVersion){
                    function getPlatStr(plat){
                        var url=a[plat],
                            downUrl='wgt://data/kxjy.apk';
                        if("ios"==plat){
                          Device.loadApp(url);
                        }
                        if("android"==plat){
                            Device.download(url,downUrl,function(){
                                Device.installApp(downUrl);
                            });
                        }
                    }
                    function downloadNew(){//下载新版本
                        Device.getPlatForm(getPlatStr);
                    }
                    Device.confirm(a['str'],downloadNew,null,["现在更新","以后再说"],"有新版本，是否下载?");
                }
            },
            errCb=function(){
                toast("检测无法成功，请检查你的网络配置。",2);
            };
        function verCb(ver){
            UserAction.sendAction(checkUrl+ver,"","get",secCb);
        }
        Device.alert('检测完成','您当前为最新版本。','我知道了');
        // Device.getAppVersion(verCb);
    },
    /*用户退出*/
    logOut:function(){
        Device.confirm('确定注销用户？',function(){
            UserTools.refresh();
            Mix.base.storage.clear();
            ViewMgr.init();
            Device.disetMenuBtn();
        },null,null,'注销提示');
    },
    /*预加载资源图片*/
    preLoadResource:function(cb){
        var progressDom=DOM.create('div',{className:'ui_progress'}),
            progressInte=DOM.create('div',{className:'inner'}),
            proTxt=DOM.create('div',{className:'text'}),
            loadDom=DOM.create('div',{style:{'position':'absolute','height':'0','left':'10000em'}}),
            imgDir1=StorMgr.siteUrl+'/template/mobile/css/images/',
            imgs1=['f_1.png',
                    'f_2.png',
                    'f_3.png',
                    'f_4.png',
                    'f_5.png',
                    'list.png',
                    'icon-search-black.png',
                    'love.png',
                    'love-act.png',
                    'mood.png',
                    'plus.gif',
                    'pull-icon@2x.png',
                    'photo.png',
                    'close.png',
                    'comment.png',
                    'delete.png',
                    'plus.png',
                    'yes.png',
                    'on-off.png'],
            imgDir2=StorMgr.siteUrl+'/template/mobile/css/res-apple/',
            imgs2=['home.png',
                    'info.png',
                    'menu.png',
                    'set.png',
                    'shop.png',
                    'talk.png',
                    'tp-blacklist.png',
                    'tp-commnet.png',
                    'tp-flower.png',
                    'tp-love.png'],
            loadedNum=0,
            totleNum=29,
            startT=Date.now(),
            inter=setTimeout(function(){
                finishLoad();
            },30000),
            finished=false;
            
            progressDom.appendChild(progressInte);
            progressDom.appendChild(proTxt);
            BODY.appendChild(loadDom);
            BODY.appendChild(progressDom);

        function oneLoad(){
            loadedNum++;
            var p=Math.ceil(loadedNum*100/totleNum)+"%";
            proTxt.innerHTML=p;
            progressInte.style.width=p;
            if(loadedNum>=totleNum){
                progressDom.style.opacity=0;
                cb();
                setTimeout(function(){
                    finishLoad();
                },500);
                
            }
        }
        function finishLoad(){
            if(finished)
                return;
            clearTimeout(inter);
            BODY.removeChild(progressDom);
            BODY.removeChild(loadDom);
            finished=true;
        }

        $.each(imgs1,function(imgUrl,idx){
            var img=new Image();
            img.src=imgDir1+imgUrl;
            img.onload=function(){
                oneLoad();
            }
            loadDom.appendChild(img);
        });
        $.each(imgs2,function(imgUrl,idx){
            var img=new Image();
            img.src=imgDir2+imgUrl;
            img.onload=function(){
                oneLoad();
            }
            loadDom.appendChild(img);
        });
    },
    /*执行ajax请求*/
    sendAction:function(url,data,method,secCb,errCb){
        var x=new Mix.x({
            method:method||'get',
            dataType:'json'
        });
        x.onLoad=function(){
            var resp=x.response;
            if(resp.error&&resp.error!=""){
                errCb?errCb(resp):toast(resp.error||resp.msg);
                return;
            }
            secCb&&secCb(resp);
        }
        x.onFail=function(){
            if(errCb&&x.response){
                errCb(x.response);
            }
        }
        x.send(url,data);
        this.x=x;
        return x;
    }
}

/*涉及到应用的一些工具类*/
var UserTools={
    /*清除缓存和一些记录的变量值,用户退出时需要*/
    refresh:function(){
        // Mix.base.storage.clear();//gps等信息
        Mix.base.storage.clear('session');
        UserTools.sidUidParam=null;
        StorMgr.destroy();
    },
    /*取sid和uid参数字符串*/
    getSidUidParams:function(gotoUrl,setParams){
        var paramStr;
        if(UserTools.sidUidParam){
            return UserTools.sidUidParam;
        }

        if(StorMgr.uid&&StorMgr.userKey){
            paramStr="sid="+StorMgr.sid+"&uid="+StorMgr.uid+"&userKey="+StorMgr.userKey;
            UserTools.sidUidParam=paramStr;
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
                return UserTools.getParamVal(c);
            });
        return reUrl;
    },
    /*表情字符串正则转换图片*/
    filterMsgFace:function(str){
        if(str){return str = str.replace(/\[(face(\d+))\]/g, "<img src='"+StorMgr.siteUrl+"/images/face/$1.gif' />");}
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

        var imgArr=[],
            tarImg=new Event(node.event).getTargets('img')[0];

        $.each(imgs,function(img){
            imgArr.unshift(img);
        });

        var idx=imgArr.indexOf(tarImg);

        if(idx<0)
            return;

        tarImg.parentNode.appendChild($('.MoodSelect',node));
        node.setAttribute('iconid',idx+1);
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
                Device.backFunc.unshift(function(){regSel.hide();});
            },
            hideEnd:function(regSel){
                Device.backFunc.shift(0);
                if(Device.backFunc.length<=0){
                    Device.backFunc=[function(){ViewMgr.back();}];
                }
            }
        };

        if(defProv){
            regObj.prov=defProv;
        }
        if(defCity){
            regObj.city=defCity;
        }
        Mix.ui.region.show(regObj);
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
                        alert('最多只能选4项');
                        return false;
                    }
                }
                Page.setEditVal(ipt,selOpts.join(" "));
                return true;
            },
            onShow:function(UIselect){
                Device.backFunc.unshift(function(){UIselect.hide();});
            },
            hideEnd:function(UIselect){
                Device.backFunc.shift(0);
                if(Device.backFunc.length<=0){
                    Device.backFunc=[function(){ViewMgr.back();}];
                }
            }
        };

        Mix.ui.select.show(selectObj);
    },
    /*获得用户所在地址,解析地址为省,市*/
    getGpsInfo:function(cb){
        StorMgr.gpsInfo=Mix.base.storage.get("kxjy_my_gpsInfo");
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
                        Mix.base.storage.set("kxjy_my_gpsInfo",gpsInfo);

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

/*用到的菜单*/
function UserMenus(name){
    var menuObj={
            pos:"middle",
            onShow:function(UImenu){
                Device.backFunc.unshift(function(){UImenu.hide();});
            },
            hideEnd:function(UImenu){
                Device.backFunc.shift(0);
                if(Device.backFunc.length<=0){
                    Device.backFunc=[function(){ViewMgr.back();}];
                }
            }
        };

    switch(name){
        case 'menuBtn':
            menuObj.pos="bottom";
            menuObj.items=['注销用户','退出应用'];
            menuObj.onSelect=function(idx){
                switch(idx*1){
                    case 0:
                        UserAction.logOut();
                        break;
                    case 1:
                        Device.exit();
                        break;
                }
            };
            break;
        case 'search':
            menuObj.direct="vertical";
            menuObj.title="筛选";
            menuObj.items=['显示全部','只显示男','只显示女','更换地区'];
            menuObj.onSelect=function(idx){
                switch(idx*1){
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
                        UserTools.initArea('photo');
                        break;
                }
            };
            break;
        case 'photo':
            menuObj.direct="vertical";
            menuObj.title="上传照片";
            menuObj.items=["从相册中选择","拍照"];
            menuObj.onCancel=function(){
                $("#mood").focus();
            }
            menuObj.onSelect=function(idx){
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
                        Device.xmlHttp.close();
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
                    Device.xmlHttp.send(sendObj);
                }
                switch(idx*1){
                    case 0:
                        function imageBrowserCb(opCode,dataType,data){
                            imgurl=data;
                            Device.getFileSize(data,xmlHttpPost);
                        }
                        setTimeout(function(){
                            Device.imageBrowser(imageBrowserCb);
                        },0);
                        break;
                    case 1:
                        function cameraCb(opId,dataType,data){
                            if(dataType==0){
                                imgurl=data;
                                Device.getFileSize(data,xmlHttpPost);
                            }
                        }
                        setTimeout(function(){
                            Device.camera(cameraCb);
                        },0);
                        break;
                }
            };
            break;
    }
    Mix.ui.menu.show(menuObj);
}