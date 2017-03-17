var Task = require('../models/task');
function searchInstagram(req, res) {
  Task.find({}, (err, tasks) => {
    res.send(tasks);
  });
  // Instagram.tagSearch(req.params.query, function (body) {
  //   var data = body.data;
  //   var i=0,challenges=[];
  //   for (i;i < data.length; i++) {
  //     var utcSeconds = data[i].created_time
  //     var d = new Date(0);
  //     d.setUTCSeconds(utcSeconds);
  //     if (data[i].caption) {
  //        var text = data[i].caption.text
  //     } else {
  //         var text = ''
  //     }
  //     var task = {
  //       _creator:  { name: data[i].user.full_name,
  //        img_url: data[i].user.profile_picture },
  //        img_url: data[i].images.standard_resolution.url,
  //        description: text,
  //        created_at: d
  //      } ;
  //      if (data[i].location !== null) {
  //       task.location = {
  //         name: data[i].location.name,
  //         lat: data[i].location.latitude,
  //         lon: data[i].location.longitude
  //       };
  //     }
  //     challenges.push(task);
  //   }
  //   res.send(challenges);
  // });
}

module.exports = {
  searchInstagram: searchInstagram
};