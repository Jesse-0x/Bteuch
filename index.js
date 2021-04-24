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


const bodyParser = require('body-parser')
const winston = require('winston')
const moment = require('moment')
const port = 4000
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'http.log' }),
        new winston.transports.Console()
    ]
});

app.use(bodyParser.json({
    type: 'application/json'
}))
app.use(bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded'
}))
app.use(bodyParser.text({
    type: '*/*'
}))
app.get('*', reqHandler)
app.post('*', reqHandler)
app.put('*', reqHandler)
app.delete('*', reqHandler)
app.listen(port, () => console.log(`listening & logging on port ${port}`))

function reqHandler(req, res) {
    logger.info(formatReq(req))
    res.send('OK')
}

function formatReq(req) {
    let logStr = getStandardDateTime()
    logStr += `\n\t${req.method} ${req.path}`
    logStr += `\n\tQuery:`
    logStr += `${toString(req.query, 2)}`
    logStr += `\n\tHeader:`
    logStr += `${toString(req.headers, 2)}`
    if (req.method !== 'GET') {
        logStr += `\n\tBody:`
        if (req.body instanceof Object) {
            logStr += `${toString(req.body, 2)}`
        } else {
            logStr += `\n\t\t${req.body}`
        }
    }
    return logStr
}

function getStandardDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function toString(obj, tabCount = 2) {
    let str = ''
    let item
    for (let key in obj) {
        item = obj[key]
        str += '\n'
        for (let i = 0; i < tabCount; i++) {
            str += '\t'
        }
        str += `${key}:`
        if (item instanceof Object) {
            str += toString(item, tabCount + 1)
        } else {
            str += ` ${item}`
        }
    }
    return str
}