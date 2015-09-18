var User = require('../models/user.js');


function getMyTeams (req, res) {
 User.findById(req.body.userId).populate('teams').exec(function (err, user) {
  if (err) res.status(403).send({ message: "Could not find user"}); 
  console.log(user);
  res.status(200).send(user.teams);
 });
}

function createUsers (req,res) {
  User.create(req.body, function (error,user) {
    if (error) return res.status(403).send({
      message: "Cannot create user"
    });
    return res.status(200).send(user)
  })
}
function getUser(req,res) {
  User.findById(req.params.id).populate('completed_tasks','completion.description completion.img_url').populate('created_tasks', 'description img_url').exec(function (err, user) {
    if (err) res.status(403).send({ message: "Could not find user"});
    res.send(user);
  }) 
}
function indexUsers(req, res) {
  User.find(function (error, users) {
    if (error) return res.status(404).json({
      message: "no users found"
    });
    return res.status(200).send(users);
  })
}
function updateUser(req,res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(403).send({
      message: "Cannot find user"
    });
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.img_url) {
      console.log(req.body.img_url);
      user.img_url = req.body.img_url;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    user.save(function (err, user) {
      if (err) res.status(403).send({ message: "could not save"})
      return res.status(200).send(user);
    });
 
  })
}
module.exports = {
  getUser: getUser,
  getMyTeams: getMyTeams,
  updateUser: updateUser,
  createUsers: createUsers,
  indexUsers: indexUsers
}