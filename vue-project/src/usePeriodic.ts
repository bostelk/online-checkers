// usePeriodic.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function usePeriodic(timeout?: number) {
  const counter = ref(0)

  const handler = () => {
    counter.value += 1
  }

  let intervalId: number | null = null

  onMounted(() => {
    handler() // Run immediate

    // Set the interval to refresh data every x milliseconds
    intervalId = setInterval(handler, timeout)
  })

  onBeforeUnmount(() => {
    // Clear the interval when the component is destroyed
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return { counter }
}
