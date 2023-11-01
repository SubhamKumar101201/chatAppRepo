const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    socketsConnected.add(socket.id);
    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message',data);
    })

}

app.use(express.static(path.resolve('./public')));

app.get("/", (req, res) => {
    return res.sendFile('/public/index.html');
});

server.listen(6969, () => console.log('server is running on port http://localhost:6969'));