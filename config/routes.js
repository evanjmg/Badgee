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
 router.route('/users')
 .post(UsersController.createUsers)
 .get(UsersController.indexUsers);
 router.route('/users/:id')
 .get(UsersController.getUser)
 .put(UsersController.updateUser);
 router.route('/users/teams')
 .post(UsersController.getMyTeams);

 // TEAMS
 router.route('/teams')
  .post(TeamsController.createTeam)
  .get(TeamsController.indexTeams);

  router.route('/teams/:id')
  // .put(TeamsController.updateTeam)
  .get(TeamsController.showTeam);

// TASKS
router.route('/tasks/:id')
  .put(TasksController.updateTask)
  .get(TasksController.showTask);

router.route('/tasks/:id/complete')
  .post(TasksController.completeTask);

router.route('/tasks/:id/review')
  .post(TasksController.reviewTaskCompletion);

router.route('/tasks')
  .get(TasksController.indexTasks)
  .post(TasksController.createTask);

router.route('/tasks/pending')
    .post(TasksController.pendingTasks);


 module.exports = router;