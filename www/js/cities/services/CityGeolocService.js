/**
 * Created by Salifukayta on 07/07/2015.
 */

'use strict';

cloudApp.factory('cityGeolocService', ['$q', '$ionicPlatform', '$cordovaGeolocation', 'citiesService', 'gettextCatalog', 'TIME_OUT',
    function ($q, $ionicPlatform, $cordovaGeolocation, citiesService, gettextCatalog, TIME_OUT) {

        function getCityInformation(cityToSearch, callback) {
            // get city information for raining radar
            citiesService.searchOne(cityToSearch.name, cityToSearch.country, false)
                .then(function (city) {
                    callback(null, city);
                })
                .catch(function (err) {
                    console.log(err);
                    callback(err, null);
                });
        }

        function getReverseGeoCoding(position, callback) {
            // get reverse geo-coding for city name
            citiesService.reverseCoding(position)
                .then(function (cityToSearch) {
                    cityToSearch.coords = position.coords;
                    callback(null, cityToSearch);
                })
                .catch(function (err) {
                    console.log(err);
                    callback(err, null);
                });
        }

        function getCurrentPosition(x, callback) {
            // get position geo-localisation
            //test enableHighAccuracy test to true ?
            $cordovaGeolocation.getCurrentPosition({timeout: TIME_OUT, enableHighAccuracy: false})
                .then(function (position) {
                    callback(null, position);
                }, function (err) {
                    console.log(err.message);
                    callback(gettextCatalog.getString("Check your GPS"), null);
                });
        }

        function projectionOnRadar(userLocationOnMap, cityLocationOnMap, cityLocationOnRadar) {
            return {
                x: cityLocationOnRadar.x + cityLocationOnMap.lon - userLocationOnMap.longitude,
                y: cityLocationOnRadar.y + cityLocationOnMap.lat - userLocationOnMap.latitude,
            };
        }

        var serviceAPI = {
            getGeolocCity: function () {
                var deferred = $q.defer();
                $ionicPlatform.ready(function () {
                    var getPositionThenCity = async.compose(getCityInformation, getReverseGeoCoding, getCurrentPosition);
                    getPositionThenCity(null, function (err, result) {
                        if (result != null) {
                            deferred.resolve(result);
                        } else {
                            console.log("Error: " + err);
                            deferred.reject(err);
                        }
                    });
                });
                return deferred.promise;
            },
            getUserLocationOnRadar: function (cityLocationOnMap, cityLocationOnRadar) {
                var deferred = $q.defer();
                $ionicPlatform.ready(function () {
                    var getUserCurrentPosition = async.compose(getReverseGeoCoding, getCurrentPosition);

                    getUserCurrentPosition(null, function (err, userLocationOnMap) {
                        if (userLocationOnMap != null) {
                            if (cityLocationOnMap.country === userLocationOnMap.country && cityLocationOnMap.name === userLocationOnMap.name) {
                                var userLocationOnRadar = projectionOnRadar(userLocationOnMap.coords, cityLocationOnMap, cityLocationOnRadar);
                                // Accuracy in meters, not used for now
                                console.log("user Location On Radar= " + angular.toJson(userLocationOnRadar));
                                deferred.resolve(userLocationOnRadar);
                            } else {
                                console.log("Warning: the user location is not in the selected city");
                                deferred.reject("Warning: the user location is not in the selected city");
                            }
                        } else {
                            console.log("Error: " + err);
                            deferred.reject(err);
                        }
                    });
                });
                return deferred.promise;
            },
        };

        return serviceAPI;
    }]);