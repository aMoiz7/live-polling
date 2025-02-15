import express from "express";
import dotenv from "dotenv";
import bodyParser from "express";
import userRoutes from "./routes/user";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

const server = http.createServer(app);
export const io = new Server(server);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(port, "port");
});

app.get("/", (req, res) => {
  res.status(200).json("hellow world");
});

io.on("connection", (socket) => { 
  console.log("socket connected");

  socket.on("disconnected", () => {
    console.log("socket disconnected");
  });
});

app.use("/api/v1/user", userRoutes);
