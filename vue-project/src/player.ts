import { ref, computed } from 'vue'

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
    'Dawn',
  ]
  const lastName = [
    'von Licht',
    'Truthseeker',
    'Mann',
    'Doe',
    'Firstlight',
    'Seagrass',
    'Dreamwalker',
    'Furry',
    'Lightbringer',
  ]
  return (
    firstName[Math.floor(Math.random() * firstName.length)] +
    ' ' +
    lastName[Math.floor(Math.random() * lastName.length)]
  )
}

const generatePlayerIconColor = () => {
  const colors = ['white', 'black', 'aqua', 'gold', 'blue', 'red', 'fuschia', 'lime']
  return colors[Math.floor(Math.random() * colors.length)]
}

export const playerName = ref(generatePlayerName())
export const playerIconColor = ref(generatePlayerIconColor())
export const playerIconSmall = computed(() => meepleIconSmall(playerIconColor.value))
export const playerIconTiny = computed(() => meepleIconTiny(playerIconColor.value))
export const meepleIcon = (color: string, size: number) => {
  return `/src/assets/meeple/meeple-${color}-${size}.png`
} // Baked interpolation: @ => src
export const meepleIconTiny = (color: string) => {
  return meepleIcon(color, 16)
}
export const meepleIconSmall = (color: string) => {
  return meepleIcon(color, 32)
}
