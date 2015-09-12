var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true},
  img_url: String,
  local: {
    password: String
  },
  facebook: {
    username: String,
    token: String
  } 
});

UserSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}
var User = mongoose.model("User", UserSchema);
module.exports = User;