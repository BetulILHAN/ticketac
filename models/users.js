const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  Name: String,
  Firstname: String,
  Email: String,
  Password: String,
  userJourney : [{ type: mongoose.Schema.Types.ObjectId, ref: 'journeys' }],
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel; 