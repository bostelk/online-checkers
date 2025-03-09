const { games, isMoveValid, applyMove } = require("../game")

export default function handler (socketServer, socket) {
    const moveChecker = (payload) => {
        let { id, move } = payload
        let game = games[id]
        if (isMoveValid(game, move)) {
            game.moves.push(move)
            applyMove(game, move)
            socketServer.emit("game", game)
        }
    }
  
    socket.on("game:moveChecker", moveChecker);
}