angular.module('taggyApp')
.controller('TasksController', TasksController);

TasksController.$inject = ['Flash', 'User', 'Task', '$state', '$stateParams', 'TokenService', '$location','PhotoUpload', '$scope', 'Geo'];

function TasksController(Flash, User, Task, $state, $stateParams, TokenService, $location, PhotoUpload, $scope, Geo) {


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
  self.task             = {};
  self.all = Task.query();
  self.showCamera       = false;
  self.selectUsersPage  = false;
 
  self.task.completion = self.task.completion || {};
  if ($stateParams.query) $scope.query = $stateParams.query

  if ($stateParams.id) {
    self.task = Task.get({id: $stateParams.id}, function (response) {
      self.task = response;
     if (self.task.created_at) {
       self.format_created_at = moment(self.task.created_at).startOf('hour').fromNow(); 
     }
      
    });
  }

  if ($('canvas').length !== 0 || $('#shareChallengeButton').css('display') !== 'none') { 
    Geo.locate(function (data) {
      self.lat =  data.coords.latitude;
      self.lon =  data.coords.longitude;
    });
  }
  
  User.query(function (response) {
    var i=0; for (i;i < response.length;i++) {
      if (response[i].id  == self.currentUser.id) {
        var index = i;
      }
    }
    response.splice(index, 1);
    self.allUsers = response;
    console.log(response[0].id);
  });

  self.startCamera = function(){
    $scope.showCamera = true;
  }

  $scope.$watch('showCamera', function(showCamera){
    if (showCamera) {
      
      setTimeout(function(){
        PhotoUpload.startup();
      }, 200);
    }
  });
  self.openMap = function () {
    $('.map-container').show();
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
    $('.card-bottom').hide();
  }
  self.closeMap = function () {
    $('.map-container').hide();
    $('.card-bottom').show();
  }
  self.takePicture = function() {
    PhotoUpload.takepicture();
  }

  self.decideTask = function (bool) {
    if (bool) {
      $state.go('completeTask', { id: $stateParams.id });
    } else {
    

    Task.reject({ id: $stateParams.id }, function (response) {
   
      Flash.create('success', "<h4> Rejected "+ self.task._creator.name +"'s challenge</h4>", 'custom-class');
    });
    $state.go('myTasks');
    }   
  }
  self.acceptResponse = function () {
    Task.acceptResponse({ id: $stateParams.id}, function (response) {
      
      $state.go('createdTasks');
      Flash.create('success', "<h4> Successfully accepted "+ self.task._tagged_member.name +"'s response</h4>", 'custom-class');
    });
  }
  self.rejectResponse = function () {
    Task.rejectResponse({ id: $stateParams.id}, function (response) {
     
      $state.go('createdTasks');
      Flash.create('warning', "<h4> Rejected "+ self.task._tagged_member.name +"'s response</h4>", 'custom-class');
    })
  }
  self.completeTask = function () {

    Task.complete({ task: self.task, lat: self.lat, lon: self.lon }, function (response) {
      $state.go('myTasks');

      // $('.taskInvitesHeader').append();
      Flash.create('success', "<h4> You responded to "+ self.task._creator.name +"'s challenge. Awaiting confirmation.</h4>", 'custom-class');
    })
  }
 self.copyTask = function (user) {
  self.task._id = undefined;
  self.task._creator = self.currentUser.id; 
  self.task._tagged_member = user.id;
  self.task.completed = null;

  Task.copy({ task: self.task, lat: self.lat, lon: self.lon }, function (response){
    
    $state.go('createdTasks');
    Flash.create('success', "<h4> You shared this challenge with "+ self.task._tagged_member.name +". Awaiting their response.</h4>", 'custom-class');
  });


 }
  self.upload = function () {
    if (!self.file) {
      PhotoUpload.upload(null, function(img_url){
     if ($('#createTaskPage').length > 0) {
        self.task.img_url = img_url;

      } else {
        self.task.completion.img_url = img_url; 
      }
      });
      $scope.showCamera = false;

    } else {
      PhotoUpload.upload(self.file, function(img_url){

      if ($('#createTaskPage').length > 0) {
         self.task.img_url = img_url;
       
       } else {
         self.task.completion.img_url = img_url; 
       }
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

 
  self.showUsersPage = function () {
    self.selectUsersPage = true;
  }
  // self.addUser = function (user, $event) {
  //   console.log(user);
  //   self.task._tagged_member =  user.id;
  //   tasks.showUsersPage = false;

  //   // $($event.target).hide();
  //   // $($event.target).next('.removeFromNewTeamButton').css('display', 'block');
  // }

  // self.removeUser = function (user, $event) {
    
  //   $($event.target).css('display', 'none');
  //   $($event.target).prev('.addToNewTeamButton').show();
   
  //   var i=0; for (i;i < self.team.members.length;i++) {
  //     if (self.team.members[i]._member == user.id) {
  //       var index = i;
  //       break; 
  //     }
  //   }
  self.createTask = function (recipient) { 
    self.task.minutes = $('#input-number').val();
    self.task._creator = self.currentUser.id;
    self.task._tagged_member = recipient.id;
    // self.task.team_id = $stateParams.team_id;

    Task.save({ task: self.task, lat: self.lat, lon: self.lon  }, function (response) {

      $state.go('showTask', { id: response._id})
    });
  }

  self.showEditTask = function () {
    $state.go('editTask', { team_id: $stateParams.team_id, id: $stateParams.id })
  }

  self.showTask = function () {
    Task.get({id: $state.params.id},function (response){
 
      self.task = response;
    } )
  } 
}