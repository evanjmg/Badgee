angular
  .module('taggyApp')
  .directive('slider', Slider);

function Slider() {
  var directive = {};
  directive.restrict    = "E";
  directive.replace     = true;
  directive.link =   function(scope, element, attrs) {

       var tag = '<div id="slider"></div><input id="input-number"><span id="minutes">Minutes</span>';
       element.append(tag);

        var rangeSlider = $('#slider')[0];
        console.log('slider');
       noUiSlider.create(rangeSlider, {
        start: [ 10 ],
        step: 1,
    format: wNumb({
           decimals: 0, // default is 2
           thousand: '.', // thousand delimiter
           postfix: '', // gets appended after the number
       }),
        range: {
          'min': [ 0 ],
          'max': [ 60 ]
        }
       });;
        var rangeSliderValueElement = document.getElementById('input-number');


        rangeSlider.noUiSlider.on('update', function( values, handle ) {
          rangeSliderValueElement.value = values[handle];
        });
  }
  directive.scope       = {
  question: "@"
  }
  return directive
}