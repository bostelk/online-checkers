<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive({
  numCol: 8,
  numRow: 8,
  material: 'marble',
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
})
let g_drag = [-1, -1] // bad global
const cellId = (x, y) => {
  return x + data.numRow * y
}
const cellName = (x, y) => {
  const debug = false
  if (debug) {
    return cellId(x, y)
  } else {
    return ''
  }
}
const getChecker = (x, y) => {
  if (y >= 0 && y < data.checkers.length) {
    if (x >= 0 && x < data.checkers[y].length) {
      return data.checkers[y][x]
    }
  }
  return null
}
const setChecker = (x, y, value) => {
  if (y >= 0 && y < data.checkers.length) {
    if (x >= 0 && x < data.checkers[y].length) {
      data.checkers[y][x] = value
    }
  }
}
const checkerId = (x, y) => {
  const value = getChecker(x, y)
  const valueToId = {
    r: 'red-checker',
    b: 'black-checker',
  }
  if (value in valueToId) {
    return valueToId[value]
  }
  return 'empty'
}
const getBoard = (x, y) => {
  return (x + y) % 2 == 0
}
const boardId = (material, x, y) => {
  return material + '-' + (getBoard(x, y) ? 'black' : 'white')
}
const onDragCheckerPiece = (x, y, event) => {
  console.log('dragging ' + cellId(x, y))
}
const onDragStartCheckerPiece = (x, y, event) => {
  console.log('drag start ' + cellId(x, y))
  g_drag = [x, y]
}
const onDragEndCheckerPiece = (x, y, event) => {
  console.log('drag end ' + cellId(x, y))
}
const onDragEnterCheckerPiece = (x, y, event) => {
  console.log('drag enter ' + cellId(x, y))
}
const onDragLeaveCheckerPiece = (x, y, event) => {
  console.log('drag leave ' + cellId(x, y))
}
const onDragOverCheckerPiece = (x, y, event) => {
  console.log('drag over ' + cellId(x, y))

  if (isMoveValid(x, y)) {
    // prevent default to allow drop
    event.preventDefault()
  }
}
const onDropCheckerPiece = (x, y, event) => {
  console.log('drop ' + cellId(x, y))

  // prevent default action (open as link for some elements)
  event.preventDefault()

  // move dragged element to the selected drop target
  moveChecker(g_drag[0], g_drag[1], x, y)
}
const isCheckerDraggable = (x, y) => {
  return getChecker(x, y) === 'b'
}
const isMoveValid = (x, y) => {
  return getBoard(x, y) && getChecker(x, y) === ''
}
const moveChecker = (oldX, oldY, newX, newY) => {
  if (isMoveValid(newX, newY)) {
    const value = getChecker(oldX, oldY)
    console.log(value)
    setChecker(oldX, oldY, '') // Empty.
    setChecker(newX, newY, value)
    console.log(data.checkers)
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
          @drag="onDragCheckerPiece(x - 1, y - 1, $event)"
          @dragstart="onDragStartCheckerPiece(x - 1, y - 1, $event)"
          @dragend="onDragEndCheckerPiece(x - 1, y - 1, $event)"
          @dragenter="onDragEnterCheckerPiece(x - 1, y - 1, $event)"
          @dragleave="onDragLeaveCheckerPiece(x - 1, y - 1, $event)"
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
  position: fixed;
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
