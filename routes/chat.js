const router = require('koa-router')()
const DataManager = require('../DataManager/DataManager')
const mongoDM = require('../DataManager/mongoDM')

router.prefix('/chat')

var chatView = 'chatRoom/chat'

router.get('/',async(ctx)=>{
    console.log("-------");
})

/**
 * 私聊
 */
router.get('/privateChat', async(ctx) => {
    //自己
    var self = ctx.request.body.self;
    //本
    var friend = ctx.request.body.friend;
    var onlineLIst = DataManager.getLineList();
    if(onlineLIst[self]!=undefined&&onlineLIst[friend]!=undefined){
        await ctx.render('chatRoom/privateChat')
    }
})

/**
 * 公聊
 */
router.get('/publicChat',async(ctx)=>{
    var allUsers = await mongoDM.query('user', {});
    var data = dealUserStatus(allUsers,DataManager.OnLineList);
    console.log(ctx.session.username)
    await ctx.render(chatView, {
        loginData: ctx.session.username,
        online:data
    });
})

module.exports = router;