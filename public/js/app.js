angular
.module("badgeeApp", ['ngResource','angular-jwt', 'ui.router', 'jcs-autoValidate', 'bootstrap.fileField', "flash", 'satellizer'])
.config(MainRouter)
.config(AuthInterceptor)
.constant("API", "/api");

function AuthInterceptor($httpProvider){
  $httpProvider.interceptors.push("authInterceptor");
}

function MainRouter($stateProvider, $urlRouterProvider, $authProvider) {
  
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/users/login.html'
  })
  .state('showInstagramPhoto', {
    url: '/instagram',
    templateUrl:'templates/tasks/instagram.html',
    params: {
        instagram: null
    }
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
  .state('privacyPolicy', {
    url: '/privacy-policy',
    templateUrl: 'templates/home/privacy_policy.html'
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
    templateUrl: 'templates/tasks/show.html',
    params: {
        instagram: null
    }

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
  $urlRouterProvider.otherwise('/#/');

  $authProvider.loginUrl = 'http://localhost:3000/auth/login';
  $authProvider.signupUrl = 'http://localhost:3000/auth/signup';

 $authProvider.facebook({
  clientId: '781089508666393',
   url: '/api/auth/facebook',
   authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
   redirectUri: (window.location.origin || window.location.protocol + '//' + window.location.host) + '/',
   requiredUrlParams: ['display', 'scope'],
   scope: ['email'],
   scopeDelimiter: ',',
   display: 'popup',
   type: '2.0',
   popupOptions: { width: 580, height: 400 }
 });
  
  }