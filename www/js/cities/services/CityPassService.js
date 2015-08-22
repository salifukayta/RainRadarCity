/**
 * Created by Salifukayta on 20/08/2015.
 */
'use strict';

cloudApp.factory('cityPassService', [function () {

    this.city = null;

    var serviceAPI = {

        set: function (city) {
            this.city = city;
        },

        get: function () {
            return this.city;
        }
    };

    return serviceAPI;
}]);

