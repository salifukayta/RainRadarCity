/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

cloudApp.controller('RadarController', ['$scope', '$stateParams', '$interval', '$ionicLoading', '$localstorage', 'radarService', 'cityGeolocService',
        function($scope, $stateParams, $interval, $ionicLoading, $localstorage, radarService, cityGeolocService) {

            var _this = this;
            this.city = null;
            this.indexCity = -1;
            this.indexCityIncremental = 0;
            this.indexCountryIncremental = 0;
            this.indexCountry = -1;
            this.isFavorite = false;
            this.isNoDataAvailable = false;
            this.stopNextPicture = null;
            this.radar = {
                country: [],
                city: []
            };

            this.addRemoveFavorite = function () {
                var favorites = $localstorage.getObject('favoriteCities');

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

            var nextIndexCity = function() {
                _this.indexCityIncremental = _this.indexCityIncremental + 0.025;
                console.log(_this.indexCityIncremental + "/" + _this.radar.city.length);
            };

            var nextIndexCountry = function() {
                _this.indexCountryIncremental = _this.indexCountryIncremental + 0.025;
                console.log(_this.indexCountryIncremental + "/" + _this.radar.country.length);
            };

            var nexPicture = function () {
                _this.indexCity++;
                _this.indexCityIncremental = _this.indexCity;
                _this.indexCountry++;
                _this.indexCountryIncremental = _this.indexCountry;

                $interval(nextIndexCity, 75, 40);
                $interval(nextIndexCountry, 75, 40);

                if (_this.indexCity === _this.radar.city.length) {
                    _this.indexCity = 0;
                    _this.indexCityIncremental = 0;
                }
                if (_this.indexCountry === _this.radar.country.length) {
                    _this.indexCountry = 0;
                    _this.indexCountryIncremental = 0;
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
                            _this.stopNextPicture = $interval(nexPicture, 3000);
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
                $interval.cancel(_this.stopNextPicture);
                initCity();
            }

            $scope.$on('$ionicView.enter', function() {
                _this.error = null;
                _this.city = null;
                initCity();
            });
        }
])