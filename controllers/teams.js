var User = require('../models/user.js');
var Task = require('../models/task.js');
var Team = require('../models/team.js');

function createTeam (req, res) {
    Team.create(req.body, function (err, team) {
      if (err) res.status(403).send({ message: "Could not create Team, error occurred"});
      var member_ids = [];

    team.members.forEach(function(member) { member_ids.push(member._member) });

      User.find({
    '_id': { $in: member_ids }}).populate('teams').exec(function (error, users) {
        users.forEach(function(user) {
          user.teams.push(team._id);
          user.save(function(){});
        });
     
          res.send(team);
          });
        });
}
function showTeam (req, res) {
 Team.findById(req.params.id).populate('members._member').populate('tasks').exec(function (err, team) {
   if (err) res.status(403).send({ message: "Error finding team"});
   res.send(team);
 });

}
function indexTeams (req,res) {
  Team.find({}).exec(function (err, teams) {
    if (err) res.status(403).send({ message: 'Error occurred when finding teams'});
    res.send(teams);
  })
}


module.exports = {
  createTeam : createTeam,
  indexTeams : indexTeams,
  showTeam : showTeam
}