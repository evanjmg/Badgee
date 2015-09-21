angular.module('badgeeApp')
.controller('TeamsController', TeamsController);

$(function () {
  $('.removeFromNewTeamButton').hide();
})
TeamsController.$inject = ['User', 'Team', '$state', '$stateParams', 'TokenService'];
function TeamsController(User, Team, $state, $stateParams, TokenService){
  var self = this;
  self.all = Team.query();
  self.team = {};
  if ($stateParams.id) {
    self.team = Team.get({ id: $stateParams.id});
  }

  User.query(function (response) {
    var i=0; for (i;i < response.length;i++) {
      if (response[i].id  == self.currentUser.id) {
        var index = i;
      }
    }
    response.splice(index, 1);
    self.allUsers = response;
  });
  
  self.addUserToNewTeam = function (user, $event) {
    console.log(user);
    self.team.members = self.team.members || [];
    self.team.members.push({ _member: user.id});
    console.log(self.team.members);
    $($event.target).hide();
    $($event.target).next('.removeFromNewTeamButton').css('display', 'block');
  }

  self.removeFromNewTeam = function (user, $event) {
    
    $($event.target).css('display', 'none');
    $($event.target).prev('.addToNewTeamButton').show();
   
    var i=0; for (i;i < self.team.members.length;i++) {
      if (self.team.members[i]._member == user.id) {
        var index = i;
        break; 
      }
    }
    console.log(index);
    console.log(self.team.members);
    self.team.members.splice(index, 1);
  }
  
  self.createTeam = function () {
    console.log('hello', self.currentUser.id)
    self.team.members.push({ _member: self.currentUser.id });
    Team.save(self.team, function (response) {
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