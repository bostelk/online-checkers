import { CheckerMove } from '../game'
import { allGames, findGame, insertMove, updateGame } from '../database'

export default function handler(socketServer, socket) {
  const moveChecker = (payload: { id: string; move: CheckerMove }) => {
    let { id, move } = payload
    let game = findGame(id)
    if (game.inProgress() && game.isPlayerTurn(socket.data.username) && game.validMove(move)) {
      game.applyMove(move)
      insertMove(game, move)
      let win = game.checkWin()
      if (win) {
        const colorToPlayer = {
          b: game.player1,
          r: game.player2,
        }
        game.winner = colorToPlayer[win]
        game.loser = colorToPlayer[game.getOppositeColor(win)]
      }
      updateGame(game)
      socketServer.to(id).emit('game', game)
    } else {
      console.warn('move is invalid: ' + move)
      socketServer.to(id).emit('game', game) // Correct client.
    }
  }
  const joinGame = (payload: { id: string }) => {
    socket.join(payload.id)
    console.log('a player has joined game: ' + payload.id)
    let game = findGame(payload.id)
    if (game) {
      if (game.player1 === '' || game.player1 === socket.data.username) {
        game.player1 = socket.data.username
        game.player1Color = socket.data.color
      } else if (game.player2 === '' || game.player2 === socket.data.username) {
        game.player2 = socket.data.username
        game.player2Color = socket.data.color
      }

      updateGame(game)

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
    let game = findGame(payload.id)
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

      updateGame(game)

      // Broadcast to other players.
      socket.to(game.id).emit('game:leave', {
        name: socket.data.username,
        color: socket.data.color,
      })
    }
  }
  const disconnecting = () => {
    Object.entries(allGames()).forEach(([id, game]) => {
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
