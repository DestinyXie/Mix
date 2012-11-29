/**UI工具类**/
;Mix.ui={};

/*tips提示类*/
Mix.ui.tips={
    destroy:function(){
        var that=this;

        if(that.hasTip){
            that.container.removeChild(that.tipDom);
            delete that.hasTip;
            delete that.container;
            delete that.tipDom;
        }
        that.reset();
    },
    reset:function(){
        var that=this;
        that.option={
            msg:'',
            contSel:'body',
            tipH:0,
            hideT:5000
        };
        if(that.timer){
            clearTimeout(that.timer);
            delete that.timer;
        }
    },
    show:function(cusOpt){
        var that=this;
        that.reset();
        !!cusOpt&&extend(that.option,cusOpt);

        if(!that.option.msg){
            return;
        }

        if(!that.hasTip){
            that.tipDom=DOM.create('div',{className:'tipsShow'});
            that.container=$(that.option.contSel)||BODY;
            that.container.appendChild(that.tipDom);
            that.hasTip=true;
            DOM.addEvent(that.tipDom,CLICK_EV,function(){that.hide();});
        }
        that.tipDom.innerHTML=that.option.msg;
        that.tipDom.style.display="block";
        that.option.tipH=that.tipDom.offsetHeight;//intresting set
        
        setTimeout(function(){that.tipDom.style.bottom="0px";},0);
        if (that.option.hideT) {
            that.timer=setTimeout(function(){that.hide();},that.option.hideT);
        }
    },
    hide:function(){
        var that=this;
        try{
            that.tipDom.style.bottom="-"+that.option.tipH+"px";
            that.reset();
            that.timer=setTimeout(function(){
                delete that.timer;
                that.tipDom.style.display="none";
            },600);
        }catch(e){
            Mix.base.logErr(e,'Mix.ui.tips.hide');
        }
    }
}


/*背景遮罩*/
Mix.ui.mask=function(opts){
    this.show(opts);
    return this;
}

Mix.ui.mask.prototype={
    /*option{cont}*/
    show:function(){
        var that=this,
            option={//default config
                cont:'body',
                maskClickCb:null//点击背景遮罩方法
            };
        if(arguments.length>0){
            extend(option,arguments[0]);
        }

        that.container=$(option.cont),
        that.maskDom=DOM.create('div',{className:'pageMask'});
        that.container.appendChild(that.maskDom);

        if(option.maskClickCb){
            DOM.addEvent(that.maskDom,CLICK_EV,option.maskClickCb);
        }
    },
    hide:function(){
        var that=this;
        that.container.removeChild(that.maskDom);
        delete that.maskDom;
        delete that.container;
    }
}

/*@private所有弹出层的公共类*/
Mix.ui.popLayer={
    className:'popLayer',//当前UI工具类名
    domStr:['<div class="">',
            '</div>'],
    reset:function(){
        var that=this;
        that.option={
            domId:'layerSel',//弹出层DOM id
            domCls:'layerSelWrap',//弹出层DOM class
            title:false,//是否有标题
            hasConfirm:false,//是否有确认按钮
            useMask:true,//是否显示背景遮罩
            clickMaskHide:true,//是否点击背景遮罩隐藏
            canScroll:false,//弹出层内容是否可以滚动
            contSel:'body',//没有遮罩时，弹出层显示的容器选择器
            onShow:null,//params:this{object}
            hideEnd:null//params:void
        }
        delete that.layerDom;
        delete that.container;
        if(that.scroller){
            that.scroller.destroy();
            delete that.scroller;
        }
        that.subReset&&that.subReset();//执行子类的reset方法
    },
    show:function(cusOpt){
        var that=this,
            domStrArr=that.domStr.clone();
        that.reset();

        !!cusOpt&&extend(that.option,cusOpt);

        that.preShow&&that.preShow();//执行子类的preShow方法
        
        if($("#"+that.option.domId)){
            $("#"+that.option.domId).parentNode.removeChild($("#"+that.option.domId));
            that.option.useMask&&that.mask.hide();
            that.option.hideEnd&&that.option.hideEnd.call(null);
        }
        if(that.option.title){
            domStrArr.push('<h3 class="pop_title">',
                that.option.title,
            '</h3>');
        }
        if('popLayer'!=that.className&&that.option.hasConfirm){
            domStrArr.push('<div class="pop_confirm clearfix">',
                '<a class="confirm" _click="Mix.ui.'+that.className+'.confirm()">确认</a>',
                '<a class="cancel" _click="Mix.ui.'+that.className+'.cancel()">取消</a>',
            '</div>');
        }

        that.option.onShow&&that.option.onShow.call(null,that);
        that.layerDom=DOM.create('div',{id:that.option.domId,className:that.option.domCls});
        DOM.addClass(that.layerDom,'pop_layer');//公用类
        that.layerDom.innerHTML=domStrArr.join('');

        if(that.option.useMask){
            var maskOpt={};
            if(that.option.clickMaskHide){
                maskOpt={maskClickCb:function(ev){
                    if(ev.target==that.mask.maskDom){
                        that.hide();
                        that.option.onCancel&&that.option.onCancel();
                    }
                }}
            }
            that.mask=new Mix.ui.mask(maskOpt);
            that.container=that.mask.maskDom;

        }else{
            that.container=$(that.option.contSel);
        }

        that.layerDom.style.display='none';//减少repaint/reflow

        that.container.appendChild(that.layerDom);

        that.subShow&&that.subShow();//执行子类的show方法
        
        that.layerDom.style.display='block';

        var scrollOpt={vScrollbar:true};
        if(that.option.title){
            var offsetTop=$('.pop_title',that.layerDom).offsetHeight;
            scrollOpt.topOffset=-offsetTop;
            $('div',that.layerDom).style.paddingTop=offsetTop+"px";
        }


        if(that.option.canScroll){
            that.scroller=new Mix.scroll(that.option.domId,scrollOpt);
        }
    },
    hide:function(){
        var that=this;
        that.container.removeChild(that.layerDom);
        that.option.useMask&&that.mask.hide();
        that.option.hideEnd&&that.option.hideEnd.call(null);
        that.subHide&&that.subHide();//执行子类的hide方法
    }
}

/*菜单类*/
Mix.ui.menu=extend({},Mix.ui.popLayer,{
    className:'menu',
    domStr:['<div class="">',
            '</div>'],
    subReset:function(){
        var that=this,
            option={
                domId:'menuSel',//选择框DOM id
                domCls:'menuLayer',//选择框DOM class
                pos:'bottom',//菜单的位置(bottom,middle,top)
                useMask:true,
                items:[],//菜单项
                direct:'horizon'//菜单项排列方向horizon,vertical
            }
        delete that.ancEl;
        extend(that.option,option);
    },
    preShow:function(){
        if($('#selectSel')){//如果有选择框在页面上，弹出其它框前先去掉选择框
            Mix.ui.select.hide();
        }
    },
    subShow:function(){
        var that=this,
            opts=that.option,
            itemsStr=[];
        if(opts.items.length<1){
            return;
        }

        $.each(that.option.items,function(item,idx){
            itemsStr.unshift('<i _click="Mix.ui.menu.select(this,'+idx+')">'+item+'</i>');
        });
        $('div',that.layerDom).innerHTML=itemsStr.join('');

        that.setSizePos();
    },
    setSizePos:function(){
        try{
            var that=this,
                opts=that.option,
                vertiDire=('vertical'==that.option.direct),
                itemWidth,
                contW=DOM.getSize(that.container)[0],
                contH=DOM.getSize(that.container)[1],
                layerDom=that.layerDom,
                itemsDom=$$('i',that.layerDom),
                itemLen=opts.items.length,
                //相对中间的那个选项在宽度无法均分时设置其宽度相对最大
                midItemIdx=Math.ceil(itemLen/2),
                perItemW;

            DOM.addClass(that.layerDom,opts['pos']);
            if(vertiDire){
                DOM.addClass(that.layerDom,'vertiDirect');
            }

            if(!vertiDire){
                perItemW=Math.floor(contW/itemLen);
                $.each(itemsDom,function(item,idx){
                    item.style.width=perItemW+"px";
                });
                itemsDom[midItemIdx].style.width=(contW-perItemW*(itemLen-1))+"px";
            }

            layerDom.style.display="block";

            if($('div',layerDom).offsetHeight>layerDom.offsetHeight){
                layerDom.style.height=contH+"px";
                that.option.canScroll=true;
            }
        }catch(e){
            Mix.base.logErr(e,'Mix.ui.menu.setSizePos');
        }
    },
    select:function(item,idx){
        var that=this;
        that.hide();
        that.option.onSelect&&that.option.onSelect(idx);
    }
});

/*地区选择(extend Mix.ui.popLayer)*/
Mix.ui.region=extend({},Mix.ui.popLayer,{
    className:'region',
    domStr:['<div class="selectWrap clearfix">',
            '<label class="provSel" _click="Mix.ui.region.chooseProv()">',
            '</label>',
            '<label class="citySel" _click="Mix.ui.region.chooseCity()">',
            '</label>',
            '</div>'],
    subReset:function(){//重置地区选择对象和option值
        var that=this,
            option={
                prov:"",//省份
                city:"",//城市
                domId:'regionSel',//选择框DOM id
                domCls:'regionLayer',//选择框DOM class
                hasConfirm:true,
                provProm:'选择省份',//省份选择提示
                cityProm:'选择城市',//城市选择提示
                clickMaskHide:false,
                onConfirm:null,//params:option.prov{string},option.city{string}
                onCancel:null//params:this{object}
            }
        extend(that.option,option);
        if($("#selectSel")){
            Mix.ui.select.hide();
        }
        delete that.provSel;
        delete that.citySel;
    },
    subShow:function(){
        var that=this;
        
        that.provSel=$('.provSel',that.layerDom);
        that.citySel=$('.citySel',that.layerDom);
        that.provSel.innerHTML=that.option.prov||that.option.provProm;
        that.citySel.innerHTML=that.option.city||that.option.cityProm;
    },
    chooseProv:function() {
        var that=this;
        function checkProv(selOpts){
            that.provSel.innerHTML=selOpts[0];
            that.citySel.innerHTML=that.option.cityProm;
            if(that.option.provProm==selOpts[0]){
                that.option.prov="";
            }else{
                that.option.prov=selOpts[0];
            }

            that.option.city="";
        }
        Mix.ui.select.show({
            useMask:false,
            options:Mix.regions.provinces,
            defOptions:[that.option.prov||that.option.provProm],
            onConfirm:checkProv,
            onShow:function(UIselect){
                Device.backFunc.unshift(function(){UIselect.hide();});
            },
            hideEnd:function(UIselect){
                Device.backFunc.shift(0);
                if(Device.backFunc.length<=0){
                    Device.backFunc=[function(){ViewMgr.back();}];
                }
            }
        });
    },
    chooseCity:function() {
        var that=this;
        function checkCity(selOpts){
            that.citySel.innerHTML=selOpts[0];
            if(that.option.cityProm==selOpts[0]){
                that.option.city="";
            }else{
                that.option.city=selOpts[0];
            }
        }
        if(!that.option.prov){
            toast("需先选择省份");
            return;
        }
        Mix.ui.select.show({
            useMask:false,
            options:Mix.regions.getCity(that.option.prov)||[],
            defOptions:[that.option.city||that.option.cityProm],
            onConfirm:checkCity,
            onShow:function(UIselect){
                Device.backFunc.unshift(function(){UIselect.hide();});
            },
            hideEnd:function(UIselect){
                Device.backFunc.shift(0);
                if(Device.backFunc.length<=0){
                    Device.backFunc=[function(){ViewMgr.back();}];
                }
            }
        });
    },
    confirm:function(){
        var that=this;
        that.hide();
        that.option.onConfirm&&that.option.onConfirm(that.option.prov,that.option.city);
    },
    cancel:function(){
        var that=this;
        that.hide();
        that.option.onCancel&&that.option.onCancel();
    }
});

/*单选、多选框(extend Mix.ui.popLayer)*/
Mix.ui.select=extend({},Mix.ui.popLayer,{
    className:'select',
    domStr:['<div><ul class="optWrap"></ul></div>'],
    subReset:function(){
        var that=this,
            option={
            domId:'selectSel',//选择框DOM id
            domCls:'selectLayer',//选择框DOM class
            hasConfirm:false,
            options:[],//选项集合
            defOptions:[],//默认选项集合
            selOptions:[],//选中项集合
            multi:false,//是否为多选
            canScroll:true//可以滚动
        }
        extend(that.option,option);
    },
    preShow:function(){
        if(this.option.multi){
            this.option.hasConfirm=true;
        }
    },
    subShow:function(){
        var that=this,
            optStr=[];
        if(that.option.options.length===0){
            toast('没有可供选择的项目');
            return;
        }
        if(that.option.multi){
            DOM.addClass(that.layerDom,"multiSelect");
        }
        if(that.option.defOptions){
            that.option.selOptions=that.option.defOptions;
        }
        $.each(that.option.options,function(opt,idx){
            var clsStr='';
            if(that.option.defOptions&&that.option.defOptions.has(opt)){
                clsStr=' class="selected"';
            }
            optStr.unshift('<li'+clsStr+' _click="Mix.ui.select.select(this,'+idx+')">'+opt+'</li>');
        });
        $('.optWrap',that.layerDom).innerHTML=optStr.join('');

        that.layerDom.style.display='block';

        if(that.layerDom.offsetHeight-BODYFS*.5>=$('ul',that.layerDom).offsetHeight){
            that.option.canScroll=false;
        }

    },
    select:function(item,idx){
        var that=this,
            selVal=that.option.options[idx];

        if(!that.option.multi){
            DOM.removeClass($$('.optWrap li',that.layerDom),'selected');
            this.option.selOptions=[selVal];
            that.confirm();
        }else{
            if(!this.option.selOptions.has(selVal)){
                DOM.addClass(item,'selected');
                this.option.selOptions.push(selVal);
            }else{
                DOM.removeClass(item,'selected');
                this.option.selOptions.remove(selVal);
            }
        }
    },
    confirm:function(){
        var that=this,
            check=that.option.onConfirm&&that.option.onConfirm(that.option.selOptions);
        
        (check||!that.option.multi)&&that.hide();
    },
    cancel:function(){
        var that=this;
        that.hide();
        that.option.onCancel&&that.option.onCancel();
    }
});

/*原生提示信息，默认2,3秒消失*/
function toast(s,t){
    if(Device.isMobi()){
        Device.toast(s,t);
    }else{
        Mix.ui.tips.show({
            msg:s,
            contSel:"#content",
            hideT:t*1000||3000
        });
    }
}