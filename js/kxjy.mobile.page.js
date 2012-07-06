/*单页面模式*/
(function(){
//公共tmpl,减少代码量
var headerBack='<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <div _click="ViewMgr.back()" class="btn btn-l kxjy-btn ub ub-ac ">\
            <div class="ulim">返回</div>\
            </div>',
    headerCancel=headerBack.replace('返回','取消'),
    photoContTmpl='<!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="bg">\
    <div>\
    <div class="pullDown">\
    <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>\
    </div>\
    <div class="ub-f1 tx-l t-bla ub-img6 mainPhoto">\
        <div id="feedCont" class="mainListBox clearfix">\
        </div>\
    </div>\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
    moodContTmpl='<!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="bg">\
    <div>\
    <div class="pullDown">\
    <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>\
    </div>\
    <!--网格开始-->\
    <div id="feedCont">\
    </div>\
    <!--网格结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
    commentTmpl='<!-- 输入 -->\
    <div class="enter ub ub-ac">\
        <div class="enterMood" _click="Comment.switchMoodBox(this)"><img src="css/images/f_1.png" alt="心情" /></div>\
        <div class="enterInput btnBg ub-f1 uinput" id="enterInput"><input type="text" placeholder="评论内容..." _click="Comment.focusInput(this)"></div>\
        <div class="enterButton btnBg" _click="Comment.sendComment(function(){Feed.refresh();});">发表评论</div>\
    </div>\
    <!-- 输入结束-->',
    commentListTmpl='<!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--列表开始-->\
    <div class="chatList">\
    </div>\
    <!--列表结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->'

var contentTmpl={
'login':'<div class="logo"><img src="css/images/login_logo.png" alt="开心交友" /></div>\
    <div class="loginBox">\
        <div class="ub-ac ub loginList">\
            <label class="uinn">邮箱</label>\
            <div class="loginInput ub-f1"><input id="email" class="btnBg" type="text" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">密码</label>\
            <div class="loginInput ub-f1"><input id="password" class="btnBg" type="password" /></div>\
        </div>\
        <div class="Forget tr">忘记密码?</div>\
        <div class="loginButton">\
            <span id="loginBtn" class="btnBg" _click="UserAction.checkLogin(\'#email\',\'#password\',this)">登陆</span>\
            <span class="btnBg" _click="ViewMgr.goto(\'users.html\')">注册</span>\
        </div>\
    </div>\
    <div class="qqLogin">\
        <span>用QQ帐号登录</span>\
    </div>',
'mainPhoto':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <div _click="actionSheet.show(\'search\')" class="btn btn-l kxjy-btn ub ub-ac ">\
                <span class="header-ico hd-search"></span>\
            </div>\
            <h1 class="ut ulev0 ut-s tx-c">附近的人</h1>\
            <div _click="ViewMgr.goto(\'mainList.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac">动态<span class="header-ico hd-list"></span></div>\
        </div>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'mainList':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <div _click="actionSheet.show(\'search\')" class="btn btn-l kxjy-btn ub ub-ac ">\
                <span class="header-ico hd-search"></span>\
            </div>\
            <h1 class="ut ulev0 ut-s tx-c">附近动态</h1>\
            <div _click="ViewMgr.goto(\'mainPhoto.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac">头像<span class="header-ico hd-photo"></span></div>\
            </div>\
        </div>\
    </div>\
    <!--header结束-->\
    ${moodContTmpl}',
'myPhoto':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <div _click="ViewMgr.goto(\'myList.html\')" class="btn btn-l kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac"><span class="header-ico hd-list"></span>心情</div>\
            </div>\
            <h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>\
            <div _click="ViewMgr.goto(\'editInfo.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim">编辑资料</div>\
            </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <div class="ub-f1 tx-l t-bla ub-img6 mainPhoto">\
        <div class="myTitle clearfix">\
            <div class="myTitleAvatar fl"></div>\
            <div class="myTitle-r">\
                <strong class="DynamicName">&nbsp;</strong>\
                <span class="DynamicTrank"></span>\
                <ul class="myTitleMenu ub">\
                    <li class="ub-f1 active" id="titleMenu-pic">\
                        <span>0<br />照片</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-mood" _click="ViewMgr.goto(\'myList.html\')">\
                        <span>0<br />心情</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.goto(\'rank.html\')">\
                        <span><br />无排名</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu_more" _click="Page.showMore()">\
                        <span>更多资料</span>\
                    </li>\
                </ul>\
            </div>\
        </div>\
        <ul class="myInfo">\
            <li id="myInfo-1"></li>\
            <li id="myInfo-2"></li>\
            <li id="myInfo-3"></li>\
        </ul>\
        <div id="feedCont" class="mainListBox clearfix">\
            <div class="myPhotoBox myPhotoBox-last fl" _click="actionSheet.show(\'photo\')">\
                <img src="css/images/plus.gif" alt="添加" />\
            </div>\
        </div>\
    </div>\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'myList':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <div _click="ViewMgr.goto(\'myPhoto.html\')" class="btn btn-l kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac"><span class="header-ico hd-photo"></span>照片</div>\
            </div>\
            <h1 class="ut ulev0 ut-s tx-c">\&nbsp;</h1>\
            <div _click="ViewMgr.goto(\'editInfo.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim">编辑资料</div>\
            </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="bg">\
    <div>\
    <!--网格开始-->\
    <div class="dockScroll" id="feedCont">\
        <div class="myTitle clearfix">\
            <div class="myTitleAvatar fl"></div>\
            <div class="myTitle-r">\
                <strong class="DynamicName">&nbsp;</strong>\
                <span class="DynamicTrank"></span>\
                <ul class="myTitleMenu ub">\
                    <li class="ub-f1" id="titleMenu-pic" _click="ViewMgr.goto(\'myPhoto.html\')">\
                        <span>0<br />照片</span>\
                    </li>\
                    <li class="ub-f1 active" id="titleMenu-mood">\
                        <span>0<br />心情</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.goto(\'rank.html\')">\
                        <span><br />无排名</span>\
                    </li>\
                </ul>\
            </div>\
        </div>\
    </div>\
    <!--网格结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'editInfo':'${headerCancel}\
            <h1 class="ut ulev0 ut-s tx-c">编辑资料</h1>\
            <!--按钮开始-->\
             <div class="btn btn-r kxjy-btn ub ub-ac" _click="Page.submitEditInfo()">\
                  <div class="ulim">保存</div>\
             </div>\
             <!--按钮结束-->\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <div class="uba  b-gra c-wh us listBg">\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入昵称\',function(txt){Page.setEditVal(\'nickname\',txt);},null,[\'确定\',\'取消\'],$(\'#nickname\').innerHTML)">\
          <div class="t-org umar-t color777 fr" id="nickname"></div>\
          <div class="umar-t">昵称</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.actionThree(\'\',\'选择性别\',[\'男\',\'女\',\'取消\'],function(){Page.setEditVal(\'sex\',\'男\')},function(txt){Page.setEditVal(\'sex\',\'女\');},null)">\
          <div class="t-org umar-t color777 fr" id="sex"></div>\
          <div class="umar-t">性别</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Tools.initArea();">\
          <div class="umar-t">地区</div>\
          <div class="t-org umar-t color777" id="area"></div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.datePicker($(\'#birthDay\'),function(val){Page.setEditVal(\'birthDay\',val)})">\
          <div class="t-org umar-t color777 fr" id="birthDay"></div>\
          <div class="umar-t">生日</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix">\
            <select id="marrySel">\
            </select>\
          <div class="t-org umar-t color777 fr" id="marry"></div>\
          <div class="umar-t">婚姻状况</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix">\
            <select id="targetSel">\
            </select>\
          <div class="t-org umar-t color777 fr" id="target"></div>\
          <div class="umar-t">交友目的</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入个人描述\',function(txt){Page.setEditVal(\'note\',txt)},null,[\'确定\',\'取消\'],$(\'#note\').innerHTML)">\
          <div class="umar-t">个人描述</div>\
          <div class="t-org umar-t color777" id="note"></div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入QQ号\',function(txt){Page.setEditVal(\'qq\',txt)},null,[\'确定\',\'取消\'],$(\'#qq\').innerHTML)">\
          <div class="t-org umar-t color777 fr" id="qq"></div>\
          <div class="umar-t">QQ</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入手机号\',function(txt){Page.setEditVal(\'mobile\',txt)},null,[\'确定\',\'取消\'],$(\'#mobile\').innerHTML)">\
          <div class="t-org umar-t color777 fr" id="mobile"></div>\
          <div class="umar-t">手机</div>\
        </div>\
        <div class="ub-f1 lis editinfoList infoList clearfix">\
            <select id="interestSel" multiple>\
            </select>\
          <div class="umar-t">兴趣爱好</div>\
          <div class="t-org umar-t color777" id="interest"></div>\
        </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'myDetail':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">动态详情</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">\
    <div class="ub-f1">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--网格开始-->\
    <div>\
    <!-- 心情 -->\
        <div class="DynamicList clearfix">\
            <div class="DynamicInfo">\
                <div class="DynamicAvatar"></div>\
                <div class="DynamicAvatar-r">\
                    <strong class="DynamicName">用户昵称</strong>\
                    <span class="DynamicTrank"></span>\
                    <ul class="DynamicNav clearfix">\
                        <li><span class="DynamicIco ub-img1 time"></span>时间</li>\
                        <li><span class="DynamicIco ub-img1 place"></span>地点</li>\
                    </ul>\
                </div>\
            </div>\
            <div class="ub">\
                <div class="DynamicMood ub ub-ver">\
                    <img src="css/images/f_3.png" alt="" />\
                </div>\
                <div class="DynamicMoodTextBox ub-f1">\
                    <div class="ub-f1 DynamicMoodText">\
                        <span>&diams;</span>\
                        <div class="DynamicText ub">\
                            <p class="ub-f1"></p>\
                        </div>\
                        <div class="DynamicImg"></div>\
                        <ul class="DynamicMenu clearfix">\
                            <li class="ub ub-ac" _click="UserAction.deleteData(\'mood\',this)"><span class="DynamicMenuIco delete"></span>删除</li>\
                            <li class="ub ub-ac"><span class="DynamicMenuIco comment"></span>0</li>\
                            <li class="ub ub-ac"><span class="DynamicMenuIco love"></span>0</li>\
                        </ul>\
                    </div>\
                </div>\
            </div>\
        </div>\
    <!-- 心情结束 -->\
    <!-- 留言 -->\
    <div class="comment">\
    </div>\
    <!-- 留言 结束-->\
    </div>\
    <!--网格结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    ${commentTmpl}\
    </div>\
    <!--content结束-->',
'hisPhoto':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>\
            <div _click="ViewMgr.goto(\'hisList.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac">心情<span class="header-ico hd-list"></span></div>\
        </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--网格开始-->\
    <div>\
        <div class="myTitle clearfix">\
            <div class="myTitleAvatar fl"></div>\
            <div class="myTitle-r">\
                <strong class="DynamicName">&nbsp;</strong>\
                <span class="DynamicTrank"></span>\
                <ul class="myTitleMenu ub">\
                    <li class="ub-f1 active" id="titleMenu-pic">\
                        <span>0<br />照片</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-mood" _click="ViewMgr.goto(\'hisList.html\')">\
                        <span>0<br />心情</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.goto(\'rank.html\')">\
                        <span><br />无排名</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu_more" _click="Page.showMore()">\
                        <span>更多资料</span>\
                    </li>\
                </ul>\
            </div>\
        </div>\
        <ul class="myInfo">\
            <li id="myInfo-1"></li>\
            <li id="myInfo-2"></li>\
            <li id="myInfo-3"></li>\
        </ul>\
        <div id="feedCont" class="mainListBox clearfix">\
        </div>\
    </div>\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'hisList':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>\
            <div _click="ViewMgr.goto(\'hisPhoto.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim ub ub-ac">照片<span class="header-ico hd-photo"></span></div>\
        </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="bg">\
    <div>\
    <!--网格开始-->\
    <div class="dockScroll" id="feedCont">\
        <div class="myTitle clearfix">\
            <div class="myTitleAvatar fl"></div>\
            <div class="myTitle-r">\
                <strong class="DynamicName">&nbsp;</strong>\
                <span class="DynamicTrank"></span>\
                <ul class="myTitleMenu ub">\
                    <li class="ub-f1" id="titleMenu-pic" _click="ViewMgr.goto(\'hisPhoto.html\')">\
                        <span>0<br />照片</span>\
                    </li>\
                    <li class="ub-f1 active" id="titleMenu-mood">\
                        <span>0<br />心情</span>\
                    </li>\
                    <li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.goto(\'rank.html\')">\
                        <span><br />无排名</span>\
                    </li>\
                </ul>\
            </div>\
        </div>\
    </div>\
    <!--网格结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'hisDetail':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">动态详情</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">\
    <div class="ub-f1">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--网格开始-->\
    <div>\
    <!-- 心情 -->\
        <div class="DynamicList clearfix">\
            <div class="DynamicInfo">\
                <div class="DynamicAvatar"></div>\
                <div class="DynamicAvatar-r">\
                    <strong class="DynamicName">&nbsp;</strong>\
                    <span class="DynamicTrank"></span>\
                    <ul class="DynamicNav clearfix">\
                        <li><span class="DynamicIco ub-img1 time"></span>时间</li>\
                        <li><span class="DynamicIco ub-img1 place"></span>地点</li>\
                    </ul>\
                </div>\
            </div>\
            <div class="ub">\
                <div class="DynamicMood ub ub-ver">\
                    <img src="css/images/f_3.png" alt="" />\
                </div>\
                <div class="DynamicMoodTextBox ub-f1">\
                    <div class="ub-f1 DynamicMoodText">\
                        <span>&diams;</span>\
                        <div class="DynamicText ub">\
                            <p class="ub-f1"></p>\
                        </div>\
                        <div class="DynamicImg"></div>\
                        <ul class="DynamicMenu clearfix">\
                            <li class="ub ub-ac" _click="Comment.focusInput()"><span class="DynamicMenuIco comment"></span>0</li>\
                            <li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this)"><span class="DynamicMenuIco love"></span>0</li>\
                        </ul>\
                    </div>\
                </div>\
            </div>\
        </div>\
    <!-- 心情结束 -->\
    <!-- 留言 -->\
    <div class="comment">\
    </div>\
    <!-- 留言 结束-->\
    </div>\
    <!--网格结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    ${commentTmpl}\
    </div>\
    <!--content结束-->',
'showMood':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <h1 class="ut ulev0 ut-s tx-c">秀心情</h1>\
            <div _click="UserAction.showMood($(\'.showMoodPlus\'),$(\'.showMoodList\'),$(\'#mood\'))" class="btn btn-r kxjy-btn ub ub-ac ">\
            <div class="ulim">发布</div>\
            </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
        <div class="showMoodPlus" _click="actionSheet.show(\'photo\');"></div>\
        <div class="showMoodList ub" _click="Tools.setIconId(this);" iconid="3">\
            <div class="showMoodImg ub-f1"><img src="css/images/f_1.png" alt="表情" /></div>\
            <div class="showMoodImg ub-f1"><img src="css/images/f_2.png" alt="表情" /></div>\
            <div class="showMoodImg ub-f1">\
                <img src="css/images/f_3.png" alt="表情" />\
                <span class="MoodSelect"></span>\
            </div>\
            <div class="showMoodImg ub-f1"><img src="css/images/f_4.png" alt="表情" /></div>\
            <div class="showMoodImg ub-f1"><img src="css/images/f_5.png" alt="表情" /></div>\
        </div>\
        <div class="showMoodTextarea uinput ub-f1">\
            <textarea id="mood" placeholder="请输入内容..." name="textarea-0" class="uc-a1"></textarea>\
        </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'infoCenter':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <h1 class="ut ulev0 ut-s tx-c">信息中心</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
        <!--列表开始-->\
    <div class="uba b-gra us listBg">\
        <div  _click="ViewMgr.goto(\'chatList.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">私信</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'sysNotice.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">通知</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'newGuest.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">最近访客</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'likeMe.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">谁在&hearts;我</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'myList.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">&hearts;我的心情 </div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'attract.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">相互吸引</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'commentMe.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">收到的评论</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'rank.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">我的排名</div>\
            <div class="tx-r t-blu ulev-1">无排名</div>\
        </div>\
        <div _click="InfoCenter.clear(\'flowersList\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">收到的鲜花</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'myView.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">我看过谁</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'sendComment.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">发出的评论</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'blackList.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">我屏蔽的人</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'likeMood.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">我&hearts;过的心情</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
        <div _click="ViewMgr.goto(\'likePerson.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">我&hearts;过的人</div>\
            <div class="tx-r t-blu ulev-1">0</div>\
        </div>\
      </div>\
    <!--列表结束-->\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'chatList':'${headerBack}\
            <!--按钮结束-->\
            <h1 class="ut ulev0 ut-s tx-c">私信</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--列表开始-->\
    <div class="chatList">\
    </div>\
    <!--列表结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'chat':'${headerBack}\
        <h1 class="ut ulev0 ut-s tx-c"  id="nickName">&nbsp;</h1>\
        <div _click="ViewMgr.goto(\'hisPhoto.html\')" class="btn btn-r kxjy-btn ub ub-ac ">\
        <div class="ulim">TA的主页</div>\
        </div>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">\
    <div class="ub-f1">\
    <div id="wrapper" class="bg">\
    <div>\
    <div class="pullDown">\
    <span class="pullDownLabel">下拉查看更多...</span>\
    </div>\
    <div id="chatContent">\
    </div>\
    <div class="moreFeed">\
    </div>\
    </div>\
    </div>\
    </div>\
    <!-- 输入 -->\
    <div class="enter ub ub-ac">\
        <div class="enterMood" _click="Comment.switchMoodBox(this);"><img src="css/images/f_1.png" alt="心情" /></div>\
        <div class="enterInput btnBg ub-f1 uinput" id="enterInput"><input type="text" placeholder="私信内容..." _click="Comment.focusInput(this)"></div>\
        <div class="enterButton btnBg" _click="Comment.sendComment(function(){ChatFeed.loadMore(null,true)},\'chat\');">发送私信</div>\
    </div>\
    <!-- 输入结束-->\
    </div>\
    <!--content结束-->',
'sysNotice':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">通知</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver bg">\
        <div class="chatBox ub-f1">\
            <div id="wrapper" class="fixWrapperLeft">\
            <div>\
            <div class="pullDown">\
            <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>\
            </div>\
            <div id="feedCont">\
            </div>\
            <div class="moreFeed" _click="Feed.loadMore();">\
                查看更多\
            </div>\
            </div>\
            </div>\
        </div>\
    </div>\
    <!--content结束-->',
'newGuest':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">最近访客(0)</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'likeMe':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">谁在&hearts;我</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'attract':'${headerBack}\
        <h1 class="ut ulev0 ut-s tx-c">相互吸引</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'commentMe':'${headerBack}\
              <h1 class="ut ulev0 ut-s tx-c">收到的评论</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${commentListTmpl}',
'myView':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">我看过谁</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'sendComment':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">发出的评论</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${commentListTmpl}',
'blackList':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">我屏蔽的人</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'likeMood':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">我&hearts;过的心情</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${moodContTmpl}',
'likePerson':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">我&hearts;过的人</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    ${photoContTmpl}',
'more':'<!--header开始-->\
    <div id="header" class="uh">\
        <div class="kxjy-hd">\
            <h1 class="ut ulev0 ut-s tx-c">更多</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="fixWrapperLeft bg">\
    <div>\
    <!--网格开始-->\
    <div>\
    <!--列表开始-->\
    <div class="uba  b-gra listBg us">\
        <div _click="ViewMgr.goto(\'rank.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">达人榜</div>\
            <div class="res8 lis-sw ub-img"></div>\
        </div>\
        <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">提醒</div>\
            <!--开关按钮开始-->\
            <input id="cBtn" class="uhide" type="checkbox" checked="true">\
            <div class="uba b-gra swi swi-bg uc-a1"  _click="$(\'#cBtn\').checked=!$(\'#cBtn\').checked;"></div>\
            <!--开关按钮结束-->\
        </div>\
            <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">声音</div>\
            <!--开关按钮开始-->\
            <input id="dBtn" class="uhide" type="checkbox" checked="true">\
            <div class="uba b-gra swi swi-bg uc-a1"  _click="$(\'#dBtn\').checked=!$(\'#dBtn\').checked;"></div>\
            <!--开关按钮结束-->\
        </div>\
        <div _click="ViewMgr.goto(\'password.html\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">修改密码</div>\
            <div class="res8 lis-sw ub-img"></div>\
        </div>\
        <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">评分支持</div>\
        </div>\
        <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">意见反馈</div>\
        </div>\
        <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">\
            <div class="ub-f1 ut-s">关于</div>\
        </div>\
        <div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis" _click="Device.confirm(\'确定退出？\',function(){Tools.storage.clear();Tools.storage.clear(\'session\');ViewMgr.setUrl(\'login\');})">\
            <div class="ub-f1 ut-s">退出当前账号</div>\
        </div>\
    </div>\
    <!--列表结束-->\
    </div>\
    <!--网格结束-->\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'rank':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">人气达人榜</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6">\
    <div id="wrapper" class="bg">\
    <div>\
    <div class="pullDown">\
    <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>\
    </div>\
    <!--列表开始-->\
    <div class="rankBox">\
        <div class="rankAddress">\
            所在地区：<span _click="Tools.initArea(\'rank\');" id="area"></span>\
            <p>我今日的人气值为：<label id="expToday"></label>，目前<label id="curPos">无排名</label></p>\
        </div>\
        <div class="uba b-gra us listBg">\
        </div>\
    </div>\
    <!--列表结束-->\
    <div _click="Feed.loadMore();" class="moreFeed">\
        查看更多\
    </div>\
    </div>\
    </div>\
    </div>\
    <!--content结束-->',
'password':'${headerCancel}\
            <h1 class="ut ulev0 ut-s tx-c">修改密码</h1>\
            <!--按钮开始-->\
             <div class="btn btn-r kxjy-btn ub ub-ac" _click="UserAction.changePassword(\'#oPwd\',\'#nPwd\',\'#cPwd\')">\
                <div class="ulim">保存</div>\
              </div>\
            <!--按钮结束-->\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 bg">\
    <!--列表开始-->\
    <div class="passwordBox">\
        <div class="ub-ac ub loginList">\
            <label class="uinn">当前密码:</label>\
            <div class="loginInput ub-f1"><input id="oPwd" class="btnBg" type="password" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">　新密码:</label>\
            <div class="loginInput ub-f1"><input id="nPwd" class="btnBg" type="password" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">确认密码:</label>\
            <div class="loginInput ub-f1"><input id="cPwd" class="btnBg" type="password" /></div>\
        </div>\
    </div>\
    <!--列表结束-->\
    </div>\
    <!--content结束-->',
'users':'${headerBack}\
            <h1 class="ut ulev0 ut-s tx-c">用户注册</h1>\
        </div>\
    </div>\
    <!--header结束-->\
    <!--content开始-->\
    <div id="content" class="ub-f1 tx-l t-bla ub-img6 bg">\
    <!--列表开始-->\
    <div class="passwordBox">\
    <!--复选框开始-->\
    <input type="hidden" id="regSex" value="0"/>\
    <div class="t-bla">\
     <div class="ub uc-a1 t-bla   c-m7 uba tx-c gender">\
      <div class=" uinn5 ubr b-grp uc-l1 ub-f1 che usersActive" _click="setSex(this,0)">\
        男\
      </div>\
      <div class=" uinn5 ubr b-grp uc-r1 ub-f1 che btnBg" _click="setSex(this,1)">\
        女\
      </div>\
     </div>\
    </div>\
    <!--复选框结束-->\
        <div class="ub-ac ub loginList">\
            <label class="uinn">电子邮箱:</label>\
            <div class="loginInput ub-f1"><input class="btnBg" type="text" id="regEmail" value="@qq.com"/></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">　用户名:</label>\
            <div class="loginInput ub-f1"><input class="btnBg" type="text" id="regNickName" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">　　密码:</label>\
            <div class="loginInput ub-f1"><input class="btnBg" type="password" id="regPwd" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">确认密码:</label>\
            <div class="loginInput ub-f1"><input class="btnBg" type="password" id="regPwdR" /></div>\
        </div>\
        <div class="ub-ac ub loginList">\
            <label class="uinn">　验证码:</label>\
            <div class="loginInput ub-f1"><input class="btnBg" type="text" placeholder="点击右边图片,刷新验证码" id="regVeri"/></div>\
            <div id="verify" _click="UserAction.getVerify(this)"></div>\
        </div>\
    </div>\
    <div class="users" _click="UserAction.userRegist()">注册</div>\
    <!--列表结束-->\
    </div>\
    <!--content结束-->'
};

var footerTmple={
'mainFooter':'<!--footer开始-->\
    <div id="footer" class="uf c-m2 c-bla t-wh">\
        <!--iPhone导航条开始-->\
        <div class="ub c-bla c-m12 t-wh footer">\
        <input class="uhide" ${1} type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("mainPhoto.html");\' class="ub-f1 ub ub-ver "><div class="ub-f1 ub-img5 tp-info"></div><div class="uinn ulev-2 tx-c">交友广场</div></div>\
        <input class="uhide" ${2} type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("myPhoto.html");\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-home"></div><div class="uinn ulev-2 tx-c">我的主页</div></div>\
        <input class="uhide" ${3} type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("showMood.html");\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-set"></div><div class="uinn ulev-2 tx-c">秀心情</div></div>\
        <input class="uhide" ${4} type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("infoCenter.html");\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-shop"></div><div class="uinn ulev-2 tx-c">信息中心</div></div>\
        <input class="uhide" ${5} type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("more.html");\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-talk"></div><div class="uinn ulev-2 tx-c">更多</div></div>\
        </div>\
        <!--iPhone导航条结束-->\
    </div>\
    <!--footer结束-->',
'hisFooter':'<!--footer开始-->\
    <div id="footer" class="uf c-m2 c-bla t-wh">\
        <!--iPhone导航条开始-->\
        <div class="ub c-bla c-m12 t-wh footer">\
        <input class="uhide" ${love} type="radio" name="tabSwitch">\
        <div id="footer-love" _click=\'UserAction.loveData("people",this);\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-love"></div><div class="uinn ulev-2 tx-c">喜欢</div></div>\
        <input class="uhide" type="radio" name="tabSwitch">\
        <div _click=\'ViewMgr.goto("chat.html","st=3m&fid="+Tools.getParamVal("user_id")+"&user_id="+Tools.getParamVal("user_id"));\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-commnet"></div><div class="uinn ulev-2 tx-c">发私信</div></div>\
        <input class="uhide" type="radio" name="tabSwitch">\
        <div _click=\'UserAction.sendFlower("people",this);\' class="ub-f1 ub ub-ver disable"><div class="ub-f1 ub-img5 tp-flower"></div><div class="uinn ulev-2 tx-c">送鲜花</div></div>\
        <input class="uhide" ${shield} type="radio" name="tabSwitch">\
        <div id="footer-shield" _click=\'UserAction.shieldPerson("people",this);\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-blacklist"></div><div class="uinn ulev-2 tx-c">屏蔽</div></div>\
        </div>\
        <!--iPhone导航条结束-->\
    </div>\
    <!--footer结束-->'
};


/*各个页面相关配置*/
//[footerTmpl{string,boolean},
// footerFocusIdx{number,boolean},
// requestInfoCener{boolean},
// requestTips{boolean},
// initEvent{function}]
var pageConfig={
'login':[false,false,false,false,function(){
    DOM.addEvent($('#password'),'keypress',function(e){
        if(13==e.event.keyCode){
            UserAction.checkLogin('#email','#password',$('#loginBtn'));
        }
    });
    var storEmail=Tools.storage.get('kxjy_my_email'),
        storPwd=Tools.storage.get('kxjy_my_pwd');
    if(storEmail&&storPwd){
        $('#email').value=storEmail;
        $('#password').value=storPwd;
    }
}],
'mainPhoto':['mainFooter',1,true,true],
'mainList':['mainFooter',1,true,true],
'myPhoto':['mainFooter',2,true,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=new iScroll('wrapper');
    Page.init({
        name:'myPhoto',
        dataUrl:'do.php?action=getUserInfo&sid='+StorageMgr.sid+"&user_id="+StorageMgr.uid
    });
    Feed.init({
        page:'myPhoto',
        cont:$('#feedCont'),
        more:$('.moreFeed'),
        cb:function(){myScroll.refresh();},
        lastPos:1
    });
    //取得心情总数
    UserAction.getMoodNum(Tools.getSiteUrl()+"weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=1&uid="+StorageMgr.uid+"&sid="+StorageMgr.sid+"&page=1&ajax=1",function(num){
        try{$("#titleMenu-mood span").innerHTML=num+"<br/>心情";}catch(e){}
        
    });
}],
'myList':['mainFooter',2,true,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=new initDockScroll('.DynamicMoodTtile','wrapper','#feedCont');
    Page.init({
        name:'myList',
        dataUrl:'do.php?action=getUserInfo&sid='+StorageMgr.sid+"&user_id="+StorageMgr.uid
    });
    Feed.init({
        page:'myList',
        cont:$('#feedCont'),
        more:$('.moreFeed'),
        cb:function(){myScroll.refresh();},
        lastPos:-1
    });
    //取得照片总数
    UserAction.getMoodNum(Tools.getSiteUrl()+"weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=1&uid="+StorageMgr.uid+"&sid="+StorageMgr.sid+"&page=1&ajax=1",function(num){
        try{$('#titleMenu-pic span').innerHTML=num+"<br/>照片";}catch(e){}
        
    });
}],
'editInfo':['mainFooter',2,true,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=new iScroll('wrapper',{
        useTransform: false,
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if(!['INPUT','SELECT','OPTION'].has(e.target.tagName)){
                e.preventDefault();
            }
        },
        onScrollEnd:function(){
            myScroll.refresh();
        }
    });
    Tools.initSelect('#marrySel','marry');
    Tools.initSelect('#targetSel','target');
    Tools.initSelect('#interestSel','interest',true);
    Page.init({
        name:'editInfo',
        dataUrl:'do.php?action=getUserInfo&sid='+StorageMgr.sid+"&user_id="+StorageMgr.uid
    });
}],
'myDetail':[false,false,false,true,function(){
    Page.init({
        name:'myDetail',
        dataUrl:'mood.php?ajax=1&wid='+Tools.getParamVal("wid")+'&sid='+StorageMgr.sid
    });
}],
'hisPhoto':['hisFooter',false,false,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=new iScroll('wrapper');
    hisInfo.init(function(){
        Page.init({
            name:'hisPhoto',
            dataUrl:'profile.php?ajax=1&sid='+StorageMgr.sid+"&user_id="+hisInfo.curId
        });
        Feed.init({
            page:'hisPhoto',
            cont:$('#feedCont'),
            more:$('.moreFeed'),
            cb:function(){myScroll.refresh();}
        });
        //取得心情总数
        UserAction.getMoodNum(Tools.getSiteUrl()+"weibo.php?action=weibolist&mbweibotype=1&type=2&pagecount=1&uid="+hisInfo.curId+"&sid="+StorageMgr.sid+"&page=1&ajax=1",function(num){
            $("#titleMenu-mood span").innerHTML=num+"<br/>心情";
        });
    });
}],
'hisList':['hisFooter',false,false,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=new initDockScroll('.DynamicMoodTtile','wrapper','#feedCont');
    hisInfo.init(function(){
        Feed.init({
            page:'hisList',
            cont:$('#feedCont'),
            more:$('.moreFeed'),
            cb:function(){myScroll.refresh();},
            lastPos:-1
        });
        Page.init({
            name:'hisList',
            dataUrl:'profile.php?ajax=1&sid='+StorageMgr.sid+"&user_id="+hisInfo.curId
        });
        //取得照片总数
        UserAction.getMoodNum(Tools.getSiteUrl()+"weibo.php?action=weibolist&mbweibotype=1&type=1&pagecount=1&uid="+hisInfo.curId+"&sid="+StorageMgr.sid+"&page=1&ajax=1",function(num){
            try{$('#titleMenu-pic span').innerHTML=num+"<br/>照片";}catch(e){}
            
        });
    });
}],
'hisDetail':[false,false,false,true,function(){
    Page.init({
        name:'hisDetail',
        dataUrl:'moodHe.php?ajax=1&wid='+Tools.getParamVal("wid")+'&sid='+StorageMgr.sid
    });
}],
'showMood':['mainFooter',3,true,true,function(){
    //计算TextArea的高度
    var fs=parseInt(getComputedStyle(BODY).fontSize);
    function setMoodH(){
        var h=$('#content').offsetHeight-10.5*fs-$('.showMoodList').offsetHeight;
        h=(h<10*fs)?10*fs:h;
        $('.showMoodTextarea').style.height=h+"px";
    }
    setTimeout(function(){
        //登陆就弹出的话小周手机会出现奇怪的情况
        actionSheet.show('photo');
        setMoodH();
    },100);
    //取得上次的心情图标
    Tools.setIconId(null,StorageMgr.myInfo['mood_icon_id']||3);
    delete WIN['myScroll'];
    WIN['myScroll']=new iScroll('wrapper');
    DOM.addEvent($("#mood"),"keypress",function(e){e.event.stopPropagation();
    });
}],
'infoCenter':['mainFooter',4,true,true,function(){
    new iScroll('wrapper');
}],
'chatList':['mainFooter',4,true,true],
'chat':[false,false,false,true,function(){
    hisInfo.init(function(){
        //check 从他们主页过来还是聊天列表过来
        var cl=Tools.storage.get("kxjy_my_chatList","session"),
            nickname="TA";
        if(ViewMgr.views[ViewMgr.views.length-2]=="chatList"&&!!cl){
            var hisId=hisInfo.curId;
            $.each(cl,function(item){
                if(item.fid==hisId){
                    hisInfo.heOfChatList=item;
                }
            });
            nickname=hisInfo.heOfChatList.name;
        }else{
            nickname=hisInfo.get(hisInfo.curId).nickname;
        }
        $('#nickName').innerHTML=nickname;
    });
    WIN['myScroll']=initIScroll($('.pullDown'),'wrapper',function(){ChatFeed.refresh();
    });
    ChatFeed.init({
        noDataTxt:"暂无数据,请返回",
        noMoreBtn:true,
        page:'chat',
        cont:$('#chatContent'),
        more:$('.moreFeed'),
        cb:function(){
            if(ChatFeed.hasData){
                ChatFeed.more.style.display="none";
            }

            myScroll.refresh();

            if(myScroll.maxScrollY<0&&ChatFeed.hasData){
                myScroll.scrollTo(0,myScroll.maxScrollY,500);
            }
        }
    });
    Comment.init('.enter');
    DOM.addEvent($('#enterInput input'),'keypress',function(e){
        e.event.stopPropagation();
    });
}],
'sysNotice':[false,false,false,true],
'newGuest':['mainFooter',4,true,true,function(){
    var totalView=StorageMgr.infoCenter['visitor_total']||'总数不详';
    $('.kxjy-hd h1').innerHTML="最近访客("+totalView+")";
}],
'likeMe':['mainFooter',4,true,true],
'attract':['mainFooter',4,true,true],
'commentMe':['mainFooter',4,true,true],
'myView':['mainFooter',4,true,true],
'sendComment':['mainFooter',4,true,true],
'blackList':['mainFooter',4,true,true],
'likeMood':['mainFooter',4,true,true],
'likePerson':['mainFooter',4,true,true],
'more':['mainFooter',5,true,true,function(){
    new iScroll('wrapper');
}],
'rank':['mainFooter',5,true,true,function(){
    delete WIN['myScroll'];
    WIN['myScroll']=initIScroll($('.pullDown'),'wrapper');
    var myInfo=StorageMgr.myInfo,
        addre=[myInfo.reside_province?myInfo.reside_province:"",myInfo.reside_city?myInfo.reside_city:""].join(" ");

    $(".rankAddress span").innerHTML=(" "!=addre)?addre:"地区不详";
    if(!["无排名","0",0].has(StorageMgr.infoCenter.current_rank)){
        $('#curPos').innerHTML="排在第"+StorageMgr.infoCenter.current_rank+"位";
    }else{
        $('#curPos').innerHTML="无排名";
    }

    //取今日人气值
    var todayExp=StorageMgr.myTodayExp;
    if(!todayExp){
        var url=Tools.getSiteUrl()+"starPromotion.php?"+Tools.getSidUidParams()+"&ajax=1"
        function secCb(a){
            $("#expToday").innerHTML=a.today_pop;
            StorageMgr.myTodayExp=a.today_pop;
        }
        UserAction.sendAction(url,"","get",secCb,null);    
    }else{
        $("#expToday").innerHTML=todayExp;
    }
    

    /*取得地区信息后再载入列表*/
    Feed.addParams="reside_province="+myInfo.reside_province+"&reside_city="+myInfo.reside_city;
    Feed.init({
        page:'rank',
        cont:$('.rankBox .listBg'),
        more:$('.moreFeed'),
        cb:function(){myScroll.refresh();}
    });
}],
'password':[false,false,false,true],
'users':[false,false,false,false,function(){
    var url=Tools.getSiteUrl()+"verify.php?sid="+StorageMgr.sid,
        img=DOM.create('img');
    img.src=url;
    $('#verify').appendChild(img);

    delete WIN['setSex'];
    WIN['setSex']=function(node,val){
        if(DOM.hasClass(node,'usersActive'))
            return;
        DOM.dropClass(node,'btnBg');
        DOM.addClass(node,'usersActive');
        var sibling=node.previousElementSibling||node.nextElementSibling;
        DOM.dropClass(sibling,'usersActive');
        DOM.addClass(sibling,'btnBg');
        $('#regSex').value=val;
    }
}]
}

var PageEngine=function(options){
    var that=this;
    that.destory();

    that.options={//缓存DOM节点 待实现
        pageWrap:$('#pageWraper'),
        cacheDomPage:['mainPhoto','myPhoto','showMood','editInfo','more']
    }

    extend(that.options,options);
}

PageEngine.prototype={
    initUser:function(){//用户信息初始化
        var that=this;
        if(that.hasUser){
            return;
        }

        if(!/login|users/.test(that.curPage)){
            //初始化缓存数据
            StorageMgr.initStor();
            that.hasUser=true;
        }
    },
    replacePubTmpl:function(tmplStr){//替换公共tmpl
        var retStr=tmplStr;
        retStr=retStr.replace(/\$\{headerCancel\}/,headerCancel);
        retStr=retStr.replace(/\$\{headerBack\}/,headerBack);
        retStr=retStr.replace(/\$\{photoContTmpl\}/,photoContTmpl);
        retStr=retStr.replace(/\$\{moodContTmpl\}/,moodContTmpl);
        retStr=retStr.replace(/\$\{commentTmpl\}/,commentTmpl);
        retStr=retStr.replace(/\$\{commentListTmpl\}/,commentListTmpl);
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
            ftStr=ftStr.replace(fReg,'checked="checked"');
            ftStr=ftStr.replace(aReg,'');
        }

        return htmlStr+ftStr;
    },
    cancelPrePage:function(){//撤销前一个页面相关
        if('chat'==this.curPage){//撤销私信轮询
            ChatFeed.destory();
        }
        Page.destory();//撤销页面载入
        UserAction.stop();//撤销用户动作
        Tips.destory();//Tips
        Comment.destory();//撤销评论对象
    },
    initPage:function(page){
        this.cancelPrePage();

        if(page!=this.curPage){
            this.prePage=this.curPage;
            this.curPage=page;
        }

        this.initUser();
        var tmplStr=this.compileTmpl();
        
        this.options.pageWrap.innerHTML=tmplStr;
        this.fireEvent();
    },
    fireEvent:function(){
        var that=this,
            page=that.curPage,
            pcofig=pageConfig[page],
            reqInfo=pcofig[2],
            reqTips=pcofig[3],
            initFn=pageConfig[that.curPage][4];


        if(reqTips){//信息中心更新
            ViewMgr.getMsg=(reqInfo)?true:false;//tips更新
            ViewMgr.getData(true);
        }else{
            ViewMgr.stopGetData();
        }

        //执行页面初始化代码
        if($.isFunc(initFn)){
            initFn.call(null);
        }
        switch(that.curPage){
            case "mainPhoto":
            case "mainList":
                delete WIN['myScroll'];
                WIN['myScroll']=initIScroll($('.pullDown'),'wrapper');
                Feed.init({
                    page:that.curPage,
                    cont:$('#feedCont'),
                    more:$('.moreFeed'),
                    cb:function(){myScroll.refresh();}
                });
                break;
            case "myDetail":
            case "hisDetail":
                delete WIN['myScroll'];
                WIN['myScroll']=new iScroll('wrapper');
                Feed.init({
                    page:that.curPage,
                    cont:$('div.comment'),
                    more:$('.moreFeed'),
                    cb:function(){myScroll.refresh();}
                });
                Comment.init('.enter');
                break;
            case "chatList":
            case "commentMe":
            case "sendComment":
                delete WIN['myScroll'];
                WIN['myScroll']=new iScroll('wrapper');
                Feed.init({
                    noDataTxt:"暂无数据,请返回",
                    page:that.curPage,
                    cont:$('.chatList'),
                    more:$('.moreFeed'),
                    cb:function(){myScroll.refresh();}
                });
                InfoCenter.clear(that.curPage);
                break;
            case "sysNotice":
            case "newGuest":
            case "likeMe":
            case "attract":
            case "myView":
            case "blackList":
            case "likeMood":
            case "likePerson":
            case "likePerson":
                delete WIN['myScroll'];
                WIN['myScroll']=initIScroll($('.pullDown'),'wrapper');
                Feed.init({
                    noDataTxt:"暂无数据,请返回",
                    page:that.curPage,
                    cont:$('#feedCont'),
                    more:$('.moreFeed'),
                    cb:function(){myScroll.refresh();}
                });
                break;
        }
    },
    display:function(dirc){},
    destory:function(){
        this.domCaches={};
        this.curPage='login';
        this.prePage=null;
        this.hasUser=false;
    }
}
window.PageEngine=PageEngine;
})();