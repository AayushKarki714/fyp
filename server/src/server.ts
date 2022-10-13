import { config } from "dotenv";
// load's the .env file
config();
import http from "http";
import app from "./app";

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
