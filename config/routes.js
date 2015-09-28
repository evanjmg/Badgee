var express = require('express');
var router = express.Router();
 var  bodyParser = require('body-parser'); //parses information from POST
 var methodOverride = require('method-override'); 
 var expressJWT = require("express-jwt");
 var TasksController = require('../controllers/tasks');
 var TeamsController = require('../controllers/teams');
 var UsersController = require('../controllers/users');
 var SearchController = require('../controllers/search');

 var AuthenticationController = require('../controllers/auth');
 var passport = require('passport');
 var jwt      = require('jsonwebtoken');
 // AUTH
 router.route('/login')
 .post(AuthenticationController.login);
 
 router.route('/signup')
 .post(AuthenticationController.signup);
 
 router.route('/auth/facebook').post(AuthenticationController.facebookCallback);

 // USERS
 router.route('/users')
 .post(UsersController.createUsers)
 .get(UsersController.indexUsers);
 router.route('/users/:id')
 .get(UsersController.getUser)
 .put(UsersController.updateUser);
 router.route('/users/teams')
 .post(UsersController.getMyTeams);
 router.route('/users/:id/feed')
 .get(UsersController.getUserFeed);
 
 // TEAMS
 router.route('/teams')
  .post(TeamsController.createTeam)
  .get(TeamsController.indexTeams);

  router.route('/teams/:id')
  // .put(TeamsController.updateTeam)
  .get(TeamsController.showTeam);
// SEARCH 
router.route('/search/:query').get(SearchController.searchInstagram);
// TASKS
router.route('/tasks/copy')
  .post(TasksController.copyTask);
  
router.route('/tasks/created')
  .post(TasksController.createdTasks);

router.route('/tasks/completed')
  .post(TasksController.completedTasks);

router.route('/tasks/:id/accept-response')
  .get(TasksController.acceptResponse);
  
router.route('/tasks/:id/reject-response')
  .get(TasksController.rejectResponse);

router.route('/tasks/:id')
  .put(TasksController.updateTask)
  .get(TasksController.showTask);

router.route('/tasks/complete')
  .post(TasksController.completeTask);

router.route('/tasks/:id/review')
  .post(TasksController.reviewTaskCompletion);

router.route('/tasks/:id/reject')
  .get(TasksController.rejectTask);

  
router.route('/tasks')
  .get(TasksController.indexTasks)
  .post(TasksController.createTask);

router.route('/tasks/pending')
    .post(TasksController.pendingTasks);


 module.exports = router;