"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

type Message = {
  user: string;
  message: string;
  createdAt?: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);

  // LOAD CHAT HISTORY
  useEffect(() => {
    fetch("http://localhost:3001/messages")
      .then((res) => res.json())
      .then((data) => setChat(data));
  }, []);

  // REALTIME CHAT
  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!username.trim()) return;

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
            💬 Chat Login
          </h1>

          <input
            className="w-full border p-2 mb-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white p-2"
            onClick={() => username.trim() && setIsLoggedIn(true)}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold">
        💬 Chat App - {username}
      </div>

      {/* CHAT BOX */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg, i) => (
          <div key={i} className="bg-white p-2 rounded shadow">
            <b>{msg.user}:</b> {msg.message}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white flex gap-2">
        <input
          className="flex-1 border p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}