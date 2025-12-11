import { createServer } from "http";
import { Server } from "socket.io";
import admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

console.warn(process.env.FIREBASE_SERVICE_ACCOUNT);
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("クライアント接続: ", socket.id);

  // 過去のメッセージを送る
  socket.on("getMessages", async () => {
    try {
      const snapshot = await db.collection("messages")
        .orderBy("createdAt") // 昇順で取得
        .get();
      const msgs = snapshot.docs.map(doc => doc.data().text as string);
      socket.emit("initMessages", msgs);
    } catch (err) {
      console.error("過去メッセージ取得失敗:", err);
    }
  });

  socket.on("message", async (msg) => {
    console.log("受信: ", msg);
    io.emit("message", msg);

    try {
      await db.collection("messages").add({
        text: msg,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("保存失敗: ", err);
    }

  });

  socket.on("disconnect", () => {
    console.log("切断: ", socket.id);
  });
});

const PORT = Number(process.env.PORT) || 8080;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});



