angular.module('taggyApp')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state', '$location'];
function UsersController(User, TokenService, $state, $location){

  var self = this;
  self.user = {}

  self.users = {};
  if (TokenService.isAuthed()) {
    self.all = User.query();
    self.currentUser = TokenService.parseJwt();
    console.log(self.currentUser);
    self.teams = User.teams( { "userId": self.currentUser.id});
  }

  if ($location.path() == '/users/tasks') {
    
    User.pendingTasks({ userId: self.currentUser.id }, function (response) {
      self.pending = response;
      console.log(self.pending);
    }); 
  }
  if ($location.path() == '/users/tasks/created') {
  User.createdTasks({ userId: self.currentUser.id }, function (response) {
    self.createdTasks = response;
  }); 
}
  if ($location.path() == '/users/tasks/completed') {
  User.completedTasks({ userId: self.currentUser.id }, function (response) {
    self.completedTasks = response;
  }); 
}

  self.getUser = function(user) {
    self.getUser = User.get({id: user._id});
  }
  self.login = function() {
    User.login({email: self.user.email , password: self.user.password },function(response){

    if (TokenService.isAuthed()) {
      self.currentUser = TokenService.parseJwt();
    }
      $state.go('myTasks');
    })
  }
  self.update = function () {
    User.update(self.user, function (response) {
      console.log(response);
    })
  }
  self.signup = function() {
    if (!self.user.img_url) {
      self.user.img_url = 'http://localhost:5000/images/badgee-profile-filler'+Math.floor(Math.random()*2)+'.png';
    }
    User.signup(self.user,function(response){
      $state.go('myTasks');
    })
  
    }
    self.logout = function() {
      TokenService.logout && TokenService.logout();
      $state.go('landing');
    }
    self.isAuthed = function() {
      return TokenService.isAuthed ? TokenService.isAuthed() : false
    }

  

    
    return self;
  }