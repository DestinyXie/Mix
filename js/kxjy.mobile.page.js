/*单页面模式*/
;(function(){
//公共tmpl,减少代码量
var headerBack=['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<div _click="ViewMgr.back()" class="btn btn-l kxjy-btn ub ub-ac ">',
            '<div class="ulim">返回</div>',
            '</div>'].join(''),
    headerCancel=headerBack.replace('返回','取消'),
    headerSearch=['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<div _click="UserMenus(\'search\')" class="btn btn-l kxjy-btn ub ub-ac ">',
                '<span class="header-ico hd-search"></span>',
            '</div>'].join(''),
    photoContTmpl=['<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="bg">',
    '<div>',
    '<div class="pullDown">',
    '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>',
    '</div>',
    '<div class="ub-f1 tx-l t-bla ub-img6 mainPhoto">',
        '<div id="feedCont" class="mainListBox clearfix">',
        '</div>',
    '</div>',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
    moodContTmpl=['<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="bg">',
    '<div>',
    '<div class="pullDown">',
    '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>',
    '</div>',
    '<!--网格开始-->',
    '<div id="feedCont">',
    '</div>',
    '<!--网格结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
    commentTmpl=['<!-- 输入 -->',
    '<div class="enter ub ub-ac">',
    '<div class="enterMood" _click="Comment.switchMoodBox(this)"><img src="${siteurl}/template/mobile/css/images/f_1.png" alt="心情" /></div>',
    '<div class="enterInput btnBg ub-f1 uinput" id="enterInput"><input type="text" placeholder="评论内容..." _click="Comment.focusInput(this)"></div>',
    '<div class="enterButton btnBg" _click="Comment.sendComment(function(){Feed.refresh();});">发表评论</div>',
    '</div>',
    '<!-- 输入结束-->'].join(''),
    commentListTmpl=['<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--列表开始-->',
    '<div class="chatList">',
    '</div>',
    '<!--列表结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join('');

var contentTmpl={
'login':['<div class="logo"><img src="${siteurl}/template/mobile/css/images/login_logo.png" alt="开心交友" /></div>',
    '<div class="loginBox">',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">邮箱</label>',
            '<div class="loginInput ub-f1"><input id="email" class="btnBg" type="text" /></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">密码</label>',
            '<div class="loginInput ub-f1"><input id="password" class="btnBg" type="password" /></div>',
        '</div>',
        '<div _click="setTimeout(function(){ViewMgr.gotoPage(\'reset\');},500)" class="Forget tr">忘记密码?</div>',
        '<div class="loginButton clearfix">',
            '<span id="loginBtn" class="btnBg" _click="UserAction.checkLogin(\'#email\',\'#password\',this)">登陆</span>',
            '<span class="btnBg" _click="setTimeout(function(){ViewMgr.gotoPage(\'users\');},500)">注册</span>',
        '</div>',
    '</div>',
    '<div class="qqLogin">',
        '<span>用QQ帐号登录</span>',
    '</div>'].join(''),
'mainPhoto':['${headerSearch}',
            '<h1 class="ut ulev0 ut-s tx-c">附近的人</h1>',
            '<div _click="ViewMgr.gotoPage(\'mainList\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac">动态<span class="header-ico hd-list"></span></div>',
        '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'mainList':['${headerSearch}',
            '<h1 class="ut ulev0 ut-s tx-c">附近动态</h1>',
            '<div _click="ViewMgr.gotoPage(\'mainPhoto\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac">头像<span class="header-ico hd-photo"></span></div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${moodContTmpl}'].join(''),
'myPhoto':['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<div _click="ViewMgr.gotoPage(\'myList\')" class="btn btn-l kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac"><span class="header-ico hd-list"></span>心情</div>',
            '</div>',
            '<h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>',
            '<div _click="ViewMgr.gotoPage(\'editInfo\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim">编辑资料</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<div class="ub-f1 tx-l t-bla ub-img6">',
        '<div class="myTitle clearfix">',
            '<div class="myTitleAvatar fl"></div>',
            '<div class="myTitle-r">',
                '<strong class="DynamicName">&nbsp;</strong>',
                '<span class="DynamicTrank"></span>',
                '<ul class="myTitleMenu ub">',
                    '<li class="ub-f1 active" id="titleMenu-pic">',
                        '<span>0<br />照片</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-mood" _click="ViewMgr.gotoPage(\'myList\')">',
                        '<span>0<br />心情</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.gotoPage(\'rank\')">',
                        '<span><br />无排名</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu_more" _click="Page.showMore()">',
                        '<span>更多资料</span>',
                    '</li>',
                '</ul>',
            '</div>',
        '</div>',
        '<ul class="myInfo">',
            '<li id="myInfo-1"></li>',
            '<li id="myInfo-2"></li>',
            '<li id="myInfo-3"></li>',
        '</ul>',
        '<div id="feedCont" class="mainListBox clearfix">',
            '<div class="myPhotoBox myPhotoBox-last fl" _click="UserMenus(\'photo\')">',
                '<img src="${siteurl}/template/mobile/css/images/plus.gif" alt="添加" />',
            '</div>',
        '</div>',
    '</div>',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'myList':['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<div _click="ViewMgr.gotoPage(\'myPhoto\')" class="btn btn-l kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac"><span class="header-ico hd-photo"></span>照片</div>',
            '</div>',
            '<h1 class="ut ulev0 ut-s tx-c">\&nbsp;</h1>',
            '<div _click="ViewMgr.gotoPage(\'editInfo\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim">编辑资料</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div class="dockScroll" id="feedCont">',
        '<div class="myTitle clearfix">',
            '<div class="myTitleAvatar fl"></div>',
            '<div class="myTitle-r">',
                '<strong class="DynamicName">&nbsp;</strong>',
                '<span class="DynamicTrank"></span>',
                '<ul class="myTitleMenu ub">',
                    '<li class="ub-f1" id="titleMenu-pic" _click="ViewMgr.gotoPage(\'myPhoto\')">',
                        '<span>0<br />照片</span>',
                    '</li>',
                    '<li class="ub-f1 active" id="titleMenu-mood">',
                        '<span>0<br />心情</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.gotoPage(\'rank\')">',
                        '<span><br />无排名</span>',
                    '</li>',
                '</ul>',
            '</div>',
        '</div>',
    '</div>',
    '<!--网格结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'editInfo':['${headerCancel}',
            '<h1 class="ut ulev0 ut-s tx-c">编辑资料</h1>',
            '<!--按钮开始-->',
             '<div class="btn btn-r kxjy-btn ub ub-ac" _click="Page.submitEditInfo()">',
                  '<div class="ulim">保存</div>',
             '</div>',
             '<!--按钮结束-->',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<div class="uba  b-gra c-wh us listBg">',
        '<div class="uc-t ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入昵称\',function(txt){Page.setEditVal(\'nickname\',txt);},null,[\'确定\',\'取消\'],Mix.base.htmlDecode($(\'#nickname\').innerHTML))">',
          '<div class="t-org umar-t color777 fr" id="nickname"></div>',
          '<div class="umar-t">昵称</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.actionThree(\'\',\'选择性别\',[\'男\',\'女\',\'取消\'],function(){Page.setEditVal(\'sex\',\'男\')},function(txt){Page.setEditVal(\'sex\',\'女\');},null)">',
          '<div class="t-org umar-t color777 fr" id="sex"></div>',
          '<div class="umar-t">性别</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="var defVal=$(\'#area\').innerHTML.split(\' \');UserTools.initArea(null,defVal[0],defVal[1]);">',
          '<div class="umar-t">地区</div>',
          '<div class="t-org umar-t color777" id="area"></div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.datePicker($(\'#birthDay\'),function(val){Page.setEditVal(\'birthDay\',val)})">',
          '<div class="t-org umar-t color777 fr" id="birthDay"></div>',
          '<div class="umar-t">生日</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="UserTools.initSelect(\'marry\');">',
          '<div class="t-org umar-t color777 fr" id="marry"></div>',
          '<div class="umar-t">婚姻状况</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="UserTools.initSelect(\'target\');">',
          '<div class="t-org umar-t color777 fr" id="target"></div>',
          '<div class="umar-t">交友目的</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入个人描述\',function(txt){Page.setEditVal(\'note\',txt)},null,[\'确定\',\'取消\'],Mix.base.htmlDecode($(\'#note\').innerHTML))">',
          '<div class="umar-t">个人描述</div>',
          '<div class="t-org umar-t color777" id="note"></div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入QQ号\',function(txt){Page.setEditVal(\'qq\',txt)},null,[\'确定\',\'取消\'],Mix.base.htmlDecode($(\'#qq\').innerHTML))">',
          '<div class="t-org umar-t color777 fr" id="qq"></div>',
          '<div class="umar-t">QQ</div>',
        '</div>',
        '<div class="ub-f1 lis editinfoList infoList clearfix" _click="Device.prompt(\'请输入手机号\',function(txt){Page.setEditVal(\'mobile\',txt)},null,[\'确定\',\'取消\'],Mix.base.htmlDecode($(\'#mobile\').innerHTML))">',
          '<div class="t-org umar-t color777 fr" id="mobile"></div>',
          '<div class="umar-t">手机</div>',
        '</div>',
        '<div class="uc-b ub-f1 lis editinfoList infoList clearfix" _click="UserTools.initSelect(\'interest\',true);">',
          '<div class="umar-t">兴趣爱好</div>',
          '<div class="t-org umar-t color777" id="interest"></div>',
        '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'myDetail':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">动态详情</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">',
    '<div class="ub-f1">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div>',
    '<!-- 心情 -->',
        '<div class="DynamicList clearfix">',
            '<div class="DynamicInfo">',
                '<div class="DynamicAvatar"></div>',
                '<div class="DynamicAvatar-r">',
                    '<strong class="DynamicName">用户昵称</strong>',
                    '<span class="DynamicTrank"></span>',
                    '<ul class="DynamicNav clearfix">',
                        '<li><span class="DynamicIco ub-img1 time"></span>时间</li>',
                        '<li><span class="DynamicIco ub-img1 place"></span>地点</li>',
                    '</ul>',
                '</div>',
            '</div>',
            '<div class="ub">',
                '<div class="DynamicMood ub ub-ver">',
                    '<img src="${siteurl}/template/mobile/css/images/f_3.png" alt="" />',
                '</div>',
                '<div class="DynamicMoodTextBox ub-f1">',
                    '<div class="ub-f1 DynamicMoodText">',
                        '<span>&diams;</span>',
                        '<div class="DynamicText ub">',
                            '<p class="ub-f1"></p>',
                        '</div>',
                        '<div class="DynamicImg"></div>',
                        '<ul class="DynamicMenu clearfix">',
                            '<li class="ub ub-ac" _click="UserAction.deleteData(\'mood\',this)"><span class="DynamicMenuIco delete"></span>删除</li>',
                            '<li class="ub ub-ac"><span class="DynamicMenuIco comment"></span>0</li>',
                            '<li class="ub ub-ac"><span class="DynamicMenuIco love"></span>0</li>',
                        '</ul>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    '<!-- 心情结束 -->',
    '<!-- 留言 -->',
    '<div class="comment">',
    '</div>',
    '<!-- 留言 结束-->',
    '</div>',
    '<!--网格结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '${commentTmpl}',
    '</div>',
    '<!--content结束-->'].join(''),
'hisPhoto':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>',
            '<div _click="ViewMgr.gotoPage(\'hisList\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac">心情<span class="header-ico hd-list"></span></div>',
        '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div>',
        '<div class="myTitle clearfix">',
            '<div class="myTitleAvatar fl"></div>',
            '<div class="myTitle-r">',
                '<strong class="DynamicName">&nbsp;</strong>',
                '<span class="DynamicTrank"></span>',
                '<ul class="myTitleMenu ub">',
                    '<li class="ub-f1 active" id="titleMenu-pic">',
                        '<span>0<br />照片</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-mood" _click="ViewMgr.gotoPage(\'hisList\')">',
                        '<span>0<br />心情</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.gotoPage(\'rank\')">',
                        '<span><br />无排名</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu_more" _click="Page.showMore()">',
                        '<span>更多资料</span>',
                    '</li>',
                '</ul>',
            '</div>',
        '</div>',
        '<ul class="myInfo">',
            '<li id="myInfo-1"></li>',
            '<li id="myInfo-2"></li>',
            '<li id="myInfo-3"></li>',
        '</ul>',
        '<div id="feedCont" class="mainListBox clearfix">',
        '</div>',
    '</div>',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'hisList':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">&nbsp;</h1>',
            '<div _click="ViewMgr.gotoPage(\'hisPhoto\')" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim ub ub-ac">照片<span class="header-ico hd-photo"></span></div>',
        '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div class="dockScroll" id="feedCont">',
        '<div class="myTitle clearfix">',
            '<div class="myTitleAvatar fl"></div>',
            '<div class="myTitle-r">',
                '<strong class="DynamicName">&nbsp;</strong>',
                '<span class="DynamicTrank"></span>',
                '<ul class="myTitleMenu ub">',
                    '<li class="ub-f1" id="titleMenu-pic" _click="ViewMgr.gotoPage(\'hisPhoto\')">',
                        '<span>0<br />照片</span>',
                    '</li>',
                    '<li class="ub-f1 active" id="titleMenu-mood">',
                        '<span>0<br />心情</span>',
                    '</li>',
                    '<li class="ub-f1" id="titleMenu-rank" _click="ViewMgr.gotoPage(\'rank\')">',
                        '<span><br />无排名</span>',
                    '</li>',
                '</ul>',
            '</div>',
        '</div>',
    '</div>',
    '<!--网格结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'hisDetail':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">动态详情</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">',
    '<div class="ub-f1">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div>',
    '<!-- 心情 -->',
        '<div class="DynamicList clearfix">',
            '<div class="DynamicInfo">',
                '<div class="DynamicAvatar"></div>',
                '<div class="DynamicAvatar-r">',
                    '<strong class="DynamicName">&nbsp;</strong>',
                    '<span class="DynamicTrank"></span>',
                    '<ul class="DynamicNav clearfix">',
                        '<li><span class="DynamicIco ub-img1 time"></span>时间</li>',
                        '<li><span class="DynamicIco ub-img1 place"></span>地点</li>',
                    '</ul>',
                '</div>',
            '</div>',
            '<div class="ub">',
                '<div class="DynamicMood ub ub-ver">',
                    '<img src="${siteurl}/template/mobile/css/images/f_3.png" alt="" />',
                '</div>',
                '<div class="DynamicMoodTextBox ub-f1">',
                    '<div class="ub-f1 DynamicMoodText">',
                        '<span>&diams;</span>',
                        '<div class="DynamicText ub">',
                            '<p class="ub-f1"></p>',
                        '</div>',
                        '<div class="DynamicImg"></div>',
                        '<ul class="DynamicMenu clearfix">',
                            '<li class="ub ub-ac" _click="Comment.focusInput()"><span class="DynamicMenuIco comment"></span>0</li>',
                            '<li class="ub ub-ac" _click="UserAction.loveData(\'mood\',this)"><span class="DynamicMenuIco love"></span>0</li>',
                        '</ul>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    '<!-- 心情结束 -->',
    '<!-- 留言 -->',
    '<div class="comment">',
    '</div>',
    '<!-- 留言 结束-->',
    '</div>',
    '<!--网格结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '${commentTmpl}',
    '</div>',
    '<!--content结束-->'].join(''),
'showMood':['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<h1 class="ut ulev0 ut-s tx-c">秀心情</h1>',
            '<div _click="UserAction.showMood($(\'.showMoodPlus\'),$(\'.showMoodList\'),$(\'#mood\'))" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim">发布</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
        '<div class="showMoodPlus" _click="UserMenus(\'photo\');"></div>',
        '<div class="showMoodList ub" _click="UserTools.setIconId(this);" iconid="3">',
            '<div class="showMoodImg ub-f1"><img src="${siteurl}/template/mobile/css/images/f_1.png" alt="表情" /></div>',
            '<div class="showMoodImg ub-f1"><img src="${siteurl}/template/mobile/css/images/f_2.png" alt="表情" /></div>',
            '<div class="showMoodImg ub-f1">',
                '<img src="${siteurl}/template/mobile/css/images/f_3.png" alt="表情" />',
                '<span class="MoodSelect"></span>',
            '</div>',
            '<div class="showMoodImg ub-f1"><img src="${siteurl}/template/mobile/css/images/f_4.png" alt="表情" /></div>',
            '<div class="showMoodImg ub-f1"><img src="${siteurl}/template/mobile/css/images/f_5.png" alt="表情" /></div>',
        '</div>',
        '<div class="showMoodTextarea uinput ub-f1">',
            '<textarea id="mood" placeholder="请输入内容..." name="textarea-0" class="uc-a1"></textarea>',
        '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'infoCenter':['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<h1 class="ut ulev0 ut-s tx-c">信息中心</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
        '<!--列表开始-->',
    '<div class="uba b-gra us listBg">',
        '<div  _click="ViewMgr.gotoPage(\'chatList\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">私信</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'sysNotice\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">通知</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'newGuest\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">最近访客</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'likeMe\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">谁在&hearts;我</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'myList\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">&hearts;我的心情 </div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'attract\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">相互吸引</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'commentMe\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">收到的评论</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'rank\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">我的排名</div>',
            '<div class="tx-r t-blu ulev-1">无排名</div>',
        '</div>',
        '<div _click="InfoCenter.clear(\'flowersList\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">收到的鲜花</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'myView\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">我看过谁</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'sendComment\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">发出的评论</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'blackList\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">我屏蔽的人</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'likeMood\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">我&hearts;过的心情</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'likePerson\')" class="infoList uc-b ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">我&hearts;过的人</div>',
            '<div class="tx-r t-blu ulev-1">0</div>',
        '</div>',
      '</div>',
    '<!--列表结束-->',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'chatList':['${headerBack}',
            '<!--按钮结束-->',
            '<h1 class="ut ulev0 ut-s tx-c">私信</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--列表开始-->',
    '<div class="chatList">',
    '</div>',
    '<!--列表结束-->',
    '<div _click="ChatListFeed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'chat':['${headerBack}',
        '<h1 class="ut ulev0 ut-s tx-c"  id="nickName">&nbsp;</h1>',
        '<div _click="ViewMgr.gotoPage(\'hisPhoto\')" class="btn btn-r kxjy-btn ub ub-ac ">',
        '<div class="ulim">TA的主页</div>',
        '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver">',
    '<div class="ub-f1">',
    '<div id="wrapper" class="bg">',
    '<div>',
    '<div class="pullDown">',
    '<span class="pullDownIcon"></span>',
    '<span class="pullDownLabel">下拉查看更多...</span>',
    '</div>',
    '<div id="chatContent">',
    '</div>',
    '<div class="moreFeed">',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- 输入 -->',
    '<div class="enter ub ub-ac">',
        '<div class="enterMood" _click="Comment.switchMoodBox(this);"><img src="${siteurl}/template/mobile/css/images/f_1.png" alt="心情" /></div>',
        '<div class="enterInput btnBg ub-f1 uinput" id="enterInput"><input type="text" placeholder="私信内容..." _click="Comment.focusInput(this)"></div>',
        '<div class="enterButton btnBg" _click="Comment.sendComment(null,\'chat\');">发送私信</div>',
    '</div>',
    '<!-- 输入结束-->',
    '</div>',
    '<!--content结束-->'].join(''),
'sysNotice':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">通知</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6 ub ub-ver bg">',
        '<div class="chatBox ub-f1">',
            '<div id="wrapper" class="fixWrapperLeft bg">',
            '<div>',
            '<div class="pullDown">',
            '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>',
            '</div>',
            '<div id="feedCont">',
            '</div>',
            '<div class="moreFeed" _click="Feed.loadMore();">',
                '查看更多',
            '</div>',
            '</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'newGuest':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">最近访客(0)</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'likeMe':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">谁在&hearts;我</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'attract':['${headerBack}',
        '<h1 class="ut ulev0 ut-s tx-c">相互吸引</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'commentMe':['${headerBack}',
              '<h1 class="ut ulev0 ut-s tx-c">收到的评论</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${commentListTmpl}'].join(''),
'myView':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">我看过谁</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'sendComment':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">发出的评论</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${commentListTmpl}'].join(''),
'blackList':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">我屏蔽的人</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'likeMood':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">我&hearts;过的心情</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${moodContTmpl}'].join(''),
'likePerson':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">我&hearts;过的人</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '${photoContTmpl}'].join(''),
'more':['<!--header开始-->',
    '<div id="header" class="uh">',
        '<div class="kxjy-hd">',
            '<h1 class="ut ulev0 ut-s tx-c">更多</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--网格开始-->',
    '<div>',
    '<!--列表开始-->',
    '<div class="uba  b-gra listBg us">',
        '<div _click="ViewMgr.gotoPage(\'rank\')" class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">达人榜</div>',
            '<div class="res8 lis-sw ub-img"></div>',
        '</div>',
        '<div class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">提醒</div>',
            '<!--开关按钮开始-->',
            '<input id="cBtn" class="uhide" type="checkbox" checked="true">',
            '<div class="uba b-gra swi swi-bg uc-a1"  _click="$(\'#cBtn\').checked=!$(\'#cBtn\').checked;"></div>',
            '<!--开关按钮结束-->',
        '</div>',
        '<div class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">声音</div>',
            '<!--开关按钮开始-->',
            '<input id="dBtn" class="uhide" type="checkbox" checked="true">',
            '<div class="uba b-gra swi swi-bg uc-a1"  _click="$(\'#dBtn\').checked=!$(\'#dBtn\').checked;"></div>',
            '<!--开关按钮结束-->',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'password\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">修改密码</div>',
            '<div class="res8 lis-sw ub-img"></div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'mapTest\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">评分支持</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'feedBack\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">意见反馈</div>',
        '</div>',
        '<div _click="ViewMgr.gotoPage(\'about\')" class="infoList ubb ub b-gra t-bla ub-ac umh4 lis">',
            '<div class="ub-f1 ut-s">关于</div>',
        '</div>',
        '<div class="infoList uc-b ubb ub b-gra t-bla ub-ac umh4 lis" _click="UserAction.logOut();">',
            '<div class="ub-f1 ut-s">退出当前账号</div>',
        '</div>',
    '</div>',
    '<!--列表结束-->',
    '</div>',
    '<!--网格结束-->',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'rank':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">人气达人榜</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="bg">',
    '<div>',
    '<div class="pullDown">',
    '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新页面...</span>',
    '</div>',
    '<!--列表开始-->',
    '<div class="rankBox">',
        '<div class="rankAddress">',
            '所在地区：<span _click="UserTools.initArea(\'rank\');" id="area"></span>',
            '<p>我今日的人气值为：<label id="expToday"></label><label id="curPos"></label></p>',
        '</div>',
        '<div class="uba b-gra us listBg">',
        '</div>',
    '</div>',
    '<!--列表结束-->',
    '<div _click="Feed.loadMore();" class="moreFeed">',
        '查看更多',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'password':['${headerCancel}',
            '<h1 class="ut ulev0 ut-s tx-c">修改密码</h1>',
            '<!--按钮开始-->',
             '<div class="btn btn-r kxjy-btn ub ub-ac" _click="UserAction.changePassword(\'#oPwd\',\'#nPwd\',\'#cPwd\')">',
                '<div class="ulim">保存</div>',
              '</div>',
            '<!--按钮结束-->',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6 bg">',
    '<!--列表开始-->',
    '<div class="passwordBox">',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">当前密码:</label>',
            '<div class="loginInput ub-f1"><input id="oPwd" class="btnBg" type="password" /></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">　新密码:</label>',
            '<div class="loginInput ub-f1"><input id="nPwd" class="btnBg" type="password" /></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">确认密码:</label>',
            '<div class="loginInput ub-f1"><input id="cPwd" class="btnBg" type="password" /></div>',
        '</div>',
    '</div>',
    '<!--列表结束-->',
    '</div>',
    '<!--content结束-->'].join(''),
'feedBack':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c" >意见反馈</h1>',
            '<div _click="UserAction.sendFeedBack($(\'#feedBackIpt\'))" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim">提交</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--列表开始-->',
    '<div class="uba b-gra us listBg">',
        '<div class="feedbackBox">',
            '<div class="feedback uinput">',
                '<textarea id="feedBackIpt" placeholder="请填写您建议和意见，我们将不胜感激!"></textarea>',
            '</div>',
        '</div>',
      '</div>',
    '<!--列表结束-->',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'about':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c" >关于开心交友</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg ub ub-ver"">',
        '<div class="about_logo"><img src="${siteurl}/template/mobile/css/images/about_logo.png" alt="开心交友" /></div>',
        '<div class="ub-f1">',
            '<!--列表开始-->',
            '<div class="uba b-gra us listBg">',
                '<div class="infoList uc-t ubb ub b-gra t-bla ub-ac umh4 lis">',
                '<div id="verCont" class="ub-f1 ut-s">版本v1.0</div>',
                '</div>',
                '<div _click="UserAction.checkAppVersion()" class="infoList uc-b ubb ub b-gra t-bla ub-ac umh4 lis">',
                    '<div class="ub-f1 ut-s">检查新版本</div>',
                     '<div class="res8 lis-sw ub-img"></div>',
                '</div>',
             '</div>',
            '<!--列表结束-->',
        '</div>',
        '<div class="about_footer">',
            '<p></p>上海翼友网络科技有限公司  2012版权所有</p>',
            '<p> 官方网站:HTTP://WWW.KXJY.COM</p>',
        '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'reset':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c" >重置密码</h1>',
            '<div _click="UserAction.resetPwd($(\'#emailIpt\'))" class="btn btn-r kxjy-btn ub ub-ac ">',
            '<div class="ulim">提交</div>',
            '</div>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="content" class="ub-f1 tx-l t-bla ub-img6">',
    '<div id="wrapper" class="fixWrapperLeft bg">',
    '<div>',
    '<!--列表开始-->',
    '<div class="uba b-gra us listBg">',
        '<div class="resetBox">',
            '<div class="reset uinput">',
                '<input id="emailIpt" type="text" placeholder="填写您的注册邮箱..." />',
            '</div>',
        '</div>',
      '</div>',
      '<div class="resetText">重置密码的连接将发送到您的邮箱</div>',
    '<!--列表结束-->',
    '</div>',
    '</div>',
    '</div>',
    '<!--content结束-->'].join(''),
'users':['${headerBack}',
            '<h1 class="ut ulev0 ut-s tx-c">用户注册</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div class="ub-f1 tx-l t-bla ub-img6 bg">',
    '<!--列表开始-->',
    '<div class="passwordBox">',
    '<!--复选框开始-->',
    '<input type="hidden" id="regSex" value="0"/>',
    '<div class="t-bla">',
     '<div class="ub uc-a1 t-bla   c-m7 uba tx-c gender">',
      '<div class=" uinn5 ubr b-grp uc-l1 ub-f1 che usersActive" _click="setSex(this,0)">',
        '男',
      '</div>',
      '<div class=" uinn5 ubr b-grp uc-r1 ub-f1 che btnBg" _click="setSex(this,1)">',
        '女',
      '</div>',
     '</div>',
    '</div>',
    '<!--复选框结束-->',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">电子邮箱:</label>',
            '<div class="loginInput ub-f1"><input class="btnBg" type="text" id="regEmail" value="@qq.com"/></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">　　昵称:</label>',
            '<div class="loginInput ub-f1"><input class="btnBg" type="text" id="regNickName"/></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">　　密码:</label>',
            '<div class="loginInput ub-f1"><input class="btnBg" type="password" id="regPwd"/></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">确认密码:</label>',
            '<div class="loginInput ub-f1"><input class="btnBg" type="password" id="regPwdR"/></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">　验证码:</label>',
            '<div class="loginInput ub-f1"><input class="btnBg" type="text" id="regVeri"/></div>',
        '</div>',
        '<div class="ub-ac ub loginList">',
            '<label class="uinn">　　　　</label>',
            '<div id="verify" _click="UserAction.getVerify()"></div>',
        '</div>',
    '</div>',
    '<div class="users" _click="UserAction.userRegist()">注册</div>',
    '<!--列表结束-->',
    '</div>',
    '<!--content结束-->'].join(''),
'mapTest':['<!--header开始-->',
    '<div id="header" class="uh header2">',
        '<div class="kxjy-hd">',
            '<div _click="if(Mix.hasTouch){Device.exit();}else{UserMenus(\'map\');}" class="btn btn-l kxjy-btn ub ub-ac ">',
            '<div class="ulim">退出</div>',
            '</div>',
            '<h1 class="ut ulev0 ut-s tx-c">地图</h1>',
        '</div>',
    '</div>',
    '<!--header结束-->',
    '<!--content开始-->',
    '<div id="mapCont" class="ub-f1 tx-l t-bla ub-img6 bg">',
    '</div>',
    '<!--content结束-->'].join('')
};

var footerTmple={
'mainFooter':['<!--footer开始-->',
    '<div id="footer" class="uf c-m2 c-bla t-wh">',
        '<div class="ub c-bla c-m12 t-wh footer">',
        '<div _click=\'ViewMgr.gotoPage("mainPhoto");\' class="${1} ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-info"></div><div class="uinn ulev-2 tx-c">交友广场</div></div>',
        '<div _click=\'ViewMgr.gotoPage("myPhoto");\' class="${2} ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-home"></div><div class="uinn ulev-2 tx-c">我的主页</div></div>',
        '<div _click=\'ViewMgr.gotoPage("showMood");\' class="${3} ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-set"></div><div class="uinn ulev-2 tx-c">秀心情</div></div>',
        '<div _click=\'ViewMgr.gotoPage("infoCenter");\' class="${4} ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-shop"></div><div class="uinn ulev-2 tx-c">信息中心</div></div>',
        '<div _click=\'ViewMgr.gotoPage("more");\' class="${5} ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-talk"></div><div class="uinn ulev-2 tx-c">更多</div></div>',
        '</div>',
    '</div>',
    '<!--footer结束-->'].join(''),
'hisFooter':['<!--footer开始-->',
    '<div id="footer" class="uf c-m2 c-bla t-wh">',
        '<div class="ub c-bla c-m12 t-wh footer">',
        '<div id="footer-love" _click=\'UserAction.loveData("people",this);\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-love"></div><div class="uinn ulev-2 tx-c">喜欢</div></div>',
        '<div _click=\'ViewMgr.gotoPage("chat");\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-commnet"></div><div class="uinn ulev-2 tx-c">发私信</div></div>',
        '<div _click=\'UserAction.sendFlower("people",this);\' class="ub-f1 ub ub-ver disable"><div class="ub-f1 ub-img5 tp-flower"></div><div class="uinn ulev-2 tx-c">送鲜花</div></div>',
        '<div id="footer-shield" _click=\'UserAction.shieldPerson("people",this);\' class="ub-f1 ub ub-ver"><div class="ub-f1 ub-img5 tp-blacklist"></div><div class="uinn ulev-2 tx-c">屏蔽</div></div>',
        '</div>',
    '</div>',
    '<!--footer结束-->'].join('')
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
        if(13==e.keyCode){
            $('#password').blur();
            UserAction.checkLogin('#email','#password',$('#loginBtn'));
        }
    });
    var storEmail=Mix.base.storage.get('kxjy_my_email'),
        storPwd=Mix.base.storage.get('kxjy_my_pwd');
    if(storEmail&&storPwd){
        $('#email').value=storEmail;
        $('#password').value=storPwd;
    }
}],
'mainPhoto':['mainFooter',1,true,true],
'mainList':['mainFooter',1,true,true],
'myPhoto':['mainFooter',2,true,true],
'myList':['mainFooter',2,true,true],
'editInfo':['mainFooter',2,true,true],
'myDetail':[false,false,false,true],
'hisPhoto':['hisFooter',false,false,true],
'hisList':['hisFooter',false,false,true],
'hisDetail':[false,false,false,true],
'showMood':['mainFooter',3,true,true,function(){
    //计算TextArea的高度
    var cont=$('#content'),
        foot=$('#footer'),
        moodIpt=$('.showMoodTextarea'),
        moodPlus=$('.showMoodPlus'),
        moodIcon=$('.showMoodList');
    function setMoodH(){
        var h=moodIpt.style.height=cont.offsetHeight-0.6*BODYFS;
        if(moodPlus.style.display!="none"){
            h=cont.offsetHeight-10*BODYFS-$('.showMoodList').offsetHeight;
        }
        moodIpt.style.height=h+"px";
    }

    setTimeout(function(){
        UserMenus('photo');
        setMoodH();
    },100);

    //取得上次的心情图标
    var lastIconId=3;
    if(StorMgr.myInfo){
        lastIconId=StorMgr.myInfo['mood_icon_id']||3;
    }
    UserTools.setIconId(null,StorMgr.myInfo['mood_icon_id']||3);

    var wrapEl=$('#pageWraper'),//输入框设置
        oriHeight=wrapEl.offsetHeight;
    window.onresize=function(){
        if('showMood'!=pageEngine.curPage){
            return;
        }
        if(oriHeight==wrapEl.offsetHeight){
            foot.style.display="block";
            moodPlus.style.display="block";
            moodIcon.style.position="relative";
            moodIcon.style.top="0";
        }else{
            foot.style.display="none";
            moodPlus.style.display="none";
            moodIcon.style.position="absolute";
            moodIcon.style.top="-1000em";
        }
        setMoodH();
    }
}],
'infoCenter':['mainFooter',4,true,true],
'chatList':['mainFooter',4,true,true],
'chat':[false,false,false,true,function(){
    hisInfo.init();
    //判断从他们主页过来还是聊天列表过来
    var cl=Mix.base.storage.get("kxjy_my_chatList","session"),
        nickname="TA";
    if(pageEngine.prePage=="chatList"&&!!cl){
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
    $('#nickName').innerHTML=nickname||"&nbsp;";
    
    DOM.addEvent($('#enterInput input'),'keypress',function(e){
        e.stopPropagation();
    });
}],
'sysNotice':[false,false,false,true],
'newGuest':['mainFooter',4,true,true,function(){
    var totalView='总数不详';
    if(StorMgr.infoCenter){
        totalView=StorMgr.infoCenter['visitor_total']||'总数不详';
    }
    
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
'more':['mainFooter',5,true,true],
'rank':['mainFooter',5,true,true,function(){
    //取今日人气值
    var todayExp=StorMgr.myTodayExp;
    if(!todayExp){
        var url=StorMgr.siteUrl+"/starPromotion.php?"+UserTools.getSidUidParams()+"&ajax=1";
        function secCb(a){
            if($("#expToday").length!=0){
                $("#expToday").innerHTML=a.today_pop;
            }
            StorMgr.myTodayExp=a.today_pop;
        }
        UserAction.sendAction(url,"","get",secCb,null);    
    }else{
        if($("#expToday").length!=0){
            $("#expToday").innerHTML=todayExp;
        }
    }
}],
'password':[false,false,false,true],
'feedBack':[false,false,false,true],
'about':[false,false,false,true,function(){
    // function setVersion(ver){
    //     $('#verCont').innerHTML="版本V"+ver;
    // }
    // Device.getAppVersion(setVersion);
}],
'reset':[false,false,false,false],
'users':[false,false,false,false,function(){
    UserAction.getVerify();
    if(WIN['setSex']){
        return;
    }
    WIN['setSex']=function(node,val){
        if(DOM.hasClass(node,'usersActive'))
            return;
        DOM.removeClass(node,'btnBg');
        DOM.addClass(node,'usersActive');
        var sibling=node.previousElementSibling||node.nextElementSibling;
        DOM.removeClass(sibling,'usersActive');
        DOM.addClass(sibling,'btnBg');
        $('#regSex').value=val;
    }
}],
'mapTest':[false,false,false,false,function(){
    /*baidu地图*/
    Device.menuFunc=function(){
        UserMenus('map');
    }
    var bM;

    function clickHd(e){
        var point=new BMap.Point(e.point.lng, e.point.lat),
            local = new BMap.LocalSearch(point, {  
            renderOptions:{map: bM}  
        });
        addMarker(e.point.lat,e.point.lng,true);
        toast(UserTools.distence([e.point.lng,e.point.lat],[121.512519,31.21641]));
        // local.search('是');如何显示标记所在地址??
    }

    function BmapInit(){
        bM = new BMap.Map('mapCont');
        var point=new BMap.Point(121.491, 31.233);//上海
        bM.curPonit=point;
        bM.centerAndZoom(point, 11);
        // bM.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
        bM.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
        bM.addEventListener('click', clickHd);
    }

    if(!WIN['BMap']){
        DOM.loadCss('http://api.map.baidu.com/res/13/bmap.css');
        DOM.loadJs('http://api.map.baidu.com/getscript?v=1.3&key=&services=&t=20121108061854',function(){
            if(WIN['BMap']){
                BmapInit();
            }
        });
    }else{
        BmapInit();
    }

    function addMarker(lati,longi,notRe){
        var point=new BMap.Point(longi, lati),
            marker = new BMap.Marker(point);
        bM.curPonit=point;
        if(!notRe){
            bM.centerAndZoom(point, 20);
        }
        
        bM.clearOverlays();
        bM.addOverlay(marker);

        var gc = new BMap.Geocoder();    
    
        gc.getLocation(point, function(rs){
            var addComp = rs.addressComponents,
                opts = {
                    offset:{width:0,height:-25},
                    width : 250,     // 信息窗口宽度  
                    height: 100,     // 信息窗口高度
                    title : "<b>地址<b>"  // 信息窗口标题
                },
                addr=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            infoWindow = new BMap.InfoWindow(rs.address, opts);// 创建信息窗口对象  
            var mPoint=marker.point;
            bM.openInfoWindow(infoWindow, mPoint); 
        });
    }

    WIN['mapMenuSelect']=function(idx){
        function cancel(){
            if(bM.removedEv){
                bM.addEventListener('click', clickHd);
                bM.removedEv=false;
            }
        }
        function searchLocal(val,placeStr){
            bM.removeEventListener('click', clickHd);
            bM.removedEv=true;
            var local = new BMap.LocalSearch(placeStr||bM, {
              renderOptions:{map: bM}  
            });
            bM.clearOverlays();
            local.search(val);
        }
        function searchNation(val){
            bM.removeEventListener('click', clickHd);
            bM.removedEv=true;
            var local = new BMap.LocalSearch("全国",{
              renderOptions: {
                map: bM,
                panel : "r-result",
                autoViewport: true,
                selectFirstResult: false
              },
              pageCapacity:50,
              onInfoHtmlSet:function(){
                console.log('whats the hell of it?');
              },
              onResultsHtmlSet:function(){
                console.log('shit where is it?');
              },
              onSearchComplete:function(LocalResult){
                console.log(LocalResult);
                var opts=[];
                $.each(LocalResult._cityList,function(o,idx){
                    opts.unshift(o.city+"("+o.numResults+")");
                })
                Mix.ui.select.show({
                    options:opts.length==0?['查无结果']:opts,
                    onConfirm:function(items){
                        var city=items[0].replace(/\(.*\)/,'');
                        searchLocal(val,city);
                    }
                });
              }
            });
            // bM.clearOverlays();
            local.search(val);
        }

        switch(idx*1){
            case 0://当前定位
                if(bM.removedEv){
                    bM.addEventListener('click', clickHd);
                    bM.removedEv=false;
                }

                function offset(longi,lati){
                    var url='http://api.map.baidu.com/ag/coord/convert?callback=?&from=0&to=4&x='+longi+'&y='+lati,
                        secCb=function(data){
                            if(!data.error){
                                var la=UserTools.base64(data.y,true),
                                    lo=UserTools.base64(data.x,true);
                                addMarker(la,lo);
                            }else{
                                alert(data.error);
                            }
                        };
                    // appcan现在取的baidu的经纬度所以不必纠偏了
                    // UserAction.sendAction(url,null,'POST',secCb);
                    alert(lati+"~~"+longi);
                    addMarker(lati,longi);
                }
                // 创建标注
                if(Device.isMobi()){
                    Device.getLocation(function(lati,longi){
                        offset(longi,lati);
                    });
                }else{
                    offset(121.512682,31.216299);
                }
                break;
            case 1://附近搜索
                Device.prompt('附近搜索',searchLocal,cancel,null,'上海');
                break;
            case 2://全国搜索
                Device.prompt('全国搜索',searchNation,cancel,null,'上海');
                break;
            case 3://范围搜索
                function setLevel(longInt){
                    longInt=longInt*1;
                    if(longInt>200000){
                        return 7;
                    }else if(longInt>100000){
                        return 8;
                    }else if(longInt>70000){
                        return 9;
                    }else if(longInt>30000){
                        return 10;
                    }else if(longInt>17000){
                        return 11;
                    }else if(longInt>9000){
                        return 12;
                    }else if(longInt>4000){
                        return 13;
                    }else if(longInt>2000){
                        return 14;
                    }else if(longInt>1000){
                        return 15;
                    }else if(longInt>500){
                        return 16;
                    }else{
                        return 17;
                    }
                }
                function ok3(val){
                    bM.removeEventListener('click', clickHd);
                    var value=val.split(','),
                        longVal=value[1]>500000?500000:value[1],
                        lev=setLevel(value[1]);
                        circle = new BMap.Circle(bM.curPonit,longVal||1000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});

                    bM.centerAndZoom(bM.curPonit,lev);
                    bM.clearOverlays();
                    bM.addOverlay(circle);
                    var local =  new BMap.LocalSearch(bM, {renderOptions: {map: bM, autoViewport: false}});
                    var bounds = getSquareBounds(circle.getCenter(),circle.getRadius());
                    local.searchInBounds(value[0],bounds); 
                   
                    /**
                     * 得到圆的内接正方形bounds
                     * @param {Point} centerPoi 圆形范围的圆心
                     * @param {Number} r 圆形范围的半径
                     * @return 无返回值   
                     */ 
                    function getSquareBounds(centerPoi,r){
                        var a = Math.sqrt(2) * r; //正方形边长
                      
                        mPoi = getMecator(centerPoi);
                        var x0 = mPoi.x, y0 = mPoi.y;
                     
                        var x1 = x0 + a / 2 , y1 = y0 + a / 2;//东北点
                        var x2 = x0 - a / 2 , y2 = y0 - a / 2;//西南点
                        
                        var ne = getPoi(new BMap.Pixel(x1, y1)), sw = getPoi(new BMap.Pixel(x2, y2));
                        return new BMap.Bounds(sw, ne);        
                        
                    }
                    //根据球面坐标获得平面坐标。
                    function getMecator(poi){
                        return bM.getMapType().getProjection().lngLatToPoint(poi);
                    }
                    //根据平面坐标获得球面坐标。
                    function getPoi(mecator){
                        return bM.getMapType().getProjection().pointToLngLat(mecator);
                    }
                }
                Device.prompt('范围搜索 格式:"搜索内容,半径(米,默认1000米,半径过大可能无法搜索到和显示合理的信息)"',ok3,cancel,null,'上海,1000');
                break;
        }
    }
}]
}

var PageEngine=function(options){
    var that=this;
    
    that.destroy();
    that.options={
        pageWrap:$('#pageWraper'),
        cacheDomPage:['mainPhoto','myPhoto','showMood','editInfo','more'],//缓存DOM节点 待实现
        animate:true//是否动画切换
    }

    extend(that.options,options);
}

PageEngine.prototype={
    initUser:function(){//用户信息初始化
        var that=this;
        if(!/login|users/.test(that.curPage)){
            if(that.hasUser){
                return;
            }
            StorMgr.initStor();//初始化用户缓存数据
            that.hasUser=true;
        }else{
            that.hasUser=false;
        }
    },
    replacePubTmpl:function(tmplStr){//替换公共tmpl
        var retStr=tmplStr;
        retStr=retStr.replace(/\$\{headerCancel\}/,headerCancel);
        retStr=retStr.replace(/\$\{headerBack\}/,headerBack);
        retStr=retStr.replace(/\$\{headerSearch\}/,headerSearch);
        retStr=retStr.replace(/\$\{photoContTmpl\}/,photoContTmpl);
        retStr=retStr.replace(/\$\{moodContTmpl\}/,moodContTmpl);
        retStr=retStr.replace(/\$\{commentTmpl\}/,commentTmpl);
        retStr=retStr.replace(/\$\{commentListTmpl\}/,commentListTmpl);
        retStr=retStr.replace(/\$\{siteurl\}/g,StorMgr.siteUrl);
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
        switch(this.curPage){
            case 'chat'://撤销私信轮询
                ChatFeed.destroy();
                break;
            case 'login':
            case 'users':
                WIN.scrollTo(0,0);
                break;
        }
        Page.destroy();//撤销页面载入
        UserAction.stop();//撤销用户动作
        Mix.ui.tips.destroy();//Tips
        Comment.destroy();//撤销评论对象
        Device.destroy();//撤销如上传等手机正在执行的动作
    },
    initPage:function(page,diret){
        var that=this;

        that.cancelPrePage();

        that.prePage=that.curPage;
        that.curPage=page;

        if(page!=that.prePage&&'infoCenter'==that.prePage){
            InfoCenter.clear(page);//清除信息中心的提示数量
        }

        that.initUser();
        var tmplStr=that.compileTmpl(),
            wrap=that.options.pageWrap;

        if(that.options.animate&&that.prePage!=that.curPage){//是否使用动画
            that.animate(diret,tmplStr);
        }else{
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
            reqInfo=pcofig[2],
            reqTips=pcofig[3],
            initFn=pageConfig[that.curPage][4];

        if(reqTips){//tips更新
            ViewMgr.getMsg=(reqInfo)?true:false;//信息中心更新
            ViewMgr.getData(true);
        }else{
            ViewMgr.getMsg=false;
            ViewMgr.stopGetData();
            ViewMgr.tipsArray=null;
        }

        /*执行页面配置项中页面初始化代码*/
        if($.isFunc(initFn)){
            initFn.call(null);
        }

        /*Page类初始化*/
        if(['myPhoto','myList','editInfo','myDetail','hisPhoto','hisList','hisDetail'].has(page)){
            Page.init(page);
        }

        that.initIScrollAndFeed();
    },
    /*执行iScroll和feed相关代码*/
    initIScrollAndFeed:function(){
        var that=this,
            feedOption={
                page:that.curPage,
                cont:$('#feedCont'),
                more:$('.moreFeed'),
                cb:function(){myScroll.refresh();}
            }
        if(WIN['myScroll']){
            myScroll.destroy();
            myScroll=null;
        }
        // delete WIN['myScroll'];
        switch(that.curPage){
            case "mainPhoto":
            case "mainList":
                WIN['myScroll']=initIScroll($('.pullDown'),'#wrapper');
                var myInfo=StorMgr.myInfo;
                if(Feed.mainParams){//mainPhoto,mainList页面取得记录参数
                    feedOption['addParams']=Feed.mainParams;
                }else if(StorMgr.gpsInfo){
                    feedOption['addParams']="reside_province="+StorMgr.gpsInfo['prov']+"&reside_city="+StorMgr.gpsInfo['city'];
                }else if(myInfo){
                    feedOption['addParams']="reside_province="+myInfo.reside_province+"&reside_city="+myInfo.reside_city;    
                }
                Feed.init(feedOption);
                break;
            case "rank":
                WIN['myScroll']=initIScroll($('.pullDown'),'#wrapper');
                var userObj,
                    infoCent=StorMgr.infoCenter,
                    addrSpan=$(".rankAddress span");
                
                if(/his/.test(that.prePage)){//他人到他人城市排行
                    userObj=hisInfo.get(hisInfo.curId);
                }else{
                    userObj=StorMgr.myInfo||{};
                }

                var prov=userObj.reside_province,
                    city=userObj.reside_city,
                    addre=[prov?prov:"",city?city:""].join(" ");

                if(" "==addre&&StorMgr.gpsInfo){//无数据时取GPS地址
                    prov=StorMgr.gpsInfo['prov'];
                    city=StorMgr.gpsInfo['city'];
                    addre=prov+" "+city;
                }
                
                if(" "!=addre){
                    addrSpan.innerHTML=addre;
                    feedOption['addParams']="reside_province="+prov+"&reside_city="+city;
                }else{
                    addrSpan.innerHTML="地区不详";
                }

                function setMyNum(){
                    WIN["myScroll"].refresh();
                    var feedProv=prov,
                        feedCity=city;
                    if(/reside_province=/.test(Feed.addParams)&&/reside_city=/.test(Feed.addParams)){
                        feedProv=/reside_province=([^&]*)/.exec(Feed.addParams)[1];
                        feedCity=/reside_city=([^&]*)/.exec(Feed.addParams)[1];
                    }
                    if(StorMgr.myInfo&&feedProv==StorMgr.myInfo.reside_province&&feedCity==StorMgr.myInfo.reside_city){
                        if(infoCent&&!["无排名","0",0].has(infoCent.current_rank)){
                            $('#curPos').innerHTML="，目前排在第"+infoCent.current_rank+"位";
                        }else{
                            $('#curPos').innerHTML="，目前无排名";
                        }
                    }else{
                        $('#curPos').innerHTML="";
                    }
                }

                feedOption['cb']=setMyNum;
                feedOption['cont']=$('.rankBox .listBg');
                Feed.init(feedOption);
                break;
            case "myPhoto":
            case "hisPhoto":
                WIN['myScroll']=new Mix.scroll('wrapper',{useTransform:false});
                if("myPhoto"==that.curPage){
                    feedOption['lastPos']=1;
                }
                Feed.init(feedOption);
                break;
            case "myList":
            case "hisList":
                WIN['myScroll']=new initDockScroll('.DynamicMoodTtile','wrapper','#feedCont');
                feedOption['lastPos']=-1;
                Feed.init(feedOption);
                break;
            case "editInfo":
                WIN['myScroll']=new Mix.scroll('wrapper',{
                    useTransform: false,//useTransform是个神奇的属性
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
                break;
            case "myDetail":
            case "hisDetail":
                WIN['myScroll']=new Mix.scroll('wrapper');
                feedOption['cont']=$('div.comment');
                Feed.init(feedOption);
                Comment.init('.enter');
                break;
            case "chatList":
                WIN['myScroll']=new Mix.scroll('wrapper');
                feedOption['cont']=$('.chatList');
                feedOption['noDataTxt']="暂无数据,请返回";
                ChatListFeed.init(feedOption);
                break;
            case "commentMe":
            case "sendComment":
                WIN['myScroll']=new Mix.scroll('wrapper');
                feedOption['cont']=$('.chatList');
                feedOption['noDataTxt']="暂无数据,请返回";
                Feed.init(feedOption);
                break;
            case "chat":
                WIN['myScroll']=initIScroll($('.pullDown'),'#wrapper',function(){
                    ChatFeed.refresh();
                });
                feedOption['noDataTxt']="暂无数据,请返回";
                feedOption['noMoreBtn']=true;
                feedOption['cont']=$('#chatContent');
                feedOption['cb']=function(){
                    if(ChatFeed.hasData){
                        ChatFeed.more.style.display="none";
                    }
                    myScroll.refresh();
                    
                    if(myScroll.maxScrollY<0&&ChatFeed.hasData){
                        myScroll.scrollTo(0,myScroll.maxScrollY,500);
                    }
                };
                ChatFeed.init(feedOption);
                Comment.init('.enter',{type:'chat'});
                break;
            case "sysNotice":
            case "newGuest":
            case "likeMe":
            case "attract":
            case "myView":
            case "blackList":
            case "likeMood":
            case "likePerson":
                WIN['myScroll']=initIScroll($('.pullDown'),'#wrapper');
                feedOption['noDataTxt']="暂无数据,请返回";
                Feed.init(feedOption);
                break;
            case "infoCenter":
            case "more":
                WIN['myScroll']=new Mix.scroll('wrapper');
                break;
        }
    },
    display:function(dirc){},
    destroy:function(){
        this.curPage='login';
        this.prePage=null;
        this.hasUser=false;
    }
}
window['PageEngine']=PageEngine;
})();