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
  player2: string
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

    let now = Date.now()
    this.created_at = now
    this.updated_at = now
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
    throw new Error('unknown color')
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
  findPath(
    x: number,
    y: number,
    goalX?: number,
    goalY?: number,
    maxSteps: number = 100,
  ): { visited: Set<string>; path: any[] } {
    let path = []

    const opponentColor = this.getOppositeColor(this.getColor(x, y))
    const allowedDirs = this.getAllowedDirs(x, y)
    let getNeighbours = (x: number, y: number): any[] => {
      let neighbours = []
      for (let i = 0; i < allowedDirs.length; i++) {
        let jumpX = allowedDirs[i][0] + x
        let jumpY = allowedDirs[i][1] + y
        let neighbourX = allowedDirs[i][0] * 2 + x
        let neighbourY = allowedDirs[i][1] * 2 + y
        if (!this.boundsCheck(neighbourX, neighbourY)) {
          continue // Move must be on game board.
        }
        let value = this.checkers[neighbourY][neighbourX]
        if (value !== '') {
          continue // Move must jump to empty space.
        }
        let value2 = this.checkers[jumpY][jumpX]
        if (value2 === '') {
          continue // Jump must not be empty.
        }
        let jumpColor = this.getColor(jumpX, jumpY)
        if (jumpColor !== opponentColor) {
          continue // Move must jump opposite color.
        }
        let key = this.moveKey(neighbourX, neighbourY)
        if (!visited.has(key)) {
          visited.add(key)
          path.push([jumpX, jumpY])
          path.push([neighbourX, neighbourY])
          neighbours.push([neighbourX, neighbourY])
        }
      }
      return neighbours
    }
    let steps = 0
    let visited = new Set<string>()
    let current = [x, y]
    let stack: any[] = getNeighbours(current[0], current[1])
    while (stack.length > 0) {
      if (steps >= maxSteps) {
        console.warn('jump validation exceeded allowed number of steps')
        break
      }
      current = stack.pop()
      if (current[0] == goalX && current[1] == goalY) {
        break
      }
      let neighbours = getNeighbours(current[0], current[1])
      if (neighbours.length > 0) {
        // Skip empty array.
        stack.push(neighbours)
      }
      steps += 1
    }

    let result = {
      visited,
      path,
    }
    return result
  }
  validMove(move: CheckerMove): boolean {
    // Check move is within game board
    if (!this.boundsCheck(move[2], move[3])) {
      return false
    }

    // Check move is in the forward (towards opponent) diagonal direction
    const allowedDirs = this.getAllowedDirs(move[0], move[1])
    const delta = [move[2] - move[0], move[3] - move[1]]
    const deltaNorm = [Math.sign(delta[0]), Math.sign(delta[1])]
    let validDir = false
    for (let i = 0; i < allowedDirs.length; i++) {
      if (allowedDirs[i][0] === deltaNorm[0] && allowedDirs[i][1] === deltaNorm[1]) {
        validDir = true
        break
      }
    }

    let validMove = false
    if (validDir) {
      // Check move is to an empty space.
      if (this.checkers[move[3]][move[2]] === '') {
        validMove = true
      }
    }

    // Check move is a jump when available.
    let { visited, path } = this.findPath(move[0], move[1])
    let moveKey = this.moveKey(move[2], move[3])
    if (visited.size > 0 && !visited.has(moveKey)) {
      validMove = false
    }

    return validMove
  }
  applyMove(move: CheckerMove) {
    let myColor = this.getColor(move[0], move[1])
    let opponentColor = this.getOppositeColor(myColor)
    let delta = [move[2] - move[0], move[3] - move[1]]

    // Eat opponent.
    if (Math.abs(delta[0]) > 1 || Math.abs(delta[1]) > 1) {
      let { visited, path } = this.findPath(move[0], move[1], move[2], move[3])
      for (let i = 0; i < path.length; i++) {
        let current = path[i]
        if (this.checkers[current[1]][current[0]] === opponentColor) {
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
}
