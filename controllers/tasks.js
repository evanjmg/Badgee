var User = require('../models/user.js');
var Task = require('../models/task.js');
var Team = require('../models/team.js');


function createTask (req, res) {
  Team.findById(req.params.team_id, function (err, team) {
    Task.create(req.body, function (err, task) {
      if (err) res.status(403).send({ message: "Could not create task, error occurred"});
      team.tasks.push(task);
      team.save(function (error) {
        res.send(task);
      })
    });
  })
    
}

function showTask (req, res) {
 Task.findById(req.params.id).populate('_creator').populate('_tagged_member').exec(function (err, task) {
   if (err) res.status(403).send({ message: "Error finding task"});
   res.send(task);
 });

}
function indexTasks (req,res) {
  Team.findById(req.params.team_id).populate('tasks').populate('tasks._creator').populate('tasks._tagged_member').exec(function (err, team) {
      if (err) res.status(403).send({ message: 'Error occurred when finding tasks'});
      res.send(team.tasks);
    })
}

module.exports = {
  createTask : createTask,
  indexTasks : indexTasks,
  showTask : showTask
}