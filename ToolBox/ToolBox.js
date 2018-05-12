
var authCodeSourceArray = [0, 1, 2, 3, 4, 5];
class ToolBox{
    //获取6位验证码
    getAuthCode(){
        //map 一次取出元素，floor，向下取整，randow 0~1
        authCodeSourceArray.map(function (x) {
            return Math.floor(Math.random() * 10);
        }).join('');
    }
}

