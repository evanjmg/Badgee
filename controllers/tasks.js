var User = require('../models/user.js');
var Task = require('../models/task.js');
var Team = require('../models/team.js');

var request = require('request');



function createTask (req, res) {
  // Team.findById(req.body.team_id, function (err, team) {

    if (!req.body.lon) {
      req.body.lat = "51.5286416"
      req.body.lon = "-0.1015987"
    }
    if (!req.body.task.location) {
      var query = "London";
    } else {
      var query = req.body.task.location.name
    }


    request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ req.body.lat+','+ req.body.lon+'&radius=5000&name='+ query + '&key='+ process.env.GOOGLE_API_KEY, function (error, response, body) {
     if (!error && response.statusCode == 200) {
      var resp = JSON.parse(body)

      Task.create(req.body.task, function (er, task) {
       if (er) res.status(403).send({ message: "Could not create task, error occurred"});
       
       var d = new Date();
       task.start_time = d;
       var addedMinutes = d.getMinutes() + task.minutes;

       var then = new Date();
       then.setMinutes(then.getMinutes() + 30);
       task.end_time =  then;
       
       if (resp.results[0]) { 
         task.location.lat = resp.results[0].geometry.location.lat
         task.location.lon = resp.results[0].geometry.location.lng
       }


       task.save(function (err, tas) {
        User.findById(task._creator, function (err, user) {
         user.created_tasks.push(tas);
         user.save(function (er) {
          if (err) res.status(403).send({ message: "Could not save task"});
          res.send(task);
        });
         
        })
     })

     }); 
    } }) 
}

function reviewTaskCompletion (req, res) {
  Task.findById(req.params.id, function (err, task) {
    if (err) res.status(403).send({ message: "could not find task"});
    if (req.body.completed)  {task.completed = true; }
    else { task.completed = false }
     task.updated_at = Date.now;
   task.save(function (err) {
    res.status(200).send(task);
  })
 })
}


function completeTask (req, res) {

  Task.findById(req.body.task._id, function (err, task) {
    if (err) res.status(403).send({ message: "Could not find task"});

    task.completion = {};
    task.completion.message = req.body.task.completion.message;
    task.completion.img_url = req.body.task.completion.img_url;
    task.completion.time_completed = new Date();
    task.completed = false;

    if (!req.body.lon) {
     req.body.lat = "51.5286416"
     req.body.lon = "-0.1015987"
   }

   if (!req.body.task.completion.location) {
    req.body.task.completion.location = {
      "name": null
    }
    var query = "London";
  } else {
   var query = req.body.task.completion.location.name
   task.completion.location.name = req.body.task.completion.location.name;
 }
 if (req.body.task.location.name) {
   request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ req.body.lat+ ','+ req.body.lon+'&radius=5000&name='+ query + '&key='+ process.env.GOOGLE_API_KEY, function (error, response, body) {
    if (!error && response.statusCode == 200) {
     var resp = JSON.parse(body);
     console.log(resp);
     if (resp.results[0]) {
       var latlon = [resp.results[0].geometry.location.lat, resp.results[0].geometry.location.lng]
       task.completion.location.lat = latlon[0];
       task.completion.location.lon = latlon[1];
     }
     task.save(function (err, tas) {
      res.status(200).send(tas);
    });
   }
 }) 
 } else {
  task.save(function (err, tas) {
    res.status(200).send(tas);
  });
 }
});
}
function rejectTask (req, res) {
  Task.findById(req.params.id).populate('_creator').exec( function (err, task) {
    if (err) res.status(403).send({ message: "Could not find task"});
    task._tagged_member = null;
    task.updated_at = new Date();
    task.save( function (error) {
      if (error) res.status(403).send({ message: "Could not save task."});
      res.status(200).send(task);
    })
  })
}

function pendingTasks (req, res) {
  console.log('in pending tasks');
  Task.find({ "_tagged_member": { $eq: req.body.userId }, "completed": { $ne : true } }).sort({ updated_at:-1}).populate('_creator').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: "Error in finding pending tasks"});
    res.send(tasks);
  });
}
function updateTask(req, res) {
  var update = req.body;
  Task.findByIdAndUpdate(req.params.id, update , function (err, task) {
    if(err) res.status(403).send({ message: "Error in finding task"});
    task.updated_at = new Date();
    task.save(function (error) {
      if (error) res.status(403).send({ message: "Error saving task on update"})
        res.status(200).send(task);
    });
  }) 
}
function showTask (req, res) {
 Task.findById(req.params.id).populate('_creator').populate('_tagged_member').exec(function (err, task) {
   if (err) res.status(403).send({ message: "Error finding task"});
   res.send(task);
 });

}
function createdTasks (req,res) {
  Task.find( { "_creator": {$eq: req.body.userId } }).sort({ updated_at:-1}).populate('_tagged_member').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: "An error occured when looking for tasks"});
    res.status(200).send(tasks);
  })
}
function completedTasks (req,res) {
  Task.find({ "_tagged_member": { $eq: req.body.userId }, "completed": { $eq:  true } }).sort({ updated_at: -1 }).populate('_creator').exec(function (err,tasks) {
    if (err) res.status(403).send({ message: "An error occured when looking for tasks"});
    res.status(200).send(tasks);
  });
}
function acceptResponse (req,res) {
  Task.findById(req.params.id, function (err, task) {
    if (err) res.status(403).send({ message: "An error occured when finding task to accept."});

    task.completed = true;
    task.updated_at = new Date();

    task.save(function (error, tas) {
      if (error) res.status(403).send({ message: "could not save task on accept response"});
      User.findById(task._tagged_member, function (er, user) {
        if (er) res.status(403).send({ message: "could not find user to add coin"});
        user.total_coins++;
        user.completed_tasks.push(tas);

        user.save(function (erro) {
          if (erro) res.status(403).send({ message: "could not save user on coin update"});
          res.status(200).send(task);
        })
      })
    })
  })
}
function rejectResponse (req, res) {
  Task.findById(req.params.id, function (err, task) {
    if (err) res.status(403).send({ message: "An error occured when finding task to reject."});

    task.completed = null;
    task.updated_at = new Date();
    task.save(function (error) {
      res.status(200).send(task);
    });
  })
}
function indexTeamTasks (req,res) {
  Team.findById(req.body.team_id).sort({ updated_at:-1}).populate('tasks').populate('tasks._creator').populate('tasks._tagged_member').exec(function (err, team) {
    if (err) res.status(403).send({ message: 'Error occurred when finding tasks'});
    res.status(200).send(team.tasks);
  })
}

function indexPublicPendingTasks (req, res) {
  Task.find({ "completed": { $ne : true } }).populate('_tagged_member').populate('_creator').exec( function (err, tasks) {
    if (err) res.status(403).send({ message: 'Error occurred when finding tasks'});
    res.status(200).send(tasks);
  })
}
function copyTask (req,res) {
  console.log('inside controller function - copy task')
  Task.create(req.body.task, function (err, task) {
    console.log('in create copy task')
    if (err) res.status(403).send({ message: 'Error occurred when creating task'});
    // if (req.body.task.location) {
    //   if (!req.body.task.location.name) {
    //     var query = "London";
    //   } else {
    //     var query = req.body.task.location.name
    //   }
    //   request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ req.body.lat+','+ req.body.lon+'&radius=5000&name='+ query + '&key='+ process.env.GOOGLE_API_KEY, function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //     var resp = JSON.parse(body);
    //     if (resp.results[0]) { 
    //       task.location.lat = resp.results[0].geometry.location.lat;
    //       task.location.lon = resp.results[0].geometry.location.lng;
    //       task.save(function (error) {
    //         if(error) res.status(403).send({ message: "Could not save on location change"});
    //         res.send(task)
    //       });
    //     }
    //   } else {
    //     res.status(200).send(task);
    //   }
    // });

    // } else {
      res.status(200).send(task);

    });
}
function indexTasks (req,res) {
  Task.find({}).sort({ updated_at:-1}).populate('_creator').populate('_tagged_member').exec(function (err, tasks) {
    if (err) res.status(403).send({ message: 'Error occurred in indexing tasks'});
    res.status(200).send(tasks);
  })
}
module.exports = {
  acceptResponse: acceptResponse,
  rejectResponse: rejectResponse,
  completedTasks: completedTasks,
  createdTasks: createdTasks,
  rejectTask: rejectTask,
  reviewTaskCompletion: reviewTaskCompletion,
  indexPublicPendingTasks: indexPublicPendingTasks,
  completeTask: completeTask,
  updateTask: updateTask,
  pendingTasks : pendingTasks,
  indexTasks : indexTasks,
  createTask : createTask,
  indexTeamTasks : indexTeamTasks,
  showTask : showTask,
  copyTask: copyTask
}