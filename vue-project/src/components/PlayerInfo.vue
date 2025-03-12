<script setup lang="ts">
import { playerName, playerIconColor } from '@/player'
import ConnectionIndicator from '../components/ConnectionIndicator.vue'
import MeepleIcon from '../components/MeepleIcon.vue'
</script>
<template>
  <div id="player-info">
    <MeepleIcon class="player-icon" :color="playerIconColor" :size="32" />
    <span id="player-name">
      {{ playerName }}
    </span>
    <ConnectionIndicator />
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
