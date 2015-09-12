angular
.module('eventMatchApp').factory('Geo', Geo)

function Geo () {
  function locate () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }
  }

 function address (address) {

  geocoder = new google.maps.Geocoder();

  geocoder.geocode( { 'address': address}, function(results, status) {

   if (status == google.maps.GeocoderStatus.OK) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();
    return [latitude, longitude];
  }      
});
}
return {
  locate: locate
  address: address
}

}
