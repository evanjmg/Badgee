angular.module('badgeeApp')
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
       if (self.task.completion.time_completed) {
        self.format_time_completed = moment(self.task.completion.time_completed).startOf('hour').fromNow();
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
    });

    self.startCamera = function(){
      $scope.showCamera = true;
      Flash.create('success', "Take a picture, then draw on it!", 'custom-class');
   
    }

    $scope.$watch('showCamera', function(showCamera){
      if (showCamera) {
        
        setTimeout(function(){
          PhotoUpload.startup();
        }, 200);
      }
    });
    self.openMap = function (bool) {
      $('.map-container').show();

      initializeMap(bool, function (latLon, map) {
        var marker = new google.maps.Marker({
          position: latLon,
          map: map,
          visible: true
        });
        marker.setMap(map);

        var infowindow = new google.maps.InfoWindow({
          content:self.task.location.name
        });

        infowindow.open(map,marker);
        
      });
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

    function initializeMap (bool, callback) {
      if (bool) {
      var lon  = parseFloat(self.task.location.lon);
      var lat = parseFloat(self.task.location.lat);
      var name = self.task.location.name;
    } else {
      var lon  = parseFloat(self.task.completion.location.lon);
      var lat = parseFloat(self.task.completion.location.lat);
      var name = self.task.completion.location.name;
    }
      var map = new google.maps.Map(document.getElementById('map'), {
       zoom: 14,
       center: {lat: lat , lng: lon },
       styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#ffe500"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"},{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9bdffb"},{"visibility":"on"}]}]
     });

var latLon ={lat: lat , lng: lon }
callback(latLon, map);
    // window.setTimeout(function (){
     
    // },1200 );
}
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