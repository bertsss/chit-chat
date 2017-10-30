var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('user connected', { id: socket.id });
    
    socket.on('new user', function(data){
        if(nicknames.indexOf(data) != -1){
            
        }
    });

    console.log(socket.id + "has connected");
    socket.on('chat message', function(msg){
        io.emit('chat message', msg)
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnected', { id: socket.id });
        console.log(socket.id + 'has disconnected');
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
