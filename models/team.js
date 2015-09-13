var mongoose = require('mongoose');

var User = require('./user');
var Task = require('./task');

var TeamSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  members: [ { total_points: { type: Number, default: 0 },
             _member: { type: mongoose.Schema.ObjectId, ref: 'User'},
             tasks_completed: { type: Number, default: 0 } }],
  name: String,
  active_user: { type: mongoose.Schema.ObjectId, ref: 'User'},
  tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task'}]
});

module.exports = mongoose.model('Team', TeamSchema);