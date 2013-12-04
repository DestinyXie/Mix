/*桥接appCan接口*/
define(['dom'], function(dom) {
    var Device = {
        /*手机初始化*/
        isMobi: function() {
            if (window["uexWindow"]) {
                return true;
            }
            return false;
        },
        hasLoaded: false,
        /*操作ID，AppCan专有*/
        opCode: 1,
        /*设备初始化完毕，只调用一次*/
        onLoad: function(loadFn) {
            function load() {
                if (Device.hasLoaded) {
                    return;
                }
                loadFn();
                Device.hasLoaded = true;
            }

            function PCload() {
                /*appCan对象初始化比window.onload慢
                 * 等待1秒如果appCan的onload还没启动再执行DOMContentLoaded的监听方法
                 */
                setTimeout(function() {
                    if (!window["uexWindow"]) {
                        //PC test
                        load();
                    }
                }, 1000);
            }
            window.uexOnload = load;
            dom.addEvent(document, 'DOMContentLoaded', PCload);
        },
        destroy: function() { //关掉一些东西，比如上传
            if (!Device.isMobi()) {
                return;
            }
            /*停止上传*/
            if (Device.xmlHttp.isSending) {
                Device.xmlHttp.close();
            }
            /*关闭toast*/
            uexWindow.closeToast();
        },
        exit: function() { //退出应用
            if (!Device.isMobi()) {
                return;
            }
            uexWidgetOne.exit();
        },
        toast: function(s, t) {
            if (!Device.isMobi()) {
                return;
            }
            uexWindow.toast(0, 5, s, t * 1000 || 2000);
        },
        alert: function(title, msg, btn) {
            if (!Device.isMobi()) {
                alert(title + ":" + msg);
                return;
            }
            uexWindow.alert(title, msg, btn);
        },
        /*uexWindow接口*/
        confirm: function(msg, ok, cancel, labs, title) {
            if (Device.isMobi()) {
                uexWindow.cbConfirm = function(opId, dataType, data) {
                    switch (data * 1) {
                        case 0:
                            if (typeof ok == "function")
                                ok();
                            break;
                        case 1:
                            if (typeof cancel == "function")
                                cancel();
                            break;
                    }
                }

                uexWindow.confirm(title || "确认", msg, labs || ['确认', '取消']);
            } else {
                window.confirm(msg) ? ok && ok() : cancel && cancel();
            }
        },
        backFunc: [],
        menuFunc: null,
        setKeyPress: function() {
            if (!Device.isMobi()) {
                return;
            }
            uexWindow.onKeyPressed = function(code) {
                if (0 === code * 1) {
                    if (Device.backFunc.length > 0) {
                        Device.backFunc[0].call(null);
                    }
                } else if (1 === code * 1) {
                    if (Mix.base.isFunc(Device.menuFunc)) {
                        Device.menuFunc.call(null);
                    }
                }
            }
        },
        setBackBtn: function(fn) { //设置返回按钮android symbian
            if (!Device.isMobi()) {
                return;
            }
            Device.setKeyPress();
            uexWindow.setReportKey('0', '1');
        },
        disetBackBtn: function() { //取消设置返回按钮android symbian
            if (!Device.isMobi()) {
                return;
            }
            uexWindow.setReportKey('0', '0');
        },
        setMenuBtn: function(fn) { //设置menu键
            if (!Device.isMobi()) {
                return;
            }
            Device.setKeyPress();
            uexWindow.setReportKey('1', '1');
        },
        disetMenuBtn: function() { //取消设置menu键
            if (!Device.isMobi()) {
                return;
            }
            uexWindow.setReportKey('1', '0');
        },
        /*GPS功能*/
        getLocation: function(cb) { //获取经纬度 cb(latitude,longitude)
            if (!Device.isMobi()) {
                return;
            }

            function locationCallback(lat, log) {
                uexLocation.closeLocation();
                cb(lat, log);
            }
            uexLocation.onChange = locationCallback;
            // check
            // uexWidgetOne.cbError = function(opCode,errorCode,errorInfo){
            //     toast("未能取得经纬度 errorCode:" + errorCode + "\nerrorInfo:" + errorInfo);
            // }
            uexLocation.openLocation();
        },
        imageBrowser: function(imgArr) {
            if (!Device.isMobi()) {
                return;
            }
            var arr;
            if (Mix.base.isArray(imgArr)) {
                arr = imgArr;
            } else {
                arr = [imgArr];
            }
            uexImageBrowser.open(arr, 0, 0);
        },
        dial: function(num) {
            if (!Device.isMobi()) {
                return;
            }
            var numStr = 'phone'.replace(/phone/, num);
            uexCall.dial(numStr);
        },
        /*===========以下方法在adiCub项目中未使用,但以后会用===========*/
        /*取得手机操作平台ios or android*/
        getPlatForm: function(cb) {
            if (!Device.isMobi()) {
                return;
            }

            function platformSuccess(opId, dataType, data) {
                var platstr = ""; //终端标识
                if (dataType == 2 && data == 0) {
                    platstr = "ios";
                }
                if (dataType == 2 && data == 1) {
                    platstr = "android";
                }
                if (dataType == 2 && data == 4) {
                    platstr = "wp";
                }
                if (cb) {
                    cb(platstr);
                }
                Device.platStr = platstr;
            }
            if (!Device.platstr) {
                uexWidgetOne.getPlatform();
                uexWidgetOne.cbGetPlatform = platformSuccess;
            } else {
                if (cb) {
                    cb(Device.platStr);
                }
            }
        },
        /*启动一个第三方应用*/
        loadApp: function(addr) {
            if (!Device.isMobi()) {
                return;
            }
            uexWidget.loadApp(addr);
        },
        /*安装应用*/
        installApp: function(addr) {
            if (!Device.isMobi()) {
                return;
            }
            uexWidget.installApp(addr);
        },
        /*下载*/
        download: function(url, downUrl, cb) {
            if (!Device.isMobi()) {
                return;
            }
            Device.opCode++;
            var inOpCode = Device.opCode;
            uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
                switch (status) {
                    case 0:
                        uexWindow.toast('1', '5', '当前下载的进度：' + percent + '%', '');
                        break;
                    case 1:
                        uexWindow.alert("温馨提示", "下载完成，请进行安装！", "我知道了");
                        uexDownloaderMgr.closeDownloader(opCode);
                        uexWindow.closeToast();
                        cb();
                        break;
                    case 2:
                        uexWindow.alert("温馨提示", "下载失败，请联系管理员！", "我知道了");
                        uexDownloaderMgr.closeDownloader(opCode);
                        break;
                }
            }
            uexDownloaderMgr.cbCreateDownloader = function(opCode, dataType, data) {
                if (data == 0) {
                    uexDownloaderMgr.download(inOpCode, url, downUrl, '0');
                } else {
                    uexWindow.alert("温馨提示", "创建下载资源失败，请确认你手机中装有SD存储卡。", "我知道了");
                }
            }
            // check
            // uexWidgetOne.cbError = function(opCode,errorCode,errorInfo){
            //     toast(errorInfo,3);
            // }
            uexDownloaderMgr.createDownloader(inOpCode);
        },
        /*===========以下方法在adiCub项目中未使用===========*/
        /*清空缓存*/
        clearCache: function() {
            if (!Device.isMobi()) {
                return;
            }

            function clean(opId, dataType, data) {
                if (dataType == 2 && data == 0) {
                    alert("清除成功");
                } else if (dataType == 2 && data == 1) {
                    alert("清除失败");
                }
            }
            uexWidgetOne.cbCleanCache = clean;
            uexWidgetOne.cleanCache()
        },
        actionThree: function(title, msg, labArr, first, second, third) {
            if (Device.isMobi()) {
                uexWindow.cbConfirm = function(opId, dataType, data) {
                    switch (data * 1) {
                        case 0:
                            if (typeof first == "function")
                                first();
                            break;
                        case 1:
                            if (typeof second == "function")
                                second();
                            break;
                        case 2:
                            if (typeof third == "function")
                                third();
                            break;
                    }
                }

                uexWindow.confirm(title, msg, labArr);
            }
        },
        prompt: function(msg, ok, cancel, labs, def) {
            if (Device.isMobi()) {
                uexWindow.cbPrompt = function(opId, dataType, data) {
                    var obj = eval('(' + data + ')');
                    var num = obj.num,
                        val = obj.value;
                    switch (num * 1) {
                        case 0:
                            ok && ok(val);
                            break;
                        case 1:
                            cancel && cancel(val);
                            break;
                    }
                }
                uexWindow.prompt("", msg, def || "", labs || ['确定', '取消']);
            } else {
                var val = window.prompt(msg);
                if (typeof val == "string") {
                    ok && ok(val);
                } else {
                    cancel && cancel();
                }
            }
        },
        actionSheet: function(ao) { //不再用它
            if (!Device.isMobi()) {
                return;
            }
            uexWindow.cbActionSheet = ao[3];
            uexWindow.actionSheet(ao[0], ao[1], ao[2]);
        },
        datePicker: function(node, okCb, errCb) { //日期选择
            if (!Device.isMobi()) {
                return;
            }
            uexControl.cbOpenDatePicker = function(opCode, dataType, data) {
                if (dataType == 1) {
                    var obj = eval('(' + data + ')'),
                        dataStr = obj.year + "-" + obj.month + "-" + obj.day,
                        today = new Date().getTime();
                    if (new Date(obj.year, obj.month - 1, obj.day).getTime() > today) {
                        alert('日期超过今天无效');
                        return;
                    }
                    okCb ? okCb(dataStr) : Device.toast(dataStr);
                } else {
                    errCb ? errCb() : Device.toast('日期没有选择成功');
                }
            }
            var defData = node.getAttribute('default').split("-");
            if (0 == defData[0] || 0 == defData[1] || 0 == defData[2]) {
                defData = ['1992', '12', '12'];
            }

            uexControl.openDatePicker(defData[0], defData[1], defData[2]);
        },
        /*根据经纬度获取地址 cb(addr);*/
        getAddress: function(lat, log, cb, errCb) {
            if (!Device.isMobi()) {
                return;
            }

            function LocationSuccess(opCode, dataType, data) {
                if (dataType == 0) {
                    cb(data);
                } else {
                    if (errCb) {
                        errCb();
                    } else {
                        Device.toast('未能获得地址信息');
                    }
                }
            }
            uexLocation.cbGetAddress = LocationSuccess;
            uexLocation.getAddress(lat, log);
        },
        getAppVersion: function(cb) {
            if (!Device.isMobi()) {
                Device.toast('你不是手机，请自便。');
                return;
            }

            function versionSuccess(opId, dataType, data) {
                if (dataType == 0) {
                    if (cb) {
                        cb(data);
                    }
                    Device.appVersion = data;
                } else {
                    Device.toast('版本获取失败!');
                }
            }

            if (!Device.appVersion) {
                uexWidgetOne.cbGetVersion = versionSuccess;
                uexWidgetOne.getVersion();
            } else {
                if (cb) {
                    cb(Device.appVersion);
                }
            }
        },
        xmlHttp: {
            isSending: false,
            send: function(customObj) { //跨域异步请求数据的方法
                /* param:customObj{object}:
                src 请求地址
                method 请求方法
                plainPara 简单参数
                sourcePara 资源参数
                progressCb 进度回调
                secCb 请求成功回调
                failCb 请求失败回调
                */
                if (!Device.isMobi()) {
                    return;
                }
                if (!customObj['src']) {
                    Device.toast('缺少xmlHttp请求地址。');
                    return;
                }

                var option = {
                    opCode: Device.opCode++,
                    method: 'POST',
                    timeout: 0 //请求超时
                }
                extend(option, customObj);

                function sendParam(paramStr, isSource) {
                    var params = paramStr.split('&'),
                        tmpArr;
                    for (var i = params.length - 1; i >= 0; i--) {
                        tmpArr = params[i].split('=');
                        if (2 === tmpArr.length) {
                            uexXmlHttpMgr.setPostData(option.opCode, !isSource ? "0" : "1", tmpArr[0], tmpArr[1]);
                        }
                    };
                }

                uexXmlHttpMgr.onPostProgress = option.progressCb;
                uexXmlHttpMgr.onData = option.secCb;
                uexXmlHttpMgr.open(option.opCode, option.method.toUpperCase(), option.src, option.timeout);

                sendParam(option['plainPara'], false);
                sendParam(option['sourcePara'], true);

                Device.xmlHttp.isSending = true;
                Device.xmlHttp.opCode = option.opCode;

                uexXmlHttpMgr.send(option.opCode);
            },
            close: function() {
                if (!Device.xmlHttp.isSending) {
                    return;
                }
                var opCode = Device.xmlHttp.opCode;
                uexXmlHttpMgr.close(opCode);
                Device.xmlHttp.isSending = false;
            }
        },
        /*取得文件大小*/
        getFileSize: function(path, cb) {
            if (!Device.isMobi()) {
                return;
            }
            Device.opCode++;
            var inOpCode = Device.opCode;

            function callback(opId, dataType, data) {
                if (dataType == 2) {
                    //alert(data/1024);//k
                    if (cb) {
                        cb(data / 1024);
                    }
                }
            }
            uexFileMgr.cbGetFileSize = callback;
            uexFileMgr.openFile(inOpCode, path, 1);
            uexFileMgr.getFileSize(inOpCode);
            uexFileMgr.closeFile(inOpCode);
        },
        camera: function(cb) { //拍照
            if (!Device.isMobi()) {
                return;
            }
            uexCamera.cbOpen = function(opId, dataType, data) {
                cb(opId, dataType, data);
            };
            uexCamera.open();
        },
        imagePick: function(cb) { //浏览照片
            if (!Device.isMobi()) {
                return;
            }
            uexImageBrowser.cbPick = function(opCode, dataType, data) {
                cb(opCode, dataType, data);
            };
            uexImageBrowser.pick();
        },
        call: function(num) {
            if (!Device.isMobi()) {
                return;
            }
            var numStr = 'phone'.replace(/phone/, num);
            uexCall.call(numStr);
        }
    };
});