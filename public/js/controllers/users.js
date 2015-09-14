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
    self.teams = User.teams( { "userId": self.currentUser.id});
  }

  if ($location.path() == '/users/tags') {
    
    User.pendingTasks({ userId: self.currentUser.id }, function (response) {
      self.pending = response;
      console.log(self.pending);
    }); 
  }

  self.getUser = function(user) {
    self.getUser = User.get({id: user._id});
  }
  self.login = function() {
    User.login({email: self.user.email , password: self.user.password },function(response){
      console.log(response);
      $state.go('createTeam');
    })
  }
  self.update = function () {
    User.update(self.user, function (response) {
      console.log(response);
    })
  }
  self.signup = function() {
    User.signup(self.user,function(response){
      console.log(response);
    })
      // user.register(self.email, self.password)
      // .then(handleRequest, handleRequest)
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