<script setup lang="ts">
import { ref } from 'vue'

const generatePlayerName = () => {
  const firstName = [
    'Scrap',
    'John',
    'Adam',
    'Stacy',
    'Reb',
    'Derek',
    'Locas',
    'Robin',
    'Summer',
    'Sarah',
  ]
  const lastName = [
    'von Licht',
    'Truthseeker',
    'Mann',
    'Doe',
    'Fristlight',
    'Seagrass',
    'Dreamwalker',
    'Furry',
  ]
  return (
    firstName[Math.floor(Math.random() * firstName.length)] +
    ' ' +
    lastName[Math.floor(Math.random() * lastName.length)]
  )
}

const title = defineModel('title')
const password = ref('')
const broadcast = ref(true)
const material = ref('marble')
const player1 = ref(generatePlayerName())
const player2 = ref(generatePlayerName())

const emit = defineEmits({
  // Validate submit event
  submit: ({ title, password, broadcast, material, player1, player2 }) => {
    return true // Always valid
  },
})

function submitForm() {
  emit('submit', { title, broadcast, password, material, player1, player2 })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <label for="title">Title:</label>&nbsp;
    <input type="text" id="title" name="title" required v-model="title" /><br />

    <label for="password">Password (optional):</label>&nbsp;
    <input type="password" id="password" name="password" :value="password" /><br />

    <label for="broadcast">Broadcast</label>&nbsp;
    <input type="checkbox" id="broadcast" name="broadcast" v-model="broadcast" /><br /><br />

    <label for="material">Material:</label>&nbsp;
    <select id="material" name="material" v-model="material" required>
      <option value="wood">Wood</option>
      <option value="marble">Marble</option></select
    ><br /><br />

    <label for="player1">Player 1 Name:</label>&nbsp;
    <input type="text" id="player1" name="player1" :value="player1" required /><br />

    <label for="player2">Player 2 Name:</label>&nbsp;
    <input type="text" id="player2" name="player2" :value="player2" required /><br /><br />

    <button type="submit">Submit</button>
  </form>
</template>
