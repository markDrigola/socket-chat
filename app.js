var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

var usersAll = [];

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('obtained message', msg);
    });

    socket.on('userName', function (name) {
        if(usersAll[name]) {
            socket.emit('user is byzi', name);
            return;
        } else {
            var newUSerId = socket.id;
            usersAll[name] = socket.id;
            io.emit('userAdded', name, newUSerId);
            socket.emit('userNotForm', true);
        }
    });

    socket.on('im print', function () {
        socket.broadcast.emit('img yes', true)
    });

    socket.on('im not print', function () {
        socket.broadcast.emit('img no', true)
    });

    socket.on('disconnect', function(){
        var thisExitUserID = socket.id;
        for(var key in usersAll) {
            if(thisExitUserID === usersAll[key]) {
                io.emit('exitUser', usersAll[key]);
                delete usersAll[key];
            }
        }
        console.log('user disconnected');
    });

    var arrTmp = [];
    for(var key in usersAll) {
        arrTmp.push(key);
    }
    socket.emit('allUSer', arrTmp);
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});