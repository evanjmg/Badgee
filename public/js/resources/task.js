angular
.module('badgeeApp')
.factory('Task', Task);

Task.$inject = ['$resource'];
function Task ($resource) {

 var url = '/api/tasks/'

 var TaskResource = $resource(url + ':id' ,{id: '@_id'},
  { 'update' : { method: 'PUT' },
   'complete': { method: 'POST', url: url + 'complete'},
    'review': { method: 'POST', url: url + ':id/review'},
    'reject': { method: 'GET', url: url + ':id/reject'},
    'rejectResponse': { method: 'GET', url: url + ':id/reject-response'},
    'acceptResponse': { method: 'GET', url: url + ':id/accept-response'},
    'copy': { method: 'POST', url: url + 'copy'},
    'search': { method: 'GET', url: '/api/search/:query', isArray: true }
  
});

 return TaskResource;

}