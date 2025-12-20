import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

type Message = {
  text: string;
  senderId: string;
  createdAt: number;
}

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 初回接続時にサーバーから過去のメッセージを取得
    socket.emit("getMessages");

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleInitMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    socket.on("message", handleMessage);
    socket.on("initMessages", handleInitMessages);

    return () => {
      socket.off("message", handleMessage);
      socket.off("initMessages", handleInitMessages);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    socket.emit("message", {
      text,
      senderId: socket.id,
      createdAt: Date.now()
    });
    setText("");
  };

  return (
    <div className="chat-app">

      <header className="chat-header">
        <h1>💬Chat App</h1>
      </header>

      <div className="chat-container">
        {messages.map((message, index) => {
          const isMe = message.senderId === socket.id;
          const formattedTime = new Date(message.createdAt).toLocaleTimeString("ja-JP", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div key={index} className={`message-row ${isMe ? "me" : "other"}`}>
              {isMe && <span className="time">{formattedTime}</span>}
              <p className={`message ${isMe ? "me" : "other"}`}>
                <span className="text">{message.text}</span>
              </p>
              {!isMe && <span className="time">{formattedTime}</span>}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}
