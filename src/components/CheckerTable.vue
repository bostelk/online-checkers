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
    [],
    [],
    ['', 'b', '', 'b', '', 'b', '', 'b', ''],
    ['b', '', 'b', '', 'b', '', 'b', '', 'b'],
    ['', 'b', '', 'b', '', 'b', '', 'b', ''],
  ],
})
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
const checkerId = (x, y) => {
  if (y >= 0 && y < data.checkers.length) {
    if (x >= 0 && x < data.checkers[y].length) {
      const map = {
        r: 'red-checker',
        b: 'black-checker',
      }
      const value = data.checkers[y][x]
      if (value in map) {
        return map[data.checkers[y][x]]
      }
    }
  }
  return 'empty'
}
const boardId = (material, x, y) => {
  return material + '-' + ((x + y) % 2 == 0 ? 'black' : 'white')
}
</script>

<template>
  <div id="under-table">
    <table cellspacing="0" cellpadding="0">
      <tr v-for="y in data.numRow">
        <th v-for="x in data.numCol" :id="boardId(data.material, x - 1, y - 1)">
          {{ cellName(x - 1, y - 1) }}
        </th>
      </tr>
    </table>
  </div>
  <div id="over-table">
    <table cellspacing="0" cellpadding="0">
      <tr v-for="y in data.numRow">
        <th v-for="x in data.numCol" :id="checkerId(x - 1, y - 1)">{{ cellName(x - 1, y - 1) }}</th>
      </tr>
    </table>
  </div>
</template>

<style scoped>
#under-table {
  z-index: -1;
  position: fixed;
}
#over-table {
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
