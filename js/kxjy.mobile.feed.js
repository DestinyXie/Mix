/*列表模板*/
var feedTemplate={
	photo:'<div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="mainList ub-img1"><img src="${avatarPicUrlx}" alt="" /></div>',
    myPhoto:'<div _click="ViewMgr.goto(\'myDetail.html\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    hisPhoto:'<div _click="ViewMgr.goto(\'hisDetail.html\',\'wid=${enwid}\')" class="mainList ub-img1"><img src="${fileimg}" alt="" /></div>',
    mood:'<div class="DynamicList clearfix">\
        <div class="DynamicInfo">\
            <div _click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${uid}\')" class="DynamicAvatar"><img src="${smallpic}" alt="" /></div>\
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
        <strong class="DynamicMore" _click="ViewMgr.goto(\'chat.html\',\'fid=${fid}&user_id=${fid}&nickname=${name}\')">></strong>\
    </div>',
    chat:'<div class="chatContent ub ${cb:who} clearfix">\
        <div class="chatAvatar"><img src="${cb:avatar}" alt="" /></div>\
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
            <p>评论<span class="t-pur"_click="ViewMgr.goto(\'hisPhoto.html\',\'user_id=${touid}\')">${nickname}</span>的${cb:urlType}:<span class="t-blue">${cb:parentTitle}</span></p>\
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
    mainPhoto:"main.php?uid="+Tools.getUrlParamVal('uid'),
    mainList:"main.php?uid="+Tools.getUrlParamVal('uid'),
    myPhoto:"weibo.php?action=weibolist&type=1&pagecount=8&uid="+Tools.getUrlParamVal('uid'),
    myList:"weibo.php?action=weibolist&type=2&pagecount=8&uid="+Tools.getUrlParamVal('uid'),
    myDetail:"weibo.php?action=weibolist&type=4&parentid="+Tools.getUrlParamVal('wid'),
    hisPhoto:"weibo.php?action=weibolist&type=1&pagecount=8&uid=",
    hisList:"weibo.php?action=weibolist&type=2&pagecount=8&uid=",
    hisDetail:"weibo.php?action=weibolist&type=4&parentid="+Tools.getUrlParamVal('wid'),
    chatList:"get_sess_list.php?callback=?&t=1&i="+Tools.getUrlParamVal('uid')+"&k="+Tools.getUrlParamVal('userKey'),
    chat:"get_msg.php?callback=?&st=3m&i="+Tools.getUrlParamVal('uid')+"&fid="+Tools.getUrlParamVal('fid')+"&tid="+Tools.getUrlParamVal('uid')+"&k="+Tools.getUrlParamVal('userKey'),
    sysNotice:"get_msg.php?callback=?&st=&i="+Tools.getUrlParamVal('uid')+"&fid=1&tid="+Tools.getUrlParamVal('uid')+"&k="+Tools.getUrlParamVal('userKey'),
    newGuest:"see.php?type=1&uid="+Tools.getUrlParamVal('uid'),
    likeMe:"admire.php?type=0&uid="+Tools.getUrlParamVal('uid'),
    attract:"admire.php?type=2&uid="+Tools.getUrlParamVal('uid'),
    commentMe:"weibo.php?action=commentme&uid="+Tools.getUrlParamVal('uid'),
    myView:"see.php?type=0&uid="+Tools.getUrlParamVal('uid'),
    sendComment:"weibo.php?action=mycomment&uid="+Tools.getUrlParamVal('uid'),
    blackList:"Blacklist.php?uid="+Tools.getUrlParamVal('uid'),
    likeMood:"moodlist.php?action=love",
    likePerson:"admire.php?type=1",
    rank:"rank.php?type=0&page=1&rank=1&sex=2&user_id="
}


/*列表类*/
var Feed={
    index:1,
    cont:null,
    more:null,
    onePageNum:null,
    loadingTxt:"正在加载...",
    moreTxt:"查看更多",
    noMoreTxt:"没有更多了",
    noDataTxt:"暂时没有数据",
    noMoreBtn:false,//是否显示加载按钮
	init:function(options){
        /*options项
        * page 页面名;
        * cont 容器DOM;
        * more 更多按钮DOM;
        * cb   数据加载完成回调函数;
        * lastPos 数据插入位置;
        */
        extend(this,options);
        this.refresh();
	},
    reset:function(){
        this.isRefresh=false;
        if(typeof this.cb=="function"){
            this.cb();
        }
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
            if(data.rank!="无排名")
                $('#curPos').innerHTML="排在"+data.rank+"位";
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
        if(!that.isRefresh&&(typeof that.totalPage==number)&&that.index>that.totalPage){
            that.reset();
            return false;
        }

        if(!that.isRefresh&&that.more&&!that.noMoreBtn){
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
                toast('connect error');
            };
        UserAction.sendAction(dataUrl,params,"get",secCb,errCb);
    },
    getUrl:function(){
        return Tools.getSiteUrl()+pageFeedUrl[this.page]+"&sid="+Tools.getUrlParamVal('sid');
    },
    setParams:function(setParam){
        var params="page="+this.index+"&ajax=1";
        if(setParam){
            params+="&"+setParam;
        }
        if(this.addParams){//临时增加的参数
            params+="&"+this.addParams;
        }
        return params;
    },
    refresh:function(setParam){
        if(this.noMoreBtn&&this.more.innerHTML!=this.noDataTxt){
            this.more.style.display="none";
        }
        this.index=1;
        this.isRefresh=true;
        this.loadMore(setParam);
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
            case "myPhoto":
            case "hisPhoto":
                if(data.havemood*1!=0&&(!data.filetype||data.filetype=="img"))
                    tmplStr=zy_tmpl_s(tmpl,data,null,idx);
                break;
            case "mainList":
            case "myList":
            case "hisList":
            case "likeMood":
                if(!data.filetype||data.filetype=="img")
                    tmplStr=that.compileMood(tmpl,data,idx);
                break;
            case "myDetail":
            case "hisDetail":
                tmplStr=zy_tmpl_s(tmpl,data,function(o,t){
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
                        if(o.uid==Tools.getUrlParamVal('uid'))
                            return true;
                        return false
                    }
                    return "";
                },idx);
                break;
            case "chatList":
                tmplStr=zy_tmpl_s(tmpl,data,function(o,t){
                    if(t[1]=="hasMsg"&&o.hasMsg*1==1){
                        return "<span class='amount'></span>";
                    }
                    return "";
                },idx);
                break;
            case "chat":
            case "sysNotice":
                tmplStr=zy_tmpl_s(tmpl,data,function(o,t){
                    if(t[1]=="who"&&o.fid==Tools.getUrlParamVal('uid')){return " chatContent-r ub-rev"}
                    if(t[1]=="content"){
                        return Tools.filterMsgFace(o.content);
                    }
                    if(t[1]=="avatar"){
                        var cl=Tools.storage.get("kxjy_my_chatList","session"),
                            myInfo=StorageMgr.myInfo,
                            hisImg="x";
                        $.each(cl,function(item){
                            if(item.fid==Tools.getUrlParamVal('user_id')&&o.fid==Tools.getUrlParamVal('user_id'))
                                hisImg=item.img;
                        });

                        if(o.fid==Tools.getUrlParamVal('uid')){
                            if(myInfo&&myInfo.avatar_file){
                                hisImg=myInfo.avatar_file;    
                            }else{
                                hisImg="myImg";
                                StorageMgr.getMyInfo(function(info){
                                        imgs=$$("img[src='myImg']");
                                        $.each(
                                            function(img){
                                                img.src=info.avatar_file;
                                            });
                                    }
                                );
                            }
                        }
                        return hisImg;
                    }
                    return "";
                },idx);
                break;
            case "commentMe":
            case "sendComment":
                tmplStr=zy_tmpl_s(tmpl,data,function(o,t){
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
                tmplStr=zy_tmpl_s(tmpl,data,function(o,t){
                    switch(t[1]){
                        case "isself":
                            if(o.uid==Tools.getUrlParamVal('uid')){
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
                tmplStr=zy_tmpl_s(tmpl,data,null,idx);
        }
        return tmplStr;
    },
    compileMood:function(tmpl,data,idx){//拼装心情列表
        var pageName=this.page;
        var moodLiStr=zy_tmpl_s(tmpl,data,function(o,t){//模板回调函数
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
         this.reset();
    }
};


//私信类,继承Feed
var ChatFeed={};
extend(ChatFeed,Feed);
extend(ChatFeed,{
    onePageNum:10,
    ingterCount:0,
    reset:function(){
        this.isRefresh=false;
        clearTimeout(ChatFeed.getDataInter);
        ChatFeed.getDataInter=setTimeout(function(){
            ChatFeed.ingterCount++;
            ChatFeed.loadMore();},1000);
        if(typeof this.cb=="function"&&this.hasData){
            this.cb();
        }
        this.hasData=false;
    },
    getUrl:function(mine){
        var url=Tools.getSiteUrl()+pageFeedUrl[this.page]+"&sid="+Tools.getUrlParamVal('sid');

        if(mine)
            url=url.replace(/&fid=\d+/,"&fid="+Tools.getUrlParamVal('uid')).replace(/&tid=\d+/,"&tid="+Tools.getUrlParamVal('fid')).replace("st=3m","st=");
        if(!this.isRefresh)
            url=url.replace("st=3m","st=");
        return url;
    },
    loadMore:function(setParam,mine){
        clearTimeout(ChatFeed.getDataInter);

        var dataUrl=this.getUrl(mine),
            params=this.setParams(setParam);

        dataUrl=Tools.getChatUrl(dataUrl);

        this.sendRequest(dataUrl,params);
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
        
        if(that.isRefresh){
            that.reset();
            if(!data||data.length==0){
                that.more.style.display="block"
                that.more.innerHTML=that.noDataTxt;
                return;
            }
        }else{
            that.reset();
        }

        var len=data.length;
        that.hasData=(len>0);
        if(that.ingterCount==1){
            return;
        }

        for (var i=0; i<len; i++) {
            var item=DOM.create("div");
            
            item.innerHTML=that.compileTmpl(data[i],i);
            
            for(var j=0,chiLen=item.childNodes.length;j<chiLen;j++){
                that.cont.appendChild(item.firstElementChild);
            }
            delete item;
        }
    }
})


/*评论类*/
var Comment={
    type:"评论",
    moodInter:null,
    motions:["[龇牙]","[吐舌头]","[流汗]","[捂嘴]","[挥手]","[敲打]","[擦汗]","[玫瑰]","[大哭]","[流泪]","[嘘]","[抓狂]","[委屈]","[微笑]","[色]","[脸红]","[得瑟]","[笑]","[惊恐]","[尴尬]","[吻]","[无语]","[不开心]","[惊讶]","[疑问]","[睡觉]","[亲]","[憨笑]","[吐]","[阴险]","[坏笑]","[鄙视]","[晕]","[可怜]","[好]","[坏]","[握手]","[耶]","[承让]","[勾手指]","[OK]","[折磨]","[挖鼻屎]","[拍手]","[糗]","[打哈欠]","[要哭了]","[闭嘴]"],
    transMotion:function(){
        var faces=Comment.motions,
            msg=Comment.commTxt;
        for(var i=0,len=faces.length;i<=len;i++){
           var reg = new RegExp("\\"+faces[i],"g");
           msg = msg.replace(reg,"[face"+(i*1+1)+"]");
        }
        return msg;
    },
	init:function(commBox,opt){
        this.commBox=$(commBox);
        this.moodImg=$('.enterMood',Comment.commBox);
        this.moodBox=$('.chatMood',Comment.commBox);
        if(!this.moodBox){
            this.createMoodBox();
        }
        this.input=$('.enterInput input',Comment.commBox);
        this.sentBtn=$('.enterButton',Comment.commBox);
        this.bindEvent();
    },
    bindEvent:function(){
        DOM.addEvent(DOC,CLICK_EVENT,function(e){
            if(Comment.stopHideBox)
                return;
            Comment.hideMoodBox();
        });
    },
    focusInput:function(node){
        Comment.hideMoodBox();
        Comment.input.focus();
        if(DOM.hasClass(Comment.input.parentNode,"wrong"))
            Comment.reset();
        node&&node.event.event.stopPropagation();
    },
    sendComment:function(pid,cb,type){
        Comment.hideMoodBox();

        if(!Comment.checkComment()){
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
                Comment.reset();
                toast('发送成功！',2);
            };

        if(type&&type=="chat"){
            Comment.type="私信";
            sendUrl=Tools.getSiteUrl()+"send_msg.php?callback=?&sid="+Tools.getUrlParamVal('sid')+"&fid="+Tools.getUrlParamVal('uid')+"&tid="+Tools.getUrlParamVal('fid')+"&msg="+Comment.transMotion(Comment.commTxt)+"&i="+Tools.getUrlParamVal('uid')+"&k="+Tools.getUrlParamVal('userKey');

            sendUrl=Tools.getChatUrl(sendUrl);
        }else{
            sendUrl=Tools.getSiteUrl()+"weibo.php?action=comment&type=4&sid="+Tools.getUrlParamVal('sid')+"&parentid="+Tools.getUrlParamVal('wid');

            params="title="+Comment.transMotion(Comment.commTxt);
            if(Comment.parenNode){
                params+="&parentNode="+Comment.parenNode
                Comment.parenNode=null;
            }
        }
        
        UserAction.sendAction(sendUrl,params,"get",secCb);
    },
    checkComment:function(){
        if(DOM.hasClass(Comment.input.parentNode,"wrong")){
            return false;
        }
        Comment.commTxt=Comment.input.value.trim();

        var errTxt="";
        if(Comment.commTxt==""){
            errTxt=Comment.type+"内容不能为空！";
        }
        if(Comment.commTxt.chineseLen()>139){
            errTxt=Comment.type+"过长！";
        }

        if(errTxt!=""){
            Comment.setErr(errTxt);
            return false;
        }
        return true;
    },
    setErr:function(txt){
        Comment.input.value=txt;
        DOM.addClass(Comment.input.parentNode,"wrong");
    },
    reset:function(){
        Comment.input.value="";
        DOM.dropClass(Comment.input.parentNode,"wrong");
    },
    createMoodBox:function(){
        var mb=DOM.create('div'),
            ul=DOM.create('ul'),
            arrow=DOM.create('span'),
            li;
        mb.className="chatMood";
        ul.className="clearfix";
        for(var i=0;i<40;i++){
            li=DOM.create('li');
            ul.appendChild(li);
        }
        arrow.innerHTML='&diams;';
        ul.appendChild(arrow);
        mb.appendChild(ul);
        mb.setAttribute('_click','Comment.selectMood(this)');
        Comment.commBox.appendChild(mb);
        Comment.moodBox=mb;
    },
    selectMood:function(node){
        var evt=node.event,
            li=evt.getTargets('li')[0],
            lis=$$('li',Comment.moodBox),
            len=lis.length,
            liArr=[];
        for(var i=0;i<len;i++){
            liArr[i]=lis[i];
        }
        var idx=liArr.indexOf(li);
        if(typeof idx=="number"&&idx>=0){
            if(DOM.hasClass(Comment.input.parentNode,"wrong"))
                Comment.reset();
            Tools.insertAtCaret(Comment.input,Comment.motions[idx]);
        }
        Comment.stopHideBox=true;
        evt.stop();
        setTimeout(function(){Comment.stopHideBox=false;},200);
    },
    switchMoodBox:function(node){
        if(getComputedStyle(Comment.moodBox).display!="block"){
            Comment.showMoodBox();
            Comment.stopHideBox=true;
        }else{
            Comment.hideMoodBox();
        }
        node.event.stop();
        setTimeout(function(){Comment.stopHideBox=false;},200);
    },
    showMoodBox:function(){
        if(Comment.moodBox.style.display=="block"){
            return;
        }
        clearTimeout(Comment.moodInter);
        Comment.moodBox.style.display="block";
        Comment.moodInter=setTimeout(function(){
            DOM.addClass(Comment.moodBox,'display');
        },0);
    },
    hideMoodBox:function(){
        if(Comment.moodBox.style.display=="none"){
            return;
        }
        clearTimeout(Comment.moodInter);
        DOM.dropClass(Comment.moodBox,'display');
        Comment.moodInter=setTimeout(function(){
            Comment.moodBox.style.display="none";
        },250);
    },
    popOperation:function(node,paraId,enwid,self){
        if(!self){
            Device.actionThree('执行操作','对这条评论:',['回复','删除','取消'],
            function(){
                /*添加父节点,在Comment.sendComment方法中捕获*/
                Comment.parenNode=enwid;
                Comment.focusInput();
            },
            function(){
                Comment.parenNode=null;
                UserAction.deleteData('comment',node,enwid);
            },
            function(){
                Comment.parenNode=null;
            }
            );
        }else{
            Device.confirm('对你的评论:',
            function(){
                Comment.parenNode=null;
                UserAction.deleteData('comment',node,enwid);
            },
            function(){
                Comment.parenNode=null;
            },['删除','取消'],'执行操作'
            );
        }
    }
};