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
        }
        usersAll[name] = name;
        socket.emit('userAdded', name);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});