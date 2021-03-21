/* socket\app1.js */
const app1 = require(`express`)();
const server = require(`http`).Server(app1);
const io = require(`socket.io`)(server);
app1.get(`/`, (req, res) => {
res.sendFile(__dirname + `/index.html`);
});
io.on(`connection`, (socket) => {
    console.log(`a user connected`);
    socket.on(`chat message`, (msg) => {
        io.emit(`chat message`, msg);
    });
    socket.on(`disconnect`, () => {
        console.log(`user disconnected`);
    });
});
server.listen(8001, () => {
    console.log(`Connected at 8001`);
});

app1.get(`/`, (req, res) => {
res.sendFile(__dirname + `index.html`);
});
// NameSpace 1번
const namespace1 = io.of(`/namespace1`);
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace1.on(`connection`, (socket) => {
    namespace1.emit(`news`, { hello: `Someone connected at namespace1` });
});
// NameSpace 2번
const namespace2 = io.of(`/namespace2`);
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace2.on(`connection`, (socket) => {
    namespace2.emit(`news`, { hello: `Someone connected at Namespace2` });
});