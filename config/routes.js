var express = require('express');
var router = express.Router();
 var  bodyParser = require('body-parser'); //parses information from POST
 var methodOverride = require('method-override'); 
 var expressJWT = require("express-jwt");
 var TasksController = require('../controllers/tasks');
 var TeamsController = require('../controllers/teams');
 var UsersController = require('../controllers/users');
 var AuthenticationController = require('../controllers/auth');
 router.route('/login')
 .post(AuthenticationController.login);
 
 router.route('/join')
 .post(AuthenticationController.signup);
 // USERS
    router.route('/users/')
    .post(UsersController.createUsers)
    .get(UsersController.indexUsers);
 
module.exports = router;