var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  members: [ { total_points: Number,
             member: { type: mongoose.Schema.ObjectId, ref: 'User'},
             tasks_completed: Number } ],
  name: String,
  active_user: { type: mongoose.Schema.ObjectId, ref: 'User'},
  active_task: { type: mongoose.Schema.ObjectId, ref: 'Task'} 
});

module.exports = mongoose.model('Team', TeamSchema);