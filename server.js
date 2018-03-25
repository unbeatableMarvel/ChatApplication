var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
users = [];
connections = [];
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

/*app.use(express.static(__dirname + '/public'));*/
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

server.listen(process.env.PORT || 3000);
console.log('Server running.............. on port 3000');


app.get('/', function(req, res) {

    res.sendFile(__dirname + '/index.html');

});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    if(socket.username!=null){
      console.log("connected socket connected"+socket.username);
    }
    else
    {
      console.log("connected %s users",connections.length);
    }
    

    socket.on('disconnect', function(data) {
      
      users.splice(users.indexOf(socket.username),1);
      updateUsername();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: socket connected"+socket.username);
    });

    socket.on("send message",function(data){
      console.log("---------",data);
      io.sockets.emit('new message',{msg:data,user:socket.username});

    });

    socket.on('new user',function(data,callback){
      callback(true);
      socket.username=data;
      users.push(socket.username);
      updateUsername();

    });

function updateUsername(){

  io.sockets.emit('get users',users);
}

});

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});*/

/*io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});*/
