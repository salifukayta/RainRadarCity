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
         * @param radarImgWidth
         * @returns {{x: number, y: number}}
         */
        function gps2pixel(userLocationOnMap, cityLocationOnMap, radarImgWidth) {
            // The red point that shows the user position is 10 pixel size
            var redPointSize = 10;
            // -45° heading to top left
            var topLeftCorner = findPointAt60KmHeading(cityLocationOnMap, -45);
            // 135° heading to bottom right
            var bottomRightCorner = findPointAt60KmHeading(cityLocationOnMap, 135);
            return {
                x: Math.round((radarImgWidth - redPointSize)* (userLocationOnMap.longitude - topLeftCorner.lng())
                    / (bottomRightCorner.lng() - topLeftCorner.lng())),
                y: Math.round((radarImgWidth - redPointSize) * (userLocationOnMap.latitude - topLeftCorner.lat())
                    / (bottomRightCorner.lat() - topLeftCorner.lat()))
            };
        }

        /**
         * Find the the end point from a start point, a heading at a distance of 60 km
         *
         * @param pointStart
         * @param heading
         * @returns {*}
         */
        function findPointAt60KmHeading(pointStart, heading) {
            // 60 Km distance from the center to the edge of a radar image
            var distance = 60000;
            return google.maps.geometry.spherical.computeOffset(
                new google.maps.LatLng(pointStart.lat, pointStart.lon),
                distance,
                heading
            );
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
            // Show the coordinates on a map http://www.gps-coordinates.net/
            // Calculate corners coordinates http://www.svennerberg.com/2011/04/calculating-distances-and-areas-in-google-maps-api-3/
            // http://stackoverflow.com/questions/3225803/calculate-endpoint-given-distance-bearing-starting-point
            // Convert gps coordinates to (x, y) screen pixel https://openclassrooms.com/forum/sujet/convertir-coordonnees-gps-en-coordonnees-pixel
            getUserLocationOnCityRadar: function (cityLocationOnMap, radarImgWidth) {
                var deferred = $q.defer();
                $ionicPlatform.ready(function () {
                    var getUserCurrentPosition = async.compose(getReverseGeoCoding, getCurrentPosition);

                    getUserCurrentPosition(null, function (err, userLocationOnMap) {
                        if (userLocationOnMap != null) {
                            if (cityLocationOnMap.country === userLocationOnMap.country) {
                                //TODO center of countries is not known, i will maybe search it manually for few countries.
                                //TODO userLocationOnCountryRadar will be used to show user position in the country
                                //TODO don't forget to  update the deferred instruction.
                                var userLocationOnCountryRadar = null;
                                var userLocationOnCityRadar = gps2pixel(userLocationOnMap.coords, cityLocationOnMap, radarImgWidth);
                                console.log("user Location On City Radar= " + angular.toJson(userLocationOnCityRadar));
                                deferred.resolve({
                                    onCity: userLocationOnCityRadar,
                                    onCountry: userLocationOnCountryRadar
                                });
                            } else {
                                console.warn("Warning: the user location is not in the selected country");
                                deferred.reject();
                            }
                        } else {
                            console.warn("Error: " + err);
                            deferred.reject();
                        }
                    });
                });
                return deferred.promise;
            },
        };

        return serviceAPI;
    }]);