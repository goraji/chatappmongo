const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  sid:{
    type:String,
  },
  name:{
    type:String,
    unique:true
  },
  room:{
    type: String
  }
});

const User = new mongoose.model('User', userSchema);
module.exports = User;