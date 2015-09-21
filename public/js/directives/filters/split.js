angular.module('badgeeApp')
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
    
            return input.split(splitChar)[splitIndex];
        }
    });