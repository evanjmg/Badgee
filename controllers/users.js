var User = require('../models/user.js');

function createUsers (req,res) {
  User.create(req.body, function (error,user) {
    if (error) return res.status(403).send({
      message: "Cannot create user"
    });
    return res.status(200).send(user)
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

module.exports = {
  createUsers: createUsers,
  indexUsers: indexUsers
}