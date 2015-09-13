angular
  .module('taggyApp')
  .controller('CaptureController', CaptureController);

CaptureController.$inject = ['$scope'];

function CaptureController($scope) {
  var self = this;
  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var streaming = false;
  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  
  self.uniqueFileName = '';
  startup();

  self.file = $scope.file || $scope.uploadFile || {};
  self.creds = {
    bucket: 'taggyapp/images',
    access_key: 'AKIAJE57UR5TAI4KNVJA',
    secret_key: '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'
  }
  self.image_file_path = self.creds.bucket + '/' + self.uniqueFileName;


 
  self.upload = function() {
    console.log("in upload"); 
    console.log($scope.previewImage);
    // console.log(self.file);
    // console.log($scope.file);

    // Configure The S3 Object 
    AWS.config.update({ accessKeyId: self.creds.access_key, secretAccessKey: self.creds.secret_key });
    AWS.config.region = 'eu-west-1';
    var bucket = new AWS.S3({ params: { Bucket: self.creds.bucket } }); 
    

    if(self.file) {
      var fileSize = Math.round(parseInt(self.file.size));


      // Check file size
      if(self.fileSize > 10585760) {
        alert('Sorry, file size must be under 10MB');
        return false;
      }

      self.uniqueFileName = self.uniqueString() + '.png';
      var params = { Key: self.uniqueFileName, ContentType: self.file.type, Body: self.file, ServerSideEncryption: 'AES256' };
    
    // UPLOAD
      bucket.putObject(params, function(err, data) {
        if(err) {
          // There Was An Error With Your S3 Config
          alert(err.message);
          return false;
        }
        else {
          // Success!
          alert('Upload Done')

        }
      })
      .on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');


          });
    }
    else {
      // No File Selected
      console.log('No File Selected');
    }
  }





  function startup() {
    
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');


    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      console.log(data);

      self.file = dataURItoBlob(data)
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }
  function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
  }


  window.addEventListener('load', startup, false);

  self.uniqueString = function() {
      var text     = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 8; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

}
