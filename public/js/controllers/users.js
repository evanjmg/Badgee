angular.module('taggyApp')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state','$stateParams', '$location'];
function UsersController(User, TokenService, $state, $stateParams, $location){

  var self = this;
  self.user = {}

  self.users = {};

  if ($stateParams.user_id) {
    self.feed = User.feed({ id: $stateParams.user_id}, function (resp) {
      console.log(resp);
      return resp;
    });
  }
  if ($stateParams.user_id || $stateParams.id) {
    self.user = User.get({ id: ($stateParams.user_id || $stateParams.id) });
  }
  if (TokenService.isAuthed()) {
  
    self.currentUser = User.get({ id: (TokenService.parseJwt()).id }, function (response) {
      console.log(self.currentUser);
        if ($location.path() == '/users/tasks') {
          
          User.pendingTasks({ userId: response.id }, function (response) {
            self.pending = response;
            console.log(self.pending);
          }); 
        }

        if ($location.path() == '/users/tasks/created') {
        User.createdTasks({ userId: response.id }, function (response) {
          self.createdTasks = response;
        }); 
      }
        if ($location.path() == '/users/tasks/completed') {
        User.completedTasks({ userId: response.id }, function (response) {
          self.completedTasks = response;
        }); 
      }
    });

    // console.log(self.currentUser);
    self.all = User.query();
    // self.teams = User.teams( { "userId": self.currentUser.id});
  }

  self.getUser = function(user) {
    self.getUser = User.get({id: user._id});
  }
  self.login = function() {
    User.login({email: self.user.email , password: self.user.password },function(response){

    if (TokenService.isAuthed()) {
      self.currentUser = TokenService.parseJwt();
    }
     window.location.href = "/#/users/tasks";
     window.location.reload();
    })
  }
  self.update = function () {
    User.update(self.user, function (response) {
      console.log(response);
    })
  }
  self.signup = function() {
    if (!self.user.img_url) {
      self.user.img_url = 'http://www.badgee.uk/images/badgee-profile-filler'+Math.floor(Math.random()*2)+'.png';
    }
    User.signup(self.user,function(response){
      window.location.href = "/#/users/tasks";
      window.location.reload();
    })
  
    }
    self.logout = function() {
      TokenService.logout && TokenService.logout();
      window.location.href = "/#/";
      window.location.reload();
    }
    self.isAuthed = function() {
      return TokenService.isAuthed ? TokenService.isAuthed() : false
    }

    return self;
  }