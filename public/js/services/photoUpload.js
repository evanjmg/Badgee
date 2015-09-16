angular
.module('taggyApp')
.service('PhotoUpload', PhotoUpload);

PhotoUpload.$inject = ['$http']
function PhotoUpload($http) {
  var self = this;
  var width = window.innerWidth;   // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var streaming = false;
  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  
  self.uniqueFileName = '';

  self.upload = function(file, callback) { 
    console.log("Inside Photoupload", file)

    if (!file) {
      var file = canvas.toDataURL('image/png');
      file     = dataURItoBlob(file);
      console.log(file);
    }
    
    if (file) {
      self.file     = file;
      self.fileSize = Math.round(parseInt(self.file.size));

      // Validating the size of the file
      if (self.fileSize > 10585760) {
        alert('Sorry, file size must be under 10MB');
        return false;
      }

      // Creating a new unique filename
      self.uniqueFileName = self.uniqueString() + '.png';

      $http.post('/api/aws', {
        name: self.uniqueFileName, 
        size: self.fileSize, 
        type: self.file.type
      }).then(function(res) {
        $.ajax({
          url: res.data.url,
          type: 'PUT',
          data: self.file,
          processData: false,
          contentType: self.file.type,
      }).success(function(res){
        console.log('File uploaded');

        // UI to add the file to the page
        $('#createTaskMainForm').prepend("<img id='capture-preview' class='center' src='https://s3-eu-west-1.amazonaws.com/taggyapp/images/"+self.uniqueFileName+"'>")

        // Return img_url
        callback("https://s3-eu-west-1.amazonaws.com/taggyapp/images/" + self.uniqueFileName);
      });
    });
  }
}

self.startup = function () {

  // These shouldnt be global!
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');

  navigator.getMedia = ( navigator.getUserMedia ||
   navigator.webkitGetUserMedia ||
   navigator.mozGetUserMedia ||
   navigator.msGetUserMedia);

  navigator.getMedia({
    video: true,
    audio: false
  }, function(stream) {
    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  }, function(err) {
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

  clearphoto();
  // create canvas element and append it to document body
  
  // get canvas 2D context and set him correct size
  var ctx = canvas.getContext('2d');

  // last known position
  var pos = { x: 0, y: 30 };

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', setPosition);
  canvas.addEventListener('mouseenter', setPosition);

  // new position from mouse event
  function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }

  // resize canvas

  function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c0392b';

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
  }
}

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    // photo.setAttribute('src', data);
  }

  self.takepicture = function () {
    console.log("INSIDE DIRECTIVE");

    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = video.width;
      canvas.height = video.height;
      context.drawImage(video, 0, 0, width, height);
      $('#canvas').show();
      $('#video').hide();
      $('.cameraOptionButtons').show();
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


  //   function handleOrientation(event) {
  //     var absolute = event.absolute;

  //     var alpha    = event.alpha; // Z In degree in the range [0,360]
  //     var beta     = event.beta; // X In degree in the range [-180,180]
  //     var gamma    = event.gamma; // Y In degree in the range [-90,90]

  //     return orientation = [alpha, beta, gamma];

  //   }
  // window.addEventListener('deviceorientation', handleOrientation);
  self.uniqueString = function() {
    var text     = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
