<script setup lang="ts">
import CheckerTable from '../components/CheckerTable.vue'
import { useRoute, onBeforeRouteLeave} from 'vue-router'
import { ref, reactive, watch, computed, onMounted, provide } from 'vue'
import { socket } from "@/socket";

const route = useRoute()
const game = reactive({})
const loading = ref(false)
const err = ref({})

provide('server-game', game)

const fetchGame = async (id) => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/games/' + id)
    const data = await res.json()
    if (!('err' in data)) {
      game.value = data
    } else {
      err.value = data
    }
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

socket.on("game:join", (payload: { name: string, color: string }) => {
  if (game.value.player1 === '') {
    game.value.player1 = payload.name
  } else if (game.value.player2 === '') {
    game.value.player2 = payload.name
  }
})
socket.on("game:leave", (payload: { name: string, color: string }) => {
  if (game.value.player1 === payload.name) {
    game.value.player1 = ''
  } else if (game.value.player2 === payload.name) {
    game.value.player2 = ''
  }
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
  socket.emit('game:join', { id: route.params.id }) // The client should block enter until server has acknowledged the join.
  await fetchGame(route.params.id)
})

const gameTitle = computed(() => {
  return game.value ? game.value.title : 'Unknown'
})

const gameSubtitle = computed(() => {
  if (gameFinished.value) {
    return (game.value && game.value.winner ? game.value.winner : "???") + " vs. " + (game.value && game.value.loser ? game.value.loser : "???")
  } else {
    return (game.value && game.value.player1 ? game.value.player1 : "???") + " vs. " + (game.value && game.value.player2 ? game.value.player2 : "???")
  }
})

const currentPlayer = computed(() => {
  return (game.value.moves && game.value.moves.length % 2 === 0) ? game.value.player1 : game.value.player2
})

const currentTurnColor = computed(() => {
  return (game.value.moves && game.value.moves.length % 2 === 0) ? "black" : "red"
})

const gameFinished = computed(() => {
  return game.value && game.value.winner
})

const gameInProgress = computed(() => {
  return game.value && game.value.player1 && game.value.player2 && !game.value.winner
})

const infoIcon = computed(() => {
  if (gameInProgress.value) {
  return "/src/assets/checker-" + currentTurnColor.value + "-16.png"
  } else {
    return null
  }
})

const infoIcon2 = computed(() => {
  if (err.value.code === 404) {
    return "⚠️"
  } else if (gameInProgress.value) {
  return null
  } else if (game.value && game.value.winner) {
    return "🥳"
  } else {
    return "⏳"
  } 
})

const infoMessage = computed(() => {
  if (err.value.code === 404) {
    return err.value.err
  } else if (game.value && game.value.winner) {
    return `Congrats ${game.value.winner}! You win.`
  } else if (gameInProgress.value) {
    return currentPlayer.value + ", it's your turn."
  }  else {
    return "Waiting for an opponent to join."
  }
})

onBeforeRouteLeave((to, from) => {
  if (game.value) {
    socket.emit('game:leave', { id: game.value.id })
  }
})

watch(err, () => {
  console.error(`${err.value.err} (${err.value.code})`)
})
</script>

<template>
  <div class="game">
    <div id="game-header">
      <h1>{{ gameTitle }}</h1>
      <hr>
      <p>{{ gameSubtitle }}</p>
    </div>
    <div>
      <CheckerTable @move="postGameMove" />
      <div id="game-info">
        <div id="game-info-icon">
          <img :src="infoIcon" />
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
.test {
  padding-top: 10px;
  display:flex;
  align-items: center;
}
.test-2 {
  display: flex;
  align-content: center;
  padding-left:2px;
}
.test-3 {
  display: flex;
  align-content: center;
  padding-left:2px;
}
@media (min-width: 1024px) {
  .game {
  }
}
</style>
