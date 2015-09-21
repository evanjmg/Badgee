angular
.module('badgeeApp').factory('Geo', Geo)

function Geo () {
  function locate (callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        callback(position);
      }) 
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
    locate: locate,
    address: address
  }

}
