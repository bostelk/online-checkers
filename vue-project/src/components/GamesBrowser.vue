<script setup lang="ts">
import { watch, computed } from 'vue'
import { playerIconColor } from '@/player'
import { useFetch } from '@/useFetch'
import { usePeriodic } from '@/usePeriodic'
import MeepleIcon from '../components/MeepleIcon.vue'

const { counter } = usePeriodic(5000)
const { data, error } = useFetch(() => 'http://localhost:3000/games#' + counter.value, {
  reset: false,
})

watch(error, () => {
  console.error('Error! Could not reach the API. ' + error)
})

const games = data
const numGames = computed(() => (games.value ? Object.keys(games.value).length : 0))

const gamePath = (id) => {
  return '/games/' + id
}
</script>

<template>
  <div>
    <p v-if="numGames == 0">
      There are no games to play! Please create a
      <RouterLink to="/games/new">new game</RouterLink> first.
    </p>
    <ul>
      <li v-for="(game, id) in games">
        {{ game.title }}
        <div>
          <div v-if="game.player1">
            <MeepleIcon :color="game.player1Color" :size="16" />{{ game.player1 }}
          </div>
          <div v-else>
            <MeepleIcon :color="playerIconColor" :size="16" /><RouterLink :to="gamePath(id)"
              >Play</RouterLink
            >
          </div>
          <div v-if="game.player2">
            <MeepleIcon :color="game.player2Color" :size="16" />{{ game.player2 }}
          </div>
          <div v-else>
            <MeepleIcon :color="playerIconColor" :size="16" /><RouterLink :to="gamePath(id)"
              >Play</RouterLink
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
