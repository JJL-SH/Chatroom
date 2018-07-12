var express = require('express');
var path = require('path');
var pug = require('pug');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./route/routes');
var crypto = require('crypto');
var Identicon = require('identicon.js');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

var users = {}

routes(app);
app.use(express.static('static'));

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
  socket.on('sendMessage', function(res) {
    let hash = crypto.createHash('md5');

    io.emit('sendMessageToClient', {
      userID: res.userID,
      msg: res.msg,
      hash: hash.update(res.userID).digest('hex')
    })
  })
})

http.listen(3000, function() {
  console.log('listening on *:3000');
})