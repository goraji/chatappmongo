const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
var botname = "Rose";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    io.to(user.id).emit("message",formatMessage(botname, ` ${username} welcome to dev!!!`));

    socket.broadcast.to(user.room).emit("message", formatMessage(botname, ` ${user.username} has joined`));

        // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    //  console.log("username  "+user.username);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

   // Runs when client disconnects
   socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  // Send users and room info


});

const port = 3000;
server.listen(port, () => {
  console.log(`running at port ${port}`);
});
