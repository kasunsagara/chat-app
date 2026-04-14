import { io, Socket } from "socket.io-client";

// message type (optional here or import from types)
export interface Message {
  user: string;
  message: string;
}

// create socket connection
export const socket: Socket = io("http://localhost:3001", {
  autoConnect: true,
});

// optional: connection logs
socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});