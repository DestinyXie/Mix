/*页面初始化*/
function executeLoad(){
    /*全局变量赋值*/
    HEAD = $('head');
    BODY = DOC.body;
    BODYFS = parseInt(getComputedStyle(BODY).fontSize);

    /*取得GPS信息*/
    Tools.getGpsInfo();

    /*页面历史管理初始化*/
    ViewMgr.init();

    /*加载weinre debug工具*/
    // DOM.loadJs("http://192.168.30.78:8081/target/target-script.js",function(){alert('weinre test ok!')});
}

Device.onLoad(executeLoad);

/*页面历史管理类,控制历史记录,页面跳转*/
var ViewMgr={
    tmpParams:"",//临时记录参数值
    recordLen:10,//记录历史页面最大长度
    pairPages:['mainPhoto','mainList','myPhoto','myList','hisPhoto','hisList'],//成双的页面
    getMsg:true,
    getDataInter:null,//轮询信息中心数据及Tips
    getDataTime:10000,//轮询信息中心数据及Tips时间间隔 10秒
    init:function(){//取得历史页面
        delete WIN['pageEngine'];
        Device.disetBackBtn();
        WIN['pageEngine']=new PageEngine();
        this.views=['login'];

        var storEmail=Tools.storage.get('kxjy_my_email'),
            storPwd=Tools.storage.get('kxjy_my_pwd'),
            ok=null,
            fail=function(){
                pageEngine.initPage('login');
                Tools.storage.remove("kxjy_view_history","session");
            };
        if(storEmail&&storPwd){
            UserAction.sendLogin(storEmail,storPwd,null,ok,fail);
        }else{
            fail();
        }

        Device.backFunc=function(){ViewMgr.back();}
    },
    getData:function(init){//轮询信息中心数据及Tips
        this.stopGetData();
        if(init){
            ViewMgr.getMsgTips(init);
        }else{
            ViewMgr.getDataInter=setTimeout(
            function(){
                ViewMgr.getMsgTips();
            },ViewMgr.getDataTime);
        }
    },
    stopGetData:function(){
        clearTimeout(ViewMgr.getDataInter);
    },
    goto:function(page,params){
        this.stopGetData();
        page=page.replace("\.html","");
        var viewLen=this.views.length;
        if(this.checkLast(page)){
            this.views[viewLen-1]=page;
        }else if(this.views[viewLen-2]==page){//back
            this.views.pop(1);
        }else{
            if(viewLen>=this.recordLen)
                this.views.shift(1);
            this.views.push(page);
        }
        Tools.storage.set("kxjy_view_history",ViewMgr.views,"session");
        
        try{
            if(1==this.views.length){//设置返回按钮为历史回退
                pageEngine.initPage('login');
                Device.disetBackBtn();
            }else{
                Device.setBackBtn();    
            }
        }catch(e){}

        this.setUrl(page,params);
    },
    /*切换页面*/
    setUrl:function(url,params){
        if(!!params)
            ViewMgr.tmpParams=params;

        pageEngine.initPage(url);
    },
    back:function(){//返回上一个历史页面
        this.stopGetData();
        var backPage=this.views[this.views.length-2];
        if(backPage){
            this.goto(backPage);
        }
    },
    checkLast:function(page){//判断上一个页面是否因记录为同一个历史(e.g:mainPhoto和mainList不因重复记入历史)或者同一个页面
        var lastPage=this.views[this.views.length-1];
        if(!this.pairPages.has(lastPage)){
            if(lastPage==page)
                return true;
            return false;
        }else{
            try{
                if(this.pairPages.has(page)&&/^(his|my|main)\w+/.exec(lastPage)[1]==/^(his|my|main)\w+/.exec(page)[1])
                return true;
            }catch(e){}
            return false;
        }
    },
    getMsgTips:function(init){
        /*infoCenter*/
        if(ViewMgr.getMsg){
            if(init&&StorMgr.infoCenter){
                ViewMgr.noInfoNumDom=false;
                ViewMgr.infoNumDom=null;
                ViewMgr.hasFilledInfoCen=false;
                ViewMgr.showMsg(StorMgr.infoCenter);

            }
            if(ViewMgr.isIniting){//防止过快切换页面发起重复请求
                return;
            }
            StorMgr.getInfoCenter(function(a){
                    ViewMgr.showMsg(a);
            },true);    
        }
        if(ViewMgr.isIniting){//防止过快切换页面发起重复请求
            return;
        }
        ViewMgr.isIniting=true;
        /*tips*/
        var dataUrl=StorMgr.siteUrl+'/feed_flow.php?'+Tools.getSidUidParams(),
            secCb=function(a){
                ViewMgr.addTips(a);
                ViewMgr.isIniting=false;
                ViewMgr.getData();
            },
            errCb=function(m){
                ViewMgr.isIniting=false;
                ViewMgr.getData();
            };

        setTimeout(function(){//和infoCenter请求发起时刻错开，提升性能
            UserAction.sendAction(dataUrl,"","get",secCb,errCb);
        },ViewMgr.getDataTime/2);
    },
    showMsg:function(data){
        if('infoCenter'==pageEngine.curPage&&(!this.hasFilledInfoCen||StorMgr.infoCenterChange)){
            InfoCenter.fill(data);
            this.hasFilledInfoCen=true;
        }

        if(this.noInfoNumDom)
            return;

        if(!this.infoNumDom){
            var ftLis=$$('#footer>div>div'),infoDiv;
            if(ftLis&&ftLis.length==5){
                infoDiv=ftLis[3];
            }else{
                this.noInfoNumDom=true;
                return;
            }

            if(infoDiv.children.length==3){
                this.infoNumDom=infoDiv.children[0];
            }else{
                var numDom=DOM.create('div');
                numDom.className="us uinl b-wh uba1 c-m1 c-red uc-a2 t-wh ulev-1 uinn1 newAmount";
                infoDiv.insertBefore(numDom,infoDiv.firstElementChild);
                this.infoNumDom=numDom;
            }
        }
        if(data.remindNum==0){
            this.infoNumDom.style.display="none";
        }else{
            this.infoNumDom.style.display="block";
        }
        if(this.infoNumDom.innerHTML!=data.remindNum)
            this.infoNumDom.innerHTML=data.remindNum;
    },
    addTips:function(data){//添加Tips
        this.tipsArray=this.tipsArray||[];
        if(data&&$.isArray(data)&&data.length>0){
            this.tipsArray=this.tipsArray.concat(data);
        }
        if(this.tipsArray.length>0&&!this.showingTips){
            this.showTips();
        }
    },
    showTips:function(){//显示Tips
        this.showingTips=false;
        if(!this.tipsArray){
            return;
        }

        var msg=this.tipsArray.shift();
        if(msg){
            this.showingTips=true;
            Tips.show('<img _click="ViewMgr.goto(\'hisPhoto\',\'user_id='+msg.fromuid+'\')" src="'+msg.avatarPicUrl+'" alt="" /> '+msg.nickname+' '+msg.content,null,5000);
            setTimeout(function(){ViewMgr.showTips();},2000);
        }
    }
}

/*缓存资料管理*/
var StorMgr={
    myInfo:null,
    infoCenter:null,
    gpsInfo:null,
    initStor:function(){//初始化需要的缓存资料
        if(!this.myInfo){
            this.getMyInfo();
        }
        if(!this.infoCenter){
            this.getInfoCenter();
        }
        if(!this.gpsInfo){
            this.gpsInfo=Tools.storage.get("kxjy_my_gpsInfo");
        }
    },
    getMyInfo:function(cb,force){//取得我的信息并保存
        var stor=Tools.storage.get("kxjy_my_myInfo","session");
        if(force||!stor){
            var getUrl=StorMgr.siteUrl+'/do.php?action=getUserInfo&sid='+StorMgr.sid+"&user_id="+StorMgr.uid,
                secCb=function(a){
                    var encodeInfo=Tools.htmlEncodeObj(a.myInfo);
                    StorMgr.setMyInfo(encodeInfo);
                    cb&&cb(a);
                };
            UserAction.sendAction(getUrl,"","get",secCb);
        }else{
            this.myInfo=stor;
            cb&&cb(stor);
        }
    },
    setMyInfo:function(o){
        if(JSON.stringify(StorMgr.myInfo)==JSON.stringify(o))
            return;
        Tools.storage.set("kxjy_my_myInfo",o,"session");
        this.myInfo=o;
    },
    getInfoCenter:function(cb,force){
        var stor=Tools.storage.get("kxjy_my_infoCenter","session");
        if(force||!stor){
            var getUrl=StorMgr.siteUrl+'/do.php?action=getInfoCenterData&'+Tools.getSidUidParams(),
                secCb=function(a){
                    StorMgr.setInfoCenter(a);
                    cb&&cb(a);
                };
            UserAction.sendAction(getUrl,"","get",secCb);
        }else{
            this.infoCenter=stor;
            cb&&cb(stor);
        }
    },
    setInfoCenter:function(o){
        if(JSON.stringify(StorMgr.infoCenter)==JSON.stringify(o)){
            this.infoCenterChange=false;
            return;
        }
        this.infoCenterChange=true;
        Tools.storage.set("kxjy_my_infoCenter",o,"session");
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
                numDoms[i].innerHTML='<img style="width:1em;" src='+StorMgr.siteUrl+'"/template/mobile/css/images/'+(isUp?'Rise':'Decline')+'.png" alt="排名"/> '+val;
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

        var clearUrl=InfoCenter.clearUrl[page].replace(/\$\{siduid\}/,Tools.getSidUidParams()),
            url=StorMgr.siteUrl+clearUrl;

        UserAction.sendAction(url,null,'get',cb,ecb);
    }
}

/*他人信息记录缓存*/
var hisInfo={
    maxLength:5,//最多缓存人数
    storIDs:[],
    storInfos:{},
    init:function(){
        var that=this,
            storId=Tools.storage.get("kxjy_his_storId");
        that.storIDs=storId?storId:[];
        that.curId=Tools.getParamVal("user_id")||that.storIDs[0];

        //只取当前的,提升效率
        that.storInfos[that.curId]=that.get(that.curId);
    },
    get:function(id){
        var retObj=this.storInfos[id]||Tools.storage.get("kxjy_his_info_"+id);
        return retObj;
    },
    set:function(id,data){
        this.init();
        if(JSON.stringify(hisInfo.storInfos[id])!=JSON.stringify(data)){
            Tools.storage.set("kxjy_his_info_"+id,data);
            this.storInfos[id]=data;
        }

        var popId=this.storIDs[this.storIDs.length-1];
        if(this.storIDs.length>this.maxLength&&popId!=id){
            this.storIDs.pop(1);
            Tools.storage.remove("kxjy_his_info_"+popId);
        }

        this.storIDs.remove(id);
        this.storIDs.unshift(id);
        Tools.storage.set("kxjy_his_storId",this.storIDs);
    }
}

/*页面内容管理*/
Page={
    init:function(options){
        this.destory();
        extend(Page,options);
        this.getUserData();
    },
    destory:function(){
        this.userData=null;
        this.name="";
        this.dataUrl="";
        this.loadedMore=false;
        this.editedValues=[];
        this.editedErrors=[];
        this.dataXhr&&this.dataXhr.abort();
    },
    fullFillInfo:function(){
        var that=this;
        if(!that.name||!that.dataUrl||!that.userData){
            toast("页面信息不充分，无法载入资料",2);
        }else{
            var data=that.userData;

            //昵称
            $('#header h1').innerHTML=/动态详情/.test($('#header h1').innerHTML)?data.nickname+"的动态详情":data.nickname;

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
                    myRank=StorMgr.infoCenter['current_rank'];
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
                    $("#footer-love").previousElementSibling.setAttribute("checked","checked");
                }else{
                    $("#footer-love").previousElementSibling.removeAttribute("checked");
                }
                    
                if(data.friendnum&&data.friendnum>0){
                    $("#footer-love .ulev-2").innerHTML="喜欢("+data.friendnum+")";
                }else{
                    $("#footer-love .ulev-2").innerHTML="喜欢(0)";
                }
                    
                if(data.isBlocked){
                    $("#footer-shield").previousElementSibling.setAttribute("checked","checked");
                }else{
                    $("#footer-shield").previousElementSibling.removeAttribute("checked");
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
                $('.DynamicImg').innerHTML=data.fileurl?'<img src="'+data.fileurl+'" alt="xx" />':"";

                if(data.islove){
                    DOM.addClass($('.DynamicMenu .love'),'active');
                }

                $('.DynamicMenu .love').nextSibling.replaceWholeText(data.lovecount||0);
                $('.DynamicMenu .comment').nextSibling.replaceWholeText(data.commentcount||0);
            }else{
                $('.DynamicName').innerHTML=data.level?("&nbsp;LV&nbsp;"+data.level):"没有等级";
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
            var target=(data.target)?"交友目的:"+dataArray.target[data.target-1]:"交友目的:不详";
            $('#myInfo-2').innerHTML=target;

            //个人描述
            var note=(data.note)?"个人描述:"+data.note:"个人描述:不详";
            $('#myInfo-3').innerHTML=note;
        }
    },
    /*填充编辑资料内容*/
    fullFillEditInfo:function(){
        var data=this.userData;

        this.editedValues=[];
        this.editedErrors=[];

        this.setEditVal("nickname",data.nickname||"",true);
        this.setEditVal("sex",dataArray.sex[data.sex
            ]||"",true);
        this.setEditVal("area",[data.reside_province,data.reside_city].join(" ")||"",true);
        this.setEditVal("birthDay",(data.birthyear&&data.birthmonth&&data.birthday)?[data.birthyear,data.birthmonth,data.birthday].join('-'):"",true);
        this.setEditVal("marry",dataArray.marry[data.marry-1]||"单身",true);
        this.setEditVal("target",dataArray.target[data.target-1]||"",true);
        this.setEditVal("note",data.note||"",true);
        this.setEditVal("qq",data.qq||"",true);
        this.setEditVal("mobile",data.mobile||"",true);

        var interestArr=data.interest?data.interest.sort(function(a,b){return a-b;}):[],
            interestStr=[];
        $.each(interestArr,function(num){
            interestStr.unshift(dataArray.interest[num-1]);
        });
        this.setEditVal("interest",interestStr.join(" "),true);
    },
    setEditVal:function(id,value,init){
        var that=this,
            ipt=$("#"+id);
        if(init){
            ipt.setAttribute('default',value);
        }else{
            if(ipt.getAttribute('default')!=value){
                if(!that.editedValues.has(id))
                    that.editedValues.push(id);
            }else{
                that.editedValues.remove(id);
            }
        }


        ipt.innerHTML=value;

        switch(id){
            case 'marry':
            case 'target':
                $("#"+id+"Sel").value=value;
                break;
            case 'interest':
                var sel=$("#interestSel"),
                    ops=sel.children,
                    sels=[];
                if(typeof value!="array"){
                    sels=value.split(" ");
                }else{
                    sels=value;
                }
                $.each(sels,function(inter){
                    var idx=dataArray['interest'].indexOf(inter);
                    if(ops[idx])
                        ops[idx].selected=true;
                });
                break;
        }

    },
    submitEditInfo:function(){
        var that=this,
            editedIds=that.editedValues;
        that.editedErrors=[];

        if(editedIds.length<=0){
            alert('你没有改变资料');
            return;
        }

        for(var len=editedIds.length;len--;){
            var id=editedIds[len],
                ipt=$("#"+id);
            switch(id){
                case 'nickname':
                case 'note':
                case 'qq':
                case 'mobile':
                    that.sendEditVal(id+"="+ipt.innerHTML,id);
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
                    var sel=$("#interestSel"),
                        ops=sel.childNodes,
                        inters=ipt.innerHTML.split(" "),
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
        var that=this;
        function check(){//检查是否保存完成
            if(that.editedValues.length<=0){
                if(that.editedErrors.length>0){
                    toast(that.editedErrors.join("\n"));
                }else{
                    toast('保存成功!');
                    setTimeout(function(){
                        ViewMgr.goto('myPhoto.html');//编辑成功后返回个人主页
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
                    that.editedErrors.push(a.error);
                }else{
                    ipt.setAttribute("default",ipt.innerHTML);    
                }
                check();
            },
            errCb=function(m){
                that.editedValues.remove(id);
                ipt.innerHTML=ipt.getAttribute("default");
                that.editedErrors.push(m.error);
                check();
            };
        that.dataXhr=UserAction.sendAction(dataUrl,param,"post",secCb,errCb);
    },
    showMore:function(){
        var that=this,
            infoUl=$('ul.myInfo'),
            moreBtn=$("#titleMenu_more span");
        
        function insertLi(info){
            var li=DOM.create('li');
            li.className="insertLi";
            li.innerHTML=info;
            infoUl.appendChild(li);
        }

        if(!that.name||!that.dataUrl||!that.userData){
            toast("页面信息不充分，无法载入资料");
        }else{
            if(that.loadedMore){
                if(DOM.hasClass(infoUl,'showMore')){
                    DOM.dropClass(infoUl,'showMore')
                    moreBtn.innerHTML="更多资料";
                }else{
                    DOM.addClass(infoUl,'showMore')
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
        }
    },
    getUserData:function(){

        var that=this;
            dataUrl=StorMgr.siteUrl+that.dataUrl,
            params=that.params,
            secCb=function(a){
                if(a.error){toast(a.error,3);
                    return;
                }

                InfoCenter.clear(that.name);

                that.userData=a.myInfo||a.userInfo;
                if(a.moodContent){//动态详情加入心情信息
                    extend(that.userData,a.moodContent);
                }

                that.userData=Tools.htmlEncodeObj(that.userData);//html,js转义

                switch(that.name){
                    case 'myPhoto':
                    case 'myList':
                        StorMgr.setMyInfo(that.userData);
                        break;
                    case 'hisPhoto':
                    case 'hisList':
                        extend(that.userData,{myRank:a.myRank,isBlocked:a.isBlocked});
                        hisInfo.set(hisInfo.curId,that.userData);
                        break;
                    case 'editInfo':
                        StorMgr.setMyInfo(that.userData);
                        that.fullFillEditInfo();
                        return;
                        break;
                }
                that.fullFillInfo();
            },
            errCb=function(){
                // toast('connect error');
            };

        that.userData=null;

        //取缓存数据
        if(['myPhoto','myList','editInfo'].has(that.name)){
            that.userData=StorMgr.myInfo;
            if(!!that.userData){
                switch(that.name){
                    case 'myPhoto':
                    case 'myList':
                    // case 'myDetail':
                        that.fullFillInfo();
                        break;
                    case 'editInfo':
                        that.fullFillEditInfo();
                        break;
                }
            }
        }

        if(['hisPhoto','hisList'].has(that.name)){
            that.userData=hisInfo.get(hisInfo.curId);
            if(!!that.userData){
                that.fullFillInfo();
            }
        }

        that.dataXhr=UserAction.sendAction(dataUrl,params|"","get",secCb,errCb);
    },
    setDataNum:function(){
        var that=this;
        if(['myPhoto','hisPhoto'].has(that.name)&&$('.myTitleMenu')!=null){
            $('#titleMenu-pic span').innerHTML=Feed.dataCount+"<br />照片";
        }
        if(['myList','hisList'].has(that.name)&&$('.myTitleMenu')!=null){
            $('#titleMenu-mood span').innerHTML=Feed.dataCount+"<br />心情";
        }
        if(['myDetail','hisDetail'].has(that.name)){
            $('.DynamicMenu .comment').nextSibling.replaceWholeText(Feed.dataCount);
        }
    }
}


/*相关信息对应数组*/
var dataArray={
    sex:['男','女'],
    target:['找男孩','找女孩','约会','友谊','玩伴','激情','艳遇','亲密关系','真情','婚姻'],
    ethnic:['阿昌族','白族','保安族','布朗族','布依族','朝鲜族','达斡尔族','傣族','德昂族','侗族','东乡族','独龙族','鄂伦春族','俄罗斯族','鄂温克族','高山族','仡佬族','哈尼族','哈萨克族','赫哲族','回族','基诺族','京族','景颇族','柯尔克孜族','拉祜族','黎族','傈僳族','珞巴族','满族','毛南族','门巴族','蒙古族','苗族','仫佬族','纳西族','怒族','普米族','羌族','撒拉族','畲族','水族','塔吉克族','塔塔尔族','土族','土家族','佤族','锡伯族','乌兹别克族','瑶族','彝族','裕固族','藏族','维吾尔族','壮族','其它','汉族',],
    blood:['A型','B型','AB型','O型','其它'],
    personality:['温柔','浪漫','成熟','腼腆','幽默','善良','可爱','忠厚','前卫','热辣','豪放'],
    interest:['上网','摄影','音乐','动漫','电玩','汽车','写作','影视','购物','唱歌','跳舞','读书','运动','动物','园艺','烹饪','投资','手工艺','绘画','美食','旅游','其他'],
    marry:['单身','已婚','同居','分居','离婚','不想说']
}

/*用户执行动作*/
var UserAction={
    xhr:null,
    stop:function(){
        this.xhr&&this.xhr.abort();
    },
    /*秀心情*/
    showMood:function(imgDom,iconDom,moodDom){
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

        params+="&title="+title+"&iconid="+iconid;

        secCb=function(){
            toast('发布成功!',2);
            imgDom.innerHTML="";
            moodDom.value="";
            // Tools.setIconId(null,true);
            setTimeout(function(){
                ViewMgr.goto('myList.html');//秀心情成功后返回个人主页-心情
            },2000);
        }

        errCb=function(m){
            toast(m.error);
        }

        UserAction.sendAction(actionUrl,params,"post",secCb,errCb);

    },
    /*删除照片,心情或评论*/
    deleteData:function(type,node,wid,cb){
        var actionUrl=StorMgr.siteUrl+"/weibo.php?"+Tools.getSidUidParams(),
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
                params="action=del&type=2&wid="+Tools.getParamVal('wid');
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
                //子评论未消失
                // Feed.removeFeed(paraLi);
                // Page.setDataNum();
                Feed.refresh();
            }else{
                ViewMgr.back();
            }
        }

        errCb=function(m){
            toast(m.error);
        }

        Device.confirm(msg,function(){
            UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
        });
    },
    /*举报*/
    reportData:function(type,node,wid){
        var actionUrl=StorMgr.siteUrl+"/weibo.php",
            params="sid="+StorMgr.sid+"&action=report&wid="+(wid||Tools.getParamVal('wid')),
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
        var actionUrl,
            params="",
            secCb,
            errCb,
            userInfo=Page.userData,
            loveRadio,
            loveDom;

        if(type=='mood'){//心心情
            var loveIcon=node.firstElementChild;
            if(DOM.hasClass(loveIcon,"active")){
                toast('你已经心过这条心情!',2);
            }else{
                actionUrl=StorMgr.siteUrl+"/weibo.php?action=love&sid="+StorMgr.sid+"&wid="+(wid||Tools.getParamVal('wid'));
                loveDom=node.lastChild;
                secCb=function(){
                    var loveNum=loveDom.wholeText;
                    loveDom.replaceWholeText(parseInt(loveNum)+1);
                    DOM.addClass(loveIcon,"active")
                },
                errCb=function(m){
                    toast(m);
                }
                UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
            }
        }

        if(type=='people'){//心人
            actionUrl=StorMgr.siteUrl+"/do.php";
            params="sid="+StorMgr.sid+"&user_id="+Tools.getParamVal('user_id');
            loveRadio=node.previousElementSibling,
            loveDom=$("#footer-love .ulev-2");

            if(!userInfo)
                return;
            if(userInfo.islove!=1){
                params+="&action=admire";
                secCb=function(m){
                    loveRadio.setAttribute("checked","checked");
                    userInfo.friendnum++;
                    userInfo.islove=1;
                    loveDom.innerHTML="喜欢("+userInfo.friendnum+")";
                }
                errCb=function(m){
                    toast(m.error);
                }
                UserAction.sendAction(actionUrl,params,"post",secCb,errCb);
            }else{
                params+="&action=disadmire";
                secCb=function(m){
                    loveRadio.removeAttribute("checked");
                    userInfo.friendnum--;
                    userInfo.islove=0;
                    loveDom.innerHTML="喜欢("+userInfo.friendnum+")";
                }
                errCb=function(m){
                    toast(m);
                }
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
        var actionUrl=StorMgr.siteUrl+"/do.php",
            params="sid="+StorMgr.sid,
            secCb,
            errCb,
            msg='你确定要屏蔽TA吗?',
            shieldDom=node.previousElementSibling;

        secCb=function(m){
            if(type=="del"){
                Feed.removeFeed(node);
                hisInfo.storInfos[user_id].isBlocked=false;
                toast('已取消屏蔽',2);
            }else{
                if(shieldDom.getAttribute("checked")=="checked"){
                    hisInfo.storInfos[hisInfo.curId].isBlocked=false;
                    shieldDom.removeAttribute("checked");
                }else{
                    hisInfo.storInfos[hisInfo.curId].isBlocked=true;
                    shieldDom.setAttribute("checked","checked");    
                }
            }
        }
        errCb=function(m){
            toast(m.error);
        }

        if(type=="del"){//取消屏蔽
            params+="&user_id="+user_id+"&type=del&action=block_user&id="+user_id;
            Device.confirm('确认取消屏蔽?',function(){
                UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
            });
        }else{
            if(shieldDom.getAttribute("checked")=="checked"){
                params+="&user_id="+Tools.getParamVal('user_id')+"&type=del&action=block_user&id="+Tools.getParamVal('user_id');
                Device.confirm('确认取消屏蔽?',function(){
                    UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
                });
                
            }else{
                params+="&user_id="+Tools.getParamVal('user_id')+"&action=block_user";
                Device.confirm(msg,function(){
                    UserAction.sendAction(actionUrl,params,"get",secCb,errCb);
                });
            }
        }
    },
    /*登陆验证*/
    checkLogin:function(nSel,pSel,node){
        var mailVal = $(nSel).value,
            passVal = $(pSel).value,
            mailReg=/^.+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        
        if(mailVal.length==0){
            toast("请输入您的邮箱地址！",2);
            return;
        }
        if(!mailReg.test(mailVal)){
            toast("邮箱地址有误！",2);
            return;
        }
        if(passVal.length==0){
            toast("请输入您的密码！",2);
            return;
        }

        node.innerHTML="登陆中...";
        UserAction.sendLogin(mailVal,passVal,node);
    },
    sendLogin:function(mail,pwd,btn,ok,fail){
        var checkUrl=StorMgr.siteUrl+"/userLogin.php",
            params='email='+mail+'&password='+pwd,
            secCb=function(a) {
                if(a.msg){
                    toast(a.msg);
                    if(btn){
                        btn.innerHTML="登陆"
                    }
                    if($.isFunc(fail)){
                        fail();
                    }
                    return;
                }
                Tools.storage.set('kxjy_my_email',mail);
                Tools.storage.set('kxjy_my_pwd',pwd);

                StorMgr.uid=a.uid;
                StorMgr.userKey=a.userKey;

                ViewMgr.goto('mainPhoto');
                if($.isFunc(ok)){
                    ok();
                }
            },
            errCb=function(e){
                toast(e.msg);
                if(btn){
                    btn.innerHTML="登陆"
                }
                if($.isFunc(fail)){
                    fail();
                }
            };
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
    userRegist:function(){
        var sex=$("#regSex").value,
            email=$("#regEmail"),
            nickname=$("#regNickName"),
            password=$("#regPwd"),
            passwordR=$("#regPwdR"),
            imgcode=$("#regVeri"),
            url=StorMgr.siteUrl+"/register.php?sid="+StorMgr.sid,
            secCb=function(a){
                if(1==a.error){
                    toast(a.msg);
                    UserAction.getVerify();
                    return;
                }
                toast('注册成功,将自动登陆');
                setTimeout(function(){
                    UserAction.sendLogin(email.value,password.value);
                },2000);
            },errCb=function(a){
                if(1==a.error){
                    toast(a.msg);
                    UserAction.getVerify();
                    return;
                }
            };

        function checkReg(){
            if(0==email.value.length){
                throw {msg:'请输入您的邮箱地址！'};
            }
            if(!/^.+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(email.value)){
                throw {msg:'邮箱地址有误！'};
            }
            if(0==nickname.value.length){
                throw {msg:'请输入您的昵称！'};
            }
            if(nickname.value.chineseLen()>12){
                throw {msg:'昵称过长！'};
            }
            if(0==password.value.length){
                throw {msg:'请输入您的密码！'};
            }
            if(password.value!=passwordR.value){
                throw {msg:'两次密码不一致！'};
            }
            if(0==imgcode.value){
                throw {msg:'请输入验证码！'};
            }
            if(4!=imgcode.value.length){
                throw {msg:'验证码有误！'};
            }
        }
        try{
            checkReg();
            url+="&sex="+sex+"&email="+email.value+"&nickname="+nickname.value+"&password="+password.value+"&imgcode="+imgcode.value;
            UserAction.sendAction(url,"","get",secCb,errCb);
        }catch(e){
            toast(e.msg);
        }
    },
    /*验证密码*/
    checkPassword:function(psw,ok,err){
        var checkUrl=StorMgr.siteUrl+"/userLogin.php",
            params='email='+StorMgr.myInfo.email+'&password='+psw,
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
            toast("请填完所有输入框！",2);
            return;
        }
        if(nVal!=cVal){
            toast("两次新密码不相同！",2);
            return;
        }
        var setUrl=StorMgr.siteUrl+"/do.php?action=account_setting&sid="+StorMgr.sid,
            params='password='+nVal,
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
            UserAction.checkPassword(oVal,sendModiPwd,function(m){toast(m);});
        }else{
            sendModiPwd();
        }
    },
    /*取得mood或picture数*/
    getMoodNum:function(url,cb){
        secCb=function(a){
            cb(a.datacount);
        };
        UserAction.sendAction(url,"","get",secCb,null);
    },
    /*执行ajax请求*/
    sendAction:function(url,data,method,secCb,errCb){
        var xhr=zy_$.ajax({url:url,
           data:data,
           type:method||'get',
           dataType:'json',
           success:function(a){
                if(a.error&&a.error!=""){
                    errCb?errCb(a):toast(a.error||a.msg);
                    return;
                }
                secCb&&secCb(a);
            },
            error:function(e){
                errCb&&errCb(e);
            }
        });
        this.xhr=xhr;
        return xhr;
    }
}