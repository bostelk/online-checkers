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
