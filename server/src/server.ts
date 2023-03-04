import { config } from "dotenv";
config();
import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    console.log(`joined a room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("new-message", (data) => {
    socket.to(data.chatId).emit("push-new-message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
