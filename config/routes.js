var express = require('express');
var router = express.Router();
 var  bodyParser = require('body-parser'); //parses information from POST
 var methodOverride = require('method-override'); 
 var expressJWT = require("express-jwt");
 var TasksController = require('../controllers/tasks');
 var TeamsController = require('../controllers/teams');
 var UsersController = require('../controllers/users');
 var AuthenticationController = require('../controllers/auth');
 var passport = require('passport');
 var jwt      = require('jsonwebtoken');
 // AUTH
 router.route('/login')
 .post(AuthenticationController.login);
 
 router.route('/signup')
 .post(AuthenticationController.signup);

 router.route('/facebook')
 .get(passport.authenticate('facebook', { scope: ['email']}))

 router.route('/facebook/callback').get(AuthenticationController.facebookCallback, function (req,res) {
  res.render('/signup')
 });



 // USERS
 router.route('/users/')
 .post(UsersController.createUsers)
 .get(UsersController.indexUsers);
 router.route('/users/:id')
 .put(UsersController.updateUser);
 
 module.exports = router;