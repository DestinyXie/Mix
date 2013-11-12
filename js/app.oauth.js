/*腾讯微博授权*/ ;
Mix.qq = {
    type: 'qq',
    oauthWindow: 'weiboLoginWin',
    backUrl: 'http://desmix.com/oauth.html',
    regist: function() {
        var that = this,
            nickname = "qq_" + that.info.name,
            email = nickname + "@qq.com",
            password = "QQcommonpwd1",
            okCb = function() {
                toast('腾讯微博授权成功');
                that.getInfo(function() {
                    alert(JSON.stringify(that.info));
                });
            },
            failCb = function(msg) {
                UserAction._userRegist(email, nickname, password, password);
            };

        UserAction.sendLogin(nickname, password, null, okCb, failCb);
    },
    getLoginInfo: function(type) {
        var t = (type || this.type);
        return {
            'access_token': localStorage[t + 'access_token'],
            'expires_in': localStorage[t + 'expires_in'],
            'remind_in': localStorage[t + 'remind_in'],
            'uid': localStorage[t + 'uid'],
            'openid': localStorage[t + 'openid'],
            'openkey': localStorage[t + 'openkey'],
            'code': localStorage[t + 'code']
        };
    },
    succCall: function() {
        Mix.qq.qqLogInfo = Mix.qq.getLoginInfo();
        Mix.qq.checkAuth();
    },
    onOAuth: function(winNam, url) {
        var that = Mix.qq;
        if (winNam == that.oauthWindow && url.indexOf(that.backUrl) == 0) {
            //fix：SINA会回调2次，设置1S内只
            if (that.lastCall && new Date() - that.lastCall < 1000) return;
            var par = url.split('?')[1],
                par = par.split('&');
            for (var k = 0, len = par.length; k < len; k++) {
                var _karr = par[k].split('=');
                if (_karr[1])
                    that[that.type + _karr[0]] = localStorage[that.type + _karr[0]] = _karr[1];
            }
            uexWindow.toast("0", "5", "授权成功 正在返回...", 2000);
            that.lastCall = new Date();
            that.succCall && that.succCall.call(that);
        }
        return that;
    },
    login: function() {
        var that = this,
            appKey = '801291490';

        if (/192\.168\.40\.28/.test(location.href)) {
            appKey = '801291800';
        }

        var qqUrl = 'https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=' + appKey + '&response_type=code&redirect_uri=' + that.backUrl;

        uexWindow.onOAuthInfo = that.onOAuth;
        uexWindow.toast("1", "5", "正在加载腾讯微博登陆页面...", 5000);
        //格式化登陆地址
        uexWindow.open(that.oauthWindow, "0", qqUrl, "2", "0", "0", "5");
    },
    checkAuth: function() {
        this.appKey = '801291490';
        this.appSecret = '5b50939fdc25e06c1c30433ca9713a2b';
        this.clientIp = "127.0.0.1";

        if (/192\.168\.40\.28/.test(location.href)) {
            this.appKey = '801291800';
            this.appSecret = '5e36a5ef6aba4aa58142cf5a79484cd2';
            this.clientIp = "192.168.40.28";
        }

        var that = this,
            href = location.href,
            code = that.qqLogInfo && that.qqLogInfo.code,
            qqUrl2 = 'https://open.t.qq.com/cgi-bin/oauth2/access_token?client_id=' + that.appKey + '&client_secret=' + that.appSecret + '&redirect_uri=' + that.backUrl + '&grant_type=authorization_code&code=';

        if (code) {
            qqUrl2 = qqUrl2 + code + "&callback=?";
            UserAction.sendAction(qqUrl2, null, null, function(a) {
                that.access_token = UserTools.getUrlVal(a, 'access_token');
                that.openid = UserTools.getUrlVal(a, 'openid');
                that.getInfo(function() {
                    that.regist();
                });
            });
        }
    },
    getInfo: function(cb) {
        var that = this,
            url = 'https://open.t.qq.com/api/user/info?format=?&oauth_consumer_key=' + that.appKey + '&access_token=' + that.access_token + '&openid=' + that.openid + '&clientip=' + that.clientIp + '&oauth_version=2.a&scope=all';

        UserAction.sendAction(url, null, null, function(a) {
            if (a.errcode * 1 == 0) {
                that.info = a.data;
                cb && cb();
            } else {
                toast('未能获取个人信息');
            }
        });
    }
}

/*新浪微博授权*/
Mix.sina = {
    type: 'sina',
    oauthWindow: 'sinaLoginWin',
    backUrl: 'http://desmix.com/oauth.html',
    regist: function() {
        var that = this,
            nickname = "sina_" + that.info.name,
            email = nickname + "@sina.com",
            password = "SINAcommonpwd1",
            okCb = function() {
                toast('腾讯微博授权成功');
                that.getInfo(function() {
                    alert(JSON.stringify(that.info));
                });
            },
            failCb = function(msg) {
                UserAction._userRegist(email, nickname, password, password);
            };

        UserAction.sendLogin(nickname, password, null, okCb, failCb);
    },
    getLoginInfo: function(type) {
        var t = (type || this.type);
        return {
            'access_token': localStorage[t + 'access_token'],
            'expires_in': localStorage[t + 'expires_in'],
            'remind_in': localStorage[t + 'remind_in'],
            'uid': localStorage[t + 'uid'],
            'openid': localStorage[t + 'openid'],
            'openkey': localStorage[t + 'openkey'],
            'code': localStorage[t + 'code']
        };
    },
    succCall: function() {
        Mix.sina.sinaLogInfo = Mix.sina.getLoginInfo();
        Mix.sina.checkAuth();
    },
    onOAuth: function(winNam, url) {
        var that = Mix.sina;
        if (winNam == that.oauthWindow && url.indexOf(that.backUrl) == 0) {
            //fix：SINA会回调2次，设置1S内只响应一次
            if (that.lastCall && new Date() - that.lastCall < 1000) return;
            var par = url.split('?|#')[1],
                par = par.split('&');
            for (var k = 0, len = par.length; k < len; k++) {
                var _karr = par[k].split('=');
                if (_karr[1])
                    that[that.type + _karr[0]] = localStorage[that.type + _karr[0]] = _karr[1];
            }
            uexWindow.toast("0", "5", "授权成功 正在返回...", 2000);
            that.lastCall = new Date();
            that.succCall && that.succCall.call(that);
        }
        return that;
    },
    login: function() {
        var that = this,
            appKey = '3216246234';

        var sinaUrl = 'https://api.weibo.com/oauth2/authorize?client_id=' + appKey + '&response_type=token&display=wap&redirect_uri=' + that.backUrl;

        uexWindow.onOAuthInfo = that.onOAuth;
        uexWindow.toast("1", "5", "正在加载新浪微博登陆页面...", 5000);
        //格式化登陆地址
        uexWindow.open(that.oauthWindow, "0", sinaUrl, "0", "100%", "100%", "5");
    },
    checkAuth: function() {
        this.appKey = '3216246234';
        this.appSecret = 'af76a70ce9f574a61e5b2b145be255d5';
        this.clientIp = "127.0.0.1";

        var that = this,
            href = location.href,
            code = that.sinaLogInfo && that.sinaLogInfo.code,
            sinaUrl2 = 'https://api.weibo.com/oauth2/access_token?client_id=' + that.appKey + '&client_secret=' + that.appSecret + '&grant_type=authorization_code&redirect_uri=' + that.backUrl + '&code=';
        alert(code);
        if (code) {
            sinaUrl2 = sinaUrl2 + code + "&callback=?";
            UserAction.sendAction(sinaUrl2, null, null, function(a) {
                that.access_token = UserTools.getUrlVal(a, 'access_token');
                that.openid = UserTools.getUrlVal(a, 'openid');
                that.getInfo(function() {
                    that.regist();
                });
            });
        }
    },
    getInfo: function(cb) {
        var that = this,
            url = 'https://api.weibo.com/2/users/show.json?access_token=' + that.access_token;

        UserAction.sendAction(url, null, null, function(a) {
            if (a.errcode * 1 == 0) {
                that.info = a.data;
                cb && cb();
            } else {
                toast('未能获取个人信息');
            }
        });
    }
}

/*人人网授权*/
Mix.renren = {
    callId: 1,
    type: 'renren',
    oauthWindow: 'renrenLoginWin',
    backUrl: 'http://desmix.com/oauth.html',
    regist: function() {
        var that = this,
            nickname = "rr_" + that.info.name,
            email = nickname + "@renren.com",
            password = "RRcommonpwd1",
            okCb = function() {
                toast('腾讯微博授权成功');
                that.getInfo(function() {
                    alert(JSON.stringify(that.info));
                });
            },
            failCb = function(msg) {
                UserAction._userRegist(email, nickname, password, password);
            };

        UserAction.sendLogin(nickname, password, null, okCb, failCb);
    },
    getLoginInfo: function(type) {
        var t = (type || this.type);
        return {
            'access_token': localStorage[t + 'access_token'],
            'expires_in': localStorage[t + 'expires_in'],
            'remind_in': localStorage[t + 'remind_in'],
            'uid': localStorage[t + 'uid'],
            'openid': localStorage[t + 'openid'],
            'openkey': localStorage[t + 'openkey'],
            'code': localStorage[t + 'code']
        };
    },
    succCall: function() {
        Mix.renren.renrenLogInfo = Mix.renren.getLoginInfo();
        alert(JSON.stringify(Mix.renren.renrenLogInfo));
        Mix.renren.checkAuth();
    },
    onOAuth: function(winNam, url) {
        var that = Mix.renren;
        if (winNam == that.oauthWindow && url.indexOf(that.backUrl) == 0) {
            //fix：SINA会回调2次，设置1S内只
            if (that.lastCall && new Date() - that.lastCall < 1000) return;
            var par = url.split('?')[1],
                par = par.split('&');
            for (var k = 0, len = par.length; k < len; k++) {
                var _karr = par[k].split('=');
                if (_karr[1])
                    that[that.type + _karr[0]] = localStorage[that.type + _karr[0]] = _karr[1];
            }
            uexWindow.toast("0", "5", "授权成功 正在返回...", 2000);
            that.lastCall = new Date();
            that.succCall && that.succCall.call(that);
        }
        return that;
    },
    login: function() {
        var that = this,
            appId = '222780';

        var renrenUrl = 'https://graph.renren.com/oauth/authorize?client_id=' + appId + '&response_type=code&redirect_uri=' + that.backUrl + '&display=page';

        uexWindow.onOAuthInfo = that.onOAuth;
        uexWindow.toast("1", "5", "正在加载人人登陆页面...", 5000);
        //格式化登陆地址
        uexWindow.open(that.oauthWindow, "0", renrenUrl, "0", "100%", "100%", "5");
    },
    checkAuth: function() {
        this.apiKey = 'f9a7a80bd97e4ae88c0b4ecc7ad1bf5b';
        this.secretKey = 'd244f34dfe554467b33645cbf5fcd03f';
        this.clientIp = "127.0.0.1";
        alert(1);
        var that = this,
            href = location.href,
            code = that.renrenLogInfo && that.renrenLogInfo.code,
            renrenUrl2 = 'https://graph.renren.com/oauth/token?client_id=' + this.apiKey + '&client_secret=' + this.secretKey + '&redirect_uri=' + that.backUrl + '&grant_type=authorization_code&code=';
        alert(code);
        if (code) {
            renrenUrl2 = renrenUrl2 + code + "&format=jsonpRR";

            var nx = new Mix.x();

            function sec(a) {
                alert(a);
            }

            x.onLoad = function() {
                var resp = x.response;
                sec && sec(resp);
            }
            x.onFail = function() {
                alert('fail');
            }
            alert(renrenUrl2);
            nx.ajaxJSONP(renrenUrl2);
            // UserAction.sendAction(renrenUrl2,null,null,function(a){
            //     alert(a);
            //     that.access_token=UserTools.getUrlVal(a,'access_token');
            //     that.openid=UserTools.getUrlVal(a,'openid');
            //     that.getInfo(function(){
            //         that.regist();
            //     });
            // });
        }
    },
    getSig: function(param) {
        var sig = param.replace(/&/, '');
        sig += this.secretKey;
        sig = Mix.hex_md5(sig);
        alert(sig);
        return sig;
    },
    getInfo: function(cb) {
        var that = this,
            callId = that.callId++,
            param = 'format=jsonpRR&v=1.0&method=users.getInfo&call_id=' + that.callId + '&access_token=' + that.access_token,
            url = 'http://api.renren.com/restserver.do?' + param + '&sig=' + that.setSig(param);

        var nx = new Mix.x();

        function sec(a) {
            alert(a);
            if (a.errcode * 1 == 0) {
                that.info = a.data;
                cb && cb();
            } else {
                toast('未能获取个人信息');
            }
        }

        x.onLoad = function() {
            var resp = x.response;
            sec && sec(resp);
        }
        x.onFail = function() {
            alert('fail');
        }
        nx.ajaxJSONP(url);
    }
};


/*MD5 js算法Mix.hex_md5*/
(function(Mix) {
    var hexcase = 0;

    function hex_md5(a) {
        if (a == "") return a;
        return rstr2hex(rstr_md5(str2rstr_utf8(a)))
    }

    function hex_hmac_md5(a, b) {
        return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
    }

    function md5_vm_test() {
        return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
    }

    function rstr_md5(a) {
        return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
    }

    function rstr_hmac_md5(c, f) {
        var e = rstr2binl(c);
        if (e.length > 16) {
            e = binl_md5(e, c.length * 8)
        }
        var a = Array(16),
            d = Array(16);
        for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828
        }
        var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
        return binl2rstr(binl_md5(d.concat(g), 512 + 128))
    }

    function rstr2hex(c) {
        try {
            hexcase
        } catch (g) {
            hexcase = 0
        }
        var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var b = "";
        var a;
        for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
        }
        return b
    }

    function str2rstr_utf8(c) {
        var b = "";
        var d = -1;
        var a, e;
        while (++d < c.length) {
            a = c.charCodeAt(d);
            e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
            if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
                a = 65536 + ((a & 1023) << 10) + (e & 1023);
                d++
            }
            if (a <= 127) {
                b += String.fromCharCode(a)
            } else {
                if (a <= 2047) {
                    b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
                } else {
                    if (a <= 65535) {
                        b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    } else {
                        if (a <= 2097151) {
                            b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                        }
                    }
                }
            }
        }
        return b
    }

    function rstr2binl(b) {
        var a = Array(b.length >> 2);
        for (var c = 0; c < a.length; c++) {
            a[c] = 0
        }
        for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
        }
        return a
    }

    function binl2rstr(b) {
        var a = "";
        for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
        }
        return a
    }

    function binl_md5(p, k) {
        p[k >> 5] |= 128 << ((k) % 32);
        p[(((k + 64) >>> 9) << 4) + 14] = k;
        var o = 1732584193;
        var n = -271733879;
        var m = -1732584194;
        var l = 271733878;
        for (var g = 0; g < p.length; g += 16) {
            var j = o;
            var h = n;
            var f = m;
            var e = l;
            o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
            l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
            m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
            n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
            o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
            l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
            m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
            n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
            o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
            l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
            m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
            n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
            o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
            l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
            m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
            n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
            o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
            l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
            m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
            n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
            o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
            l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
            m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
            n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
            o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
            l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
            m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
            n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
            o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
            l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
            m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
            n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
            o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
            l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
            m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
            n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
            o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
            l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
            m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
            n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
            o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
            l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
            m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
            n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
            o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
            l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
            m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
            n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
            o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
            l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
            m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
            n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
            o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
            l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
            m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
            n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
            o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
            l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
            m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
            n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
            o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
            l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
            m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
            n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
            o = safe_add(o, j);
            n = safe_add(n, h);
            m = safe_add(m, f);
            l = safe_add(l, e)
        }
        return Array(o, n, m, l)
    }

    function md5_cmn(h, e, d, c, g, f) {
        return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
    }

    function md5_ff(g, f, k, j, e, i, h) {
        return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
    }

    function md5_gg(g, f, k, j, e, i, h) {
        return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
    }

    function md5_hh(g, f, k, j, e, i, h) {
        return md5_cmn(f ^ k ^ j, g, f, e, i, h)
    }

    function md5_ii(g, f, k, j, e, i, h) {
        return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
    }

    function safe_add(a, d) {
        var c = (a & 65535) + (d & 65535);
        var b = (a >> 16) + (d >> 16) + (c >> 16);
        return (b << 16) | (c & 65535)
    }

    function bit_rol(a, b) {
        return (a << b) | (a >>> (32 - b))
    };
    Mix['hex_md5'] = hex_md5;
})(Mix);