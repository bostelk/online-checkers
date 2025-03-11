<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { playerIconColor, meepleIconTiny } from "@/player"

const games = ref({})
const loading = ref(false)

const fetchGames = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/games')
    const newGames = await res.json()
    games.value = newGames
  } catch (error) {
    console.error('Error! Could not reach the API. ' + error)
  } finally {
    loading.value = false
  }
}
const gamePath = (id) => {
  return '/games/' + id
}

let intervalId = null

onMounted(() => {
  fetchGames()
  // Set the interval to refresh data every 5 seconds (5000 ms)
  intervalId = setInterval(fetchGames, 5000)
})

onBeforeUnmount(() => {
  // Clear the interval when the component is destroyed
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const numGames = computed(() => Object.keys(games.value).length)
</script>

<template>
  <div>
    <p v-if="numGames == 0">
      There are no games to play! Please create a
      <RouterLink to="/games/new">new game</RouterLink> first.
    </p>
    <ul>
      <li v-for="(game, id) in games">
        {{ game.title}}
        <div>
          <div v-if="game.player1"><img :src="game.player1Color && meepleIconTiny(game.player1Color)">{{ game.player1 }}</div>
          <div v-else><img :src="meepleIconTiny(playerIconColor)"><RouterLink :to="gamePath(id)">Play</RouterLink></div>
          <div v-if="game.player2"><img :src="game.player2Color && meepleIconTiny(game.player2Color)">{{ game.player2 }}</div>
          <div v-else><img :src="meepleIconTiny(playerIconColor)"><RouterLink :to="gamePath(id)">Play</RouterLink></div>
        </div>
      </li>
    </ul>
  </div>
</template>