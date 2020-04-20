export default function createKeyboardListener(document) {
    const state = { observers: [] };

    function registerPlayerId(playerId) {
        state.playerId = playerId;
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function unsubscribe(observerFunction) {
        state.observers.splice(state.observers.indexOf(observerFunction), 1);
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', (event) => {
        const keyPressed = event.key;

        notifyAll({ type: 'move-player', playerId: state.playerId, keyPressed });
    });

    return { subscribe, unsubscribe, registerPlayerId };
}
