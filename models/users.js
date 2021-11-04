const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  Name: String,
  Firstname: String,
  Email: String,
  Password: String,

});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel; 