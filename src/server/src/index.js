const http = require('http');
const cors = require('cors');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const fs = require('fs')

app.use('/', express.static('public'))

io.on('connection', (socket) => {

    socket.on('twitch-code-review-l',(user, file, line, message) => {
        console.log(user, file, line, message)
        socket.broadcast.emit('twitch-code-review', user, file, line, message);
    });


})

server.listen(666, () => {
    console.log("Reviewer RUNNING")
})
