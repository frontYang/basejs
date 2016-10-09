/**
 * 表单验证
 * @authors yangzhifang
 * @date    2016-10-09
 */

var _testHook = {
    //是否为空
    isEmpty: function(val){
        if(val == "" || val.length === 0){
            return false;
        }
        return true;
    },

    //称呼正则(2到8个英文或中文)
    isName: function(val){
        var reg = /^[\u4e00-\u9fa5a-zA-Z]{2,8}$/;
        if(!reg.test(val)){
            return false;
        }
        return true;
    },

    //手机正则
    isPhone: function(val){
        var reg = /^1[3|4|5|8][0-9]\d{2,8}$/;
        if(!reg.test(val)){
            return false;
        }
        return true;
    },

    //数字正则
    isNum: function(val){
        var reg = /^[0-9]*$/;
        if(!reg.test(val)){
            return false;
        }
        return true;
    }
}

// 待续。。


