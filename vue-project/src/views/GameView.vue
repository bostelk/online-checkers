<script setup lang="ts">
import CheckerTable from '../components/CheckerTable.vue'
import { useRoute, onBeforeRouteLeave} from 'vue-router'
import { ref, reactive, watch, computed, onMounted, provide } from 'vue'
import { socket } from "@/socket";

const route = useRoute()
const game = reactive({})
const loading = ref(false)

provide('server-game', game)

const fetchGame = async (id) => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/games/' + id)
    const newGame = await res.json()
    game.value = newGame
  } catch (error) {
    console.error('Error! Could not reach the API. ' + error)
  } finally {
    loading.value = false
  }
}

const postGameMove = async (oldX, oldY, newX, newY) => {
  const payload = { id: game.value.id, move: [oldX, oldY, newX, newY] }
  socket.emit("game:moveChecker", payload)
}

socket.on("game", (newGame) => {
  game.value = newGame
})

// fetch the game when params change
watch(
  () => route.params.id,
  async (newId) => {
    await fetchGame(newId)
  },
)

// Todo(kbostelmann): Upgrade to navigation guard.
onMounted(async () => {
  await fetchGame(route.params.id)
  if (game.value) {
    socket.emit('game:join', { id: game.value.id })
  }
})

const gameTitle = computed(() => {
  return game.value ? game.value.title : 'Unknown'
})

onBeforeRouteLeave((to, from) => {
  if (game.value) {
    socket.emit('game:leave', { id: game.value.id })
  }
})
</script>

<template>
  <div class="game">
    <div>
      <h1>{{ gameTitle }}</h1>
    </div>
    <div>
      <CheckerTable @move="postGameMove" />
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .game {
  }
}
</style>
