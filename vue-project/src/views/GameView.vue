<script setup lang="ts">
import CheckerTable from '../components/CheckerTable.vue'
</script>

<template>
  <div class="game">
    <CheckerTable />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .game {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
