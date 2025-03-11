<script setup lang="ts">
import CheckerTable from '../components/CheckerTable.vue'
import { useRoute, onBeforeRouteLeave} from 'vue-router'
import { ref, reactive, watch, computed, onMounted, provide } from 'vue'
import { socket } from "@/socket";
import { playerName, playerIconTiny } from "@/player"

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

const gameSubtitle = computed(() => {
  return (game.value && game.value.player1 ? game.value.player1 : "???") + " vs. " + (game.value &&   game.value.player2 ? game.value.player2 : "???")
})

const infoIcon = computed(() => {
  if (game.value && game.value.player2) {
  return playerIconTiny.value
  } else {
    return null
  }
})

const infoIcon2 = computed(() => {
  if (game.value && game.value.player2) {
  return null
  } else {
    return "⏳"
  } 
})

const infoMessage = computed(() => {
  if (game.value && game.value.player2) {
    return playerName.value + ", it's your turn."
  } else {
    return "Waiting for an opponent to join."
  }
})

onBeforeRouteLeave((to, from) => {
  if (game.value) {
    socket.emit('game:leave', { id: game.value.id })
  }
})
</script>

<template>
  <div class="game">
    <div id="game-header">
      <h1>{{ gameTitle }}</h1>
      <hr>
      <h4>{{ gameSubtitle }}</h4>
    </div>
    <div>
      <CheckerTable @move="postGameMove" />
      <div id="game-info">
        <div id="game-info-icon">
          <img class="player-icon" :src="infoIcon" />
          {{ infoIcon2 }}
        </div>
        <div><p>{{ infoMessage }}</p></div>
      </div>
    </div>
  </div>
</template>

<style>
#game-header {
  padding-bottom:10px;
}
#game-header hr {
  width:260px;
}
#game-info {
  padding-top: 10px;
  display:flex;
  align-items: center;
}
#game-info-icon {
  display: flex;
  align-content: center;
  padding-right:5px;
}
@media (min-width: 1024px) {
  .game {
  }
}
</style>
