var http = require('http'),
    server = http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('hello world!Yea, I did it! ---Jesse');
        res.end();
    });

console.log('Bteuch server started');

server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html' 
    });
    res.write('<h1>hello world for my first server! --Jesse</h1>'); 
    res.end();
});

var express = require('express'), //import express
    app = express(),
    server = require('http').createServer(app);
app.use('/', express.static(__dirname + '/www')); //where is the stable as



var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[];
app.use('/', express.static(__dirname + '/www'));
server.listen(process.env.PORT || 80)


io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });

 socket.on('img', function(imgData) {
     socket.broadcast.emit('newImg', socket.nickname, imgData);
 });

});
