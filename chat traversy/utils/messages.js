const moment = require('moment');
const Msg = require('../schema/msgschema');

async function formatMessage(username, text) {
  
  const data =  {
    name:username,
    msg:text,
    time: moment().format('h:mm a')
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

module.exports = formatMessage;
