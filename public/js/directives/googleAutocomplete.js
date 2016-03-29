(function (){
    'use strict';
    
    angular
        .module("badgeeApp")
        .directive('gautocomplete', gautocomplete);
 

    function gautocomplete () {
        return {  
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=ngModel',
                details: '=?'
            },
            link: function(scope, element, attrs, model) {
            
    
                var options = {
                    types: ['geocode'],
                    componentRestrictions: {}
                };

                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    var geoComponents = scope.gPlace.getPlace();
                    
                    var loc = [geoComponents.geometry.location.lat(),geoComponents.geometry.location.lng()];
                    var addressComponents = geoComponents.address_components;
                    addressComponents = addressComponents.filter(function(component){
                        switch (true) {
                            case "locality" == component.types[0]: // city
                                return true;
                                      // state
                            case "administrative_area_level_1" == component.types[0]:
                                return false;
                       
                            case "country" == component.types[0]: // country
                                return false;
                            default:
                                return false;
                        }
                    }).map(function(obj) {
                        return obj.short_name;
                    });
                 
                    var object = { name: addressComponents[0],loc:loc};
                    scope.$apply(function() {
                        scope.ngModel = scope.ngModel.split(',')[0];
                        scope.details = object; // array containing each location component
                    });
                    scope.$on('$destroy', function () {
                         google.maps.event.clearInstanceListeners(element[0]);
                    });

                });
            
                
             }
        };

    }
})();