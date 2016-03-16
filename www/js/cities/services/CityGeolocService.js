/**
 * Created by Salifukayta on 07/07/2015.
 */

'use strict';

cloudApp.factory('cityGeolocService', ['$q', '$ionicPlatform', '$cordovaGeolocation', '$cordovaGeolocationWifi', 'citiesService',
        'lazyLaodingService', 'gettextCatalog', 'TIME_OUT',
    function ($q, $ionicPlatform, $cordovaGeolocation, $cordovaGeolocationWifi, citiesService, lazyLaodingService, gettextCatalog, TIME_OUT) {

        /**
         * Return cityToSearch information
         *
         * @param cityToSearch
         * @param callback
         */
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

        function verifyGoogleMapLoaded() {
            var deferred = $q.defer();
            // reLoad google map api if not loaded
            if (typeof google === "undefined") {
                console.error("google is undefined");
                lazyLaodingService.lazyLoadGoogleMapApi()
                    .then(function(res) {
                        console.log(res);
                        if (typeof google === "undefined") {
                            deferred.reject(gettextCatalog.getString("Check your Internet Connection"));
                        } else {
                            deferred.resolve("google api loaded successfully");
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        deferred.reject(gettextCatalog.getString("Check your Internet Connection"));
                    });
            } else {
                deferred.resolve("google api loaded successfully");
            }
            return deferred.promise;
        }

        /**
         * Return the address of a city by gps location
         *
         * @param position
         * @param callback
         */
        function getReverseGeoCoding(position, callback) {
            verifyGoogleMapLoaded()
                .then(function () {
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
                })
                .catch(function (err) {
                    console.log(err);
                    callback(err, null);
                });
        }

        /**
         * Get the user current position, get position geo-localisation
         *
         * @param x
         * @param callback
         */
        function getCurrentPosition(x, callback) {
            //test enableHighAccuracy test to true ?

            //FIXME not finished and/or not to be finish, not working and may be will never
            //$cordovaGeolocationWifi.getCurrentPosition(
            //    function (position) {
            //        callback(null, position);
            //    }, function (err) {
            //        console.log(err.message);
            //        callback(gettextCatalog.getString("Check your GPS"), null);
            //    }, {timeout: TIME_OUT, enableHighAccuracy: false});

            //$cordovaGeolocationWifi.getCurrentPosition({timeout: TIME_OUT, enableHighAccuracy: false})
            //    .then(function (position) {
            //        console.log("success :)");
            //        callback(null, position);
            //    }, function (err) {
            //        console.log(err.message);
            //        callback(gettextCatalog.getString("Check your GPS"), null);
            //    });

            $cordovaGeolocation.getCurrentPosition({timeout: TIME_OUT, enableHighAccuracy: false})
                .then(function (position) {
                    callback(null, position);
                }, function (err) {
                    console.log(err.message);
                    callback(gettextCatalog.getString("Check your GPS"), null);
                });
        }

        /**
         * Return the projection of the location of user from the map to the image radar
         *
         * @param userLocationOnMap
         * @param cityLocationOnMap
         * @param cityLocationOnRadar
         * @returns {{x: number, y: number}}
         */
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