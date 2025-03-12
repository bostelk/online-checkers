<script setup lang="ts">
import { computed } from 'vue'
import { meepleUrl } from '@/assetUrl'
const props = defineProps({
  color: { type: String, required: true },
  size: Number,
})

const url = computed(() => {
  return meepleUrl(props.color, props.size)
})
</script>
<template>
  <img :src="url" />
</template>
