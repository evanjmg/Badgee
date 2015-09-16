angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['User', 'Task', '$state', '$stateParams', 'TokenService', '$location','PhotoUpload', '$scope', 'Geo'];

function TasksController(User, Task, $state, $stateParams, TokenService, $location, PhotoUpload, $scope, Geo) {

  var self = this;

  if (TokenService.isAuthed()) {
    self.currentUser = TokenService.parseJwt();
  }
  self.allUsers = User.query();
  self.task = {};

  if ($stateParams.id) {
    self.task = Task.get({id: $stateParams.id}, function (response) {
      self.task = response;
      console.log(response);
      initMap();
      function initMap() {
        var myLatLng = {lat: parseFloat(self.task.location.lat), lng: parseFloat(self.task.location.lon) }
        
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: myLatLng
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map
        });
      }
    });
  }


  if ($('canvas').length !== 0) {
    $('.cameraOptionButtons').hide();

    $('#createTaskPage').hide();
    Geo.locate(function (data) {
     self.task.lat =  data.coords.latitude;
     self.task.lon =  data.coords.longitude;
     console.log(self.task.lat, self.task.lon);
   });
    PhotoUpload.startup();

    $('#canvas').hide();
  }

 // ANSWER
 self.decideTask = function (bool) {
  if (bool) {
    $state.go('completeTask', { id: $stateParams.id });
  } else {
    console.log($stateParams.id);

    Task.reject({ id: $stateParams.id }, function (response) {
      console.log(response);
        $('.taskInvitesHeader').prepend("<h4>"+response._creator.name + "'s challenge rejected</h4>");
      });
      $state.go('myTasks');

  }   
}

self.completeTask = function () {
  Task.complete(self.task, function (response) {
    console.log(response);
  })
}


// CREATE/UPDATE TASK
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
self.updateTask = function () {
  self.task._creator = self.task._creator.id;
  self.task._tagged_member = self.task._tagged_member.id;
  Task.update(self.task, function (response) {
    $state.go('showTask', { team_id: $stateParams.team_id, id: $stateParams.id});
  })
}
self.retakePhoto = function () {
  $('.cameraOptionButtons').hide();
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

self.showEditTask = function () {
  $state.go('editTask', { team_id: $stateParams.team_id, id: $stateParams.id })
}

  // SHOW
  self.showTask = function () {
    Task.get({id: $state.params.id},function (response){
      console.log(response);
      self.task = response;
    } )
  }
  
}