var User = require('../models/user.js');
var Task = require('../models/task.js');
var Team = require('../models/team.js');

var request = require('request');



function createTask (req, res) {
  Team.findById(req.body.team_id, function (err, team) {
    if (!req.body.lon) {
      req.body.lat = "51.5286416"
      req.body.lon = "-0.1015987"
    }
    if (err) res.status(403).send({ message: "Could not find team"});
    if (!req.body.task.location) {
      var query = "London";
    } else {
      var query = req.body.task.location.name
    }
 request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ req.body.lat+','+ req.body.lon+'&radius=5000&name='+ query + '&key='+ process.env.GOOGLE_API_KEY, function (error, response, body) {
   if (!error && response.statusCode == 200) {
    var resp = JSON.parse(body)
    console.log(resp);

     var latlon = [resp.results[0].geometry.location.lat, resp.results[0].geometry.location.lng]
   

   Task.create(req.body.task, function (er, task) {
     if (er) res.status(403).send({ message: "Could not create task, error occurred"});
     var d = new Date();
     task.start_time = d;
      var addedMinutes = d.getMinutes() + task.minutes;
      // console.log(d.setMinutes(task.start_time.getMinutes() + task.minutes));
        var then = new Date();
            then.setMinutes(then.getMinutes() + 30);
     task.end_time =  then;
     task.location.lat = latlon[0];
     task.location.lon = latlon[1];
     task.save(function (err) {
      if (err) res.status(403).send({ message: "Could not save task"});
      team.tasks.push(task);
      team.save(function (error) {
        res.send(task);
      })
     })
    
   }); 
 } }) 
   })
 }

function pendingTasks (req, res) {
  console.log('in pending tasks');
  Tasks.find({ "$elemMatch": { "_tagged_member": req.body.userId, "completed": false } }).populate('_creator').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: "Error in finding pending tasks"});
    console.log(tasks)
    res.send(tasks);
  })
}
function updateTask(req, res) {
  var update = req.body;
  console.log(req.params.id, req.body);

  Task.findByIdAndUpdate(req.params.id, update , function (err, task) {
    if(err) res.status(403).send({ message: "Error in finding task"});
    res.send(task);
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
  updateTask: updateTask,
  pendingTasks : pendingTasks,
  indexTasks : indexTasks,
  createTask : createTask,
  indexTeamTasks : indexTeamTasks,
  showTask : showTask
}