const router = require('koa-router')();
const mongoDM = require('../DataManager/mongoDM')
router.prefix('/admin')

var homeView = 'admin/admin'
var addView = 'admin/add'
var editView = 'admin/edit'
var loginView = 'admin/adminLogin'
const adminCollection = 'admin'

/**
 * 首页
 */
router.get('/', async (ctx) => {
    var username = ctx.cookies.get('username');
    var pwd = ctx.cookies.get('password');


    //进行查询数据库
    var ret = await mongoDM.query(adminCollection, {
        userName: username,
        password: pwd
    });
    if (ret.length > 0) {
        ctx.session.isLogin = true;
        var adminList = await mongoDM.query(adminCollection, {});
        //第二个参数可以用来更新数据
        await ctx.render(homeView, {
            list: adminList
        });
    } else {
        await ctx.render(loginView);
    }
});

/**
 * 登录
 */
router.post('/login', async (ctx) => {
    var body = ctx.request.body;
    var name = body.username;
    var password = body.password;

    var ret = await mongoDM.query(adminCollection, {
        userName: name,
        password: password
    });
    //可以进行登录
    if (ret.length > 0) {
        ctx.cookies.set('username', name);
        ctx.cookies.set('password', password);
        ctx.session.isLogin = true;
        ctx.redirect('/admin');
    } else {
        await ctx.render(loginView)
    }
})

/**
 * 添加用户编辑界面
 */
router.get('/add', async (ctx) => {
    if (!isLogin(ctx)) {
        await ctx.render(loginView)
        return;
    }
    await ctx.render(addView);
});

/**
 * 确认添加
 */
router.post('/doAdd', async (ctx) => {
    var body = ctx.request.body;
    var userName = body.username
    var password = body.password

    //用户是否已经存在
    var ret = await mongoDM.query(adminCollection, {
        userName: userName
    });
    if (ret.length > 0) {
        return;
    }
    //插入数据组织
    var insertData = {
        userName: userName,
        password: password
    }
    await mongoDM.insert(adminCollection, insertData);
    ctx.redirect('/admin')
});


/**
 * 添加用户编辑界面
 */
router.get('/edit', async (ctx) => {
    if (!isLogin(ctx)) {
        await ctx.render(loginView)
        return;
    }
    var id = ctx.query.id;
    var ret = await mongoDM.query(adminCollection, {
        '_id': mongoDM.getObjectID(id)
    });
    await ctx.render(editView, {
        list: ret[0]
    });
});

/**
 * 确认添加
 */
router.post('/doEdit', async (ctx) => {
    var body = ctx.request.body;
    var id = body.id;
    var oldData = {
        '_id': mongoDM.getObjectID(id)
    }
    var updateData = {
        userName: body.username,
        password: body.password
    }
    await mongoDM.update(adminCollection, oldData, updateData, false);
    await ctx.render(loginView)
});

/**
 * 删除操作
 */
router.get('/del', async (ctx) => {
    if (!isLogin(ctx)) {
        await ctx.render(loginView)
        return;
    }
    var id = ctx.query.id;
    var delData = {
        '_id': mongoDM.getObjectID(id)
    }
    var ret = await mongoDM.delete(adminCollection, delData);
    ctx.redirect('/admin')
})

/**
 * 判断是否已经登录
 * @param ctx
 * @returns {*}
 */

function isLogin(ctx) {
    return ctx.session.isLogin;
}


module.exports = router;