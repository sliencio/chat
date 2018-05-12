var DataManager = require('../DataManager/DataManager')

class chatRoom {
    startServer(io) {
        var clientMap = {};
        io.on('connection', (socket) => {
            socket.on('join', (username) => {
                socket.userName = username;
                console.log(username + "进入房间");
                if (!username || clientMap[username]) {
                    return;
                }
                clientMap[username] = socket;
                DataManager.setLineList(clientMap)
                // 把消息发送给其他人
                io.emit('connections', {
                    numConnections: Object.getOwnPropertyNames(clientMap).length
                });
                console.log(Object.getOwnPropertyNames(clientMap).length)
            });


            socket.on('disconnect', ctx => {
                console.log("disconnect");
                if (clientMap[socket.userName]) {
                    delete clientMap[socket.userName];
                    DataManager.setLineList(clientMap)
                }
                io.emit('connections', {
                    numConnections: Object.getOwnPropertyNames(clientMap).length
                });
                console.log(Object.getOwnPropertyNames(clientMap).length)
            });

            socket.on('message', (mes) => {
                // 把消息发送给其他人
                io.emit('message', socket.userName + ": " + mes);
            });

            // 私聊
            socket.on('privateMes', (from, to, mes) => {
                if (clientMap[from] && clientMap[to]) {
                    clientMap[from].emit('message', mes);
                    clientMap[to].emit('message', socket.userName + ": " + mes)
                }
            });

            socket.on('numConnections', (ctx) => {
                console.log(`Number of connections: ${ io.engine.clentsCount }`);
            });
        });
    }
}

module.exports = new chatRoom();

