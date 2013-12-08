define(['base', 'X', 'device', 'ui'], function(Mix, X, device, ui) {
    /*用户执行的一些服务器请求*/
    var UserAction = {
        x: null,
        stop: function() {
            this.removeLoading(true);
            this.sendingLogin = false;
            this.sendingRegist = false;
            this.sendingResetPwd = false;
            this.x && this.x.abort();
        },
        /*登陆验证*/
        checkLogin: function(nSel, pSel, node) {
            var nickVal = $(nSel).value;
            var passVal = $(pSel).value;

            if (nickVal.length == 0) {
                ui.toast("请输入您的昵称！", 2);
                return;
            }
            if (passVal.length == 0) {
                ui.toast("请输入您的密码！", 2);
                return;
            }

            UserAction.sendLogin(nickVal, passVal, node);
        },
        sendLogin: function(nick, pwd, btn, ok, fail) {
            if (UserAction.sendingLogin) { //防止重复发送
                return;
            }

            var checkUrl = StorMgr.siteUrl + "/login?ajax=1&callback=?",
                params = 'nickname=' + encodeURIComponent(nick) + '&password=' + encodeURIComponent(pwd),
                secCb = function(a) {
                    UserTools.refresh(); //刷新数据check

                    Mix.base.storage.set('app_my_nick', nick);
                    Mix.base.storage.set('app_my_pwd', pwd);

                    ViewMgr.gotoPage('test');
                    if ($.isFunc(ok)) {
                        ok();
                    }
                    device.setMenuBtn();
                    UserAction.sendingLogin = false;
                },
                errCb = function(e) {
                    if ($.isFunc(fail)) {
                        fail(e.errStr);
                    } else {
                        ui.toast(e.errStr);
                    }
                    UserAction.sendingLogin = false;
                };

            UserAction.sendingLogin = true;
            UserAction.sendAction(checkUrl, params, "get", secCb, errCb);
        },
        /*注册*/
        userRegist: function() {
            var that = this,
                email = $("#regEmail").value,
                nickname = $("#regNickName").value,
                password = $("#regPwd").value,
                passwordR = $("#regPwdR").value;

            that._userRegist(email, nickname, password, passwordR);
        },
        _userRegist: function(email, nickname, password, passwordR) {
            if (UserAction.sendingRegist) { //防止重复发送
                return;
            }
            var url = StorMgr.siteUrl + "/register?ajax=1&callback=?",
                secCb = function(a) {
                    if (0 != a.errCode * 1) {
                        ui.toast(a.errStr);
                        UserAction.sendingRegist = false;
                        return;
                    }
                    ui.toast('注册成功。', 0.6);
                    setTimeout(function() {
                        UserAction.sendingRegist = false;
                        UserAction.sendLogin(nickname, password);
                    }, 500);
                }, errCb = function(a) {
                    if (0 != a.errCode * 1) {
                        ui.toast(a.errStr);
                        UserAction.sendingRegist = false;
                        return;
                    }
                };

            function checkReg() {
                if (0 == nickname.length) {
                    throw {
                        msg: '请输入您的昵称'
                    };
                }
                if (nickname.chineseLen() > 50) {
                    throw {
                        msg: '昵称超过指定长度'
                    };
                }
                if (/\s+/.test(nickname)) {
                    throw {
                        msg: '昵称中不得使用空格'
                    };
                }
                if (0 == email.length) {
                    throw {
                        msg: '请输入您的邮箱地址'
                    };
                }
                if (!regExpObj['email'].test(email)) {
                    throw {
                        msg: '邮箱地址有误'
                    };
                }
                if (/\s+/.test(nickname)) {
                    throw {
                        msg: '昵称中不得使用空格'
                    };
                }
                if (0 == Mix.string.trim(password).length) {
                    throw {
                        msg: '请输入您的密码'
                    };
                }
                if (password != passwordR) {
                    throw {
                        msg: '两次密码不一致'
                    };
                }
            }
            try {
                checkReg();
                var nickVal = encodeURIComponent(nickname),
                    pwdVal = encodeURIComponent(password);
                url += "&nickname=" + nickVal + "&password=" + pwdVal + "&email=" + email;
                UserAction.sendingRegist = true;
                UserAction.sendAction(url, "", "get", secCb, errCb);
            } catch (e) {
                ui.toast(e.msg);
            }
        },
        /*用户退出*/
        logOut: function() {
            device.confirm('确定注销用户？', function() {
                UserTools.refresh();
                Mix.base.storage.clear('session');
                Mix.base.storage.clear();
                ViewMgr.init();
                device.disetMenuBtn();
            }, null, null, '注销提示');
        },
        /*执行ajax请求*/
        sendAction: function(url, data, method, secCb, errCb) {
            var that = this,
                x = new X({
                    method: method || 'get',
                    dataType: 'json'
                });
            that.addLoading();
            x.onLoad = function() {
                that.removeLoading();
                var resp = x.response;
                if (resp.errCode && resp.errCode * 1 != 0) {
                    errCb ? errCb(resp) : ui.toast(resp.errStr);
                    return;
                }
                try {
                    secCb && secCb(resp);
                } catch (e) {}
            }
            x.onFail = function() {
                that.removeLoading();
                if (errCb && x.response) {
                    errCb(x.response);
                } else {
                    pageEngine.initPage('noNet');
                }
            }
            x.send(url, data);
            that.x = x;
            return x;
        },
        addLoading: function() {
            UserAction.LoadingCount = UserAction.LoadingCount || 0;
            UserAction.LoadingCount++;
            Mix.ui.loading.show($('#cont'), function() {
                UserAction.LoadingCount = 0;
                Mix.ui.loading.hide();
                ui.toast('请求服务器超时。请检查网络或稍后再试。', 5);
            }, 10);
        },
        removeLoading: function(all) {
            UserAction.LoadingCount--;
            if (all || 0 >= UserAction.LoadingCount) {
                UserAction.LoadingCount = 0;
                Mix.ui.loading.hide();
            }
        }
    };

    return UserAction;
});