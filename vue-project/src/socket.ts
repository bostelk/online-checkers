import { io } from "socket.io-client"
import { playerIconColor, playerName } from "./player"
export const socket = io("localhost:3000", { auth: { token: playerName.value, color: playerIconColor.value }})