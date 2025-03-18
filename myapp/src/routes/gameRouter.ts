import express from 'express'
export const router = express.Router()
import { v4 as uuidv4 } from 'uuid'
import { Game } from '../game'
import { broadcastedGames, findGame, insertGame } from '../database'

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

router.get('/', (req, res) => {
  res.json(broadcastedGames())
})
router.post('/new', (req, res) => {
  let id = uuidv4()

  // Read user input.
  let title = req.body.title
  let password = req.body.password
  let broadcast = req.body.broadcast
  let player1 = req.body.player1
  let player2 = '' // Note(kbostlemann): Ignored for now req.body.player2
  let material = req.body.material

  let newGame = insertGame(id, title, password, broadcast, player1, player2, material, 8, 8)
  res.json(newGame)
})
// Order matters! At least until there's a UUIDv4 regex on the path. Otherwise /new is interpreted as a game id.
router.get('/:id', (req, res) => {
  let id = req.params.id

  let game = findGame(id)
  if (game !== null) {
    res.json(game)
  } else {
    res.status(404).json({ code: 404, err: 'Game not found!' })
  }
})
