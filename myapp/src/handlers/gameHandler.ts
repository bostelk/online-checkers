import { CheckerMove } from '../game'
import { findOne } from '../database'

export default function handler(socketServer, socket) {
  const moveChecker = (payload: { id: string; move: CheckerMove }) => {
    let { id, move } = payload
    let game = findOne(id)
    if (game.validMove(move)) {
      game.applyMove(move)
      game.moves.push(move)
      socketServer.to(id).emit('game', game)
    } else {
      console.warn('move is invalid: ' + move)
      socketServer.to(id).emit('game', game) // Correct client.
    }
  }
  const joinGame = (payload: { id: string}) => {
    socket.join(payload.id)
    console.log("a player has joined game: " + payload.id)
  }
  const leaveGame = (payload: {id: string}) => {
    socket.leave(payload.id)
    console.log("a player has left game: " + payload.id)
  }

  socket.on('game:moveChecker', moveChecker)
  socket.on('game:join', joinGame)
  socket.on('game:leave', leaveGame)

}
