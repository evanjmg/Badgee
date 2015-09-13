angular.module('taggyApp')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state'];
function UsersController(User, TokenService, $state){

  var self = this;
  self.user = {}

  self.users = {};
 

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

    if (self.isAuthed()) {
      self.all = User.query();
      self.currentUser = TokenService.parseJwt();
      self.teams = User.teams( { "userId": self.currentUser.id});
    }

    
    return self;
  }