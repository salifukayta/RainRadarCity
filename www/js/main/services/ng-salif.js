/**
 * Created by Salifukayta on 27/01/2016.
 */

cloudApp.factory('$cordovaGeolocationWifi', ['$q', function ($q) {

        return {
            getCurrentPosition: function (options) {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },
        }
    }]);