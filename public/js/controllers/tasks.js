angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['User', 'Task', '$state', '$stateParams', 'TokenService', '$location'];

function TasksController(User, Task, $state, $stateParams, TokenService, $location){

  var self = this;
  if (TokenService.isAuthed()) {
    self.currentUser = TokenService.parseJwt();
  }
  self.allUsers = User.query();
  self.task = {};
  if ($stateParams.id) {
    self.task = Task.get({id: $stateParams.id});
    console.log(self.task);
  }
  
  if ($location.path() == '/users/tags') {
    Task.pending({ userId: self.currentUser.id }, function (response) {
      self.pending = response;
      console.log(self.pending);
    });
    
  }
  self.backToTeam = function () {
    $state.go('showTeam', { id: $stateParams.team_id });
  }
  self.showCreateTask = function (memberId) {
    $state.go('createTask', { team_id: $stateParams.id, member_id: memberId }) 
  }

  self.createTask = function () {
    self.task.task._creator = self.currentUser.id;
    self.task.task._tagged_member = $stateParams.member_id;
    self.task.team_id = $stateParams.team_id;
    console.log(self.task)
    console.log('start-save',self.task)
      Task.save(self.task, function (response) {
        console.log(response, 'saved');
        $state.go('showTask', { team_id: $stateParams.team_id, id: response._id})
      })
  }
  self.showTask = function () {
    Task.get({id: $state.params.id},function (response){
      console.log(response);
      self.task = response;
    } )
  }
  
}