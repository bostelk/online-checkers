<script setup lang="ts">
import CheckerTable from '../components/CheckerTable.vue'
import { useRoute } from 'vue-router'
import { ref, reactive, watch, computed, onMounted, provide } from 'vue'

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
  loading.value = true
  try {
    const payload = { move: [oldX, oldY, newX, newY] }
    const res = await fetch('http://localhost:3000/games/' + game.value.id + '/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const newGame = await res.json()
    game.value = newGame
  } catch (error) {
    console.error('Error! Could not reach the API. ' + error)
  } finally {
    loading.value = false
  }
}

// fetch the game when params change
watch(
  () => route.params.id,
  async (newId) => {
    await fetchGame(newId)
  },
)

onMounted(() => {
  fetchGame(route.params.id)
})

const gameTitle = computed(() => {
  return game.value ? game.value.title : 'Unknown'
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
