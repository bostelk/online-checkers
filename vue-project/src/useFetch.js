// useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url, options = { reset: true }) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state before fetching..
    if (options.reset) {
      data.value = null
      error.value = null
    }

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
