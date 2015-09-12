angular.module('taggyApp')
  .controller('TeamsController', TeamsController);

TeamsController.$inject = ['User', '$state'];
function TeamsController(User, $state){
var self = this;
self.allUsers = User.query();

self.createTeam = function () {

}

}