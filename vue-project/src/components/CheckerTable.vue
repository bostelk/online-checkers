<script setup lang="ts">
import { playerName } from '@/player'
import { reactive, watch, inject } from 'vue'

let playerColor = ''

const emit = defineEmits({
  move(oldX: number, oldY: number, newX: number, newY: number) {
    // return `true` or `false` to indicate
    // validation pass / fail
    return true
  },
})

// Handle reactivity from GameView.
const serverGame = inject('server-game')
watch(serverGame, async (newGame, oldGame) => {
  data.material = newGame.value.material
  data.checkers = newGame.value.checkers
  data.turnCount = newGame.value.moves.length

  // Assign player color.
  if (newGame.value.player1 === playerName.value) {
    playerColor = 'b'
  } else if (newGame.value.player2 === playerName.value) {
    playerColor = 'r'
  } else {
    // The user is not playing.
    playerColor = ''
  }
})

const data = reactive({
  numCol: 8,
  numRow: 8,
  material: 'marble',
  checkers: [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ],
  turnCount: 0
})
let g_drag = [-1, -1] // bad global
const cellId = (x: number, y: number) => {
  return x + data.numRow * y
}
const cellName = (x: number, y: number) => {
  const debug = false
  if (debug) {
    return cellId(x, y)
  } else {
    return ''
  }
}
const getChecker = (x: number, y: number) => {
  if (y >= 0 && y < data.checkers.length) {
    if (x >= 0 && x < data.checkers[y].length) {
      return data.checkers[y][x]
    }
  }
  return null
}
const setChecker = (x: number, y: number, value: string) => {
  if (y >= 0 && y < data.checkers.length) {
    if (x >= 0 && x < data.checkers[y].length) {
      data.checkers[y][x] = value
    }
  }
}
const checkerId = (x: number, y: number) => {
  const value = getChecker(x, y)
  const valueToId = {
    r: 'red-checker',
    s: 'red-checker-king',
    b: 'black-checker',
    c: 'black-checker-king'
  }
  if (value in valueToId) {
    return valueToId[value]
  }
  return 'empty'
}
const getBoard = (x: number, y: number) => {
  return (x + y) % 2 == 0
}
const boardId = (material: string, x: number, y: number) => {
  return material + '-' + (getBoard(x, y) ? 'black' : 'white')
}
const onDragCheckerPiece = (x: number, y: number) => {
  console.log('dragging ' + cellId(x, y))
}
const onDragStartCheckerPiece = (x: number, y: number) => {
  console.log('drag start ' + cellId(x, y))
  g_drag = [x, y]
}
const onDragEndCheckerPiece = (x: number, y: number) => {
  console.log('drag end ' + cellId(x, y))
}
const onDragEnterCheckerPiece = (x: number, y: number) => {
  console.log('drag enter ' + cellId(x, y))
}
const onDragLeaveCheckerPiece = (x: number, y: number) => {
  console.log('drag leave ' + cellId(x, y))
}
const onDragOverCheckerPiece = (x: number, y: number, event: Event) => {
  console.log('drag over ' + cellId(x, y))

  if (isMoveValid(x, y)) {
    // prevent default to allow drop
    event.preventDefault()
  }
}
const onDropCheckerPiece = (x: number, y: number, event: Event) => {
  console.log('drop ' + cellId(x, y))

  // prevent default action (open as link for some elements)
  event.preventDefault()

  // move dragged element to the selected drop target
  moveChecker(g_drag[0], g_drag[1], x, y)
}
const isCheckerDraggable = (x: number, y: number) => {
  return isMyTurn() && isMyChecker(x, y)
}
const isMyTurn = () => {
  const turnColor = data.turnCount % 2 === 0 ? 'b' : 'r';
  return turnColor === playerColor
}
const isMyChecker = (x: number, y:number) => {
  const colorMap = {
    b: 'b',
    c: 'c',
    r: 'r',
    s: 's'
  }
  const value = getChecker(x, y)
  if (value !== null && value in colorMap) {
    const myColor = colorMap[value]
    return myColor === playerColor
  }
  return false
}
const isMoveValid = (x: number, y: number) => {
  return getBoard(x, y) && getChecker(x, y) === ''
}
const moveChecker = (oldX: number, oldY: number, newX: number, newY: number) => {
  if (isMoveValid(newX, newY)) {
    const value = getChecker(oldX, oldY)
    if (value === null) {
      throw new Error('checker cannot be null')
    }
    setChecker(oldX, oldY, '') // Empty.
    setChecker(newX, newY, value)
    emit('move', oldX, oldY, newX, newY)
  }
}
</script>

<template>
  <div id="board-table">
    <table cellspacing="0" cellpadding="0">
      <tr v-for="y in data.numRow">
        <th v-for="x in data.numCol" :id="boardId(data.material, x - 1, y - 1)">
          {{ cellName(x - 1, y - 1) }}
        </th>
      </tr>
    </table>
  </div>
  <div id="checker-table">
    <table cellspacing="0" cellpadding="0">
      <tr v-for="y in data.numRow">
        <th
          v-for="x in data.numCol"
          :id="checkerId(x - 1, y - 1)"
          :draggable="isCheckerDraggable(x - 1, y - 1)"
          @drag="onDragCheckerPiece(x - 1, y - 1)"
          @dragstart="onDragStartCheckerPiece(x - 1, y - 1)"
          @dragend="onDragEndCheckerPiece(x - 1, y - 1)"
          @dragenter="onDragEnterCheckerPiece(x - 1, y - 1)"
          @dragleave="onDragLeaveCheckerPiece(x - 1, y - 1)"
          @dragover="onDragOverCheckerPiece(x - 1, y - 1, $event)"
          @drop="onDropCheckerPiece(x - 1, y - 1, $event)"
        >
          {{ cellName(x - 1, y - 1) }}
        </th>
      </tr>
    </table>
  </div>
</template>

<style scoped>
#board-table {
  z-index: -1;
  position: fixed;
}
#checker-table {
  z-index: 0;
  /*
   * Disable the second fixed position because it breaks the page layout.
   * While both elements are displayed ontop of each other they're not in the middle of the page.
   * This fixes that at the cost of breaking when scrolling.
   * position: fixed;
  */
}
#marble-white {
  width: 32px;
  height: 32px;
  background: url('@/assets/marble.png') 0px 0px;
}
#marble-black {
  width: 32px;
  height: 32px;
  background: url('@/assets/marble.png') 0px -32px;
}
#wood-white {
  width: 32px;
  height: 32px;
  background: url('@/assets/wood.png') 0px 0px;
}
#wood-black {
  width: 32px;
  height: 32px;
  background: url('@/assets/wood.png') 0px -32px;
}
#red-checker {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 32px 32px;
}
#black-checker {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 0px 32px;
}
#white-checker {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 64px 32px;
}
#red-checker-king {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 32px 0px;
}
#black-checker-king {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 0px 0px;
}
#white-checker-king {
  width: 32px;
  height: 32px;
  background: url('@/assets/checker.png') 64px 0;
}
#empty {
  width: 32px;
  height: 32px;
}
</style>
