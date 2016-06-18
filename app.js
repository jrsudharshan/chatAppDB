//Server Side
var express = require('express'),
  db = require('./db'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = 3000,
  nicknames = [],                   //to store names
  messages = [],                    //to store messages
  sockets = [];                    
  
server.listen(port,function(){
  console.log("Server up and running");
  console.log("Server listening at port %d",port)
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/tchat.html');
});

var nsp = io.of('/my-namespace');

nsp.on('connection', function(socket){
  socket.on('new user', function(userName, callback){
    socket.name = socket.id.split('#')[0];
	socket.nickname = userName;
    if(nicknames.indexOf(userName) === -1){
      nicknames.push(userName);
      updateNicknames();
      socket.broadcast.emit('join',socket.nickname);
      db.getMessage(socket.name, function(err, messages){
        if(err){
          throw err;
        }
        else{
          if(messages){
            messages.forEach(function(message){
              socket.emit('new message', {msg: message.message, nick: userName});
            });
            callback(true);
          }
          else{
            callback(true);
          }
        }
      });
    }
    else{
      callback(false);
    }
  });
  
  function updateNicknames(){
    nsp.emit('usernames', nicknames);
  }

  socket.on('typing', function(data){
	 	socket.broadcast.emit('typing', socket.nickname);
	});

  socket.on('send message', function(data){
    db.saveToDb(socket.name, socket.nickname, data, function(err){
      if(err){
        throw err;
      }
      else{
        nsp.emit('new message', {msg: data, nick: socket.nickname});
      }
    });
  });
  
  socket.on('disconnect', function(data){
    if(!socket.nickname) return;                 //when user did not enter name and quit 
    console.log(socket.nickname + " disconnected.");
    io.sockets.emit('leave',socket.nickname);
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    updateNicknames();

  });
});