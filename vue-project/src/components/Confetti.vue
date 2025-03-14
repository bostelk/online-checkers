<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { type Container } from '@tsparticles/engine'
import { confetti } from '@tsparticles/confetti'

let container: Container | undefined

onMounted(async () => {
  ;(async () => {
    container = await confetti('tsparticles')
  })()
})
onUnmounted(() => {
  if (!container) {
    return
  }

  container.destroy()
  container = undefined
})
</script>
<template>
  <div id="tsparticles"></div>
</template>
