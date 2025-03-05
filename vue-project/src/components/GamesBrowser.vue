<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
</script>

<template>
  <div>
    <h1>Games</h1>
    <ul>
      <li v-for="(game, id) in games">
        <RouterLink :to="gamePath(id)">{{ id }}</RouterLink>
      </li>
    </ul>
  </div>
</template>
