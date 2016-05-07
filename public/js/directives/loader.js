(function (){
     angular
        .module('badgeeApp')
        .directive('loader', loader);
    loader.$inject = ['$http', '$rootScope'];

    function loader ($http, $rootScope) {
         return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {   
         
                scope.isLoading = function () {
                    return $http.pendingRequests.length == 0;
                };

                var unWatchLoader = scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        angular.element(elm).css({ display: 'none'});
                        
                    }else{

                        angular.element(elm).css({ display: 'block'});

                    }
                });
                
                scope.$on('$destroy', function (){
                    unWatchLoader();
                });
            }
        };
    }
})();