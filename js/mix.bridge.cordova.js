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
        	alert(device.name);
            if(Device.hasLoaded){
                return;
            }
            loadFn();
            Device.hasLoaded=true;
        }

        function PCload(){
            /*appCan对象初始化比window.onload慢
            * 等待1秒如果appCan的onload还没启动再执行DOMContentLoaded的监听方法
            */
            setTimeout(function(){
                if(!WIN["device"]){
                    //PC test
                    load();
                }
            },1000);
        }
        alert(1);
        DOM.addEvent(DOC,'DOMContentLoaded',PCload);
		DOM.addEvent(DOC,"deviceready",load);
		setTimeout(function(){
			alert(2);
			if(!WIN["device"]){
                //PC test
                alert(3);
                load();
                setTimeout(function(){
                	alert(WIN["device"]);
                },100000);
            }else{
            	alert(4);
            	load();
            }
		},10000);
    },
    destroy:function(){//关掉一些东西，比如上传
        if(!Device.isMobi()){return;}
    },
    exit:function(){//退出应用
        if(!Device.isMobi()){return;}
    },
    toast:function(s,t){
        if(!Device.isMobi()){return;}
    },
    alert:function(title,msg,btn){
        if(!Device.isMobi()){alert(title+":"+msg);return;}
    },
    confirm:function(msg,ok,cancel,labs,title){
        if(Device.isMobi()){
        }else{
            window.confirm(msg)?ok&&ok():cancel&&cancel();
        }
    },
    backFunc:[],
    menuFunc:null,
    setKeyPress:function(){
        if(!Device.isMobi()){return;}
    },
    setBackBtn:function(fn){//设置返回按钮android symbian
        if(!Device.isMobi()){return;}
    },
    disetBackBtn:function(){//取消设置返回按钮android symbian
        if(!Device.isMobi()){return;}
    },
    setMenuBtn:function(fn){//设置menu键
        if(!Device.isMobi()){return;}
    },
    disetMenuBtn:function(){//取消设置menu键
        if(!Device.isMobi()){return;}
    },
	/*GPS功能*/
    getLocation:function(cb){//获取经纬度 cb(latitude,longitude)
    	alert('in-get');
        if(!Device.isMobi()){return;}
        alert('in-get-in');
        var options = { timeout: 30000 },
        	watchID;
        function clear(){
        	if(watchID!=null){
        		navigator.geolocation.clearWatch(watchID);
        		watchID=null;
        	}
        }

        function onSuccess(pos){
        	alert('pos-1');
        	var lat=pos.coords.latitude,
        		lng=pos.coords.longitude;
        	alert(lat+"~~"+lng);
        	cb&&cb(lat,lng);
        	clear();
        }
        function onError(error){
        	alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        	clear();
        }
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    },
    imageBrowser:function(imgArr){
        if(!Device.isMobi()){return;}
    },
    dial:function(num){
        if(!Device.isMobi()){return;}
    }
};