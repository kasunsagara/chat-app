"use client";

import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

type Message = {
  user: string;
  message: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [username] = useState("Kasun");

  // RECEIVE messages
  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // SEND message
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData: Message = {
      user: username,
      message: message,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold text-xl">
        💬 Chat App
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg.user === username
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-black"
            }`}
          >
            <p className="text-sm font-semibold">{msg.user}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-white flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}