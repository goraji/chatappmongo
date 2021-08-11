// require('../../db/conn');
// const User = require('../../schema/userschema')
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leave  = document.getElementById('leave-btn');
const socket = io();

// const Msg = require('../../schema/msgschema');
const {username ,room} =  Qs.parse(location.search,{
  ignoreQueryPrefix: true 
});

socket.emit('joinRoom',{username,room});

socket.on('roomUsers',(room) => {
  // console.log("users = "+ruser);
  outputRoomName(room.room);
  outputUsers(room.ruser);
});

socket.on('message',message=>{
  // console.log("msg = "+message);
  outputMessage(message);
  scrollToBottom();

})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();


});
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.name} <span> ${message.time} </span></p>
  <p class="text">
    ${message.msg}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
  
}
function scrollToBottom (){
  chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
async function outputUsers(users) {
  // const data = await User.find({room});
// console.log("data= "+users)
  userList.innerHTML = '';
  users.forEach((users) => {
    const li = document.createElement('li');
    li.innerText = users.name;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
leave.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
