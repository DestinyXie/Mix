/* Ajax */ ;
Mix.x = function(options) {
	var that = this;
	that.options = {
		varsEncode: false,
		method: 'get',
		dataType: 'json',
		timeOut: 15 /* timeout in seconds;*/
	};
	extend(that.options, options || {});
	return that.reset();
};

Mix.x.jsonpIdx = 0;
Mix.x.prototype = {
	reset: function() {
		clearTimeout(this.timer);
		this.loading = false;
		this.data = '';
		return this;
	},
	ajaxJSONP: function(url, data) {
		var that = this,
			jsonp = 'Mix_x_jsonp' + Mix.x.jsonpIdx++,
			script = DOM.create("script");
		WIN[jsonp] = function(a) {
			that.response = a;
			delete WIN[jsonp];
			that.reset().onLoad();
			HEAD.removeChild(script);
		};
		url = url.replace(/=\?/, '=' + jsonp) + ( !! data ? '&' + data : '');
		script.src = url;
		script.onerror = function(e) {
			that.onFail();
		}
		HEAD.appendChild(script);
	},
	send: function(url, data) {
		var that = this;
		if (/=\?/.test(url)) {
			return that.ajaxJSONP(url, data);
		}
		if (that.loading) return;
		var options = that.options,
			xmlhttp = that.xmlhttp || (WIN.XMLHttpRequest ? new XMLHttpRequest() : false);
		if (xmlhttp) {
			that.xmlhttp = xmlhttp;
			that.loading = true;
			that.onStart();
			xmlhttp.onreadystatechange = function() {
				if (4 === this.readyState && 0 !== this.status) {
					if (!that.timer) return;
					var resp = this.responseText;
					if ('json' == options.dataType) {
						that.response = JSON.parse(resp);
					} else {
						that.response = resp;
					}
					that.reset().onLoad();
					xmlhttp.onreadystatechange = function() {};
					xmlhttp = null;
					that = null;
				}
			};
		} else {
			that.onFail();
			return that;
		}

		if (options.method.toLowerCase() == 'get') {
			if (data) {
				if (url.match(/\?.*=/)) {
					data = '&' + data;
				} else if (data[0] != '?') {
					data = '?' + data;
				}
			} else {
				data = "";
			}

			url += data;
			xmlhttp.open('get', url, true);
			xmlhttp.send();
		} else {
			xmlhttp.open('post', url, true);
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlhttp.send(data);
		}

		that.timer = setTimeout(
			function() {
				that._onTimeout.apply(that)
			}, options.timeOut * 1000);
		return that;
	},
	abort: function() {
		var that = this;
		if (that.loading) {
			that.xmlhttp.abort();
			that.reset();
			that.loading = false;
		}
	},
	_onTimeout: function() {
		var that = this;
		that.abort();
		that.onTimeout();
	},
	onStart: function() {},
	onLoad: function() {},
	onFail: function() {},
	onTimeout: function() {}
};