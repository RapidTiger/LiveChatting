/* socket\room_chat\app.js */

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('chat');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/chatRoom', (req, res) => {
    res.render('chatRoom',{'num' : req.query.num});
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });


    socket.on('leaveRoom', (num, name) => {
        socket.leave(num, () => {
            console.log(name + ' leave a ' + num);
            io.to(num).emit('leaveRoom', num, name);
        });
    });


    socket.on('joinRoom', (num, name) => {
        socket.join(num, () => {
            console.log(name + ' join a ' + num);
            io.to(num).emit('joinRoom', num, name);
        });
    });


    socket.on('chat message', (num, name, msg) => {
        io.to(num).emit('chat message', name, msg);
    });
});


http.listen(8002, () => {
    console.log('Connect at 8002');
});