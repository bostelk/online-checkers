<script setup lang="ts">
import { playerName, playerIconSmall } from '@/player'
</script>
<template>
  <div id="player-info">
    <img class="player-icon" :src="playerIconSmall" />
    <span id="player-name">
      {{ playerName }}
    </span>
  </div>
</template>
<style scoped>
.player-icon {
  padding-left: 16px;
  padding-right: 16px;
}
#player-info {
  display: flex;
  align-items: center;
}
#player-name {
  align-content: center;
}
</style>
