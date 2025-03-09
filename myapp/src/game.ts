export class Game {
    id: string
    title: string
    password: string
    broadcast: boolean
    player1: string
    player2: string
    material: string
    numRow: number
    numCol: number
    checkers: string[][]
    moves: []
    created_at: number
    updated_at: number

    constructor(id: string, title: string, password:string, broadcast:boolean, player1:string, player2:string, material:string, numRow:number, numCol:number) {
        this.id = id
        this.title = title
        this.password = password
        this.broadcast = broadcast
        this.player1 = player1
        this.player2 = player2
        this.material = material
        this.numRow = numRow
        this.numCol = numCol
        this.checkers = [
            ['r', '', 'r', '', 'r', '', 'r', '', 'r'],
            ['', 'r', '', 'r', '', 'r', '', 'r', ''],
            ['r', '', 'r', '', 'r', '', 'r', '', 'r'],
            ['', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', ''],
            ['', 'b', '', 'b', '', 'b', '', 'b', ''],
            ['b', '', 'b', '', 'b', '', 'b', '', 'b'],
            ['', 'b', '', 'b', '', 'b', '', 'b', ''],
          ]
        this.moves = []

        let now = Date.now();
        this.created_at = now
        this.updated_at = now
    }
}

// In-memory persistence.
export const games: Record<string, Game> = {}

export function isMoveValid (game, move) {
    return true // Validate user move to prevent cheating!!
}

export function applyMove(game, move) {
    let value = game.checkers[move[1]][move[0]]
    game.checkers[move[3]][move[2]] = value
    game.checkers[move[1]][move[0]] = ''

    let now = Date.now();
    game.updated_at = now
}