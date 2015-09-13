
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.update({ accessKeyId: process.env.AWS_API_KEY, secretAccessKey: process.env.AWS_API_SECRET });
AWS.config.region = 'eu-west-1';



module.exports = function () {
  var s3 = new AWS.S3();
  s3.listBuckets(function(err, data) {
    if (err) { console.log("Error:", err); }
    else {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
      }
    }
  });
}