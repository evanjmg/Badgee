angular.module('badgeeApp')
.directive('map', function() {
  var directive = {};
    directive.restrict    = "A";
    directive.scope       = {
    task: '@',
    question: "@"
    }
  // E - element, C - class, A - attr, M - message/comment
    directive.replace     = true;
   directive.link =   function ($scope, element, attrs) {
    console.log($scope);
    console.log(attrs);

      // parseFloat()
    // var tag = '<div id="map" style="width:200px;height:200px"></div>';
    // element.append(tag);

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
