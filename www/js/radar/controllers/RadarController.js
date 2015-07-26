/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

cloudApp.controller('RadarController', ['$scope', '$stateParams', '$interval', '$ionicLoading', '$localstorage', 'radarService', 'cityGeolocService',
        function($scope, $stateParams, $interval, $ionicLoading, $localstorage, radarService, cityGeolocService) {

            var _this = this;
            this.city = null;
            this.indexCity = -1;
            this.indexCountry = -1;
            this.isFavorite = false;
            this.isNoDataAvailable = false;
            this.radar = {
                country: [],
                city: []
            };
            //
            //this.progressCity = function () {
            //    console.log("_this.radar.city.length= " + _this.radar.city.length);
            //    return indexCity + 1 / _this.radar.city.length;
            //};
            //
            //this.progressCountry = function () {
            //    console.log("_this.radar.country.length= " + _this.radar.country.length);
            //    return indexCountry + 1 / _this.radar.country.length;
            //};

            this.addRemoveFavorite = function () {
                var favorites = $localstorage.get('favoriteCities');

                if (angular.isUndefined(favorites[_this.city.name])) {
                    favorites[_this.city.name] = _this.city;
                    _this.isFavorite = true;
                } else {
                    delete favorites[_this.city.name];
                    _this.isFavorite = false;
                }
                $localstorage.set('favoriteCities', favorites);
                console.log(favorites[_this.city.name]);
            };

            var nexPicture = function () {
                _this.indexCity++;
                _this.indexCountry++;
                if (_this.indexCity === _this.radar.city.length) {
                    _this.indexCity = 0;
                }
                if (_this.indexCountry === _this.radar.country.length) {
                    _this.indexCountry = 0;
                }

                _this.radarCity = _this.radar.city[_this.indexCity];
                _this.radarCountry = _this.radar.country[_this.indexCountry];
            };

            function getRainingRadar() {
                // init favorite icon
                if($localstorage.get('favoriteCities') != null && !angular.isUndefined($localstorage.get('favoriteCities')[_this.city.name])) {
                    _this.isFavorite = true;
                }
                radarService.getPrecipitationRadar(_this.city.url)
                    .then(function (data) {
                        $ionicLoading.hide();
                        _this.radar = data;
                        if (_this.radar.country.length != 0) {
                            _this.isNoDataAvailable = false;
                            nexPicture();
                            $interval(nexPicture, 3000);
                        } else {
                            _this.isNoDataAvailable = true;
                        }
                    })
                    .catch(function (err) {
                        $ionicLoading.hide();
                        _this.error = err;
                    });
            }

            function initCity() {
                $ionicLoading.show();
                if ($stateParams.city == "") {
                    cityGeolocService.getGeolocCity()
                        .then(function(city) {
                            // init city
                            _this.city = city;
                            // init radars
                            getRainingRadar.call(this);
                        })
                        .catch(function(err) {
                            _this.error = err;
                            $ionicLoading.hide();
                        });
                } else {
                    _this.city = angular.fromJson($stateParams.city);
                    getRainingRadar.call(this);
                }
            }

            this.refreshRadar = function () {
                _this.error = null;
                initCity();
            }

            $scope.$on('$ionicView.enter', function() {
                _this.error = null;
                _this.city = null;
                initCity();
            });
        }
])