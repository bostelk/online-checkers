const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// In-memory persistence.
const games = {}

const makeNewGame = (id, numRow, numCol, material) => {
    let newGame = {
        id: id,
        numCol: numCol,
        numRow: numRow,
        checkers: [
            ['r', '', 'r', '', 'r', '', 'r', '', 'r'],
            ['', 'r', '', 'r', '', 'r', '', 'r', ''],
            ['r', '', 'r', '', 'r', '', 'r', '', 'r'],
            ['', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', ''],
            ['', 'b', '', 'b', '', 'b', '', 'b', ''],
            ['b', '', 'b', '', 'b', '', 'b', '', 'b'],
            ['', 'b', '', 'b', '', 'b', '', 'b', ''],
          ],
        moves: []   
    }
    return newGame
}

const isMoveValid = (game, move) => {
    return true // Validate user move to prevent cheating!!
}

const applyMove = (game, move) => {
    let value = game.checkers[move[1]][move[0]]
    game.checkers[move[3]][move[2]] = value
    game.checkers[move[1]][move[0]] = ''
}

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

router.get('/', (req, res) => {
  res.json(games)
})
router.post('/new', (req, res) => {
    let id = uuidv4()
    let newGame = makeNewGame(id, 8, 8)
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
router.post('/:id/move', (req, res) => {
    let id = req.params.id;
    if (id in games) {
        let game = games[id]
        let move = req.body.move
        if (isMoveValid(game, move)) {
            game.moves.push(move)
            applyMove(game, move)
            res.json(game)
        }
        else {
            res.status(400).send("Move is invalid!")
        }
    } else {
        res.status(404).send("Game not found!")
    }
})

module.exports = router