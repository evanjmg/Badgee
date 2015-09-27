var User    = require('../models/user');
var jwt      = require('jsonwebtoken');
var passport = require('passport');
var request = require('request');


 function facebookCallback (req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me?fields=email,name,id';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_API_SECRET_BADGEE,
    redirect_uri: req.body.redirectUri
  };

 // Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      console.log(profile);
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }

      if (req.headers.authorization) {
       
        User.findOne({ 'facebook.id' : profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, process.env.BADGEE_SECRET);


          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook.id = profile.id;
            user.img_url = user.img_url || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.name = user.name || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token, success: true });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ "facebook.id": profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = jwt.sign(existingUser, process.env.BADGEE_SECRET, { expiresInMinutes: 1440 });
            return res.send({ token: token });
          }

          var user = new User();
          user.email = profile.email;
          user.facebook.id = profile.id;
          user.img_url = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.name = profile.name;
          user.save(function() {
      
            var token = jwt.sign(user, process.env.BADGEE_SECRET, { expiresInMinutes: 1440 });
            res.send({ token: token });
          });
        });
      }
    });
  });
};

function signup(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send({ error: 'User already exists!' + JSON.parse(info) });

    var token = jwt.sign(user, process.env.BADGEE_SECRET, { expiresInMinutes: 1440 });

    return res.status(200).send({ 
      success: true,
      message: "There is no going back now.",
      token: token
    });
  })(req, res, next);
};

function login(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) return res.status(500).send(err);

    if (!user) return res.status(403).send({ message: 'You seem to be mistaken, we have no user with that identity.' });

    if (!user.validPassword(req.body.password)) return res.status(403).send({ message: 'Authentication failed. Wrong password.' });

    var token = jwt.sign(user, process.env.BADGEE_SECRET, { expiresInMinutes: 1440 });

    return res.status(200).send({
      success: true,
      message: 'You are In',
      token: token
    });
  });
};

module.exports = {
  facebookCallback : facebookCallback,
  signup: signup,
  login: login
}