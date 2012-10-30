/*手机接口调用*/
;var Device={
    /*手机初始化*/
    hasBridge:function(){
        if(WIN["uexWindow"]){
            return true;
        }
        return false;
    },
    isMobi:function(){
        return Device.hasBridge();
    },
    isLoaded:false,
    loadEventBinded:false,
    loadQueue:[],
    opCode:1,
    onLoad:function(loadFn){
        function load(){
            if(Device.isLoaded){
                return;
            }
            for(var i=0,dl=Device.loadQueue,len=dl.length;i<len;i++){
                dl[i].call(null);
            }
            Device.isLoaded=true;
        }

        function PCload(){
            setTimeout(function(){//appcan对象初始化延迟
                if(!WIN["uexWindow"]){
                    //PC test
                    load();
                }
            },1000);
        }

        Device.loadQueue.push(loadFn);

        if(Device.loadEventBinded)
            return;

        //appCan对象初始化比window.onload慢
        window.uexOnload=load;
        DOM.addEvent(DOC,'DOMContentLoaded',PCload);

        Device.loadEventBinded=true;
    },
    destroy:function(){//关掉一些东西，比如上传
        if(!Device.isMobi()){return;}
        //减1因为拍照时会取文件尺寸 Device.opCode 会比上传的加1
        uexXmlHttpMgr.close(Device.opCode-1);
        uexWindow.closeToast();
    },
    exit:function(){//退出应用
        if(!Device.isMobi()){return;}
        uexWidgetOne.exit();
    },
    alert:function(title,msg,btn){
        if(!Device.isMobi()){return;}
        uexWindow.alert(title,msg,btn);
    },
    toast:function(s,t){
        if(!Device.isMobi()){return;}
        uexWindow.toast(0,5,s,t*1000||2000);
    },
    /*uexWindow接口*/
    confirm:function(msg,ok,cancel,labs,title){
        if(Device.isMobi()){
            uexWindow.cbConfirm=function(opId,dataType,data){
                switch(data*1){
                    case 0:
                        if(typeof ok=="function")
                            ok();
                        break;
                    case 1:
                        if(typeof cancel=="function")
                            cancel();
                        break;
                }
            }

            uexWindow.confirm(title||"确认",msg,labs||['确认','取消']);
        }else{
            window.confirm(msg)?ok&&ok():cancel&&cancel();
        }
    },
    actionThree:function(title,msg,labArr,first,second,third){
        if(Device.isMobi()){
            uexWindow.cbConfirm=function(opId,dataType,data){
                switch(data*1){
                    case 0:
                        if(typeof first=="function")
                            first();
                        break;
                    case 1:
                        if(typeof second=="function")
                            second();
                        break;
                    case 2:
                        if(typeof third=="function")
                            third();
                        break;
                }
            }

            uexWindow.confirm(title,msg,labArr);
        }
    },
    prompt:function(msg,ok,cancel,labs,def){
        if(Device.isMobi()){
            uexWindow.cbPrompt=function(opId, dataType, data){
                var obj = eval('('+data+')');
                var num=obj.num,
                    val=obj.value;
                switch(num*1){
                    case 0:
                        ok&&ok(val);
                        break;
                    case 1:
                        cancel&&cancel(val);
                        break;
                }
            }
            uexWindow.prompt("",msg,def||"",labs||['确定','取消']);
        }else{
            var val=window.prompt(msg);
            if(typeof val=="string"){
                ok&&ok(val);
            }else{
                cancel&&cancel();
            }
        }
    },
    actionSheet:function(ao){
        uexWindow.cbActionSheet=ao[3];
        uexWindow.actionSheet(ao[0],ao[1],ao[2]);
    },
    backFunc:null,
    menuFunc:null,
    setKeyPress:function(){
        uexWindow.onKeyPressed=function(code){
            if(0===code*1){
                if($.isFunc(Device.backFunc)){
                    Device.backFunc.call(null);
                }
            }else if(1===code*1){
                if($.isFunc(Device.menuFunc)){
                    Device.menuFunc.call(null);
                }
            }
        }
    },
    setBackBtn:function(fn){//设置返回按钮android symbian
        if(!Device.isMobi()){return;}
        Device.setKeyPress();
        uexWindow.setReportKey('0', '1');
    },
    disetBackBtn:function(){//取消设置返回按钮android symbian
        if(!Device.isMobi()){return;}
        uexWindow.setReportKey('0', '0');
    },
    setMenuBtn:function(fn){//设置menu键
        if(!Device.isMobi()){return;}
        Device.setKeyPress();
        uexWindow.setReportKey('1', '1');
    },
    disetMenuBtn:function(){//取消设置menu键
        if(!Device.isMobi()){return;}
        uexWindow.setReportKey('1', '0');
    },
    datePicker:function(node,okCb,errCb){//日期选择
        if(!Device.isMobi()){return;}
        uexControl.cbOpenDatePicker=function(opCode,dataType,data){
　　　　　　　　if(dataType==1){
　　　　　　　　　　var obj = eval('('+data+')'),
                        dataStr=obj.year+"-"+obj.month+"-"+obj.day,
                        today=new Date().getTime();
                    if(new Date(obj.year,obj.month-1,obj.day).getTime()>today){
                        alert('日期超过今天无效');
                        return;
                    }
                    okCb?okCb(dataStr):Device.toast(dataStr);
　　　　　　　　}else{
                    errCb?errCb():Device.toast('日期没有选择成功');
                }
　　　　}
        var defData=node.getAttribute('default').split("-");
        if(0==defData[0]||0==defData[1]||0==defData[2]){
            defData=['1992','12','12'];
        }

        uexControl.openDatePicker (defData[0],defData[1],defData[2]);
    },
    /*GPS功能*/
    getLocation:function(cb){//获取经纬度 cb(latitude,longitude)
        if(!Device.isMobi()){return;}
        function locationCallback(lat,log){
            uexLocation.closeLocation();
            cb(lat,log);
        }
        uexLocation.onChange = locationCallback;
        // check
        // uexWidgetOne.cbError = function(opCode,errorCode,errorInfo){
        //     toast("未能取得经纬度 errorCode:" + errorCode + "\nerrorInfo:" + errorInfo);
        // }
        uexLocation.openLocation();
    },
    /*根据经纬度获取地址 cb(addr);*/
    getAddress:function(lat,log,cb,errCb){
        if(!Device.isMobi()){return;}
        function LocationSuccess(opCode,dataType,data){
            if(dataType==0){
                cb(data);
            }else{
                if(errCb){
                    errCb();
                }else{
                    Device.toast('未能获得地址信息');
                }
            }
        }
        uexLocation.cbGetAddress = LocationSuccess;
        uexLocation.getAddress(lat,log);
    },
    /*取得手机操作平台ios or android*/
    getPlatForm:function(cb){
        function platformSuccess(opId,dataType,data){
          var platstr="";//终端标识
          if(dataType==2 && data == 0){platstr="ios";}
          if(dataType==2 && data == 1){platstr="android";}
          if(dataType==2 && data == 4){platstr="wp";}
          if(cb){cb(platstr);}
          Device.platStr=platstr;
        }
        if(!Device.platstr){
            uexWidgetOne.getPlatform();
            uexWidgetOne.cbGetPlatform = platformSuccess;
        }else{
            if(cb){
                cb(Device.platStr);
            }
        }
    },
    getAppVersion:function(cb){
        if(!Device.isMobi()){Device.toast('你不是手机，请自便。');return;}
        function versionSuccess(opId,dataType,data){
            if(dataType==0){
                if(cb){cb(data);}
                Device.appVersion=data;
            }else{
                Device.toast('版本获取失败!');
            }
        }

        if(!Device.appVersion){
            uexWidgetOne.cbGetVersion = versionSuccess;
            uexWidgetOne.getVersion();
        }else{
            if(cb){cb(Device.appVersion);}
        }
    },
    /*启动一个第三方应用*/
    loadApp:function(addr){
        uexWidget.loadApp(addr);
    },
    /*安装应用*/
    installApp:function(addr){
        uexWidget.installApp(addr);
    },
    /*下载*/
    download:function(url,downUrl,cb){
        Device.opCode++;
        var inOpCode=Device.opCode;
        uexDownloaderMgr.onStatus = function(opCode,fileSize,percent,status){
            switch(status){
            case 0: uexWindow.toast('1','5','当前下载的进度：'+percent+ '%','');
                    break;
            case 1: uexWindow.alert("温馨提示","下载完成，请进行安装！","我知道了");
                    uexDownloaderMgr.closeDownloader(opCode);
                    uexWindow.closeToast();
                    cb();
                    break;
            case 2: uexWindow.alert("温馨提示","下载失败，请联系管理员！","我知道了");
                    uexDownloaderMgr.closeDownloader(opCode);
                    break;
            }
        }
        uexDownloaderMgr.cbCreateDownloader = function(opCode,dataType,data){
            if(data == 0){
                uexDownloaderMgr.download(inOpCode,url,downUrl,'0');
            }else{
                uexWindow.alert("温馨提示","创建下载资源失败，请确认你手机中装有SD存储卡。","我知道了");
            }
        }
        // check
        // uexWidgetOne.cbError = function(opCode,errorCode,errorInfo){
        //     toast(errorInfo,3);
        // }
        uexDownloaderMgr.createDownloader(inOpCode);
    },
    xmlHttp:function(customObj){//跨域异步请求数据的方法
        /* param:customObj{object}:
        src 请求地址
        method 请求方法
        plainPara 简单参数
        sourcePara 资源参数
        progressCb 进度回调
        secCb 请求成功回调
        failCb 请求失败回调
        */
        if(!customObj['src']){
            Device.toast('缺少xmlHttp请求地址。');
            return;
        }

        var option={
            opCode:Device.opCode++,
            method:'POST',
            timeout:0//请求超时
        }
        extend(option,customObj);

        function sendParam(paramStr,isSource){
            var params=paramStr.split('&'),tmpArr;
            for (var i = params.length - 1; i >= 0; i--) {
                tmpArr=params[i].split('=');
                if(2===tmpArr.length){
                    uexXmlHttpMgr.setPostData(option.opCode, !isSource?"0":"1", tmpArr[0], tmpArr[1]);
                }
            };
        }
        
        uexXmlHttpMgr.onPostProgress=option.progressCb;
        uexXmlHttpMgr.onData = option.secCb;
        uexXmlHttpMgr.open(option.opCode, option.method.toUpperCase(), option.src, option.timeout);

        sendParam(option['plainPara'],false);
        sendParam(option['sourcePara'],true);

        uexXmlHttpMgr.send(option.opCode);
    },
    xmlHttpClose:function(opCode){
        uexXmlHttpMgr.close(opCode);
    },
    /*取得文件大小*/
    getFileSize:function(path,cb){
        if(!Device.isMobi()){return;}
        Device.opCode++;
        var inOpCode=Device.opCode;
        function callback(opId,dataType,data){
            if(dataType==2){
                //alert(data/1024);//k
                if(cb){cb(data/1024);}
            }
        }
        uexFileMgr.cbGetFileSize = callback;
        uexFileMgr.openFile(inOpCode,path,1);
        uexFileMgr.getFileSize(inOpCode);
        uexFileMgr.closeFile(inOpCode);
    },
    camera:function(cb){//拍照
        uexCamera.cbOpen=function(opId,dataType,data){
            cb(opId,dataType,data);
        };
        uexCamera.open();
    },
    imageBrowser:function(cb){//浏览照片
        uexImageBrowser.cbPick=function (opCode,dataType,data){
            cb(opId,dataType,data);
        };
        uexImageBrowser.pick();
    }
}