
// In-memory persistence.
const games = {}

const makeNewGame = (id, title, password, broadcast, player1, player2, material, numRow, numCol) => {
    let now = Date.now();
    let newGame = {
        id: id,
        title: title,
        password: password,
        broadcast: broadcast,
        player1: player1,
        player2: player2,
        numCol: numCol,
        numRow: numRow,
        material: material,
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
        moves: [],
        created_at: now,
        updated_at: now
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

    let now = Date.now();
    game.updated_at = now
}

module.exports = {
    games,
    makeNewGame,
    applyMove,
    isMoveValid
}