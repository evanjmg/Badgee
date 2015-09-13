angular.module('taggyApp')
.controller('TeamsController', TeamsController);

$(function () {
  $('.removeFromNewTeamButton').hide();
})
TeamsController.$inject = ['User', 'Team', '$state', '$stateParams', 'TokenService'];
function TeamsController(User, Team, $state, $stateParams, TokenService){
  var self = this;
  self.allUsers = User.query();
  self.all = Team.query();
  self.team = {};
  if ($stateParams.id) {
    self.team = Team.get({ id: $stateParams.id});
  }

  self.addUserToNewTeam = function (user, $event) {
    console.log(user);
    self.team.members = self.team.members || [];
    self.team.members.push({ _member: user.id});
    $($event.target).hide();
    $($event.target).next('.removeFromNewTeamButton').show();
  }

  self.removeUserFromNewTeam = function (user, $event) {
    self.team.members = self.team.member
    var i=0; for(i; i< self.team.members;i++) {
      if (self.team.members[i]._member == user._id) {
        var index = i;
      }
    }
    $($event.target).hide();
    $($event.target).next('.addUserToNewTeamButton').show();
    self.team.members.splice(index, 1);
  }
  
  self.createTeam = function () {
    self.team.members.push({ _member: self.currentUser._id });
    Team.save(self.team,function (response) {
        self.showTeam(response);
    });
  }
  self.showTeam = function (team) {
    console.log(team);
    Team.get({id: team._id}, function (response) {
      self.team = response;
      $state.go('showTeam', { id: self.team._id });
    });
  }
  if (TokenService.isAuthed()) {
    self.currentUser = TokenService.parseJwt();
  }
}