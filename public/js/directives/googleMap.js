angular.module('badgeeApp')
.directive('map', function() {
  var directive = {};
    directive.restrict    = "A";
    directive.scope       = {
    task: '@',
    question: "@"
    }
  
    directive.replace     = true;
   directive.link =   function ($scope, element, attrs) {
    
  

  var myLatLng = {"lat": $scope.tasks.task.location.lat, "lng": $scope.tasks.task.location.lon }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map });
  };

  return directive
});
