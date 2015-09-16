angular
.module('taggyApp')
.factory('Task', Task);

Task.$inject = ['$resource'];
function Task ($resource) {

 var url = 'http://localhost:5000/api/tasks/'

 var TaskResource = $resource(url + ':id' ,{id: '@_id'},
  { 'update' : { method: 'PUT' },
   'complete': { method: 'POST', url: url + 'complete'},
    'review': { method: 'POST', url: url + ':id/review'},
    'reject': { method: 'GET', url: url + ':id/reject'},
    'rejectResponse': { method: 'GET', url: url + ':id/reject-response'},
    'acceptResponse': { method: 'GET', url: url + ':id/reject-response'} 
  
});

 return TaskResource;

}