define(['stor', 'device', 'dom', 'action', 'ui'], function(StorMgr, device, dom, action, ui) {
    /*涉及到应用的一些工具类*/
    var UserTools = {
        /*清除缓存和一些记录的变量值,用户退出时需要*/
        refresh: function() {
            // Mix.base.storage.clear();//gps等信息
            Mix.base.storage.clear('session');
            StorMgr.destroy();

            UserTools.endPreLoad = true;
            if (UserTools.preLoadInter) {
                clearTimeout(UserTools.preLoadInter);
            }
        },
        getUrlVal: function(url, name) {
            var reg = new RegExp(name + '=([^&]+)');
            if (reg.exec(url)) {
                return reg.exec(url)[1];
            }
            return null;
        },
        /*从临时变量ViewMgr.tmpParams取参数值*/
        getParamVal: function(paramKey) {
            var value = "",
                params = ViewMgr.tmpParams.split('&');

            if (0 != params.length) {
                Mix.base.each(params, function(pa) {
                    var rg = new RegExp(paramKey + "=(.*)");
                    if (rg.test(pa)) {
                        value = rg.exec(pa)[1];
                    }
                });
            }

            return value;
        },
        /*initArea弹出地区选择框*/
        initArea: function(cb, defProv, defCity) {
            if (StorMgr.gpsInfo && StorMgr.gpsInfo.prov && StorMgr.gpsInfo.city) {
                defProv = StorMgr.gpsInfo.prov;
                defCity = StorMgr.gpsInfo.city;
            }
            // if(Mix.map.searchProv){
            //     defProv=Mix.map.searchProv;
            //     defCity="";
            // }
            // if(Mix.map.searchCity){
            //     defCity=Mix.map.searchCity;
            // }
            function done(prov, city) {
                if (!prov) {
                    ui.toast('未选择地区', 2);
                    return;
                }

                cb(prov, city);
            }
            var regObj = {
                useMask: true,
                onConfirm: function(prov, city) {
                    done(prov, city);
                },
                onShow: function(regSel) {
                    device.backFunc.unshift(function() {
                        regSel.hide();
                    });
                },
                hideEnd: function(regSel) {
                    device.backFunc.shift(0);
                    if (device.backFunc.length <= 0) {
                        device.backFunc = [

                            function() {
                                ViewMgr.back();
                            }
                        ];
                    }
                }
            };

            if (defProv) {
                regObj.prov = defProv;
            }
            if (defCity && !regExpObj['directCity'].test(defCity)) {
                regObj.city = defCity;
            }
            Mix.ui.region.show(regObj);
            return;
        },
        /*获得用户所在经纬度*/
        getGpsInfo: function(cb) {
            StorMgr.gpsInfo = Mix.base.storage.get("app_my_gpsInfo");
            // StorMgr.gpsInfo={};
            // StorMgr.gpsInfo.lat=31.233;
            // StorMgr.gpsInfo.lng=121.491;
            // StorMgr.gpsInfo.prov='上海';
            // StorMgr.gpsInfo.city='上海';
            device.getLocation(
                function(lat, lng) {
                    var gpsInfo = {
                        lat: lat,
                        lng: lng
                    }
                    StorMgr.gpsInfo = gpsInfo;
                    Mix.base.storage.set("app_my_gpsInfo", gpsInfo);

                    Mix.map.getProvCity(lng, lat, StorMgr.gpsInfo);

                    if (Mix.base.isFunc(cb)) {
                        cb();
                    }
                }
            );
        },
        /*检查容器是否应该滚动*/
        checkScroll: function(contSel, cb) {
            if (!dom.$(contSel) || window['myScroll'] || !dom.$(contSel + '>div')) {
                return;
            }
            if (dom.$(contSel + '>div').offsetHeight > dom.$(contSel).offsetHeight) {
                if (Mix.array.has(['login'], pageEngine.curPage)) {
                    WIN['myScroll'] = new Mix.scroll(contSel, {
                        useTransform: false
                    });
                } else {
                    WIN['myScroll'] = new Mix.scroll(contSel);
                }
                cb && cb();
            }
        },
        /*处理textarea和input的残留*/
        fixHighlight: function() {
            DOC.activeElement.blur();
        },
        /*预加载资源图片*/
        preLoadResource: function(imgs, cb, hasProgress) {
            UserTools.endPreLoad = false;
            if (imgs.length <= 0) {
                cb && cb();
                return;
            }

            var loadDom = dom.create('div', {
                style: {
                    'position': 'absolute',
                    'height': '0',
                    'left': '10000em'
                }
            }),
                loadedNum = 0,
                totleNum = imgs.length,
                startT = Date.now(),
                finished = false;

            UserTools.preLoadInter = setTimeout(function() {
                finishLoad();
            }, 10000);

            dom.BODY.appendChild(loadDom);
            action.addLoading();

            if (hasProgress) {
                var progressDom = dom.create('div', {
                    className: 'ui_progress'
                }),
                    progressInte = dom.create('div', {
                        className: 'inner'
                    }),
                    proTxt = dom.create('div', {
                        className: 'text'
                    });

                progressDom.appendChild(progressInte);
                progressDom.appendChild(proTxt);
                dom.BODY.appendChild(progressDom);
            }

            function oneLoad() {
                loadedNum++;
                if (hasProgress) {
                    var p = Math.ceil(loadedNum * 100 / totleNum) + "%";
                    proTxt.innerHTML = p;
                    progressInte.style.width = p;
                }
                if (loadedNum >= totleNum) {
                    if (hasProgress) {
                        progressDom.style.opacity = 0;
                    }
                    if (!UserTools.endPreLoad) {
                        cb && cb();
                    }
                    finishLoad();
                }
            }

            function finishLoad() {
                if (finished)
                    return;
                clearTimeout(UserTools.preLoadInter);
                if (hasProgress) {
                    dom.BODY.removeChild(progressDom);
                }
                dom.BODY.removeChild(loadDom);
                action.removeLoading();
                finished = true;
            }

            Mix.base.each(imgs, function(imgUrl, idx) {
                var img = new Image();
                img.src = imgUrl;
                img.onload = function() {
                    if (UserTools.endPreLoad) {
                        finishLoad();
                        return;
                    }
                    oneLoad();
                }
                loadDom.appendChild(img);
            });
        }
    };
    return window['UserTools'] = UserTools;
});