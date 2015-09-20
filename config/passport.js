var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
  
  // FACEBOOK SIGN UP
  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.FACEBOOK_API_TAGGY,
    clientSecret    : process.env.FACEBOOK_API_SECRET_TAGGY,
    callbackURL     : '/api/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails']
  }, function(access_token, refresh_token, profile, done) {

    console.log(profile);
    process.nextTick(function() {

      User.findOne({ email: profile.emails[0].value }, function(err, user) {
        if (err) return done(err);
        if (user) {
          user.facebook.id = profile.id;
          user.facebook.access_token = access_token; 
          user.save(function(err) {
            if (err) throw err;
            return done(null, user);
          })
      
        } else {

          var newUser = new User();
          newUser.facebook.id           = profile.id;
          newUser.facebook.access_token = access_token;
          newUser.name  = profile.name.givenName + ' ' + profile.name.familyName
          newUser.email        = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        };
      });
    });
  }));
}