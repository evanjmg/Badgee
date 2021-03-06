var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Team = require('./team');

var UserSchema = new mongoose.Schema({

  teams: [{ type: mongoose.Schema.ObjectId, ref: 'Team'}],
  created_tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task'}],
  completed_tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task'}],
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true}, 
  total_coins: { type: Number, default: 0 },
  img_url: String,
  headline: String,
  local: {
    password: String
  },
  facebook: {
    id: String,
    username: String
  } 
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      email: ret.email,
      name: ret.name,
      img_url: ret.img_url,
      teams: ret.teams,
      total_coins : ret.total_coins,
      completed_tasks: ret.completed_tasks,
      created_tasks: ret.created_tasks,
      headline: ret.headline
      // facebook: {
      //   id: ret.facebook.id,
      //   username: ret.facebook.username
      // }
    }
    return returnJson;
  }
});

UserSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}
 module.exports = mongoose.model("User", UserSchema);
