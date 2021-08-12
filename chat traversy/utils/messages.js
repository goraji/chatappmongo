const moment = require('moment');
const Msg = require('../schema/msgschema');

async function formatMessage(username,room, text) {
  const data =  {
    name:username,
    room:room,
    time: moment().format('h:mm a'),
    msg:text
  };
  const data1 = new Msg(data);
  await data1.save();
  return data1;
  // return user;

  // return {
  //   username:username,
  //   text:text,
  //   time: moment().format('h:mm a')
  // };

}

async function wformatMessage(username,room, text) {

  return {
    name:username,
    room:room,
    time: moment().format('h:mm a'),
    msg:text
  };

}
async function rformatMessage(msgs) {
// console.log("msgs" +msgs);
// return 
// msgs.map((ele)=>{
// // console.log("ele = "+ele.name);


// })
// let msg = JSON.stringify(msgs);
// console.log(msg);


}


module.exports = {formatMessage, wformatMessage ,rformatMessage};
