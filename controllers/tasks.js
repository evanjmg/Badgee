var User = require('../models/user.js');
var Task = require('../models/task.js');
var Team = require('../models/team.js');


function createTask (req, res) {
  Team.findById(req.body.team_id, function (err, team) {
    if (err) res.status(403).send({ message: "Could not find team"});

    Task.create(req.body.task, function (er, task) {
      if (er) res.status(403).send({ message: "Could not create task, error occurred"});
      team.tasks.push(task);
      team.save(function (error) {
        res.send(task);
      })
    });
  })
    
}
function myPendingTasks (req, res) {
  Tasks.find({ "$elemMatch": { "_tagged_member": req.body.userId, "completed": false } }).populate('_creator').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: "Error in finding pending tasks"});
    console.log(tasks)
    res.send(tasks);
  })
}

function showTask (req, res) {
 Task.findById(req.params.id).populate('_creator').populate('_tagged_member').exec(function (err, task) {
   if (err) res.status(403).send({ message: "Error finding task"});
   res.send(task);
 });

}
function indexTeamTasks (req,res) {
  Team.findById(req.body.team_id).populate('tasks').populate('tasks._creator').populate('tasks._tagged_member').exec(function (err, team) {
      if (err) res.status(403).send({ message: 'Error occurred when finding tasks'});
      res.send(team.tasks);
    })
}
function indexTasks (req,res) {
  Task.find({}).populate('_creator').populate('_tagged_member').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: 'Error occurred in indexing tasks'});
    res.send(tasks);
  })
}
module.exports = {
  myPendingTasks : myPendingTasks,
  indexTasks : indexTasks,
  createTask : createTask,
  indexTeamTasks : indexTeamTasks,
  showTask : showTask
}