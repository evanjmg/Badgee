var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true},
  img_url: String,
  local: {
    password: String
  },
  facebook: {
    id: String,
    username: String,
    access_token: String
  } 
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      email: ret.email,
      name: ret.name,
      img: ret.img
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
