"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 8000;
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
        console.log(`joined a room ${roomId}`);
        socket.join(roomId);
    });
    socket.on("leave-room", (chatId) => {
        socket.leave(chatId);
    });
    socket.on("new-message", (event) => {
        socket.to(event.data.events[1]).emit("push-new-message", event);
    });
    socket.on("typing", (data) => {
        console.log({ data });
        socket.to(data.chatId).emit("typing-status", data);
    });
});
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
