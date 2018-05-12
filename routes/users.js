const router = require('koa-router')()
const mongoDM = require('../DataManager/mongoDM')
const viewData = require('../DataManager/loadAllViews')
const DataManager = require('../DataManager/DataManager')

router.prefix('/users')

var loginView = 'users/login'
var chatView = 'chatRoom/chat'

/**
 * 注册
 */
router.post('/register', async (ctx) => {
    //名字
    var userName = ctx.request.body.userName;
    //姓氏
    var phoneNum = ctx.request.body.phoneNum;
    var psw = ctx.request.body.password;

    var phoneReg = /^1[0-9]{10}/;
    var nameReg = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!phoneReg.test(phoneNum) || !nameReg.test(userName)) {
        await ctx.render('login', {
            registered: false
        });
        return;
    }

    //判断用户名是否存在，手机号是否已经注册。如果存在，就不能注册
    var ret = await mongoDM.query('user', {
        phoneNum: phoneNum
    });
    //手机已经注册
    if (ret.length > 0) {
        //用户名是否已经重复
        var ret = await mongoDM.query('user', {
            userName: userName
        });
        if (ret.length > 0) {
            await ctx.render('login', {
                registered: false
            });
            return;
        }
    }

    //进行插入数据
    var ret = await mongoDM.insert('user', {
        phoneNum: phoneNum,
        password: psw,
        userName: userName
    });
    //注册成功，进入登录界面
    if (ret.result.ok == 1) {
        await ctx.render(loginView, {
            registered: true
        });
    }
});

//登录
router.post('/login', async (ctx) => {

    var name = ctx.request.body.uname;
    var psw = ctx.request.body.password;
    if (!name && !psw) {
        return;
    }

    var passAuth = false;
    //进行查询数据库,判断用户是否存在
    var ret = await mongoDM.query('user', {
        phoneNum: name,
        password: psw
    });
    //登录成功
    if (ret.length > 0) {
        // 进入聊室天 第二个参数可以用来更新数据
        passAuth = true;
    }
    //登录不成功
    else {
        var ret = await mongoDM.query('user', {
            userName: name,
            password: psw
        });
        //通过验证
        if (ret.length > 0) {
            passAuth = true;
        }
        //未通过验证
        else {
            await ctx.render(loginView);
            return;
        }
    }

    //进入聊天室
    if (passAuth) {
        ctx.session.username = name;
        ctx.redirect('/chat/publicChat')
    }
});



//登录
router.get('/', async (ctx) => {
    await ctx.render(loginView);
});
router.get('/:viewName', async (ctx) => {
    ctx.body = viewData.get(ctx.params.viewName);
})


module.exports = router;