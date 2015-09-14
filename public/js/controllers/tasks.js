angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['User', 'Task', '$state', '$stateParams', 'TokenService', '$location','PhotoUpload', '$scope', 'Geo'];

function TasksController(User, Task, $state, $stateParams, TokenService, $location, PhotoUpload, $scope, Geo){

  var self = this;
  if (TokenService.isAuthed()) {
    self.currentUser = TokenService.parseJwt();
  }
  self.allUsers = User.query();
  self.task = {};

  if ($stateParams.id) {
    self.task = Task.get({id: $stateParams.id});
  }

  if ($('canvas').length !== 0) {
    Geo.locate(function (data) {
     self.task.lat =  data.coords.latitude;
     self.task.lon =  data.coords.longitude;
     console.log(self.task.lat, self.task.lon);
    });
    PhotoUpload.startup();
  
    $('#canvas').hide();
  }

  if ($location.path() == '/users/tags') {
    Task.pending({ userId: self.currentUser.id }, function (response) {
      self.pending = response;
      console.log(self.pending);
    });
    
  }
  self.upload = function () {
    self.task.task = {}
    PhotoUpload.uploadFile = self.uploadFile;
    if ($scope.uploadFile) {
    PhotoUpload.upload(function (url) {
      
    }, $scope.uploadFile);
  } else {
    PhotoUpload.upload(function (url) {
        self.task.task.img_url = 'https://s3-eu-west-1.amazonaws.com/taggyapp/images/'+url;
    });
  }
  }
  self.retakePhoto = function () {
    $('#retakeButton').hide();
    $('#canvas').hide();
    $('#video').show();
  }
  self.backToTeam = function () {
    $state.go('showTeam', { id: $stateParams.team_id });
  }
  self.showCreateTask = function (memberId) {
    $state.go('createTask', { team_id: $stateParams.id, member_id: memberId }) 
  }

  self.createTask = function () { 
      self.task.task.minutes = $('#input-number').val();
      self.task.task._creator = self.currentUser.id;
      self.task.task._tagged_member = $stateParams.member_id;
      self.task.team_id = $stateParams.team_id;
      console.log(self.task);
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