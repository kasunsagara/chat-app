"use client";

import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

type Message = {
  user: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);

  // receive messages
  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      user: username,
      message,
    });

    setMessage("");
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80">
          <h1 className="text-xl font-bold mb-4 text-center">
            💬 Login Chat
          </h1>

          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white p-2 rounded"
            onClick={() => {
              if (username.trim()) setIsLoggedIn(true);
            }}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  // CHAT SCREEN
  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold">
        💬 Chat App - {username}
      </div>

      {/* Chat box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg, index) => (
          <div key={index} className="bg-white p-2 rounded shadow">
            <b>{msg.user}:</b> {msg.message}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type message..."
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