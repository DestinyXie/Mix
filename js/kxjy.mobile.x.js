/* Ajax */
var X = function(options) {
	this.options = extend({
		varsEncode: true,
		method: 'post',
		evalScripts: false,
		timeOut: 15 /* timeout in seconds;*/
	}, options || {});
	return this.reset();
};

X.prototype = {
	reset: function() {
		clearTimeout(this.timer); 
		this.loading = false;
		this.data = '';
		this.vars = {};
		return this;
	},
	setVar: function(key, value) {
		var o = {};
		o[key] = value;
		this.setVars(o);
	},
	setVars: function(vars) {
		var tempVars = this.vars, t, k, v, i;
		if (vars) {
			for (k in vars) {
				v = vars[k];
				if (v === null) continue;
				if (v instanceof Array) {
					t = [];
					for (i = 0; i < v.length ; i++) {
						t.push(this.options.varsEncode ? encodeURIComponent(v[i]) : v[i]);
					}
				} else {
					t = this.options.varsEncode ? encodeURIComponent(v) : v;
				}
				
				tempVars[encodeURIComponent(k.trim())] = t;
				
			}
		}
		this.vars = tempVars;
		return this;
	},
	getData: function() {
		var temp = [], v, i;
		for (k in this.vars) {
			if (k && k !== 'undefined') {
				v = this.vars[k];
				if (v instanceof Array) {
					var i, l = v.length;
					for (i = l; i--;) {
						temp.push(k + '=' + v[i]);
					}
				} else {
					temp.push(k + '=' + v);
				}
			} 
		}
		this.data = temp.join('&');
		return this;
	},
	send: function(url) {
		if (this.loading) return;
		var options = this.options,
			xmlhttp = this.xmlhttp || (window.XMLHttpRequest ? new XMLHttpRequest() : false);
		if (xmlhttp) {
			this.xmlhttp = xmlhttp;
			this.loading = true;
			this.onStart();
			var self = this;
			xmlhttp.onreadystatechange = function() {
				if (4 === this.readyState && 0 !== this.status) {
					if(!self.timer) return;
					self.response = this.responseText;
					if (options.evalScripts) self.evalScripts(self.response);
					self.reset().onLoad();
					xmlhttp.onreadystatechange = function() {};
					xmlhttp = null;
					self = null;
				}
			};
		} else {
			this.onFail();
			return this;
		}
		
		this.getData();
		if (options.method.toLowerCase() == 'get') {
			xmlhttp.open('get', url + '?' + this.data, true);
		} else {
			xmlhttp.open('post', url, true);
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xmlhttp.send(this.data);
		this.timer = setTimeout(this._onTimeout.apply(this), options.timeOut * 1000); 
		return this;
	},
	abort: function() {
		if (this.loading) {
			this.xmlhttp.abort();
			this.reset();
			this.loading = false;
		}
	},
	evalScripts: function(text) {
		if (scripts = text.match(/<script[^>]*?>[\S\s]*?<\/script>/g)) {
			var i, l = scripts.length;
			for (i = 0; i < l; i++) {
				try{
					eval(scripts[i].replace(/^<script[^>]*?>/, '').replace(/<\/script>$/, ''));
				} catch(e) {}
			}
		}
	},
	/* 原生的JSON.parse更高效 */
	_parseJSON: JSON.parse || function() {
		return eval('(' + this.response + ')');
	},
	getJSON: function() {
		if (this.response !== '') {
			try{
				return this._parseJSON(this.response);
			} catch(e) {};
		}
		return false;
	},
	getForm: function (form) {
		var items = form.elements, item, checkBoxs = {}, arrayInput = {}, l = items.length, i;
		for (var i = 0; i < l; i++) {
			item = items[i], name = item.name, value = item.value;
			if(/INPUT|SELECT|BUTTON|TEXTAREA/i.test(item.nodeName)) {
				if (name) {
					if (/SELECT/i.test(item.nodeName)) {
						var opt, index = item.selectedIndex;
						if (index >= 0) {
							opt = item.options[index];
							this.setVar(name, opt.value);
						}
					} else if(/RADIO|CHECKBOX/i.test(item.type)) {
						if (item.checked) {
							if (/CHECKBOX/i.test(item.type)) {
								if (checkBoxs[name]) {
									checkBoxs[name].push(value);
								} else {
									checkBoxs[name] = [value];
								}
							} else {
								this.setVar(name, value);
							}
						}
					} else {
						if (/\[\]$/i.test(name)) {
							if (arrayInput[name]) {
								arrayInput[name].push(value);
							} else {
								arrayInput[name] = [value];
							}
						} else {
							this.setVar(name, value);
						}
					}
				}
			}
		}
		for (item in checkBoxs) {
			this.setVar(item, checkBoxs[item]);
		}
		for (item in arrayInput) {
			this.setVar(item, arrayInput[item]);
		}
		return this;
	},
	_onTimeout: function() {
		this.abort();
		this.onTimeout();
	},
	onStart: function() {},
	onLoad: function() {},
	onFail: function() {},
	onTimeout: function() {}
};
