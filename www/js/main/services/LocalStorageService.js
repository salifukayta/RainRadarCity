/**
 * Created by Salifukayta on 01/07/2015.
 */

'use strict';

rainRadarCityApp.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = angular.toJson(value);
        },
        get: function(key) {
            return angular.fromJson($window.localStorage[key] || null);
        },
        getBoolean: function(key) {
            return angular.fromJson($window.localStorage[key] || false);
        },
        getArray: function(key) {
            return angular.fromJson($window.localStorage[key] || []);
        },
        getObject: function(key) {
            return angular.fromJson($window.localStorage[key] || {});
        },
    }
}]);