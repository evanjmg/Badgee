angular
.module('badgeeApp')
.factory('Team', Team);

Team.$inject = ['$resource'];
function Team ($resource) {

  var url = 'https://badgeeapp.heroku.com/api/teams/'
  var TeamResource = $resource(url + ':id',
    {id: '@_id'},
    { 'joined': { method: 'POST', url: url + 'join' }
  });

  return TeamResource;
}
