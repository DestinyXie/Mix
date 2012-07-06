/*列表模板*/
var feedTemplate={
	photo:'<div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /></div>',
    myPhoto:'<div _click="ViewMgr.goto(\'myDetail.html\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    hisPhoto:'<div _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    mood:'<div class="DynamicList clearfix">\
        <div class="DynamicInfo">\
            <div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="DynamicAvatar"><img src="${avatarPicUrlx}" alt="" /></div>\
            <div class="DynamicAvatar-r">\
                <strong _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="DynamicName">${nickname}</strong>\
                <span class="DynamicTrank">${cb:colorPng}</span>\
                <ul class="DynamicNav clearfix">\
                    <li><span class="DynamicIco ub-img1 time"></span>${mooddate}</li>\
                    <li><span class="DynamicIco ub-img1 place"></span>${area}</li>\
                </ul>\
            </div>\
        </div>\
        <div class="">\
            <div class="ub">\
                <div class="DynamicMood ub ub-ver">\
                    <img src="css/images/f_${cb:mood_icon_id}.png" alt="" />\
                </div>\
                <div class="DynamicMoodTextBox ub-f1">\
                    <div class="ub-f1 DynamicMoodText">\
                    <span>&diams;</span>\
                        <div class="DynamicText ub ub-ac">\
                        <p class="ub-f1">${cb:mood}</p>\
                        <strong class="DynamicMore" _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')">></strong>\
                        </div>\
                        <div class="DynamicImg">${cb:fileurl}</div>\
	                    <ul class="DynamicMenu clearfix">\
							<li class="ub ub-ac" _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>\
	                        <li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this,\'${enwid}\',${cb:lovecount})"><span class="DynamicMenuIco love ${cb:lovemood}"></span>${cb:lovecount}</li>\
	                    </ul>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>',
    myMood:'<div class="DynamicMoodBox">\
        <div class="DynamicMoodTtile ub ub-ac">\
            <div class="DynamicMoodTime">\
                ${mooddate}\
                <span>&diams;</span>\
            </div>\
            <ul class="DynamicNav clearfix">\
                <li><span class="DynamicIco ub-img1 time"></span>${cb:time}</li>\
                <li><span class="DynamicIco ub-img1 place"></span>${area}</li>\
            </ul>\
        </div>\
        <div class="ub">\
            <div class="DynamicMood ub ub-ver">\
                <img src="css/images/f_${cb:mood_icon_id}.png" alt="" />\
                <div class="DynamicMoodLine ub-f1"></div>\
            </div>\
            <div class="DynamicMoodTextBox ub-f1">\
                <div class="ub-f1 DynamicMoodText">\
                    <span>&diams;</span>\
                    <div class="DynamicText ub ub-ac">\
                        <p class="ub-f1">${cb:mood}</p>\
                        <strong class="DynamicMore" _click="ViewMgr.goto(\'myDetail.html\',\'wid=${enwid}\')">></strong>\
                    </div>\
                    <div class="DynamicImg">${cb:fileurl}</div>\
					<ul class="DynamicMenu clearfix">\
						<li class="ub ub-ac" _click="ViewMgr.goto(\'myDetail.html\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>\
					    <li class="ub ub-ac"><span class="DynamicMenuIco love"></span>${cb:lovecount}</li>\
					</ul>\
                </div>\
                <div class="DynamicMenuLine"></div>\
            </div>\
        </div>\
    </div>',
    hisMood:'<div class="DynamicMoodBox">\
        <div class="DynamicMoodTtile ub ub-ac">\
            <div class="DynamicMoodTime">\
                ${mooddate}\
                <span>&diams;</span>\
            </div>\
            <ul class="DynamicNav clearfix">\
                <li><span class="DynamicIco ub-img1 time"></span>${cb:time}</li>\
                <li><span class="DynamicIco ub-img1 place"></span>${area}</li>\
            </ul>\
        </div>\
        <div class="ub">\
            <div class="DynamicMood ub ub-ver">\
                <img src="css/images/f_${cb:mood_icon_id}.png" alt="" />\
                <div class="DynamicMoodLine ub-f1"></div>\
            </div>\
            <div class="DynamicMoodTextBox ub-f1">\
                <div class="ub-f1 DynamicMoodText">\
                    <span>&diams;</span>\
                    <div class="DynamicText ub ub-ac">\
                        <p class="ub-f1">${cb:mood}</p>\
                        <strong class="DynamicMore" _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')">></strong>\
                    </div>\
                    <div class="DynamicImg">${cb:fileurl}</div>\
					<ul class="DynamicMenu clearfix">\
						<li class="ub ub-ac" _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')"><span class="DynamicMenuIco comment"></span>${cb:commentcount}</li>\
					    <li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this,\'${enwid}\',${cb:lovecount})"><span class="DynamicMenuIco love ${cb:islove}"></span>${cb:lovecount}</li>\
					</ul>\
                </div>\
                <div class="DynamicMenuLine"></div>\
            </div>\
        </div>\
    </div>',
    myDetail:'<div class="commentList ub ub-ac clearfix ${cb:childClass}" _click="Comment.popOperation(this,\'${parentid}\',\'${enwid}\',${cb:isself})">\
        <div class="commentListAvatar"><img src="${avatarPicUrl}" alt="头像" /></div>\
        <div class="commentListText ub-f1">${cb:commentMood}</div>\
    </div>${cb:child}',
    chatList:'<div class="commentList ub ub-ac clearfix">\
        <div class="commentListAvatar">\
			<img src="${img}" alt="" />\
            ${cb:hasMsg}\
		</div>\
        <div class="commentListText ub-f1">\
            <p class="chatListName">${name}</p>\
            <p class=" ut-s">&nbsp;</p>\
        </div>\
        <strong class="DynamicMore" _click="ViewMgr.goto(\'chat.html\',\'fid=${fid}&user_id=${fid}\')">></strong>\
    </div>',
    chat:'<div class="chatContent ub ${cb:who} clearfix">\
        ${cb:avatar}\
        <div class="chatTextBox ub-f1">\
            <div class="chatTime">${datetime}</div>\
            <div class="chatText">${cb:content}</div>\
            <span>&diams;</span>\
        </div>\
    </div>',
    attract:'<div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /><span class="myPhotoClose" _click="UserAction.disadmire(\'people\',this,\'${uid}\');this.event.stop();"></span></div>',
    commentMe:'<div class="commentList ub clearfix">\
        <div class="commentListAvatar" _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')"><img src="${avatar_url}" alt="" /></div>\
        <div class="commentListText ub-f1">\
            <p class="chatListName t-blue" _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')">${nickname}</p>\
            <p>评论内容<span class="t-pur">${cb:title}</span><span class="t-gra">(${create_time})</span></p>\
            <p>评论我的${cb:urlType}:<span class="t-blue">${cb:parentTitle}</span></p>\
        </div>\
        <strong class="DynamicMore" _click="ViewMgr.goto(\'myDetail.html\',\'wid=${parentid}\')">></strong>\
    </div>',
    sendComment:'<div class="commentList ub clearfix">\
        <div class="commentListAvatar" _click="ViewMgr.goto(${cb:isself})"><img src="${avatar_url}" alt="" /></div>\
        <div class="commentListText ub-f1">\
            <p>评论内容 ${cb:title} <span class="t-gra">(${create_time})</span></p>\
            <p>评论<span class="t-pur"_click="ViewMgr.goto(${cb:isself})">${nickname}</span>的${cb:urlType}:<span class="t-blue">${cb:parentTitle}</span></p>\
            <div class="chatDelete" _click="UserAction.deleteData(\'comment\',DOM.findParent(this,\'.commentList\',true),\'${enwid}\');">删除</div>\
        </div>\
        <strong class="DynamicMore" _click="ViewMgr.goto(\'hisDetail.html\',\'user_id=${uid}&wid=${parentid}\')">></strong>\
    </div>',
    blackList:'<div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /><span class="myPhotoClose" _click="UserAction.shieldPerson(\'del\',this.parentNode,\'${uid}\');this.event.stop();"></span></div>',
    rank:'<div class="rankList uc-t ub b-gra ub-ac umh4 lis">\
            <div class="topRank">${index:}</div>\
            <div class="commentListAvatar" ${cb:isself}>\
                <img src="${avatarPicUrlx}" alt="">\
            </div>\
            <div class="commentListText ub-f1">\
                <p class="chatListNameub-f1 chatListName" ${cb:isself}>${nickname}</p>\
                <p>${cb:age}/${cb:address}/${cb:sex}/${cb:target}</p>\
            </div>\
            ${cb:top}\
        </div> '
};

/*页面列表对应的模板*/
var pageFeedTmpl={
    mainPhoto:"photo",
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
    mainPhoto:"main.php?uid=${uid}",
    mainList:"main.php?uid=${uid}",
    myPhoto:"weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=8&uid=${uid}",
    myList:"weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=8&uid=${uid}",
    myDetail:"weibo.php?action=weibolist&type=4&parentid=${wid}",
    hisPhoto:"weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=8&uid=",
    hisList:"weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=8&uid=",
    hisDetail:"weibo.php?action=weibolist&type=4&parentid=${wid}",
    chatList:"get_sess_list.php?callback=?&t=1&i=${uid}&k=${userKey}",
    chat:"get_msg.php?callback=?&st=3m&i=${uid}&fid=${fid}&tid=${uid}&k=${userKey}",
    sysNotice:"get_msg.php?callback=?&st=&i=${uid}&fid=1&tid=${uid}&k=${userKey}",
    newGuest:"see.php?type=1&uid=${uid}",
    likeMe:"admire.php?type=0&uid=${uid}",
    attract:"admire.php?type=2&uid=${uid}",
    commentMe:"weibo.php?action=commentme&uid=${uid}",
    myView:"see.php?type=0&uid=${uid}",
    sendComment:"weibo.php?action=mycomment&uid=${uid}",
    blackList:"Blacklist.php?uid=${uid}",
    likeMood:"moodlist.php?action=love",
    likePerson:"admire.php?type=1",
    rank:"rank.php?type=0&page=1&rank=1&sex=2&user_id=0"
}

/*列表类*/
var Feed={
    defOptions:{
            index:0,
            cont:null,
            more:null,
            onePageNum:null,
            loadXhr:null,
            isLoading:false,
            loadingTxt:"正在加载...",
            moreTxt:"查看更多",
            noMoreTxt:"没有更多了",
            noDataTxt:"暂时没有数据",
            noMoreBtn:false,//是否显示加载按钮
    },
	init:function(options){
        /*options项
        * page 页面名;
        * cont 容器DOM;
        * more 更多按钮DOM;
        * cb   数据加载完成回调函数;
        * lastPos 数据插入位置;
        */
        var that=this;
        that.destory();
        that.isDestoryed=false;
        extend(that,that.defOptions,options);
        that.refresh();
	},
    reset:function(){
        this.isRefresh=false;
        this.isLoading=false;
        if(typeof this.cb=="function"){
            this.cb();
        }
    },
    destory:function(){
        if(this.beforeDestory){//供继承类使用
            this.beforeDestory();
        }
        this.isDestoryed=true;

        this.loadXhr&&this.loadXhr.abort();
        this.lastPos=null;
        this.addParams="";
    },
    refresh:function(setParam){
        if(this.noMoreBtn&&this.more.innerHTML!=this.noDataTxt){
            this.more.style.display="none";
        }
        this.index=0;
        this.isRefresh=true;
        this.isLoading=false;
        this.loadXhr&&this.loadXhr.abort();
        this.loadMore(setParam);
    },
    loadMoreSecc:function(a){
        this.index++;
        if(a.error&&this.page!="rank"){
            this.reset();
            toast(a.error);
            return;
        }

        if(this.page=="rank"&&a.error.length>0){
            this.reset();
            toast(a.error[0]);
            return;
        }

        if(this.isRefresh){//清除内容移至数据出来前
            if(this.lastPos==1){
                var lastEl=this.cont.lastElementChild.cloneNode(true);
                this.cont.innerHTML="";
                this.cont.appendChild(lastEl);
            }else if(this.lastPos==-1){
                var firstEl=this.cont.firstElementChild.cloneNode(true);
                this.cont.innerHTML="";
                this.cont.appendChild(firstEl);
            }else{
                this.cont.innerHTML="";
            }
        }
        
        if(['chatList'].has(this.page)){
            this.dataCount=a.sysMsgNum;
            this.totalPage=1;
            this.fullFillFeed(a.list);
            //记住头像
            Tools.storage.set("kxjy_my_chatList",a.list,"session");
            return;
        }

        if(['chat','sysNotice'].has(this.page)){
            this.dataCount=a.msg?a.msg.length:0;
            this.totalPage=1;
            this.fullFillFeed(a.msg?a.msg:{});
            return;   
        }

        if(['rank'].has(this.page)){
            var data=a.data;
            this.dataCount=data.rank_info.length;
            this.totalPage=data.allNum;
            this.fullFillFeed(data.rank_info);
            return;   
        }

        this.dataCount=a.datacount||(a.data&&a.data.length)||0;
        this.totalPage=a.allpage;

        if(WIN['Page']&&!!this.dataCount)
            Page.setDataNum();

        this.fullFillFeed(a.data);
    },
    loadMore:function(setParam){
        var that=this;
        if(that.isLoading)
            return;
        that.isLoading=true;

        if(!that.isRefresh&&(typeof that.totalPage=="number")&&that.index>=that.totalPage){
            that.reset();
            return false;
        }

        if(that.more&&!that.noMoreBtn){
            that.more.innerHTML=that.loadingTxt;
        }

        var dataUrl=that.getUrl(),
            params=that.setParams(setParam);

        if(['chatList','chat','sysNotice'].has(that.page)){
            dataUrl=Tools.getChatUrl(dataUrl);
        }

        that.sendRequest(dataUrl,params);
    },
    sendRequest:function(dataUrl,params){
        var that=this,
            secCb=function(a) {
                that.loadMoreSecc(a);
            },
            errCb=function(m){
                that.reset();
                // toast('connect error');
            };
        that.loadXhr=UserAction.sendAction(dataUrl,params,"get",secCb,errCb);
    },
    getUrl:function(){
        var feedUrl=pageFeedUrl[this.page].replace(/\$\{(\w+)\}/g,
            function(m,c){
                if(['uid','sid','userKey'].has(c))
                    return StorageMgr[c];
                return Tools.getParamVal(c);
            });

        if(['hisPhoto','hisList'].has(this.page)){
            feedUrl=pageFeedUrl[this.page].replace(/uid=[\d+]?$/,'uid='+hisInfo.curId);
        }

        return Tools.getSiteUrl()+feedUrl+"&sid="+StorageMgr.sid;
    },
    setParams:function(setParam){
        var params="page="+(this.index+1)+"&ajax=1";
        if(setParam){
            params+="&"+setParam;
        }
        if(this.addParams){//临时增加的参数
            params+="&"+this.addParams;
        }
        return params;
    },
    fullFillFeed:function(data){
        var that=this;
        if(that.noMoreBtn){
            if(that.more&&that.more.innerHTML!=that.noDataTxt)
                that.more.style.display="none";
        }else{
            that.more&&(that.more.innerHTML=that.moreTxt);    
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
        
        if(!that.noMoreBtn&&that.totalPage&&that.index>=that.totalPage){
            that.more&&(that.more.innerHTML=that.noMoreTxt);
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
        switch(that.page){
            case "mainPhoto":
                /*自己不显示*/
                if(data.uid==StorageMgr.uid)
                    return;
                tmplStr=Tools.compiTpl(tmpl,data,null,idx);
                break;
            case "myPhoto":
            case "hisPhoto":
                if(data.havemood*1!=0&&(!data.filetype||data.filetype=="img"))
                    tmplStr=Tools.compiTpl(tmpl,data,null,idx);
                break;
            case "mainList":
            case "myList":
            case "hisList":
            case "likeMood":
                /*自己不显示*/
                if(that.page=="mainList"&&data.uid==StorageMgr.uid){
                    return;
                }
                if(data.havemood*1!=0&&(!data.filetype||data.filetype=="img")){
                    tmplStr=that.compileMood(tmpl,data,idx);
                }
                break;
            case "myDetail":
            case "hisDetail":
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="commentMood"){
                        return Tools.filterMsgFace(o.mood);
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
                        if(o.uid==StorageMgr.uid)
                            return true;
                        return false
                    }
                    return "";
                },idx);
                break;
            case "chatList":
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
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
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="who"&&o.fid==StorageMgr.uid){return " chatContent-r ub-rev"}
                    if(t[1]=="content"){
                        return Tools.filterMsgFace(o.content)||"";
                    }
                    if(t[1]=="avatar"){
                        var myInfo=StorageMgr.myInfo,
                            hisImg="x";
                        if(ViewMgr.views[ViewMgr.views.length-2]=="chatList"){
                            hisImg=hisInfo.heOfChatList.img;
                        }else{
                            hisImg=hisInfo.storInfos[hisInfo.curId].avatar_file;
                        }

                        if(o.fid==StorageMgr.uid){
                            hisImg=myInfo.avatar_file;
                        }
                        return "<div class='chatAvatar'><img src='"+hisImg+"' alt='' /></div>";
                    }
                    return "";
                },idx);
                break;
            case "sysNotice":
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="content"){
                        return Tools.filterMsgFace(o.content);
                    }
                    if(t[1]=="avatar"){
                        return "";
                    }
                    return "";
                },idx);
                break;
            case "commentMe":
            case "sendComment":
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
                    if(t[1]=="urlType"){
                        switch(o.urlType){
                            case "2":
                                return "心情";
                                break;
                            default:
                                return "生活";
                        }
                    }
                    if(t[1]=="title"){
                        return Tools.filterMsgFace(o.title);
                    }
                    if(t[1]=="parentTitle"){
                        return Tools.filterMsgFace(o.parentTitle);
                    }
                    if(t[1]=="isself"){
                        if(o.touid==o.uid){
                            return "'myPhoto.html'";
                        }else{
                            return "'hisPhoto.html','user_id="+((that.page=="sendComment")?o.touid:o.uid)+"'";
                        }
                    }
                },idx);
                break;
            case "rank":
                tmplStr=Tools.compiTpl(tmpl,data,function(o,t){
                    switch(t[1]){
                        case "isself":
                            if(o.uid==StorageMgr.uid){
                                return "_click=\"ViewMgr.goto('myPhoto.html')\"";
                            }else{
                                return "_click=\"ViewMgr.goto('hisPhoto.html','user_id="+o.uid+"')\"";
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
                            if(o.reside_city||o.reside_provice){
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
                            if(dataArray['target'][o.target]){
                                return dataArray['target'][o.target];
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
                tmplStr=Tools.compiTpl(tmpl,data,null,idx);
        }
        return tmplStr;
    },
    compileMood:function(tmpl,data,idx){//拼装心情列表
        var pageName=this.page;
        var moodLiStr=Tools.compiTpl(tmpl,data,function(o,t){//模板回调函数
                    switch(t[1]){
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
                        case 'fileurl':
                            return (!o.fileurl)?"":'<img src="'+o.fileurl+'" alt="" />';
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
            that.loadMore();},that.getMsgInter||2000);

        if($.isFunc(that.cb)){
            that.cb();
        }

        that.hasData=false;
    },
    beforeDestory:function(){
        this.hasData=false;
        this.ingterCount=0;
    },
    getUrl:function(mine){
        var feedUrl=pageFeedUrl[this.page].replace(/\$\{(\w+)\}/g,
            function(m,c){
                if(['uid','sid','userKey'].has(c))
                    return StorageMgr[c];
                return Tools.getParamVal(c);
            });

        var url=Tools.getSiteUrl()+feedUrl+"&sid="+StorageMgr.sid;

        if(mine)
            url=url.replace(/&fid=\d+/,"&fid="+StorageMgr.uid).replace(/&tid=\d+/,"&tid="+Tools.getParamVal('fid')).replace("st=3m","st=");
        if(!this.isRefresh)
            url=url.replace("st=3m","st=");
        return url;
    },
    loadMore:function(setParam,mine){
        var that=this;
        if(that.isLoading||that.isDestoryed)
            return;
        that.isLoading=true;

        clearTimeout(that.getDataInter);

        var dataUrl=that.getUrl(mine),
            params=that.setParams(setParam);

        dataUrl=Tools.getChatUrl(dataUrl);

        that.sendRequest(dataUrl,params);
    },
    fullFillFeed:function(data){
        var that=this;

        if(that.isRefresh){
            if(that.more&&that.more.innerHTML!=that.noDataTxt)
                that.more.style.display="none";
            that.cont.innerHTML="";
        }

        if(!that.noMoreBtn){
            that.more&&(that.more.innerHTML=that.moreTxt);    
        }
        
        if(that.isRefresh&&(!data||data.length==0)){
            that.reset();
            that.more.style.display="block"
            that.more.innerHTML=that.noDataTxt;
            return;
        }

        var len=data.length;
        that.hasData=(len>0);

        if(that.ingterCount!=1){//st=3m和st=""会同时把最后一次私信内容取出来
            for (var i=0; i<len; i++) {
                var item=DOM.create("div");
                
                item.innerHTML=that.compileTmpl(data[i],i);
                
                for(var j=0,chiLen=item.children.length;j<chiLen;j++){
                    that.cont.appendChild(item.firstElementChild);
                }
                delete item;
            }
        }

        that.reset();
    }
})


/*评论类*/
var Comment={
    type:"评论",
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
        var comBox=$(commBox);
        this.commBox=comBox;
        this.moodImg=$('.enterMood',comBox);
        this.moodBox=$('.chatMood',comBox);
        if(!this.moodBox){
            this.createMoodBox();
        }
        this.input=$('.enterInput input',comBox);
        this.sentBtn=$('.enterButton',comBox);
        this._bindEvent();
    },
    destory:function(){
        var that=this;
        if(!this.commBox)
            return;
        
        clearTimeout(that.moodInter);
        that.type="评论";
        that.moodInter=null;

        delete this.commBox;
        this.commBox=null;
        this.moodImg=null;
        this.moodBox=null;
        this.input=null;
        this.sentBtn=null;
        this._unBindEvent();
    },
    _bindEvent:function(){
        DOC.addEventListener(CLICK_EVENT,Comment.hideMoodBox,false);
    },
    _unBindEvent:function(){
        DOC.removeEventListener(CLICK_EVENT,Comment.hideMoodBox,false);
    },
    focusInput:function(node){
        var that=this;
        that.hideMoodBox();
        that.input.focus();
        if(DOM.hasClass(that.input.parentNode,"wrong"))
            that.reset();
        node&&node.event.event.stopPropagation();
    },
    sendComment:function(cb,type){
        var that=this;
        that.hideMoodBox();

        if(!that.checkComment()){
            return;
        }

        var sendUrl,
            params="",
            secCb=function(a){
                if(a.error||a.state*1==1){
                    toast('出错了:'+a.msg);
                    return;
                }
                cb&&cb();
                that.reset();
                toast('发送成功！',2);
            };

        if(type&&type=="chat"){
            that.type="私信";
            sendUrl=Tools.getSiteUrl()+"send_msg.php?callback=?&sid="+StorageMgr.sid+"&fid="+StorageMgr.uid+"&tid="+Tools.getParamVal('fid')+"&msg="+that.transMotion(that.commTxt)+"&i="+StorageMgr.uid+"&k="+StorageMgr.userKey;

            sendUrl=Tools.getChatUrl(sendUrl);
        }else{
            sendUrl=Tools.getSiteUrl()+"weibo.php?action=comment&type=4&sid="+StorageMgr.sid+"&parentid="+Tools.getParamVal('wid');

            params="title="+that.transMotion(that.commTxt);
            if(that.parenNode){
                params+="&parentNode="+that.parenNode
                that._unSetParenComm();
            }
        }
        
        UserAction.sendAction(sendUrl,params,"get",secCb);
    },
    checkComment:function(){
        var that=this;
        if(DOM.hasClass(that.input.parentNode,"wrong")){
            return false;
        }
        that.commTxt=that.input.value.trim();

        var errTxt="";
        if(that.commTxt==""){
            errTxt=that.type+"内容不能为空！";
        }
        if(that.commTxt.chineseLen()>139){
            errTxt=that.type+"过长！";
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
    reset:function(){
        var that=this;
        that.input.value="";
        DOM.dropClass(that.input.parentNode,"wrong");
    },
    createMoodBox:function(){
        var mb=DOM.create('div'),
            ul=DOM.create('ul'),
            arrow=DOM.create('span'),
            li;
        mb.className="chatMood";
        ul.className="clearfix";
        for(var i=0;i<36;i++){
            li=DOM.create('li');
            ul.appendChild(li);
        }
        arrow.innerHTML='&diams;';
        ul.appendChild(arrow);
        mb.appendChild(ul);
        mb.setAttribute('_click','Comment.selectMood(this)');
        this.commBox.appendChild(mb);
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
                that.reset();
            Tools.insertAtCaret(that.input,that.motions[idx]);
        }
        that.stopHideBox=true;
        evt.stop();
        setTimeout(function(){that.stopHideBox=false;},200);
    },
    switchMoodBox:function(node){
        var that=this;
        if(getComputedStyle(that.moodBox).display!="block"){
            that.showMoodBox();
            that.stopHideBox=true;
        }else{
            that.hideMoodBox();
        }
        node.event.stop();
        setTimeout(function(){that.stopHideBox=false;},200);
    },
    showMoodBox:function(){
        var that=this;
        if(that.moodBox.style.display=="block"){
            return;
        }
        clearTimeout(that.moodInter);
        that.moodBox.style.display="block";
        that.moodInter=setTimeout(function(){
            DOM.addClass(that.moodBox,'display');
        },0);
    },
    hideMoodBox:function(){
        var that=Comment;
        if(that.stopHideBox||that.moodBox.style.display=="none"){
            return;
        }
        clearTimeout(that.moodInter);
        DOM.dropClass(that.moodBox,'display');
        that.moodInter=setTimeout(function(){
            that.moodBox.style.display="none";
        },250);
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
        if(Page.name=="myDetail"){
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
                Device.confirm('对你的评论:',
                function(){
                    that._unSetParenComm()
                    UserAction.deleteData('comment',node,enwid);
                },
                function(){
                    that._unSetParenComm()
                },['删除','取消'],'执行操作'
                );
            }
        }else{
            if(!self){
                Device.confirm('对这条评论:',
                function(){
                    that._setParenComm(enwid);
                    that.focusInput();
                },
                function(){
                    that._unSetParenComm()
                },['回复','取消'],'执行操作'
                );
            }else{
                Device.confirm('对你的评论:',
                function(){
                    that._unSetParenComm()
                    UserAction.deleteData('comment',node,enwid);
                },
                function(){
                    that._unSetParenComm()
                },['删除','取消'],'执行操作'
                );
            }
        }
    }
};