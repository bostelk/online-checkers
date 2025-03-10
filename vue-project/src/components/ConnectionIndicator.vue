<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { socket } from '@/socket'

const status = ref('Unknown')

onMounted(() => {
  status.value = 'Connecting' // Assumed autoconnect is enabled.
})

const registerEvents = (socket) => {
  socket.on('connect', () => {
    status.value = 'Online'

    const engine = socket.io.engine
    // console.log(engine.transport.name) // in most cases, prints "polling"

    engine.once('upgrade', () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      // console.log(engine.transport.name) // in most cases, prints "websocket"
    })

    engine.on('packet', ({ type, data }) => {
      // called for each packet received
    })

    engine.on('packetCreate', ({ type, data }) => {
      // called for each packet sent
    })

    engine.on('drain', () => {
      // called when the write buffer is drained
    })

    engine.on('close', (reason) => {
      // called when the underlying connection is closed
      status.value = 'Offline'
    })
  })
  socket.on('connect_error', (error) => {
    if (socket.active) {
      // temporary failure, the socket will automatically try to reconnect
      status.value = 'Reconnecting'
    } else {
      // the connection was denied by the server
      // in that case, `socket.connect()` must be manually called in order to reconnect
      console.log(error.message)
      status.value = 'Offline'
    }
  })
  socket.on('disconnect', (reason, details) => {
    status.value = 'Offline'
  })
}

registerEvents(socket)

const statusIconClass = computed(() => (status.value !== 'Online' ? 'problem' : ''))

const ellipsis = ref('')
let intervalId = null

const nextEllipsis = () => {
  if (ellipsis.value.length < 3) {
    ellipsis.value += '.'
  } else {
    ellipsis.value = '.' // Reset
  }
}

watch(
  status,
  (oldStatus, newStatus) => {
    clearInterval(intervalId)
    if (status.value.endsWith('ing')) {
      ellipsis.value = '.'
      intervalId = setInterval(() => {
        nextEllipsis()
      }, 500)
    } else {
      ellipsis.value = '' // Reset.
    }
  },
  { immediate: true },
)
</script>
<template>
  <div id="net-io-status"><span :class="statusIconClass">📶</span> {{ status }}{{ ellipsis }}</div>
</template>

<style scoped>
#net-io-status {
  position: absolute;
  left: 10px;
  top: 10px;
}
.problem {
  opacity: 50%;
}
</style>
