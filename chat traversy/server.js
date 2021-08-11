const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
require("./db/conn");
const User = require("./schema/userschema");
const Msg = require("./schema/msgschema");
const {userJoin,getCurrentUser,getRoomUsers,userLeave,} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
var botName = "Bot";
app.use(express.static(path.join(__dirname, "public")));
io.on("connection", (socket) => {
  
  socket.on("joinRoom", async ({ username, room }) => {
    userJoin(socket.id, username, room);
    const user = await User.findOne({ sid: socket.id });
    socket.join(user.room);
    io.to(user.sid).emit(
      "message",
      await formatMessage(botName, ` ${user.name} welcome to dev!!!`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        await formatMessage(botName, ` ${user.name} has joined`)
      );
    // Send users and room info
    const ruser = await User.find({ room });
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      ruser: ruser,
    });
  });
  socket.on("chatMessage", async (msg) => {
    const user = await getCurrentUser(socket.id);
    io.to(user.room).emit("message", await formatMessage(user.name, msg));
  });
  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
  // Send users and room info
});
const port = 3000;
server.listen(port, () => {
  console.log(`running at port ${port}`);
});
