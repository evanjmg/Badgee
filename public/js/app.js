angular
.module("taggyApp", ['ngResource','angular-jwt', 'ui.router', 'jcs-autoValidate', 'bootstrap.fileField'])
.config(MainRouter)
.config(AuthInterceptor)
.constant("API", "http://localhost:3000/api")

function AuthInterceptor($httpProvider){
  $httpProvider.interceptors.push("authInterceptor");
}


function MainRouter($stateProvider, $urlRouterProvider) {
  
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/users/login.html'
  })
  .state('logout', {
    url: '/login'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/users/signup.html'
  })
  .state('landing', {
    url: '/',
    templateUrl: 'templates/home/landing.html'
  }) 
  .state('createTask', {
    url: '/team/:team_id/task/new',
    templateUrl: 'templates/tasks/new.html'
  })
  .state('createTeam', {
    url: '/teams/new',
    templateUrl: 'templates/teams/new.html'
  })
  .state('showTeam', {
    url: '/team/:id',
    templateUrl: 'templates/teams/show.html',
    params: {
      id: null
    } 
  })
  .state('showTask', {
    url: '/tasks/:id',
    templateUrl: 'templates/tasks/show.html'
  })
  $urlRouterProvider.otherwise('/') 
  
  }