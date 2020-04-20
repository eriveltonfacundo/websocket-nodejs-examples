export default function createConnection(screen, game, socket, keyboardListener, renderScreen) {
    socket.on('connect', () => {
        const playerId = socket.id;

        renderScreen(screen, game, playerId, requestAnimationFrame);
    });
    socket.on('disconnect', () => keyboardListener.unsubscribe(game.movePlayer));
    socket.on('setup', (state) => {
        const playerId = socket.id;

        game.setState(state);

        keyboardListener.registerPlayerId(playerId);
        keyboardListener.subscribe(game.movePlayer);
        keyboardListener.subscribe((command) => socket.emit(command.type, command));
    });
    socket.on('add-player', (command) => game.addPlayer(command));
    socket.on('remove-player', (command) => game.removePlayer(command));
    socket.on('add-fruit', (command) => game.addFruit(command));
    socket.on('remove-fruit', (command) => game.removeFruit(command));

    socket.on('move-player', (command) => {
        const playerId = socket.id;
        if (playerId !== command.playerId) {
            game.movePlayer(command);
        }
    });
}
