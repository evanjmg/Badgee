var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  creator: {type: mongoose.Schema.ObjectId, ref: 'User'},
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
