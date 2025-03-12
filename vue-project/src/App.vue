<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { watch } from 'vue'
import PlayerInfo from './components/PlayerInfo.vue'
import { playerName, playerIconColor } from '@/player'
import { meepleUrl } from '@/assetUrl'

watch(
  playerName,
  (newName) => {
    document.title = `${newName} | Checkers`
  },
  { immediate: true },
)
watch(
  playerIconColor,
  (newColor) => {
    const link = document.querySelector("link[rel~='icon']")
    link.href = meepleUrl(newColor, 16)
  },
  { immediate: true },
)
</script>

<template>
  <header>
    <div class="wrapper">
      <div>
        <PlayerInfo />
      </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/games/new">New Game</RouterLink>
        <RouterLink to="/games">Join Game</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: 0rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
