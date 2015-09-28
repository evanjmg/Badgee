var request = require('request');

function tagSearch (query, callback) {

  request('https://api.instagram.com/v1/tags/' + query + '/media/recent?client_id='+process.env.INSTAGRAM_BADGEE_KEY,  function (error, response, body) {
    console.log(error);
    console.log(response);
    if (!error && response.statusCode == 200) {
          callback(JSON.parse(body));
         } 
  });
}


module.exports = {
  tagSearch : tagSearch
};