var LocalStrategy = require('passport-local').Strategy;

var User          = require("../models/user");
var jwt           = require('jsonwebtoken');


module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'email' : email }, function(err, user) {
        
        if (err) return done(err);
        if (user) return done(null, false);

        var newUser       = new User();
        newUser.email     = email;
        newUser.name = req.body.name;
        newUser.img_url   = req.body.img_url;
        newUser.local.password  = newUser.encrypt(password);
        newUser.save(function(err) {
          if (err) return done(err);
          return done(null, newUser);
        });
      });
    });
  }));
}