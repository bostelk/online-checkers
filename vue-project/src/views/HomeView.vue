<script setup lang="ts">
import { playerName } from '@/player'
</script>

<template>
  <div>
    <h1>Online Checkers</h1>
    <p>Hi! {{ playerName }} 👋 Welcome to online checkers.</p>
    <br />
    <p>
      You can create a <RouterLink to="/games/new">new game</RouterLink> or
      <RouterLink to="/games">join an existing game</RouterLink>. GLHF 😊
    </p>
  </div>
</template>
