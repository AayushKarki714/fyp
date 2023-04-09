import { io } from "socket.io-client";

// const socket = io("https://project-zone.onrender.com/");
const socket = io("http://localhost:8000");

export default socket;
