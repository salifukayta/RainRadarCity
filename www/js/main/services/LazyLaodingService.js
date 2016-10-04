/**
 * Created by Salifukayta on 18/02/2016.
 */

'use strict';

rainRadarCityApp.factory('lazyLaodingService', ['$q', '$timeout', 'GOOGLE_MAP_API_KEY', function ($q, $timeout, GOOGLE_MAP_API_KEY) {
    return {
        lazyLoadGoogleMapApi: function() {
            var deferred = $q.defer();
            var gmapScript = document.createElement('script'); // use global document since Angular's $document is weak
            gmapScript.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAP_API_KEY;
            gmapScript.onload = function () {
                deferred.resolve("googleapis load success");
            };
            document.body.appendChild(gmapScript);

            $timeout(function() { }, 2000)
                .then(function () {
                    deferred.reject("googleapis not loaded yet: Check your Internet Connection");
                });
            return deferred.promise;
        }
    }
}]);