import { CheckerMove, Game } from './game'
import fs from 'fs'
import { DatabaseSync } from 'node:sqlite'

let doSync = !fs.existsSync('db.sqlite')
const database = new DatabaseSync('db.sqlite', {
  allowExtension: true,
})
if (doSync) {
  sync()
}

export function sync(): void {
  database.exec(`
    CREATE TABLE game(
      id TEXT PRIMARY KEY,
      title TEXT,
      password TEXT,
      broadcast INTEGER,
      player1 TEXT,
      player1Color TEXT,
      player2 TEXT,
      player2Color TEXT,
      material TEXT,
      numRow INTEGER,
      numCol INTEGER,
      checkers TEXT,
      winner TEXT,
      loser TEXT,
      created_at INTEGER,
      updated_at INTEGER
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE move(
      id TEXT,
      oldX INTEGER,
      oldY INTEGER,
      newX INTEGER,
      newY INTEGER,
      created_at INTEGER,
      FOREIGN KEY(id) REFERENCES game(id)
    ) STRICT
  `)
}

function objectToGame(object): Game {
  let g = new Game(
    object['id'],
    object['title'],
    object['password'],
    object['broadcast'] == 1 ? true : false,
    object['player1'],
    object['player2'],
    object['material'],
    object['numRow'],
    object['numCol'],
  )
  g.player1Color = object['player1Color']
  g.player2Color = object['player2Color']
  g.created_at = object['created_at']
  g.updated_at = object['updated_at']
  g.checkers = unpackBoard(object['checkers'])
  return g
}

function packBoard(board: string[][]) {
  let text = ''
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length; x++) {
      text += board[y][x]
      if (x != board.length - 1) {
        text += ','
      }
    }
    if (y != board.length - 1) {
      text += '\n'
    }
  }
  return text
}

function unpackBoard(text: string) {
  let board = []
  let rows = text.split('\n')
  rows.forEach((row) => board.push(row.split(',')))
  return board
}

export function insertGame(
  id: string,
  title: string,
  password: string,
  broadcast: boolean,
  player1: string,
  player2: string,
  material: string,
  numRow: number,
  numCol: number,
) {
  const insert = database.prepare(
    'INSERT INTO game (id, title, password, broadcast, player1, player1Color, player2, player2Color, material, numRow, numCol, checkers, winner, loser, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  )
  let g = new Game(id, title, password, broadcast, player1, player2, material, numRow, numCol)
  g.player1Color = null
  g.player2Color = null

  console.log(packBoard(g.checkers))
  insert.run(
    g.id,
    g.title,
    g.password,
    g.broadcast ? 1 : 0,
    g.player1,
    g.player1Color,
    g.player2,
    g.player2Color,
    g.material,
    g.numRow,
    g.numCol,
    packBoard(g.checkers),
    g.winner,
    g.loser,
    g.created_at,
    g.updated_at,
  )
  return g
}

export function allGames(): Record<string, Game> {
  const query = database.prepare('SELECT * FROM game ORDER BY created_at')
  let objects = query.all()
  let games: Game[] = objects.map((object) => {
    let g = objectToGame(object)
    g.moves = allMoves(g.id)
    return g
  })
  let map = {}
  games.forEach((game) => (map[game.id] = game))
  return map
}

export function broadcastedGames(): Record<string, Game> {
  const query = database.prepare('SELECT * FROM game WHERE broadcast == true ORDER BY created_at')
  let objects = query.all()
  let games: Game[] = objects.map((object) => {
    let g = objectToGame(object)
    g.moves = allMoves(g.id)
    return g
  })
  let map = {}
  games.forEach((game) => (map[game.id] = game))
  return map
}

export function findGame(id: string): Game | null {
  const query = database.prepare('SELECT * FROM game WHERE id == ? ORDER BY created_at')
  let objects = query.all(id)
  if (objects.length === 1) {
    let object = objects[0]
    let game = objectToGame(object)
    game.moves = allMoves(game.id)
    return game
  }
  return null
}

export function updateGame(game: Game) {
  const update = database.prepare(
    'UPDATE game SET player1=?,player1Color=?,player2=?,player2Color=?,winner=?,loser=?,checkers=?,updated_at=? WHERE id == ?',
  )

  let now = Date.now()
  game.updated_at = now

  update.run(
    game.player1,
    game.player1Color,
    game.player2,
    game.player2Color,
    game.winner,
    game.loser,
    packBoard(game.checkers),
    game.updated_at,
    game.id,
  )
}

export function insertMove(game: Game, move: CheckerMove) {
  const insert = database.prepare(
    'INSERT INTO move (id, oldX, oldY, newX, newY, created_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
  let now = Date.now()
  insert.run(game.id, move[0], move[1], move[2], move[3], now)
  game.moves.push(move)
}

export function allMoves(id: string): CheckerMove[] {
  const query = database.prepare('SELECT * FROM move WHERE id = ? ORDER BY created_at')
  let objects = query.all(id)
  let moves = objects.map((object) => [
    object['oldX'],
    object['oldY'],
    object['newX'],
    object['newY'],
  ])
  return moves
}
