angular
  .module('taggyApp')
  .factory('User', User);

User.$inject = ['$resource'];

function User ($resource) {

 var url = 'http://localhost:5000/api'

 var UserResource = $resource(
    url + '/users/:id',
    {id: '@_id'},
    { 'update': { method: 'PUT' },
    'login': { url: url + '/login', method: 'POST' },
    'signup': { url: url + '/signup', method: 'POST' }
 });

 return UserResource;

}