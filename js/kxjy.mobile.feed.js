/*列表模板*/
;var feedTemplate={
    mainPhoto:'<div _click="ViewMgr.gotoPage(${cb:isself})" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /></div>',
	photo:'<div _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /></div>',
    myPhoto:'<div _click="ViewMgr.gotoPage(\'myDetail\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    hisPhoto:'<div _click="ViewMgr.gotoPage(\'hisDetail\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    mood:['<div class="DynamicList clearfix">',
        '<div class="DynamicInfo">',
            '<div _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')" class="DynamicAvatar"><img src="${avatarPicUrlx}" alt="" /></div>',
            '<div class="DynamicAvatar-r">',
                '<strong _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')" class="DynamicName">${nickname}</strong>',
                '<span class="DynamicTrank">${cb:colorPng}</span>',
                '<ul class="DynamicNav clearfix">',
                    '<li><span class="DynamicIco ub-img1 time"></span>${mooddate}</li>',
                    '<li><span class="DynamicIco ub-img1 place"></span>${area}</li>',
                '</ul>',
            '</div>',
        '</div>',
        '<div class="">',
            '<div class="ub">',
                '<div class="DynamicMood ub ub-ver">',
                    '<img src="${cb:siteurl}/template/mobile/css/images/f_${cb:mood_icon_id}.png" alt="" />',
                '</div>',
                '<div class="DynamicMoodTextBox ub-f1">',
                    '<div class="ub-f1 DynamicMoodText">',
                    '<span>&diams;</span>',
                        '<div class="DynamicText ub ub-ac">',
                        '<p class="ub-f1">${cb:mood}</p>',
                        '<strong class="DynamicMore" _click="ViewMgr.gotoPage(\'hisDetail\',\'wid=${enwid}\')">></strong>',
                        '</div>',
                        '<div class="DynamicImg">${cb:fileimg}</div>',
	                    '<ul class="DynamicMenu clearfix">',
							'<li class="ub ub-ac" _click="ViewMgr.gotoPage(\'hisDetail\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>',
	                        '<li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this,\'${enwid}\',${cb:lovecount})"><span class="DynamicMenuIco love ${cb:lovemood}"></span>${cb:lovecount}</li>',
	                    '</ul>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    '</div>'].join(''),
    myMood:['<div class="DynamicMoodBox">',
        '<div class="DynamicMoodTtile ub ub-ac">',
            '<div class="DynamicMoodTime">',
                '${mooddate}',
                '<span>&diams;</span>',
            '</div>',
            '<ul class="DynamicNav clearfix">',
                '<li><span class="DynamicIco ub-img1 time"></span>${cb:time}</li>',
                '<li><span class="DynamicIco ub-img1 place"></span>${area}</li>',
            '</ul>',
        '</div>',
        '<div class="ub">',
            '<div class="DynamicMood ub ub-ver">',
                '<img src="${cb:siteurl}/template/mobile/css/images/f_${cb:mood_icon_id}.png" alt="" />',
                '<div class="DynamicMoodLine ub-f1"></div>',
            '</div>',
            '<div class="DynamicMoodTextBox ub-f1">',
                '<div class="ub-f1 DynamicMoodText">',
                    '<span>&diams;</span>',
                    '<div class="DynamicText ub ub-ac">',
                        '<p class="ub-f1">${cb:mood}</p>',
                        '<strong class="DynamicMore" _click="ViewMgr.gotoPage(\'myDetail\',\'wid=${enwid}\')">></strong>',
                    '</div>',
                    '<div class="DynamicImg">${cb:fileimg}</div>',
					'<ul class="DynamicMenu clearfix">',
						'<li class="ub ub-ac" _click="ViewMgr.gotoPage(\'myDetail\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>',
					    '<li class="ub ub-ac"><span class="DynamicMenuIco love"></span>${cb:lovecount}</li>',
					'</ul>',
                '</div>',
                '<div class="DynamicMenuLine"></div>',
            '</div>',
        '</div>',
    '</div>'].join(''),
    hisMood:['<div class="DynamicMoodBox">',
        '<div class="DynamicMoodTtile ub ub-ac">',
            '<div class="DynamicMoodTime">',
                '${mooddate}',
                '<span>&diams;</span>',
            '</div>',
            '<ul class="DynamicNav clearfix">',
                '<li><span class="DynamicIco ub-img1 time"></span>${cb:time}</li>',
                '<li><span class="DynamicIco ub-img1 place"></span>${area}</li>',
            '</ul>',
        '</div>',
        '<div class="ub">',
            '<div class="DynamicMood ub ub-ver">',
                '<img src="${cb:siteurl}/template/mobile/css/images/f_${cb:mood_icon_id}.png" alt="" />',
                '<div class="DynamicMoodLine ub-f1"></div>',
            '</div>',
            '<div class="DynamicMoodTextBox ub-f1">',
                '<div class="ub-f1 DynamicMoodText">',
                    '<span>&diams;</span>',
                    '<div class="DynamicText ub ub-ac">',
                        '<p class="ub-f1">${cb:mood}</p>',
                        '<strong class="DynamicMore" _click="ViewMgr.gotoPage(\'hisDetail\',\'wid=${enwid}\')">></strong>',
                    '</div>',
                    '<div class="DynamicImg">${cb:fileimg}</div>',
					'<ul class="DynamicMenu clearfix">',
						'<li class="ub ub-ac" _click="ViewMgr.gotoPage(\'hisDetail\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>',
					    '<li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this,\'${enwid}\',${cb:lovecount})"><span class="DynamicMenuIco love ${cb:islove}"></span>${cb:lovecount}</li>',
					'</ul>',
                '</div>',
                '<div class="DynamicMenuLine"></div>',
            '</div>',
        '</div>',
    '</div>'].join(''),
    myDetail:['<div class="commentList ub clearfix ${cb:childClass}" _click="Comment.popOperation(this,\'${parentid}\',\'${enwid}\',${cb:isself})">',
        '<div class="commentListAvatar"><img src="${avatarPicUrl}" alt="头像" /></div>',
        '<div class="commentListText ub-f1">${cb:commentMood}</div>',
    '</div>${cb:child}'].join(''),
    chatList:['<div class="commentList ub ub-ac clearfix" _click="ViewMgr.gotoPage(\'chat\',\'fid=${fid}&user_id=${fid}\')">',
        '<div class="commentListAvatar">',
			'<img src="${img}" alt="" />',
            '${cb:hasMsg}',
		'</div>',
        '<div class="commentListText ub-f1">',
            '<p class="chatListName">${name}</p>',
            '<p class=" ut-s">&nbsp;</p>',
        '</div>',
        '<strong class="DynamicMore">></strong>',
    '</div>'].join(''),
    chat:['<div class="chatContent ub ${cb:who} clearfix">',
        '${cb:avatar}',
        '<div class="chatTextBox ub-f1">',
            '<div class="chatTime">${datetime}</div>',
            '<div class="chatText">${cb:content}</div>',
            '<span>&diams;</span>',
        '</div>',
    '</div>'].join(''),
    attract:'<div _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /><span class="myPhotoClose" _click="UserAction.disadmire(\'people\',this,\'${uid}\');"></span></div>',
    commentMe:['<div class="commentList ub clearfix">',
        '<div class="commentListAvatar" _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')"><img src="${avatar_url}" alt="" /></div>',
        '<div class="commentListText ub-f1">',
            '<p class="chatListName t-blue" _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')">${nickname}</p>',
            '<p>${cb:sendType}内容<span class="t-pur">${cb:title}</span><span class="t-gra">(${create_time})</span></p>',
            '<p>${cb:sendType}我的${cb:urlType}:<span class="t-blue">${cb:parentTitle}</span></p>',
        '</div>',
        '<strong class="DynamicMore" _click="ViewMgr.gotoPage(${cb:isselfDetail},\'wid=${parentid}\')">></strong>',
    '</div>'].join(''),
    sendComment:['<div class="commentList ub clearfix">',
        '<div class="commentListAvatar" _click="ViewMgr.gotoPage(${cb:isself})"><img src="${avatar_url}" alt="" /></div>',
        '<div class="commentListText ub-f1">',
            '<p>${cb:sendType}内容 ${cb:title} <span class="t-gra">(${create_time})</span></p>',
            '<p>${cb:sendType}<span class="t-pur"_click="ViewMgr.gotoPage(${cb:isself})">${nickname}</span>的${cb:urlType}:<span class="t-blue">${cb:parentTitle}</span></p>',
            '<div class="chatDelete" _click="UserAction.deleteData(\'comment\',DOM.findParent(this,\'.commentList\',true),\'${enwid}\');">删除</div>',
        '</div>',
        '<strong class="DynamicMore" _click="ViewMgr.gotoPage(${cb:isselfDetail},\'wid=${parentid}\')">></strong>',
    '</div>'].join(''),
    blackList:'<div _click="ViewMgr.gotoPage(\'hisPhoto\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /><span class="myPhotoClose" _click="UserAction.shieldPerson(\'del\',this.parentNode,\'${uid}\');"></span></div>',
    rank:['<div class="rankList uc-t ub b-gra ub-ac umh4 lis">',
            '<div class="topRank">${index:}</div>',
            '<div class="commentListAvatar" ${cb:isself}>',
                '<img src="${avatarPicUrlx}" alt="">',
            '</div>',
            '<div class="commentListText ub-f1">',
                '<p class="chatListNameub-f1 chatListName" ${cb:isself}>${nickname}</p>',
                '<p>${cb:age}/${cb:address}/${cb:sex}/${cb:target}</p>',
            '</div>',
            '${cb:top}',
        '</div>'].join('')
};

/*页面列表对应的模板*/
var pageFeedTmpl={
    mainPhoto:"mainPhoto",
    mainList:"mood",
    myPhoto:"myPhoto",
    myList:"myMood",
    myDetail:"myDetail",
    hisPhoto:"hisPhoto",
    hisList:"hisMood",
    hisDetail:"myDetail",
    chatList:"chatList",
    chat:"chat",
    sysNotice:"chat",
    newGuest:"photo",
    likeMe:"photo",
    attract:"attract",
    commentMe:"commentMe",
    myView:"photo",
    sendComment:"sendComment",
    blackList:"blackList",
    likeMood:"mood",
    likePerson:"attract",
    rank:"rank"
}

/*列表数据接口*/
var pageFeedUrl={
    mainPhoto:"/main.php?uid=${uid}",
    mainList:"/main.php?uid=${uid}",
    myPhoto:"/weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=8&uid=${uid}",
    myList:"/weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=8&uid=${uid}",
    myDetail:"/weibo.php?action=weibolist&type=4&parentid=${wid}",
    hisPhoto:"/weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=8&uid=${user_id}",
    hisList:"/weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=8&uid=${user_id}",
    hisDetail:"/weibo.php?action=weibolist&type=4&parentid=${wid}",
    chatList:"/get_sess_list.php?callback=?&t=1&i=${uid}&k=${userKey}",
    chat:"/get_msg.php?callback=?&st=3m&i=${uid}&fid=${user_id}&tid=${uid}&k=${userKey}",
    sysNotice:"/get_msg.php?callback=?&st=&i=${uid}&fid=1&tid=${uid}&k=${userKey}",
    newGuest:"/see.php?type=1&uid=${uid}",
    likeMe:"/admire.php?type=0&uid=${uid}",
    attract:"/admire.php?type=2&uid=${uid}",
    commentMe:"/weibo.php?action=commentme&uid=${uid}&pagecount=5",
    myView:"/see.php?type=0&uid=${uid}",
    sendComment:"/weibo.php?action=mycomment&uid=${uid}&pagecount=5",
    blackList:"/Blacklist.php?uid=${uid}",
    likeMood:"/moodlist.php?action=love",
    likePerson:"/admire.php?type=1",
    rank:"/rank.php?type=0&page=1&rank=1&sex=2&user_id=0"
}

/*列表类*/
var Feed={
    defOptions:{
            index:0,
            isLoading:false,
            isRefresh:false,
            loadingTxt:"正在加载...",
            moreTxt:"查看更多",
            noMoreTxt:"没有更多了",
            noDataTxt:"暂时没有数据",
            noMoreBtn:false,//是否显示加载按钮
            addParams:"",
            dataCount:0,
            totalPage:0,
            isDestroyed:false
    },
    mainParams:null,//记录mainPhoto和mainList的搜索变量
	init:function(options){
        /*options项
        * page 页面名;
        * cont 容器DOM;
        * more 更多按钮DOM;
        * cb   数据加载完成回调函数;
        * lastPos 数据插入位置;(-1表示插入列表前保留第一个个DOM节点,1表示在最后一个DOM节点之前插入列表)
        */
        var that=this;
        that.destroy();
        extend(that,that.defOptions,options);
        that.refresh();
	},
    reset:function(){
        var that=this;
        that.isRefresh=false;
        that.isLoading=false;
        if(typeof that.cb=="function"){
            that.cb();
        }
    },
    destroy:function(){
        var that=this;
        delete that.page;
        delete that.cont;
        delete that.more;
        delete that.onePageNum;
        delete that.cb;
        delete that.lastPos;
        delete that.nowtime;

        if(that.beforedestroy){//供继承类使用
            that.beforedestroy();
        }

        that.isDestroyed=true;
        if(that.loadXhr){
            that.loadXhr.abort();
        }
        delete that.loadXhr;
    },
    refresh:function(setParam){
        var that=this;
        if(that.isRefresh){
            return;
        }
        if(that.beforeRefersh){
            that.beforeRefersh();
        }
        if(that.noMoreBtn&&that.more.innerHTML!=that.noDataTxt&&that.more){
            that.more.style.display="none";
        }
        that.index=0;
        that.isRefresh=true;
        that.isLoading=false;
        that.nowtime=null;
        if(that.loadXhr){
            that.loadXhr.abort();
        }
        that.loadMore(setParam);
    },
    loadMoreSecc:function(a){
        var that=this;
        that.index++;
        if(!that.nowtime&&a.nowtime){
            that.nowtime=a.nowtime;
        }

        if(a.error&&that.page!="rank"){
            that.reset();
            toast(a.error);
            return;
        }

        if(that.page=="rank"&&a.error.length>0){
            that.reset();
            toast(a.error[0]);
            return;
        }

        if(that.isRefresh){//清除内容移至数据出来前
            if(that.lastPos==1){
                var lastEl=that.cont.lastElementChild.cloneNode(true);
                that.cont.innerHTML="";
                that.cont.appendChild(lastEl);
            }else if(that.lastPos==-1){
                var firstEl=that.cont.firstElementChild.cloneNode(true);
                that.cont.innerHTML="";
                that.cont.appendChild(firstEl);
            }else{
                that.cont.innerHTML="";
            }
        }

        if(['chat','sysNotice'].has(that.page)){
            that.dataCount=a.msg?a.msg.length:0;
            that.totalPage=1;
            that.fullFillFeed(a.msg?a.msg:[]);
            return;
        }

        if(['rank'].has(that.page)){
            var data=a.data;
            that.dataCount=data.rank_info.length;
            that.totalPage=data.allNum;
            that.fullFillFeed(data.rank_info);
            return;   
        }

        that.dataCount=a.datacount||(a.data&&a.data.length)||0;
        that.totalPage=a.allpage||0;

        if(WIN['Page']&&!!that.dataCount)
            Page.setDataNum();

        that.fullFillFeed(a.data);
    },
    loadMore:function(setParam){
        var that=this;
        if(that.isLoading)
            return;
        that.isLoading=true;

        if(!that.isRefresh&&(typeof that.totalPage=="number")&&that.index>=that.totalPage){
            if("暂无数据,请返回"==that.more.innerHTML){
                ViewMgr.back();
            }else{
                that.reset();
            }
            return false;
        }

        if(that.more&&!that.noMoreBtn){
            that.more.innerHTML=that.loadingTxt;
        }

        var dataUrl=that.getUrl(),
            params=that.setParams(setParam);

        if(['chatList','chat','sysNotice'].has(that.page)){
            dataUrl=StorMgr.chatPath+dataUrl;
        }else{
            dataUrl=StorMgr.siteUrl+dataUrl;
        }

        that.sendRequest(dataUrl,params);
    },
    sendRequest:function(dataUrl,params){
        var that=this,
            secCb=function(a) {
                if(that.isRefresh){
                    var strData=JSON.stringify(a);
                    switch(that.page){//缓存数据
                        case 'mainPhoto':
                            if(StorMgr.mainPhoto==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                StorMgr.mainPhoto=strData;
                            }
                            break;
                        case 'mainList':
                            if(StorMgr.mainMood==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                StorMgr.mainMood=strData;
                            }
                            break;
                        case 'myPhoto':
                            if(StorMgr.myPhoto==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                StorMgr.myPhoto=strData;
                            }
                            break;
                        case 'myList':
                            if(StorMgr.myMood==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                StorMgr.myMood=strData;
                            }
                            break;
                        case 'hisPhoto':
                            if(hisInfo.storPics[hisInfo.curId]==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                hisInfo.storPics[hisInfo.curId]=strData;
                            }
                            break;
                        case 'hisList':
                            if(hisInfo.storMoods[hisInfo.curId]==strData){
                                that.isRefresh=false;
                                return;
                            }else{
                                hisInfo.storMoods[hisInfo.curId]=strData;
                            }
                            break;
                    }
                }

                that.loadMoreSecc(a);
            },
            errCb=function(m){
                if(!that.dataCount||0==that.dataCount){
                    that.more.innerHTML=that.noDataTxt;
                }else{
                    that.more.innerHTML=that.moreTxt;
                }
                that.reset();
            };
        
        //取缓存数据
        if(that.isRefresh){
            var cacheDate=null;
            switch(that.page){
                case 'mainPhoto':
                    cacheDate=StorMgr.mainPhoto;
                    break;
                case 'mainList':
                    cacheDate=StorMgr.mainMood;
                    break;
                case 'myPhoto':
                    cacheDate=StorMgr.myPhoto;
                    break;
                case 'myList':
                    cacheDate=StorMgr.myMood;
                    break;
                case 'hisPhoto':
                    cacheDate=hisInfo.storPics[hisInfo.curId];
                    break;
                case 'hisList':
                    cacheDate=hisInfo.storMoods[hisInfo.curId];
                    break;
            }
            if(cacheDate){
                that.loadMoreSecc(JSON.parse(cacheDate));
                that.isRefresh=true;
            }
        }

        that.loadXhr=UserAction.sendAction(dataUrl,params,"get",secCb,errCb);
    },
    getUrl:function(){
        var that=this,
            feedUrl=UserTools.compileUrl(pageFeedUrl[that.page]);

        if('mainPhoto'==that.page&&StorMgr.gpsInfo){//附近的人加入经纬度
            feedUrl+="&latitude="+StorMgr.gpsInfo['lat']+"&longitude="+StorMgr.gpsInfo['log'];
        }

        return feedUrl+"&sid="+StorMgr.sid;
    },
    setParams:function(setParam){
        var that=this,
            params="page="+(that.index+1)+"&ajax=1";
        if(setParam){
            params+="&"+setParam;
        }
        if(that.addParams){//临时增加的参数
            params+="&"+that.addParams;
            if(['mainPhoto','mainList'].has(that.page)){
                that.mainParams=that.addParams;//mainPhoto,mainList页面记录参数
            }
        }
        if(that.nowtime){
            params+="&nowtime="+that.nowtime;
        }
        return params;
    },
    fullFillFeed:function(data){
        var that=this;
        if(that.more){
            if(that.noMoreBtn){
                if(that.more.innerHTML!=that.noDataTxt)
                    that.more.style.display="none";
            }else{
                that.more.innerHTML=that.moreTxt;
            }    
        }
        
        if(that.isRefresh&&(!data||data.length==0)){
            that.more.style.display="block";
            that.more.innerHTML=that.noDataTxt;
            that.reset();
            return;
        }else{
            that.reset();
        }

        var len=data.length;
        if(!that.onePageNum)
            that.onePageNum=len;

        for (var i=0; i<len; i++) {
            var item=DOM.create("div");
            
            item.innerHTML=that.compileTmpl(data[i],i);
            
            if(that.lastPos>0){//从倒数第几位开始插入新数据
                var chs=that.cont.children,
                    pos=chs.length-that.lastPos;

                for(var j=0,chiLen=item.children.length;j<chiLen;j++){
                    that.cont.insertBefore(item.firstElementChild,chs[pos]);    
                }
                
            }else{
                for(var j=0,chiLen=item.children.length;j<chiLen;j++){
                    that.cont.appendChild(item.firstElementChild);
                }
            }
            delete item;
        }
        
        if(!that.noMoreBtn&&that.totalPage&&that.index>=that.totalPage&&that.more){
            that.more.innerHTML=that.noMoreTxt;
        }

        if(['mainPhoto','myPhoto','hisPhoto','newGuest','likeMe','attract','myView','blackList','likePerson'].has(that.page)){
            that.setImgHeight();
        }
    },
    setImgHeight:function(){//根据图片宽度设置列表图片高
        var imgs=$$('.mainList img'),
            len=imgs.length;
        if(len<=0)
            return;
        var w=$('.mainList img').clientWidth;
        $.each(imgs,function(img){
            img.style.height=w+"px";
        });
    },
    compileTmpl:function(data,i){
        var that=this,
            tmpl=feedTemplate[pageFeedTmpl[that.page]],
            idx=(that.onePageNum*(that.index-1))+i+1,
            tmplStr="";

        if('sysNotice'!=that.page){//通知里面是需要显示html标签的
            data=BaseTools.htmlEncodeObj(data);
        }

        switch(that.page){
            case "mainPhoto":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="isself"){
                        if(o.uid==StorMgr.uid){
                            return "'myPhoto'";
                        }else{
                            return "'hisPhoto','user_id="+o.uid+"'";  
                        }
                    }
                },idx);
                break;
            case "myPhoto":
            case "hisPhoto":
                if(data.havemood*1!=0&&(!data.filetype||data.filetype=="img"))
                    tmplStr=BaseTools.compiTpl(tmpl,data,null,idx);
                break;
            case "mainList":
            case "myList":
            case "hisList":
            case "likeMood":
                /*处理点击自己时的跳转*/
                if(that.page=="mainList"&&data.uid==StorMgr.uid){
                    tmpl=tmpl.replace(/'hisPhoto','user_id=\$\{uid\}'/g,"'myPhoto'");
                    tmpl=tmpl.replace(/'hisDetail'/g,"'myDetail'");
                }
                if(data.havemood*1!=0&&(!data.filetype||data.filetype=="img")){
                    tmplStr=that.compileMood(tmpl,data,idx);
                }
                break;
            case "myDetail":
            case "hisDetail":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="commentMood"){
                        return UserTools.filterMsgFace(o.mood);
                    }
                    if(t[1]=="childClass"&&o.parentnode!=""&&o.parentnode!=o.parentid){//check
                        return "commentListMl";
                    }
                    if(t[1]=="child"&&o.child){
                        var chiNode=o.child,
                            chiNodeStr="";
                        for(var i in chiNode){
                            if(!chiNode[i].wid)
                                continue;
                            chiNodeStr+=that.compileTmpl(chiNode[i],0);
                        }
                        return chiNodeStr;
                    }
                    if(t[1]=="isself"){
                        if(o.uid==StorMgr.uid)
                            return true;
                        return false
                    }
                    return "";
                },idx);
                break;
            case "chatList":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="hasMsg"&&o.hasMsg*1==1){
                        return "<span class='amount'></span>";
                    }
                    return "";
                },idx);
                break;
            case "chat":
                if(""==data.content){
                    return "";
                }
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="who"&&o.fid==StorMgr.uid){return " chatContent-r ub-rev"}
                    if(t[1]=="content"){
                        return UserTools.filterMsgFace(o.content)||"";
                    }
                    if(t[1]=="avatar"){
                        var myInfo=StorMgr.myInfo,
                            hisImg="x";
                        if("chatList"==pageEngine.prePage){
                            hisImg=hisInfo.heOfChatList.img;
                        }else{
                            hisImg=hisInfo.storInfos[hisInfo.curId].avatar_file;
                        }

                        if(o.fid==StorMgr.uid){
                            hisImg=myInfo.avatar_file;
                        }
                        return "<div class='chatAvatar'><img src='"+hisImg+"' alt='' /></div>";
                    }
                    return "";
                },idx);
                break;
            case "sysNotice":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="content"){
                        return UserTools.filterMsgFace(o.content);
                    }
                    if(t[1]=="avatar"){
                        return "";
                    }
                    return "";
                },idx);
                break;
            case "commentMe":
            case "sendComment":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="urlType"){
                        switch(o.parentType*1){
                            case 1:
                                return "生活";
                                break;
                            case 4:
                                return "评论";
                                break;
                            default:
                                return "心情";
                        }
                    }
                    if(t[1]=="sendType"){
                        switch(o.parentType*1){
                            case 4:
                                return "回复";
                                break;
                            default:
                                return "评论";
                        }
                    }
                    if(t[1]=="title"){
                        return UserTools.filterMsgFace(o.title);
                    }
                    if(t[1]=="parentTitle"){
                        return UserTools.filterMsgFace(o.parentTitle);
                    }
                    if(t[1]=="isself"){
                        if("sendComment"==that.page){
                            if(o.touid==StorMgr.uid){
                                return "'myPhoto'";
                            }else{
                                return "'hisPhoto','user_id="+o.touid+"'";
                            }
                        }
                    }
                    if(t[1]=="isselfDetail"){
                        if(o.parentUid==StorMgr.uid){
                            return "'myDetail'";
                        }else{
                            return "'hisDetail'";
                        }
                    }
                },idx);
                break;
            case "rank":
                tmplStr=BaseTools.compiTpl(tmpl,data,function(o,t){
                    switch(t[1]){
                        case "isself":
                            if(o.uid==StorMgr.uid){
                                return "_click=\"ViewMgr.gotoPage('myPhoto')\"";
                            }else{
                                return "_click=\"ViewMgr.gotoPage('hisPhoto','user_id="+o.uid+"')\"";
                            }
                            break;
                        case "age":
                            if(typeof parseInt(o.age)=="number"&&parseInt(o.age)>0){
                                return o.age+"岁";
                            }else{
                                return "年龄不详";
                            }
                            break;
                        case "address":
                            if(o.reside_city||o.reside_province){
                                return [o.reside_province||"",o.reside_city||""].join(" ");
                            }else{
                                return "地区不详";
                            }
                            break;
                        case "sex":
                            if(dataArray['sex'][o.sex]){
                                return dataArray['sex'][o.sex];
                            }else{
                                return "性别不详";
                            }
                            break;
                        case "target":
                            if(dataArray['target'][o.target-1]){
                                return dataArray['target'][o.target-1];
                            }else{
                                return "交友目的不详";
                            }
                            break;
                        case "top":
                            var topStr='<div class="Ranking top{d}"></div>';
                            if(idx<=3){
                                return topStr.replace("{d}",idx);
                            }
                            return "";
                            break;
                    }
                    return "";
                },idx);
                break;
            default:
                tmplStr=BaseTools.compiTpl(tmpl,data,null,idx);
        }
        return tmplStr;
    },
    compileMood:function(tmpl,data,idx){//拼装心情列表
        data=BaseTools.htmlEncodeObj(data);

        var moodLiStr=BaseTools.compiTpl(tmpl,data,function(o,t){//模板回调函数
                    switch(t[1]){
                        case 'siteurl':
                            return StorMgr.siteUrl;
                            break;
                        case 'mood':
                            if(o.havemood*1==0){
                                var str=(o.sex||'性别不详')+"|"+(o.age||'年龄不详');
                                return str;
                            }
                            return o.mood;
                            break;
                        case 'mood_icon_id':
                            return (o.mood_icon_id==0)?3:o.mood_icon_id;
                            break;
                        case 'time':
                            return o.update_time.split(" ")[1]||"";
                            break;
                        case 'colorPng':
                            return (!o.colorPng)?"":'<img src="'+o.colorPng+'" alt="">';
                            break;
                        case 'fileimg':
                            return (!o.fileimg)?"":'<img src="'+o.fileimg+'" alt="" />';
                            break;
                        case 'islove':
                            return (o.islove==1)?"active":"";
                            break;
                        case 'lovemood':
                            return (o.lovemood==1)?"active":"";
                            break;
                        case 'lovecount':
                            return o.lovecount||0;
                            break;
                        case 'commentcount':
                            return o.commentcount||0;
                            break;
                        case 'reportcount':
                            return o.reportcount||0;
                            break;
                    }
                },idx);
        return moodLiStr;
    },
    removeFeed:function(node){
         this.cont.removeChild(node);
         this.dataCount--;
         if(0==this.dataCount){
            this.more.innerHTML=this.noDataTxt;
            this.more.style.display="block";
         }
         this.reset();
    }
};

//私信列表类,继承Feed,前端分页
var ChatListFeed=extend({},Feed,{
    onePageNum:10,
    listDB:null,
    beforeDestroy:function(){
        this.onePageNum=10;
        this.listDB=null;
    },
    loadMoreSecc:function(a){
        this.index=1;
        if(a.error){
            this.reset();
            toast(a.error);
            return;
        }
        this.isLoading=false;
        this.cont.innerHTML="";
        
        this.listDB=a.list||[];
        this.getCacheData();
    },
    getCacheData:function(){//对方清除记录，只能从cashe中获得数据
        var that=this,
            cacheUrl=StorMgr.chatPath+UserTools.compileUrl(pageFeedUrl['sysNotice']),
            secCb=function(a){
                function hasFid(fid){
                    var lists=that.listDB;
                    for(var i=0,len=lists.length;i<len;i++){
                        if(fid==lists[i]['fid']){
                            return true;
                        }
                    }
                    return false;
                }
                if(0==a.state*1&&a.list.length>0){
                    for(var i=0,len=a.list.length;i<len;i++){
                        if(!hasFid(a.list[i]['fid'])){
                            that.listDB.unshift(a.list[i]);    
                        }
                    }
                }
                that.cacheCallback();
            },
            errCb=function(){
                that.cacheCallback();
            }
        UserAction.sendAction(cacheUrl,"","get",secCb,errCb);
    },
    cacheCallback:function(){
        var that=this;
        //记住头像
        BaseTools.storage.set("kxjy_my_chatList",that.listDB,"session");
        that.dataCount=that.listDB.length;
        that.totalPage=Math.ceil(that.dataCount/that.onePageNum)||0;
        var firstList=that.listDB.slice((that.index-1)*that.onePageNum,that.index*that.onePageNum);
        that.fullFillFeed(firstList);
    },
    loadMore:function(setParam){
        var that=this;
        if(that.isRefresh){
            if(that.isLoading)
                return;
            that.isLoading=true;

            if(that.more){
                that.more.innerHTML=that.loadingTxt;
            }

            var dataUrl=that.getUrl(),
                params=that.setParams(setParam);

            dataUrl=StorMgr.chatPath+dataUrl;
            that.sendRequest(dataUrl,params);
        }else{
            if((typeof that.totalPage=="number")&&that.index>=that.totalPage){
                if("暂无数据,请返回"==that.more.innerHTML){
                    ViewMgr.back();
                }else{
                    that.reset();
                }
                return false;
            }
            that.index++;
            var dataList=that.listDB.slice((that.index-1)*that.onePageNum,that.index*that.onePageNum);
            that.fullFillFeed(dataList);
        }
    }
});

//私信类,继承Feed
var ChatFeed=extend({},Feed,{
    onePageNum:10,
    ingterCount:0,
    getMsgInter:2000,//取新消息时间间隔 2秒
    reset:function(){
        var that=this;
        that.isRefresh=false;
        that.isLoading=false;
        clearTimeout(that.getDataInter);
        if('chat'!=pageEngine.curPage)
            return;
        that.getDataInter=setTimeout(function(){
            that.ingterCount++;
            that.isRefresh=false;
            that.loadMore();},that.getMsgInter||2000);

        if($.isFunc(that.cb)){
            that.cb();
        }

        that.hasData=false;
    },
    beforeRefersh:function(){
        this.ingterCount=0;
    },
    beforeDestroy:function(){
        this.onePageNum=10;
        this.hasData=false;
        this.ingterCount=0;
    },
    getUrl:function(){
        var feedUrl=UserTools.compileUrl(pageFeedUrl['chat']);

        var url=feedUrl+"&sid="+StorMgr.sid;

        if(!this.isRefresh)
            url=url.replace("st=3m","st=");
        return url;
    },
    loadMoreSecc:function(a){
        if(a.error||a.state){
            this.reset();
            toast(a.error);
            return;
        }
        if(this.isRefresh){
            this.cont.innerHTML="";
        }

        var listData=a.msg;

        this.dataCount=listData.length||0;
        this.totalPage=1;
        this.fullFillFeed(listData||[]);
    },
    loadMore:function(setParam){
        var that=this;
        if(that.isLoading||that.isDestroyed||'chat'!=pageEngine.curPage)
            return;
        that.isLoading=true;

        clearTimeout(that.getDataInter);

        var dataUrl=that.getUrl(),
            params=that.setParams(setParam);

        dataUrl=StorMgr.chatPath+dataUrl;

        that.sendRequest(dataUrl,params);
    },
    fullFillFeed:function(data){
        var that=this;

        if(that.isRefresh){
            that.cont.innerHTML="";
        }

        if(that.isRefresh&&(!data||data.length==0)){
            that.reset();
            return;
        }

        var len=data.length;
        that.hasData=(len>0);

        if(that.ingterCount!=1){//st=3m和st=""会同时把最后一次私信内容取出来
            for (var i=0; i<len; i++) {
                that.addChatCont(data[i],i);
            }
        }

        that.reset();
    },
    addChatCont:function(data,i){//添加chat内容
        var that=this,
            item=DOM.create("div");
        
        item.innerHTML=that.compileTmpl(data,i);
        
        for(var j=0,chiLen=item.children.length;j<chiLen;j++){
            that.cont.appendChild(item.firstElementChild);
        }
        delete item;
    }
});

/*评论类*/
var Comment={
    text:"评论",
    moodInter:null,
    motions:["[龇牙]","[吐舌头]","[流汗]","[捂嘴]","[挥手]","[敲打]","[擦汗]","[玫瑰]","[大哭]","[流泪]","[嘘]","[抓狂]","[委屈]","[微笑]","[色]","[脸红]","[得瑟]","[笑]","[惊恐]","[尴尬]","[吻]","[无语]","[不开心]","[惊讶]","[疑问]","[睡觉]","[亲]","[憨笑]","[吐]","[阴险]","[坏笑]","[鄙视]","[晕]","[可怜]","[好]","[坏]","[握手]","[耶]","[承让]","[勾手指]","[OK]","[折磨]","[挖鼻屎]","[拍手]","[糗]","[打哈欠]","[要哭了]","[闭嘴]"],
    transMotion:function(){
        var faces=this.motions,
            msg=this.commTxt;
        for(var i=0,len=faces.length;i<=len;i++){
           var reg = new RegExp("\\"+faces[i],"g");
           msg = msg.replace(reg,"[face"+(i*1+1)+"]");
        }
        return msg;
    },
	init:function(commBox,opt){
        var that=this,
            comBox=$(commBox);
        that.commBox=comBox;
        that.moodImg=$('.enterMood',comBox);
        that.moodBox=$('.chatMood',comBox);
        if(!that.moodBox){
            that.createMoodBox();
        }
        that.input=$('.enterInput input',comBox);
        that.sentBtn=$('.enterButton',comBox);
        extend(that,opt);
        that._bindEvent();
    },
    destroy:function(){
        var that=Comment;
        if(!that.commBox){
            return;
        }
        clearTimeout(that.moodInter);
        that.text="评论";
        delete that.moodInter;
        delete that.sendingComm;

        delete that.commBox;
        delete that.moodImg;
        delete that.moodBox;
        delete that.input;
        delete that.sentBtn;
        if(that.scroller){
            that.scroller.destroy();
            delete that.scroller;
        }
        that._unBindEvent();
    },
    _bindEvent:function(){
        var that=this;
        $('#pageWraper').setAttribute('_click','Comment.hideMoodBox()');
        DOM.addEvent(that.input,"keypress",function(e) {//按enter发送信息
            var key=e.event.keyCode;
            if(13!==key){
                return;
            }
            if('chat'==that.type){
                that.sendComment(null,'chat');
            }else{
                that.sendComment(function(){Feed.refresh();});
            }
        });
    },
    _unBindEvent:function(){
        $('#pageWraper').removeAttribute('_click');
    },
    focusInput:function(node){
        var that=this;
        that.hideMoodBox();
        that.input.focus();
        if(DOM.hasClass(that.input.parentNode,"wrong")){
            that.resetErr();
        }
        // if(node){
        //     node.event.event.stopPropagation();
        // }
    },
    sendComment:function(cb,type){
        var that=this;
        if(that.sendingComm){
            return;
        }

        that.hideMoodBox();
        that.input.blur();

        if(type&&type=="chat"){
            that.text="私信";
        }

        if(!that.checkComment()){
            return;
        }

        var sendUrl,
            params="",
            secCb=function(a){
                if(a.error||(a.state&&a.state*1>0)){
                    if(a.state){
                        switch(a.state*1){
                        case 1:
                            that.setErr('您输入的信息有误！');
                            break;
                        case 2:
                            that.setErr('等待对方回应，请稍候！');
                            break;
                        case 3:
                            that.setErr('非常抱歉，您此项操作今日的权限已经用完。');  
                            break;
                        case 4:
                            that.setErr('发送频繁，请稍后再试！');
                            break;
                        }
                    }else{
                        toast(a.msg);
                    }
                    that.sendingComm=false;
                    return;
                }
                cb&&cb();
                if(chatData){
                    ChatFeed.addChatCont(chatData);
                    myScroll.refresh();
                    if(0>myScroll.maxScrollY){//内容超过容器是才需要向上移动
                        myScroll.scrollTo(0,myScroll.maxScrollY,500);
                    }
                }else{
                    Page.refresh();
                    toast('发送成功！',2);    
                }
                that.resetErr();
                that.sendingComm=false;
            },
            errCb=function(m){
                toast(m.error||m.msg);
                that.sendingComm=false;
            },
            chatData=null,
            msg=that.transMotion(that.commTxt);

        if(type&&type=="chat"){
            sendUrl="/send_msg.php?callback=?&sid="+StorMgr.sid+"&fid="+StorMgr.uid+"&tid="+UserTools.getParamVal('user_id')+"&msg="+encodeURIComponent(msg)+"&i="+StorMgr.uid+"&k="+StorMgr.userKey;

            var nd=new Date(),
                ndS=nd.getFullYear()+"-"+(nd.getMonth()+1)+"-"+nd.getDate()+" "+nd.toLocaleTimeString();
            chatData={
                content:msg,
                fid:StorMgr.uid,
                datetime:ndS
            };

            sendUrl=StorMgr.chatPath+sendUrl;
        }else{
            sendUrl=StorMgr.siteUrl+"/weibo.php?action=comment&type=4&sid="+StorMgr.sid+"&parentid="+UserTools.getParamVal('wid');

            params="title="+encodeURIComponent(msg);
            if(that.parenNode){
                params+="&parentNode="+that.parenNode
                that._unSetParenComm();
            }
        }
        
        that.sendingComm=true;
        UserAction.sendAction(sendUrl,params,"get",secCb,errCb);
    },
    checkComment:function(){
        var that=this;
        if(DOM.hasClass(that.input.parentNode,"wrong")){
            return false;
        }
        that.commTxt=that.input.value.trim();

        var errTxt="";
        if(that.commTxt==""){
            errTxt="发送内容不能为空！";
        }
        if(that.commTxt.chineseLen()>139){
            errTxt=that.text+"内容过长！";
        }

        if(errTxt!=""){
            that.setErr(errTxt);
            return false;
        }
        return true;
    },
    setErr:function(txt){
        var that=this;
        that.input.value=txt;
        DOM.addClass(that.input.parentNode,"wrong");
    },
    resetErr:function(){
        var that=this;
        that.input.value="";
        DOM.removeClass(that.input.parentNode,"wrong");
    },
    createMoodBox:function(){
        var mb=DOM.create('div'),
            ul=DOM.create('ul'),
            arrow=DOM.create('span'),
            li,
            needScroll=(BODY.offsetWidth<19*BODYFS||BODY.offsetHeight<9*BODYFS);
        mb.className="chatMood";
        ul.className="clearfix";
        for(var i=0;i<36;i++){
            li=DOM.create('li');
            ul.appendChild(li);
        }
        arrow.innerHTML='&diams;';
        ul.appendChild(arrow);
        if(needScroll){
            var scroller=DOM.create('div',{className:'scroller',style:{width:'100%',height:'100%',position:'relative'}}),
                scrollObj={hScroll: false,
                           vScroll: false};
            scroller.innerHTML="<div style='position:absolute'></div>";
            scroller.firstChild.appendChild(ul);
            mb.appendChild(scroller);
            if(BODY.offsetWidth<19*BODYFS){
                mb.style.width=(BODY.offsetWidth-BODYFS)+"px";
                scrollObj.hScroll=true;
                scrollObj.hScrollbar=true;
            }
            if(BODY.offsetHeight<9*BODYFS){
                mb.style.height=(BODY.offsetHeight-4*BODYFS)+"px";
                scrollObj.vScroll=true;
                scrollObj.vScrollbar=true;
            }
            
        }else{
            mb.appendChild(ul);
        }
        mb.setAttribute('_click','Comment.selectMood(this)');
        this.commBox.appendChild(mb);
        if(needScroll){
            this.scroller=new iScroll($('.scroller',mb),scrollObj);
        }
        this.moodBox=mb;
    },
    selectMood:function(node){
        var that=this,
            evt=node.event,
            li=evt.getTargets('li')[0],
            lis=$$('li',that.moodBox),
            len=lis.length,
            liArr=[];
        for(var i=0;i<len;i++){
            liArr[i]=lis[i];
        }
        var idx=liArr.indexOf(li);
        if(typeof idx=="number"&&idx>=0){
            if(DOM.hasClass(that.input.parentNode,"wrong"))
                that.resetErr();
            BaseTools.insertAtCaret(that.input,that.motions[idx]);
        }
        // evt.stop();
    },
    switchMoodBox:function(node){
        var that=this;
        if(getComputedStyle(that.moodBox).bottom!=3.5*BODYFS+"px"){
            that.showMoodBox();
        }else{
            that.hideMoodBox();
        }
        // node.event.stop();
    },
    showMoodBox:function(){
        var that=this;
        if(that.moodBox.style.bottom=="3.5em"){
            return;
        }
        clearTimeout(that.moodInter);
        that.moodBox.style.bottom="3.5em";
    },
    hideMoodBox:function(){
        var that=Comment;
        if(that.moodBox.style.bottom=="1000em"){
            return;
        }
        clearTimeout(that.moodInter);
        that.moodInter=setTimeout(function(){
            that.moodBox.style.bottom="1000em";
        },0);
    },
    _setParenComm:function(pid){
        /*添加父节点,在Comment.sendComment方法中捕获*/
        this.parenNode=pid;
        this.sentBtn.innerHTML="回复评论";
    },
    _unSetParenComm:function(){
        this.parenNode=null;
        this.sentBtn.innerHTML="发表评论";
    },
    popOperation:function(node,paraId,enwid,self){
        var that=this;
        function myComm(){
            Device.confirm('对你的评论:',
            function(){
                that._unSetParenComm();
                UserAction.deleteData('comment',node,enwid);
            },
            function(){
                that._unSetParenComm();
            },['删除','取消'],'执行操作'
            );
        }
        if("myDetail"==pageEngine.curPage){
            if(!self){
                Device.actionThree('执行操作','对这条评论:',['回复','删除','取消'],
                function(){
                    that._setParenComm(enwid);
                    that.focusInput();
                },
                function(){
                    that._unSetParenComm();
                    UserAction.deleteData('comment',node,enwid);
                },
                function(){
                    that._unSetParenComm()
                }
                );
            }else{
                myComm();
            }
        }else{
            if(!self){
                Device.confirm('对这条评论:',
                function(){
                    that._setParenComm(enwid);
                    that.focusInput();
                },
                function(){
                    that._unSetParenComm();
                },['回复','取消'],'执行操作'
                );
            }else{
                myComm();
            }
        }
    }
};