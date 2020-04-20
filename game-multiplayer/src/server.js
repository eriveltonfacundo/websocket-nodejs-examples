import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import createGame from './public/js/game.js';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('src/public'));

const game = createGame();

game.start();

game.subscribe((command) => {
    sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {
    const playerId = socket.id;

    game.addPlayer({ playerId });
    socket.emit('setup', game.state);

    socket.on('move-player', (command) => {
        command.type = 'move-player';
        command.playerId = playerId;
        game.movePlayer(command);
    });

    socket.on('disconnect', () => game.removePlayer({ playerId }));
});

server.listen(3000, () => {
    console.log('server listening on port: 3000');
});
