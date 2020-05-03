var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Client', userSchema);
