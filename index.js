var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){    
    socket.on('new user', function(data){
        if(nicknames.indexOf(data) != -1){
            socket.emit('new user', false);
        } else {
            socket.emit('new user', true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
            socket.broadcast.emit('user connected', { id: socket.nickname });
            console.log(socket.nickname + " has connected");
        }
    });

    socket.on('chat message', function(data){
        io.emit('chat message', {msg: data, nick: socket.nickname});
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnected', { id: socket.nickname });
        console.log(socket.nickname + 'has disconnected');
        
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });

    function updateNicknames(){
        io.sockets.emit('usernames', nicknames);
    }

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
