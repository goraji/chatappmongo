const users = [];

const User = require('../schema/userschema');

// Join user to chat
async function userJoin(id, username, room) {
  const user1 = { 
    sid: id,
    name : username,
    room: room
   };
  const data = new User(user1);
  const d1 =  await data.save();
  return d1;
  // users.push(user1);
  // return user1;
}

// Get current user
async function getCurrentUser(id) {
  const sid = id;
  const data = await User.findOne({sid});
  return data;

  // return users.find((user) => user.id == id);
}

// User leaves chat
async function userLeave(id) {
  const sid = id;
  const user1 = await User.findOne({sid});
  return user1;
  // const index = users.findIndex((user) => user.id === id);

  // if (index !== -1) {
  //   return users.splice(index, 1)[0];
  // }
}

// Get room users
async function getRoomUsers(room) {
  const data = await User.find({sid:room});
  return data.name;

  // return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
