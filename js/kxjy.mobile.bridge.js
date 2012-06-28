/*手机接口调用*/
var Device={
    /*uexWindow接口*/
    confirm:function(msg,ok,cancel,labs,title){
        if(WIN["uexWindow"]){
            uexWindow.cbConfirm=function(opId,dataType,data){
                switch(data*1){
                    case 0:
                        if(typeof ok=="function")
                            ok();
                        break;
                    case 1:
                        if(typeof cancel=="function")
                            cancel();
                        break;
                }
            }

            uexWindow.confirm(title||"确认",msg,labs||['确认','取消']);
        }else{
            window.confirm(msg)?ok&&ok():cancel&&cancel();
        }
    },
    actionThree:function(title,msg,labArr,first,second,third){
        if(WIN["uexWindow"]){
            uexWindow.cbConfirm=function(opId,dataType,data){
                switch(data*1){
                    case 0:
                        if(typeof first=="function")
                            first();
                        break;
                    case 1:
                        if(typeof second=="function")
                            second();
                        break;
                    case 2:
                        if(typeof third=="function")
                            third();
                        break;
                }
            }

            uexWindow.confirm(title,msg,labArr);
        }
    },
    prompt:function(msg,ok,cancel,labs,def){
        if(WIN["uexWindow"]){
            uexWindow.cbPrompt=function(opId, dataType, data){
                var obj = eval('('+data+')');
                var num=obj.num,
                    val=obj.value;
                switch(num*1){
                    case 0:
                        ok&&ok(val);
                        break;
                    case 1:
                        cancel&&cancel(val);
                        break;
                }
            }
            uexWindow.prompt("",msg,def||"",labs||['确定','取消']);
        }else{
            var val=window.prompt(msg);
            if(typeof val=="string"){
                ok&&ok(val);
            }else{
                cancel&&cancel();
            }
        }
    },
    datePicker:function(node,okCb,errCb){
        uexControl.cbOpenDatePicker=function(opCode,dataType,data){
　　　　　　　　if(dataType==1){
　　　　　　　　　　var obj = eval('('+data+')');
                    var dataStr=obj.year+"-"+obj.month+"-"+obj.day;
                    okCb?okCb(dataStr):toast(dataStr);
　　　　　　　　}else{
                    errCb?errCb:toast('日期没有选择成功');
                }
　　　　}
        var defData=node.getAttribute('default').split("-");

        uexControl.openDatePicker (defData[0]||'1992',defData[1]||'12',defData[2]||'12');
    }
}