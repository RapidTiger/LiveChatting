const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require("fs");
const mysql = require('mysql');
const dbconfig = require('../mysql/database');
const connection = mysql.createConnection(dbconfig);

app.set('/views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('typing', (num,userid,username) => {
        io.to(num).emit("typing",userid,username);
    });

    socket.on('stopTyping', (num,userid,username) => {
        io.to(num).emit("stopTyping",userid,username);
    });

    socket.on('joinRoom', (num, id, name) => {
        socket.join(num, () => {
        });
        console.log(name + ' join a ' + num);
    });

    socket.on('chat message', (num, id, name, type, msg) => {
        console.log("message");
        const sql = `INSERT INTO messages (room,id,name,type,message,BOARD_YMD) VALUE(${num},'${id}','${name}','${type}','${msg}',DEFAULT)`;
        console.log(sql);
        connection.query(sql, (error, result) => {
            if (error) throw error;
        });
        io.to(num).emit('chat message',num, id, name, type, msg);
        if (type != 'sys'){
            socket.broadcast.emit('new',num,id,name,type,msg);
        }
    });
});

http.listen(8091, () => {
    console.log("Express server has started on port 8091")
})

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

const chatRouter = require('../router/chat')(app, fs);
const friendRouter = require('../router/friend')(app, fs);
const memberRouter = require('../router/member')(app, fs);