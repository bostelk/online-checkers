<script setup lang="ts">
import { ref } from 'vue'

const title = defineModel('title')
const password = ref('')
const broadcast = ref(true)
const material = ref('marble')
const player1 = defineModel('playerName')
const player2 = ref('')

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

    <button type="submit">Submit</button>
  </form>
</template>
