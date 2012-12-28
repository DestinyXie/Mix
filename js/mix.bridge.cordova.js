/*桥接Cordova接口*/
;var Device={
	/*手机初始化*/
    isMobi:function(){
        if(WIN["device"]){
            return true;
        }
        return false;
    },
    hasLoaded:false,
    /*操作ID*/
    opCode:1,
    /*设备初始化完毕，只调用一次*/
    onLoad:function(loadFn){
        function load(){
            if(Device.hasLoaded){
                return;
            }
            loadFn();
            Device.hasLoaded=true;
        }

        function PCload(){
            /*cordova对象初始化比window.onload慢
            * 等待1秒如果deviceready还没执行再执行DOMContentLoaded的监听方法
            */
            setTimeout(function(){
                if(!WIN["device"]){
                    //PC test
                    load();
                }
            },1000);
        }
        DOM.addEvent(DOC,"deviceready",load);
        DOM.addEvent(DOC,'DOMContentLoaded',PCload);
    },
    destroy:function(){//关掉一些东西，比如上传
        if(!Device.isMobi()){return;}
    },
    exit:function(){//退出应用
        if(!Device.isMobi()){return;}
        device.exitApp();
    },
    toast:function(s,t){//暂无
        return false;
    },
    alert:function(title,msg,btn,cb){
        if(!Device.isMobi()){
            alert(title+":"+msg);return;
        }else{
            navigator.notification.alert(msg,function(){
                cb&&cb();
            },title,btn)
        }
    },
    confirm:function(msg,ok,cancel,labs,title){
        if(Device.isMobi()){
            navigator.notification.confirm(msg,function(idx){
                if(1==idx*1){
                    ok&&ok();
                }else if(2==idx*1){
                    cancel&&cancel();
                }
            },title,labs);
        }else{
            window.confirm(msg)?ok&&ok():cancel&&cancel();
        }
    },
    backFunc:[],
    menuFunc:null,
    settedBack:false,
    setBackBtn:function(){//设置返回按钮android symbian
        if(!Device.isMobi()||Device.settedBack){return;}
        Device.settedBack=true;
        DOM.addEvent(DOC,'backbutton',Device.fireBack);
    },
    fireBack:function(){
        if(Device.backFunc.length>0){
            Device.backFunc[0].call(null);
        }
    },
    disetBackBtn:function(){//取消设置返回按钮android symbian
        if(!Device.isMobi()){return;}
        Device.settedBack=false;
        DOM.removeEvent(DOC,'backKeyDown',Device.fireBack);
    },
    setMenuBtn:function(){//设置menu键
        if(!Device.isMobi()){return;}
        DOM.addEvent(DOC,'menubutton',Device.menuFunc);
    },
    disetMenuBtn:function(){//取消设置menu键
        if(!Device.isMobi()){return;}
        DOM.removeEvent(DOC,'menubutton',Device.fireBack);
    },
	/*GPS功能*/
    getLocation:function(cb){//获取经纬度 cb(latitude,longitude)
        if(!Device.isMobi()){return;}
        function onSuccess(pos){
        	var lat=pos.coords.latitude,
        		lng=pos.coords.longitude;
        	cb&&cb(lat,lng);
        }
        function onError(error){
        	alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        function watchonSuccess(position) {
            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                                'Longitude: ' + position.coords.longitude     + '<br />' +
                                '<hr />'      + element.innerHTML;
        }

        // onError Callback receives a PositionError object
        //
        function watchonError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
            if (watchID != null) {
                navigator.geolocation.clearWatch(watchID);
                watchID = null;
            }
        }

        // Options: throw an error if no update is received every 30 seconds.
        //
        var watchID = navigator.geolocation.watchPosition(watchonSuccess, watchonError, { timeout: 20000,enableHighAccuracy: false });
    },
    imageBrowser:function(imgArr){
        if(!Device.isMobi()){return;}
        var arr;
        if($.isArray(imgArr)){
            arr=imgArr;
        }else{
            arr=[imgArr];
        }

    },
    dial:function(num){
        if(!Device.isMobi()){return;}
    }
};