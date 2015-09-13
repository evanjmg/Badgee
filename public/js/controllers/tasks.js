angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['User', 'Task', '$state', '$stateParams'];

function TasksController(User, Task, $state, $stateParams){

  var self = this;

  self.allUsers = User.query();
  self.task = {};
  if ($stateParams.id) {
    self.task = Task.get({id: $stateParams.id});
    console.log(self.task);
  }
  self.task = Task.get()
  self.showCreateTask = function (memberId) {
    self.task._tagged_member = memberId;
    console.log(self.task)
    $state.go('createTask', { team_id: $stateParams.id }) 
  }

  self.createTask = function () {
    console.log('start-save',self.task)
      Task.save(self.task, function (response) {
        console.log(response, 'saved');
      })
  }
  self.showTask = function () {
    Task.get({id: $state.params.id},function (response){
      console.log(response);
      self.task = response;
    } )
  }

}