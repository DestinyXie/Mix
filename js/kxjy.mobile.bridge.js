/*手机接口调用*/
;var Device={
    /*手机初始化*/
    getBridgeName:function(){
        if(WIN["uexWindow"]){
            return 'appCan';
        }
        return 'PC-window';
    },
    isAppcan:function(){
        return (Device.getBridgeName()=="appCan");
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
        Device.loadQueue.push(loadFn);

        if(Device.loadEventBinded)
            return;

        //appCan对象初始化比window.onload慢
        window.uexOnload=load;
        if(!WIN["uexWindow"]){
            //PC test
            DOM.addEvent(DOC,'DOMContentLoaded',load);
        }

        Device.loadEventBinded=true;
    },
    destroy:function(){//关掉一些东西，比如上传
        if(!Device.isAppcan()){return;}
        //减1因为拍照时会取文件尺寸 Device.opCode 会比上传的加1
        uexXmlHttpMgr.close(Device.opCode-1);
        uexWindow.closeToast();
    },
    alert:function(title,msg,btn){
        uexWindow.alert(title,msg,btn);
    },
    /*uexWindow接口*/
    confirm:function(msg,ok,cancel,labs,title){
        if(Device.isAppcan()){
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
        if(Device.isAppcan()){
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
        if(Device.isAppcan()){
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
    backFunc:null,
    setBackBtn:function(fn){//设置返回按钮android symbian
        if(!Device.isAppcan()){return;}
        uexWindow.onKeyPressed=function(){
            if($.isFunc(Device.backFunc)){
                Device.backFunc.call(null);
            }
            if($.isFunc(fn)){
                fn.call(null);
            }
        }
        uexWindow.setReportKey('0', '1');
    },
    disetBackBtn:function(){//取消设置返回按钮android symbian
        if(!Device.isAppcan()){return;}
        uexWindow.setReportKey('0', '0');
    },
    datePicker:function(node,okCb,errCb){
        if(!Device.isAppcan()){return;}
        uexControl.cbOpenDatePicker=function(opCode,dataType,data){
　　　　　　　　if(dataType==1){
　　　　　　　　　　var obj = eval('('+data+')'),
                        dataStr=obj.year+"-"+obj.month+"-"+obj.day,
                        today=new Date().getTime();
                    if(new Date(obj.year,obj.month-1,obj.day).getTime()>today){
                        alert('日期超过今天无效');
                        return;
                    }
                    okCb?okCb(dataStr):toast(dataStr);
　　　　　　　　}else{
                    errCb?errCb:toast('日期没有选择成功');
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
        if(!Device.isAppcan()){return;}
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
        if(!Device.isAppcan()){return;}
        function LocationSuccess(opCode,dataType,data){
            if(dataType==0){
                cb(data);
            }else{
                if(errCb){
                    errCb();
                }else{
                    toast('未能获得地址信息');
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
        if(!Device.isAppcan()){toast('你不是手机，请自便。');return;}
        function versionSuccess(opId,dataType,data){
            if(dataType==0){
                if(cb){cb(data);}
                Device.appVersion=data;
            }else{
                toast('版本获取失败!');
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
    /*取得文件大小*/
    getFileSize:function(path,cb){
        if(!Device.isAppcan()){return;}
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
    }
}