import { io } from 'socket.io-client'
import { playerIconColor, playerName } from './player'
import { checkersAPI } from './api'

export const socket = io(checkersAPI.baseUrl.toString(), {
  auth: { token: playerName.value, color: playerIconColor.value },
})
