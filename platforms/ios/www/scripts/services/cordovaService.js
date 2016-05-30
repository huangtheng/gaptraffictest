
(function () {
    "use strict";
    angular.module('TrafficLaws.cordovaService', [])
        .factory("cordova", ['$q', "$window", function ($q, $window) {
            var deferred = $q.defer();
            var resolved = false;
            if (resolved && $window.cordova) {
                deferred.resolve($window.cordova);
            } else {
                document.addEventListener('deviceready', function () {
                    //navigator.splashscreen.hide();
                    resolved = true;
                    deferred.resolve($window.cordova);
                }, false);
            }
            return { ready: deferred.promise };
        }])

})();