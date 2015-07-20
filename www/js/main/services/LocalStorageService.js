/**
 * Created by Salifukayta on 01/07/2015.
 */

'use strict';

cloudApp.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = angular.toJson(value);
        },
        get: function(key) {
            return angular.fromJson($window.localStorage[key] || null);
        },
    }
}]);