import express from 'express'
export const router = express.Router()
import { v4 as uuidv4 } from 'uuid'
import { games, Game } from "../game"

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

router.get('/', (req, res) => {
    let filteredGames = {}
    // filter
    for (const [key, value] of Object.entries(games)) {
        let game = value as Game
        if (game.broadcast) {
            delete game.password
            filteredGames[key] = value
        }
    }
  res.json(filteredGames)
})
router.post('/new', (req, res) => {
    let id = uuidv4()
    
    // Read user input.
    let title = req.body.title
    let password = req.body.password
    let broadcast = req.body.broadcast
    let player1 = req.body.player1
    let player2 = req.body.player2
    let material = req.body.material

    let newGame = new Game(id, title, password, broadcast, player1, player2, material, 8, 8)
    games[id] = newGame
    res.json(newGame)
})
// Order matters! At least until there's a UUIDv4 regex on the path. Otherwise /new is interpreted as a game id.
router.get('/:id', (req, res) => {
    let id = req.params.id;
    if (id in games) {
        res.json(games[id])
    } else {
        res.status(404).send("Game not found!")
    }
})