angular
.module("badgeeApp", ['ngResource','angular-jwt', 'ui.router', 'jcs-autoValidate', 'bootstrap.fileField', "flash"])
.config(MainRouter)
.config(AuthInterceptor)
.constant("API", "https://badgeeapp.heroku.com/api");

function AuthInterceptor($httpProvider){
  $httpProvider.interceptors.push("authInterceptor");
}


function MainRouter($stateProvider, $urlRouterProvider) {
  
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/users/login.html'
  })
  .state('profile', {
    url: '/profile/:user_id',
    templateUrl: 'templates/users/profile.html'
  })
  .state('logout', {
    url: '/login'
  })
  .state('search', 
  {
    url: '/search/:query',
    templateUrl: 'templates/tasks/index.html'
  })
  .state('completeTask', 
  {
    url: '/tasks/:id/complete',
    templateUrl: 'templates/tasks/complete.html'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/users/signup.html'
  })
  .state('landing', {
    url: '/',
    templateUrl: 'templates/home/landing.html'
  }) 
  .state('myTeams', {
    url: '/users/teams',
    templateUrl: 'templates/users/my_teams.html'
  })
  .state('createTeam', {
    url: '/teams/new',
    templateUrl: 'templates/teams/new.html'
  })
  .state('myTasks', {
    url: '/users/tasks',
    templateUrl: 'templates/users/my_tasks.html'
  })
  .state('editTask', {
    url: '/tasks/:id/edit',
    templateUrl: 'templates/tasks/edit.html'
  })
  .state('showTeam', {
    url: '/teams/:id',
    templateUrl: 'templates/teams/show.html',
  })
  .state('createTask', {
    url: '/tasks/new',
    templateUrl: 'templates/tasks/new.html',
    controller: 'TasksController'
  })
  .state('showTask', {
    url: '/tasks/:id',
    templateUrl: 'templates/tasks/show.html'
  })
  .state('showResponse', {
    url: '/tasks/:id/response',
    templateUrl: 'templates/tasks/show-response.html'
  })
  .state('completedTasks', {
    url: '/users/tasks/completed',
    templateUrl: 'templates/users/completed_tasks.html'
  })
  .state('createdTasks', {
    url: '/users/tasks/created',
    templateUrl: 'templates/users/created_tasks.html'
  })
  $urlRouterProvider.otherwise('/tasks/new') 
  
  }