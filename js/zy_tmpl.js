var zy_tmpl_count=function(dd)
{
	if(Object.prototype.toString.apply(dd)==="[object Array]")
	{
		return dd.length;
	}
	else
	{	
		var c=0;
		for(var i in dd)
			c++;
		return c;
	}
}	
var _f = function(d,c,k1,k2,l){
	var q = c.match(/(first:|last:)(\"|\'*)([^\"\']*)(\"|\'*)/);
	if(!q) return;
	if(q[1]==k1){
		if(q[2]=='\"'||q[2]=='\''){
			return q[3];
		}
		else
			return d[q[3]];
	}
	else if(q[1]==k2 && l>1)
		return "";
}
var t_f = function(t,d,i,l,cb,idx){
		if('sysNotice'!=Feed.page){//通知里面是需要html标签的
			for(key in d){
				if(d.hasOwnProperty(key)&&(typeof d[key]=="string")){
					d[key]=Tools.htmlEncode(d[key]);//转换js中的HTML特殊字符串
				}
			}
		}

		return t.replace( /\$\{([^\}]*)\}/g,function(m,c){
		if(c.match(/index:/)){
			return idx;
		}
		if(c.match(/cb:/) && cb){
			return cb(d,c.match(/cb:(.*)/));
		}
		if(i==0){
			var s=_f(d,c,"first:","last:",l);
			if(s) return s;
		}
		if(i==(l-1)){
			var s= _f(d,c,"last:","first:",l);
			if(s) return s;
		}
		var ar=c.split('.'),
			res=d,
			len=ar.length
		for(var i=0;i<len;i++){
			res=res[ar[i]];
		}
		return res;
	});
}
var zy_tmpl = function(t,dd,l,cb,scb){
	var r = "";
	{
		var index=0;
		for(var i in dd)
		{
			if(scb)
				scb(0,i,dd[i]);
			var rr=t_f(t,dd[i],index,l,cb);
			if(scb)
				scb(1,rr,dd[i]);
			r+=rr;
			index++;
		}
	}
	return r;	
}
var zy_tmpl_s = function(t,dd,cb,idx)
{
	return t_f(t,dd,-1,-1,cb,idx);
}