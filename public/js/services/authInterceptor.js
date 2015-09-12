  angular
  .module('taggyApp')
  .factory('authInterceptor', AuthInterceptor)


  AuthInterceptor.$inject = ["API", "TokenService"];
  function AuthInterceptor(API, TokenService) {

   return {

     request: function(config) {

       var token = TokenService.getToken();
      console.log('in request interceptor', token);
       if(token) {
         config.headers.Authorization = 'Bearer ' + token;
       }
       return config;
     },

     response: function(res) {
      console.log('in response interceptor', res.data.token);
      console.log(res.config.url.indexOf(API))
       if(res.data.token) {
        TokenService.saveToken(res.data.token);
      }
      return res;
    }
  }
}