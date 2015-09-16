angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['User', 'Task', '$state', '$stateParams', 'TokenService', '$location','PhotoUpload', '$scope', 'Geo'];

function TasksController(User, Task, $state, $stateParams, TokenService, $location, PhotoUpload, $scope, Geo) {

  // Basic task
  // self.task = {
  //   _creator: null,
  //   _tagged_member: null,
  //   description: null,
  //   img_url: null,
  //   start_time: null,
  //   end_time: null,
  //   location.lat: null,
  //   location.lon: null,
  //   lat 
  //   lon
  // }

  var self = this;

  if (TokenService.isAuthed()) {
    self.currentUser = TokenService.parseJwt();
  }

  // Setup defaults
  self.allUsers     = User.query();
  self.task         = {};
  self.showCamera   = false;

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
    Geo.locate(function (data) {
      self.task.lat =  data.coords.latitude;
      self.task.lon =  data.coords.longitude;
      console.log(self.task.lat, self.task.lon);
    });
  }

  self.startCamera = function(){
    $scope.showCamera = true;
  }

  $scope.$watch('showCamera', function(showCamera){
    if (showCamera) {
      console.log("SHOW")
      setTimeout(function(){
        PhotoUpload.startup();
      }, 200);
    }
  });

  self.takePicture = function() {
    PhotoUpload.takepicture();
  }

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

  self.upload = function () {
    if (!self.file) {
      PhotoUpload.upload(null, function(img_url){
        self.task.img_url = img_url;
        console.log("Img_url set from camera: ", self.task.img_url);
      });
      $scope.showCamera = false;

    } else {
      PhotoUpload.upload(self.file, function(img_url){
        self.task.img_url = img_url;
        console.log("Img_url set from file: ", self.task.img_url);
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
    self.task.minutes = $('#input-number').val();
    self.task._creator = self.currentUser.id;
    self.task._tagged_member = $stateParams.member_id;
    self.task.team_id = $stateParams.team_id;
    console.log(self.task);
    Task.save({ task: self.task }, function (response) {
      console.log(response, 'saved');
      $state.go('showTask', { team_id: $stateParams.team_id, id: response._id})
    });
  }

  self.showEditTask = function () {
    $state.go('editTask', { team_id: $stateParams.team_id, id: $stateParams.id })
  }

  self.showTask = function () {
    Task.get({id: $state.params.id},function (response){
      console.log(response);
      self.task = response;
    } )
  } 
}