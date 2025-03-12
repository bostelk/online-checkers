<script setup lang="ts">
import { ref, computed } from 'vue'
import CreateGameForm from '@/components/CreateGameForm.vue'
import { playerName } from '@/player'
import { checkersAPI } from '@/api'

const gameTitle = ref('New Game')
const loading = ref(false)
const game = ref(null)

const postNewGame = async (form) => {
  loading.value = true
  try {
    const payload = {
      title: form.title.value,
      password: form.password.value,
      broadcast: form.broadcast.value,
      material: form.material.value,
      player1: form.player1.value,
      player2: form.player2.value,
    }
    const res = await fetch(checkersAPI.newGame().toString(), {
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

const noGame = computed(() => {
  return game.value === null
})

const gamePath = () => {
  return '/games/' + (game.value ? game.value.id : '')
}
</script>

<template>
  <div v-show="noGame">
    <h1>{{ gameTitle }}</h1>
    <p>Play a new game of Checkers</p>
    <br />
    <CreateGameForm
      v-model:title="gameTitle"
      v-model:player-name="playerName"
      @submit="postNewGame"
    />
  </div>
  <div v-show="!noGame">
    <p>Game created successfully! <RouterLink :to="gamePath()">Play game</RouterLink></p>
  </div>
</template>
