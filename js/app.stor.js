define(['action'], function(UserAction) {
    /*缓存资料管理*/
    var StorMgr = {
        myInfo: null,
        destroy: function() {
            StorMgr.myInfo = null;
        },
        getMyInfo: function(force, cb) {
            var that = this,
                url = StorMgr.siteUrl + '/user/info?ajax=1&callback=?';

            if (!force && that.myInfo) {
                cb && cb(that.myInfo);
                return;
            } else if (that.myInfo) {
                cb && cb(that.myInfo);
            }

            function load(data) {
                that.myInfo = data;
                cb && cb(data);
            }
            UserAction.sendAction(url, null, null, load);
        }
    };
    return StorMgr;
});