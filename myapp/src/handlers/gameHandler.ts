import { CheckerMove } from '../game'
import { all, findOne } from '../database'

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
  const joinGame = (payload: { id: string }) => {
    socket.join(payload.id)
    console.log('a player has joined game: ' + payload.id)
    let game = findOne(payload.id)
    if (game) {
      if (game.player1 === '' || game.player1 === socket.data.username) {
        game.player1 = socket.data.username
        game.player1Color = socket.data.color
      } else if (game.player2 === '' || game.player2 === socket.data.username) {
        game.player2 = socket.data.username
        game.player2Color = socket.data.color
      }

      let now = Date.now()
      game.updated_at = now

      // Broadcast to other players.
      socket.to(game.id).emit('game:join', {
        name: socket.data.username,
        color: socket.data.color,
      })
    }
  }
  const leaveGame = (payload: { id: string }) => {
    socket.leave(payload.id)
    console.log('a player has left game: ' + payload.id)
    let game = findOne(payload.id)
    if (game) {
      if (game.player1 === socket.data.username) {
        game.player1 = ''
        game.player1Color = ''
      } else if (game.player2 === socket.data.username) {
        game.player2 = ''
        game.player2Color = ''
      }

      if (game.player1 === '' || game.player2 === '') {
        // Players have forfeit.
      }

      let now = Date.now()
      game.updated_at = now

      // Broadcast to other players.
      socket.to(game.id).emit('game:leave', {
        name: socket.data.username,
        color: socket.data.color,
      })
    }
  }
  const disconnecting = () => {
    Object.entries(all()).forEach(([id, game]) => {
      let didLeave = false
      if (game.player1 === socket.data.username) {
        game.player1 = ''
        game.player1Color = ''
        didLeave = true
      } else if (game.player2 === socket.data.username) {
        game.player2 = ''
        game.player2Color = ''
        didLeave = true
      }
      if (didLeave) {
        // Broadcast to other players.
        socket.to(id).emit('game:leave', {
          name: socket.data.username,
          color: socket.data.color,
        })
      }
    })
  }

  socket.on('game:moveChecker', moveChecker)
  socket.on('game:join', joinGame)
  socket.on('game:leave', leaveGame)
  socket.on('disconnecting', disconnecting)
}
