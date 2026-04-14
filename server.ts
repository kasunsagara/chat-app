import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const GLOBAL_ROOM = "global_room";

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join global room automatically
  socket.join(GLOBAL_ROOM);

  // receive message
  socket.on("send_message", (data: { user: string; message: string }) => {
    console.log("Message:", data);

    // broadcast to all users in room
    io.to(GLOBAL_ROOM).emit("receive_message", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket server running on http://localhost:3001");
});