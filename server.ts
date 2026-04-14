import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/lib/db";
import Message from "./src/models/message";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const GLOBAL_ROOM = "global_room";

// ✅ connect DB ONCE
connectDB();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.join(GLOBAL_ROOM);

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    try {
      const msg = await Message.create(data);

      io.to(GLOBAL_ROOM).emit("receive_message", msg);
    } catch (err) {
      console.log("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket server running on 3001");
});