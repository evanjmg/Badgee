angular
.module("taggyApp", ['angular-jwt', 'ui.router', 'jcs-autoValidate']).config(MainRouter);

function MainRouter($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })
  .state('logout', {
    url: '/login'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html'
  })
  .state('landing', {
    url: '/',
    templateUrl: 'templates/home/landing.html'
  }) 
  $urlRouterProvider.otherwise('/login') 
  
  }