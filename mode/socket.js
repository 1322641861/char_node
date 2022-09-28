module.exports = function(io) {
    let socketMap = {};
    let member = 0;
    let socketList = [];

    io.sockets.on('connection', (socket) => {

        socket.on("info", data => {
            socket.name = data.name;
            socketMap[socket.id] = socket.id;
            member++;
            let allData = Object.assign(data, {
                id: socket.id,
                tip: false
            });
            /// 用户信息
            // console.log(allData);
            socket.broadcast.emit('getInfo', allData, member)
            socket.emit('getInfo', allData)
            /// 所有用户的信息列表
            if (socketList.findIndex(x => x.id === socket.id) < 0) {
                socketList.push(allData);
            }
            socket.broadcast.emit('getUsersList', socketList)
            socket.emit('getUsersList', socketList)
        })
        
        socket.on('disconnecting', () => {
            if (socketMap.hasOwnProperty(socket.id)) {
                socketList.splice(socketList.findIndex(x => x.id === socket.id), 1);
                delete socketMap[socket.id];
                member--;
                socket.broadcast.emit('leaveRoom', socket.name, member, socketList)
                // socket.emit('leaveRoom', socket.name, member)
            }
        })

        socket.on('message', (msg) => {
            socket.broadcast.emit('getMsg', msg);
        })
        socket.on('priMessage', (msg) => {
            if (socketMap[msg.oid]) {
                /// 一对一: to(对方id)
                socket.to(msg.oid).emit('getPrivateMsg', msg) 
            }
        })

    })
}