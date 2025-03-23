import { error } from 'console'

export type CheckerBoard = string[][] // 'r' red, 's', red king, 'b' black, 'c' black king, '' empty.

export interface CheckerMove {
  [index: number]: number // oldX, oldY, newX, newY
}

export class Game {
  readonly id: string
  title: string
  password: string
  broadcast: boolean
  player1: string
  player1Color: string
  player2Color: string
  player2: string
  winner: string
  loser: string
  material: string
  numRow: number
  numCol: number
  checkers: CheckerBoard
  moves: CheckerMove[]
  created_at: number
  updated_at: number

  constructor(
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
    this.winner = ''
    this.loser = ''

    let now = Date.now()
    this.created_at = now
    this.updated_at = now
  }
  getTurnCount(): number {
    return this.moves.length
  }
  getTurnColor(): string {
    return this.getTurnCount() % 2 === 0 ? 'b' : 'r'
  }
  isPlayerTurn(name: string) {
    let index = (this.getTurnCount() % 2) + 1
    if (index === 1 && name === this.player1) {
      return true
    } else if (index === 2 && name === this.player2) {
      return true
    }
    return false
  }
  isKing(x: number, y: number): boolean {
    let value = this.checkers[y][x]
    return value === 'c' || value === 's'
  }
  getKing(color: string): string {
    if (color === 'r') {
      return 's'
    } else if (color === 'b') {
      return 'c'
    }
    throw new Error('invalid color: ' + color)
  }
  isEmpty(x: number, y: number): boolean {
    return this.checkers[y][x] === ''
  }
  getColor(x: number, y: number): string {
    let value = this.checkers[y][x]
    const colorMap = {
      r: 'r',
      s: 'r',
      b: 'b',
      c: 'b',
    }
    if (value in colorMap) {
      return colorMap[value]
    }
    throw new Error("unknown color '" + value + "'  ")
  }
  getOppositeColor(color: string) {
    if (color === 'r') {
      return 'b'
    } else if (color === 'b') {
      return 'r'
    }
  }
  getForwardDir(x: number, y: number): number {
    let color = this.getColor(x, y)
    if (color === 'r') {
      return 1
    } else if (color === 'b') {
      return -1
    }
    throw new Error('unknown dir')
  }
  getAllowedDirs(x: number, y: number): number[][] {
    const forwardDir = this.getForwardDir(x, y)
    const allowedDirs = [
      [-1, forwardDir], // x, y
      [1, forwardDir], // x, y
    ]
    // A king can move forward and backward.
    if (this.isKing(x, y)) {
      allowedDirs.push([-1, -1 * forwardDir])
      allowedDirs.push([1, -1 * forwardDir])
    }
    return allowedDirs
  }
  boundsCheck(x: number, y: number): boolean {
    if (x >= 0 && x < this.numCol && y >= 0 && y < this.numRow) {
      return true
    }
    return false
  }
  moveKey(x: number, y: number): string {
    return x + ',' + y
  }
  findPaths(x: number, y: number, goalX?: number, goalY?: number, maxSteps: number = 100): any[] {
    let paths0 = [] // Graph stack.
    let paths1 = [] // Result.
    let path = []
    let findAll = !goalX && !goalY
    const opponentColor = this.getOppositeColor(this.getColor(x, y))
    const allowedDirs = this.getAllowedDirs(x, y)
    let getNeighbours = (x: number, y: number, mustJump: boolean = false): any[] => {
      let neighbours = []

      for (let i = 0; i < allowedDirs.length; i++) {
        let neighbourX = allowedDirs[i][0] + x
        let neighbourY = allowedDirs[i][1] + y

        if (!this.boundsCheck(neighbourX, neighbourY)) {
          continue // Move must be on game board.
        }

        if (this.isEmpty(neighbourX, neighbourY)) {
          if (!mustJump) {
            // Jumps must be consecutive.
            let key = this.moveKey(neighbourX, neighbourY)
            if (!visited.has(key)) {
              neighbours.push([neighbourX, neighbourY]) // Move to adjacent empty space.
            }
          }
          continue // Cannot move past empty space.
        }

        let neighbourColor = this.getColor(neighbourX, neighbourY)
        if (neighbourColor !== opponentColor) {
          continue // Move must jump opposite color.
        }

        let jumpX = allowedDirs[i][0] * 2 + x
        let jumpY = allowedDirs[i][1] * 2 + y

        if (!this.boundsCheck(jumpX, jumpY)) {
          continue // Move must be on game board.
        }

        if (!this.isEmpty(jumpX, jumpY)) {
          continue // Move must jump to empty space.
        }

        let key = this.moveKey(jumpX, jumpY)
        if (!visited.has(key)) {
          neighbours.push([jumpX, jumpY])
        }
      }

      return neighbours
    }
    let steps = 0
    let visited = new Set<string>()
    const root = [x, y]
    let current = null
    let stack: any[] = [root]
    let jump = false
    while (stack.length > 0) {
      if (steps >= maxSteps) {
        console.warn('jump validation exceeded allowed number of steps')
        break
      }
      current = stack.pop()
      path = paths0.length > 0 ? paths0.pop() : []
      // Add neighbour to path when move is a jump.
      if (path.length > 0) {
        let delta = [current[0] - path[path.length - 1][0], current[1] - path[path.length - 1][1]]
        jump = Math.abs(delta[0]) > 1 || Math.abs(delta[1]) > 1
        if (jump) {
          let middle = [
            Math.floor((current[0] + path[path.length - 1][0]) / 2),
            Math.floor((current[1] + path[path.length - 1][1]) / 2),
          ]
          path.push(middle)
        }
      }
      path.push(current)
      if (current[0] == goalX && current[1] == goalY) {
        // Terminate path and search.
        paths1.push(structuredClone(path))
        path = [root]
        break
      }
      let key = this.moveKey(current[0], current[1])
      if (!visited.has(key)) {
        visited.add(key)
        let neighbours = []
        // Cannot move more than once.
        let movedOnce = path.length >= 2 && !jump
        if (!movedOnce || jump) {
          neighbours = getNeighbours(current[0], current[1], jump)
        }
        if (path.length > 1 && findAll) {
          paths1.push(structuredClone(path))
        }
        stack = stack.concat(neighbours)
        neighbours.forEach((_) => {
          paths0.push(structuredClone(path))
        })
      }
      steps += 1
    }

    // Terminate path.
    if (path.length > 1 && findAll) {
      paths1.push(path)
    }

    return paths1
  }
  findPath(x: number, y: number, goalX?: number, goalY?: number, maxSteps: number = 100): any[] {
    let paths = this.findPaths(x, y, goalX, goalY, maxSteps)
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i]
      if (
        x === path[0][0] &&
        y === path[0][1] &&
        goalX === path[path.length - 1][0] &&
        goalY === path[path.length - 1][1]
      ) {
        return path
      }
    }
    return null // No paths.
  }
  countCaptures(path: any[]): number {
    if (path.length < 2) {
      return 0
    }
    let myColor = this.getColor(path[0][0], path[0][1])
    let opponentColor = this.getOppositeColor(myColor)
    let count = 0
    for (let i = 0; i < path.length; i++) {
      let current = path[i]
      if (this.isEmpty(current[0], current[1])) {
        continue // Skip empty space
      }
      if (this.getColor(current[0], current[1]) === opponentColor) {
        count += 1
      }
    }
    return count
  }
  validMove(move: CheckerMove): boolean {
    if (this.isEmpty(move[0], move[1])) {
      return false // Cannot move an empty square.
    }
    let myColor = this.getColor(move[0], move[1])
    let paths = []
    for (let y = 0; y < this.numRow; y++) {
      for (let x = 0; x < this.numCol; x++) {
        if (!this.isEmpty(x, y) && myColor === this.getColor(x, y)) {
          let paths0 = this.findPaths(x, y)
          paths = paths.concat(paths0)
        }
      }
    }
    if (paths.length === 0) {
      return false // No available moves.
    }
    // Move must jump when available.
    let jump = false
    let jumped = false
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i]
      if (this.countCaptures(path) > 0) {
        jump = true
        jumped =
          jumped ||
          (move[0] === path[0][0] &&
            move[1] === path[0][1] &&
            move[2] === path[path.length - 1][0] &&
            move[3] === path[path.length - 1][1])
      }
    }
    // Move must jump when available.
    if (jump) {
      return jumped
    }
    // Move must have been found.
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i]
      if (
        move[0] === path[0][0] &&
        move[1] === path[0][1] &&
        move[2] === path[path.length - 1][0] &&
        move[3] === path[path.length - 1][1]
      ) {
        return true
      }
    }
    return false // Move is invalid.
  }
  applyMove(move: CheckerMove) {
    let myColor = this.getColor(move[0], move[1])
    let opponentColor = this.getOppositeColor(myColor)
    let delta = [move[2] - move[0], move[3] - move[1]]

    // Eat opponent.
    if (Math.abs(delta[0]) > 1 || Math.abs(delta[1]) > 1) {
      let path = this.findPath(move[0], move[1], move[2], move[3])
      if (!path) {
        throw new error('invalid move. validate move first before applying')
      }
      for (let i = 0; i < path.length; i++) {
        let current = path[i]
        if (this.isEmpty(current[0], current[1])) {
          continue // Skip empty space
        }
        if (this.getColor(current[0], current[1]) === opponentColor) {
          this.checkers[current[1]][current[0]] = ''
        }
      }
    }

    let value = this.checkers[move[1]][move[0]]
    this.checkers[move[3]][move[2]] = value
    this.checkers[move[1]][move[0]] = ''

    // King maker
    let kingRow = -1
    if (myColor === 'r') {
      kingRow = this.numRow - 1
    } else if (myColor === 'b') {
      kingRow = 0
    } else {
      throw new Error('unknown king row')
    }

    if (move[3] === kingRow) {
      this.checkers[move[3]][move[2]] = this.getKing(myColor)
    }

    let now = Date.now()
    this.updated_at = now
  }
  checkWin(): string | null {
    let counter = {
      r: 0,
      b: 0,
    }
    for (let y = 0; y < this.numRow; y++) {
      for (let x = 0; x < this.numCol; x++) {
        if (this.isEmpty(x, y)) {
          continue // Skip empty space.
        }
        let c = this.getColor(x, y)
        if (c in counter) {
          counter[c]++
        }
      }
    }
    if (counter['r'] === 0) {
      return 'b'
    } else if (counter['b'] === 0) {
      return 'r'
    }
    return null
  }
  inProgress(): boolean {
    return this.player1 && this.player2 && !this.winner
  }
}
