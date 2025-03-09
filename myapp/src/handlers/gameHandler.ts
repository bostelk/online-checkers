import { CheckerMove } from "../game"
import { findOne } from "../database"

export default function handler (socketServer, socket) {
    const moveChecker = (payload: { id: string; move: CheckerMove }) => {
        let { id, move } = payload
        let game = findOne(id)
        if (game.isMoveValid(move)) {
            game.applyMove(move)
            game.moves.push(move)
            socketServer.emit("game", game)
        }
    }
  
    socket.on("game:moveChecker", moveChecker);
}