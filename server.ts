import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/lib/db";
import Message from "./src/models/message";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const ROOM = "global_room";

// CONNECT DB
connectDB();

// 📥 CHAT HISTORY API
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// 🔌 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.join(ROOM);

  socket.on("send_message", async (data) => {
    try {
      const msg = await Message.create({
        user: data.user,
        message: data.message,
        room: ROOM,
      });

      io.to(ROOM).emit("receive_message", msg);
    } catch (err) {
      console.log("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// START SERVER
httpServer.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});