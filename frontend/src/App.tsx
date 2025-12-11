import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL);

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // 初回接続時にサーバーから過去のメッセージを取得
    socket.emit("getMessages");

    const handleMessage = (msg: string) => {
      console.warn(msg);
      setMessages((prev) => [...prev, msg]);
    };

    const handleInitMessages = (msgs: string[]) => {
      console.warn(msgs);
      setMessages(msgs);
    };

    socket.on("message", handleMessage);
    socket.on("initMessages", handleInitMessages);

    return () => {
      socket.off("message", handleMessage);
      socket.off("initMessages", handleInitMessages);
    };
  }, []);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    socket.emit("message", text);
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Socket.IO</h2>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メッセージを入力"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
