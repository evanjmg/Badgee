angular
.module('taggyApp')
.factory('Task', Task);

Task.$inject = ['$resource'];
function Task ($resource) {

 var url = 'http://localhost:5000/api/tasks/'

 var TaskResource = $resource(url + ':id' ,{id: '@_id'},
  { 'update' : { method: 'PUT' },
   'pending': { method: 'PUT', url: url + 'pending'}
});

 return TaskResource;

}