import { io } from "socket.io-client";

console.log("hola");
const socket = io("http://localhost:8000");

export default socket;
