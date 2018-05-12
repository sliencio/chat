const router = require('koa-router')()
const DataManager = require('../DataManager/DataManager')
const mongoDM = require('../DataManager/mongoDM')

router.prefix('/chat')

var chatView = 'chatRoom/chat'


/**
 * 公聊
 */
router.get('/publicChat', async (ctx) => {
    var username = ctx.session.username;
    console.log(username)
    var allUsers = await mongoDM.query('user', {});
    var data = dealUserStatus(allUsers, DataManager.OnLineList);
    
    await ctx.render(chatView, {
        userName: username,
        online: data
    });
})

function dealUserStatus(allUser, onLine) {
    for (var i = 0; i < allUser.length; i++) {
        var username = allUser[i]['userName'];
        if (onLine && onLine[username] != undefined) {
            allUser[i]['status'] = 1;
        } else {
            allUser[i]['status'] = 0;
        }
    }
    return allUser;
}



module.exports = router;