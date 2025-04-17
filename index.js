// server.js
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const { ExpressPeerServer } = require("peer");
const path = require("path");
const PORT = process.env.PORT;

const socket = io("https://webmeeting.onrender.com/"); // use actual URL

const peer = new Peer(userId, {
  host: "https://webmeeting.onrender.com/",
  port: 443,
  path: "/peerjs",
  secure: true,
});
app.use("/peerjs", peerServer);
app.use(express.static(path.join(__dirname, "assets")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/", require("./routes/index"));

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId, userName);

    socket.on("send-message", (inputMsg, userName) => {
      io.to(roomId).emit("recieve-message", inputMsg, userName);
    });

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId, userName);
    });
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is live on Render, running on port ${PORT}`);
});
