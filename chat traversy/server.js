const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const {formatMessage,wformatMessage ,rformatMessage} = require("./utils/messages");
require("./db/conn");
const User = require("./schema/userschema");
const Msg = require("./schema/msgschema");
const {userJoin,getCurrentUser,getRoomUsers,userLeave,} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
var botName = "Bot"
// var botName = (Math.random() + 1).toString(10).substring(7);
app.use(express.static(path.join(__dirname, "public")));
io.on("connection", (socket) => {

  socket.on("joinRoom", async ({ username, room }) => {
    let user1 = await User.findOne({ name: username });
     if(user1 == null){
      //  console.log(username + room);
      // console.log('if is rinning');
      await userJoin(socket.id, username, room);
      var user = await User.findOne({ sid: socket.id });
      // console.log('user = '+ user);
      await socket.join(user.room);
      io.to(user.sid).emit("message", await wformatMessage(botName, user.room, ` ${user.name} welcome to dev!!!`)
    );
      
    }else{
      // console.log('else is runiing');
      var user2 = await User.findOne({ name: username });
      // console.log('user2 = '+ user2);
      let msgs = await Msg.find({room: room});
      // console.log(msgs);
      await socket.join(room);
      io.to(socket.id).emit("allmsg", msgs);
      // io.to(socket.id).emit("message", await wformatMessage(botName, user2.room, ` ${user2.name} welcome to dev!!!`)
    }
    socket.broadcast
      .to(room)
      .emit(
        "message",
        await wformatMessage(botName, room, ` ${username} has joined`)
      );
    // Send users and room info
    const ruser = await User.find({ room });
    io.to(room).emit("roomUsers", {
      room: room,
      ruser: ruser,
    });
  });
  socket.on("chatMessage", async (msg) => {
    const user3 = await getCurrentUser(socket.id);
    console.log("user3 = "+user3);
    io.to(user3.room).emit("message", await formatMessage(user3.name,user3.room, msg));
  });
  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        wformatMessage(botName, user.room, `${user.username} has left the chat`)
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
