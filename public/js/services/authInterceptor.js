  angular
  .module('taggyApp')
  .factory('authInterceptor', AuthInterceptor)


  AuthInterceptor.$inject = ["API", "TokenService"];
  function AuthInterceptor(API, TokenService) {

   return {

     request: function(config) {

       var token = TokenService.getToken();
       if(token) {
         config.headers.Authorization = 'Bearer ' + token;
       }
       return config;
     },

     response: function(res) {
       if(res.data.token) {
        TokenService.saveToken(res.data.token);
      }
      return res;
    }
  }
}