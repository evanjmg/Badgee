angular
.module('taggyApp')
.factory('Task', Task);

Task.$inject = ['$resource'];
function Task ($resource) {

 var url = 'http://localhost:5000/api/team/:team_id/tasks/'

 var TaskResource = $resource(url + ':id' ,{id: '@_id'},
  { 'update' : { method: 'PUT' }
});

 return TaskResource;

}