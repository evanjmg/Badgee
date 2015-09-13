var mongoose = require('mongoose');

var User = require('./user');


var TaskSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.ObjectId, ref: 'User'},
  _tagged_member: { type: mongoose.Schema.ObjectId, ref: 'User'},
  start_time: Date,
  img_url: String,
  end_time: Date,
  description: String,
  completed: { type: Boolean, default: false }, 
  location: {
    name: String,
    address: String,
    lat: String,
    lon: String
  }
});

module.exports = mongoose.model('Task', TaskSchema);
