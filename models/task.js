var mongoose = require('mongoose');

var User = require('./user');


var TaskSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.ObjectId, ref: 'User'},
  _tagged_member: { type: mongoose.Schema.ObjectId, ref: 'User'},
  start_time: Date,
  img_url: String,
  end_time: Date,
  minutes: Number,
  description: String,
  completed: { type: Boolean, default: null },
  completion: {
    img_url: String,
    message: String,
    minutes: Number,
    start_time: Date,
    end_time: Date,
    location: {
      name: String,
      address: String,
      lat: String,
      lon: String
    }
  }, 
  location: {
    name: String,
    address: String,
    lat: String,
    lon: String
  }
});

module.exports = mongoose.model('Task', TaskSchema);
