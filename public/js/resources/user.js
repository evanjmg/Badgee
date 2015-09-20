angular
.module('taggyApp')
.factory('User', User);

User.$inject = ['$resource'];

function User ($resource) {

 var url = 'http://www.badgee.uk/api'

 var UserResource = $resource(
  url + '/users/:id',
  {id: '@_id'},
  { 'update': { method: 'PUT' },
   'teams': { method: 'POST', url: url + '/users/teams', isArray:true },
  'login': { url: url + '/login', method: 'POST' },
  'signup': { url: url + '/signup', method: 'POST' },
  'pendingTasks': { method: 'POST', url: url + '/tasks/pending', isArray:true },
  'createdTasks': { method: 'POST', url: url + '/tasks/created', isArray: true},
  'completedTasks': { method: 'POST', url: url + '/tasks/completed', isArray: true },
  'feed': { method: 'GET', url: url + '/users/:id/feed', isArray: true}
});

 return UserResource;

}