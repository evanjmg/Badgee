 angular
  .module('badgeeApp')
  .service('TokenService', TokenService)

 TokenService.$inject = ['$window' , 'jwtHelper']
 function TokenService($window, jwtHelper) {

  var self = this;

  // Add JWT methods here
  // Saving the token as 

  self.parseJwt = function() {
    // console.log('parseJwt')
    var token = self.getToken();
    return jwtHelper.decodeToken(token);
  }

  self.saveToken = function(token) {
    // console.log('saveToken')
   $window.localStorage.setItem('token', token);
  }

  self.getToken = function() {
    // console.log('getToken')
  return $window.localStorage.getItem('token');
  }

  // Check that it is the right token if the token is validated run the functon
  // sets the date for expiration for the token 

  self.isAuthed = function() {
    // console.log('checkifAuth')
    var token = self.getToken();
    
    if(token) {
      return true;
    } else {
      return false;
    }
  }
  // Removes the token

  self.logout = function() {
    $window.localStorage.removeItem('token');
  }

}