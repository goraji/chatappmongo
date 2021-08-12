const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
  sid:{
    type:String
  },
  name:{
    type:String,
    unique:true
  },
  room:{
    type: String
  },
  time:{
    type:String
  },
  msg:{
    type:String
  }
});

const Msg = new mongoose.model('Msg', msgSchema);
module.exports = Msg;