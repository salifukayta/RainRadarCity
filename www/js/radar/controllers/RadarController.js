/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

cloudApp.controller('RadarController', ['$scope', '$stateParams', '$interval', '$ionicLoading', '$localstorage', 'radarService', 'cityGeolocService',
        function($scope, $stateParams, $interval, $ionicLoading, $localstorage, radarService, cityGeolocService) {

            var _this = this;
            var city = null;
            var indexCity = 0;
            var indexCountry = 0;
            this.isFavorite = false;
            this.isNoDataAvailable = false;
            this.radar = {
                country: [],
                city: []
            };

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
                _this.radarCity = _this.radar.city[indexCity];
                _this.radarCountry = _this.radar.country[indexCountry];

                indexCity++;
                indexCountry++;
                if (indexCity === _this.radar.city.length) {
                    indexCity = 0;
                }
                if (indexCountry === _this.radar.country.length) {
                    indexCountry = 0;
                }
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
                        if (_this.radar.city.length != 0) {
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
                $ionicLoading.show({
                    template: 'Loading'
                });
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

            //FIXME to be replaced by ionicHistory
            $scope.$on('$ionicView.enter', function() {
                _this.error = null;
                _this.city = null;
                initCity();
            });
        }
])