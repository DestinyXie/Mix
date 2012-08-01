var zy_json_opid=1000;
var zy_json_session=new Object;


(function(g, h) {
	var j = g.document, navigator = g.navigator, location = g.location;
	var k = (function() {
		var e = function(a, b) {
			return new e.fn.init(a, b, rootjQuery)
		}, _jQuery = g.jQuery, _$ = g.$, rootjQuery, quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, toString = Object.prototype.toString;
		e.fn = e.prototype = {
			constructor : e,
			init : function(a, b, c) {
				var d, elem, ret, doc;
				return this
			},
			selector : "",
			jquery : "1.6",
			length : 0,
			size : function() {
				return this.length
			},
			toArray : function() {
				return slice.call(this, 0)
			}
		};
		e.fn.init.prototype = e.fn;
		e.extend = e.fn.extend = function() {
			var a, name, src, copy, copyIsArray, clone, target = arguments[0]
					|| {}, i = 1, length = arguments.length, deep = false;
			if (typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				i = 2
			}
			if (typeof target !== "object" && !e.isFunction(target)) {
				target = {}
			}
			if (length === i) {
				target = this;
				--i
			}
			for (; i < length; i++) {
				if ((a = arguments[i]) != null) {
					for (name in a) {
						src = target[name];
						copy = a[name];
						if (target === copy) {
							continue
						}
						if (deep
								&& copy
								&& (e.isPlainObject(copy) || (copyIsArray = e
										.isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && e.isArray(src) ? src : []
							} else {
								clone = src && e.isPlainObject(src) ? src : {}
							}
							target[name] = e.extend(deep, clone, copy)
						} else if (copy !== h) {
							target[name] = copy
						}
					}
				}
			}
			return target
		};
		e.extend({
					noConflict : function(a) {
						if (g.$ === e) {
							g.$ = _$
						}
						if (a && g.jQuery === e) {
							g.jQuery = _jQuery
						}
						return e
					},
					isPlainObject : function(a) {
						if (!a || e.type(a) !== "object" || a.nodeType
								|| e.isWindow(a)) {
							return false
						}
						if (a.constructor
								&& !hasOwn.call(a, "constructor")
								&& !hasOwn.call(a.constructor.prototype,
										"isPrototypeOf")) {
							return false
						}
						var b;
						for (b in a) {
						}
						return b === h || hasOwn.call(a, b)
					},
					noop : function() {
					},
					guid : 1
				});
		rootjQuery = e(j);
		return e
	})();
	k.extend({
		ajaxJSONP : function(b) {
			var c = 'jsonp' + (++k.guid), script = j.createElement('script');
			g[c] = function(a) {
				b.success(a);
				delete g[c]
			};
			script.src = b.url.replace(/=\?/, '=' + c);
			j.getElementsByTagName("head")[0].appendChild(script)
		},
		ajaxSettings : {
			type : 'GET',
			beforeSend : k.noop,
			success : k.noop,
			error : k.noop,
			complete : k.noop,
			accepts : {
				script : 'text/javascript, application/javascript',
				json : 'application/json',
				xml : 'application/xml, text/xml',
				html : 'text/html',
				text : 'text/plain'
			},
			headers : []
		},
		ajax : function(b) {
			var c = k.extend({}, b);
			for (key in k.ajaxSettings)
				if (!c[key])
					c[key] = k.ajaxSettings[key];
			if (/=\?/.test(c.url))
				return k.ajaxJSONP(c);
			if (!c.url)
				c.url = g.location.toString();
			if (c.data && !c.contentType)
				c.contentType = 'application/x-www-form-urlencoded';
			// if (k.isPlainObject(c.data))
			// 	c.data = k.param(c.data);
			if (c.type.match(/get/i) && c.data) {
				var d = c.data;
				if (c.url.match(/\?.*=/)) {
					d = '&' + d
				} else if (d[0] != '?') {
					d = '?' + d
				}
				c.url += d
			}
			var f = c.accepts[c.dataType], xhr = new XMLHttpRequest();
			if (!!xhr.onprogress) {
				xhr.onprogress = function(a) {
					if (c.downCallback) {
						c.downCallback(xhr, a)
					} else {
						return function() {
						}
					}
				}
			}
			xhr.onreadystatechange = function() {
				if (c.readyCallback) {
					c.readyCallback(xhr);
					return
				}
				if (xhr.readyState == 4) {
					var a, error = false;
					if ((xhr.status >= 200 && xhr.status < 300)
							|| xhr.status == 0) {
						if (f == 'application/json') {
							try {
								a = JSON.parse(xhr.responseText)
							} catch (e) {
								error = e
							}
						} else
							a = xhr.responseText;
						if (error)
							c.error(xhr, 'parsererror', error);
						else
							c.success(a, 'success', xhr)
					} else {
						error = true;
						c.error(xhr, 'error')
					}
					c.complete(xhr, error ? 'error' : 'success')
				}
			};
			xhr.open(c.type, c.url, true);
			if (c.beforeSend(xhr, c) === false) {
				xhr.abort();
				return false
			}
			if (c.contentType)
				c.headers['Content-Type'] = c.contentType;
			for (name in c.headers)
				xhr.setRequestHeader(name, c.contentType);
			xhr.send(c.data);
			return xhr
		}
	});
	g.zy_$ = k;
})(window);