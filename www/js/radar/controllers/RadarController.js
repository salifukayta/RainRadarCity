/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

cloudApp.controller('RadarController', ['$scope', '$stateParams', '$state', '$interval', '$ionicLoading', '$ionicPlatform', '$localstorage',
    'radarService', 'cityGeolocService', 'cityPassService',
    function ($scope, $stateParams, $state, $interval, $ionicLoading, $ionicPlatform, $localstorage, radarService, cityGeolocService, cityPassService) {

        var _this = this;
        this.city = null;
        this.indexCity = -1;
        this.indexCityIncremental = 0;
        this.indexCountry = -1;
        this.indexCountryIncremental = 0;
        this.isFavorite = false;
        this.isNoDataAvailable = false;
        this.stopNextPicture = null;
        this.stopNextCountry = null;
        this.isPaused = false;
        this.radarImgWidth = -1;
        this.radar = {
            country: [],
            city: []
        };

        this.addRemoveFavorite = function () {
            var favorites = $localstorage.getObject('favoriteCities');

            if (angular.isUndefined(favorites[_this.city.name])) {
                favorites[_this.city.name] = _this.city;
                _this.isFavorite = true;
                // put the city as mostViewedCity if it's empty
                if ($localstorage.get('mostViewedCity') == null) {
                    $localstorage.set('mostViewedCity', _this.city);
                }

            } else {
                delete favorites[_this.city.name];
                _this.isFavorite = false;
            }
            $localstorage.set('favoriteCities', favorites);
            console.log(favorites[_this.city.name]);
        };

        var nextIndexCity = function () {
            _this.indexCityIncremental = _this.indexCityIncremental + 0.025;
            //console.log(_this.indexCityIncremental + "/" + _this.radar.city.length);
        };

        var nextIndexCountry = function () {
            _this.indexCountryIncremental = _this.indexCountryIncremental + 0.025;
            //console.log(_this.indexCountryIncremental + "/" + _this.radar.country.length);
        };

        var nexPicture = function () {
            // Increment index city, country for radar array
            // And init index for meter view
            _this.indexCity++;
            _this.indexCityIncremental = _this.indexCity;
            _this.indexCountry++;
            _this.indexCountryIncremental = _this.indexCountry;

            // Start meter view animation
            $interval.cancel(_this.stopNextCity);
            _this.stopNextCity = $interval(nextIndexCity, 75, 40);
            $interval.cancel(_this.stopNextCountry);
            _this.stopNextCountry = $interval(nextIndexCountry, 75, 40);

            // Reset index
            if (_this.indexCity === _this.radar.city.length) {
                _this.indexCity = 0;
                _this.indexCityIncremental = 0;
            }
            if (_this.indexCountry === _this.radar.country.length) {
                _this.indexCountry = 0;
                _this.indexCountryIncremental = 0;
            }

            // Get radar to show
            _this.radarCity = _this.radar.city[_this.indexCity];
            _this.radarCountry = _this.radar.country[_this.indexCountry];
        };

        var initIndex = function () {
            _this.indexCity = -1;
            _this.indexCountry = -1;
        };

        function isCityFavourite() {
            if (!angular.isUndefined($localstorage.getObject('favoriteCities')[_this.city.name])) {
                return $localstorage.get('favoriteCities')[_this.city.name].iso2 == _this.city.iso2;
            } else {
                return false;
            }
        }

        function getRainingRadar() {
            // init favorite icon
            if (isCityFavourite()) {
                _this.isFavorite = true;
            }
            radarService.getPrecipitationRadar(_this.city.url)
                .then(function (data) {
                    $ionicLoading.hide();
                    _this.radar = data;
                    if (_this.radar.country.length != 0) {
                        _this.isNoDataAvailable = false;
                        initIndex();
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
            if (angular.fromJson($stateParams.useGeoloc)) {
                cityGeolocService.getGeolocCity()
                    .then(function (city) {
                        // init city
                        _this.city = city;
                        // init radars
                        getRainingRadar.call(this);
                        initUserPosition();
                    })
                    .catch(function (err) {
                        _this.error = err;
                        $ionicLoading.hide();
                    });
            } else {
                _this.city = cityPassService.get();
                getRainingRadar.call(this);
                initUserPosition();
            }
        }

        function initUserPosition() {
            if (_this.radarImgWidth > 0) {
                var cityLocationOnRadar = {x: _this.radarImgWidth / 2, y: _this.radarImgWidth / 2};
                cityGeolocService.getUserLocationOnRadar(_this.city, cityLocationOnRadar)
                    .then(function (position) {
                        console.log(angular.toJson(position));
                        _this.userPosition = position;
                    })
                    .catch(function (err) {
                        // Can't get user position, or user's city isn't the same as the current city
                        // Do nothing ...
                    });
            } else {
                console.error("ERROR: img radar not yet initialised while initialising user position on the img radar");
            }
        }

        this.refreshRadar = function () {
            _this.error = null;
            $interval.cancel(_this.stopNextPicture);
            initCity();
        }

        $scope.$on('$ionicView.enter', function () {
            _this.error = null;
            _this.city = null;
            initCity();
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            $interval.cancel(_this.stopNextPicture);
            $interval.cancel(_this.stopNextCity);
            $interval.cancel(_this.stopNextCountry);
            var showAd = $localstorage.get("showAd");
            if (showAd == null) {
                $localstorage.set("showAd", true);
            } else if (showAd) {
                adbuddiz.showAd();
            }
        });

        this.pause = function () {
            if (_this.isPaused) {
                nexPicture();
                _this.stopNextPicture = $interval(nexPicture, 3000);
            } else {
                $interval.cancel(_this.stopNextPicture);
            }
            _this.isPaused = !_this.isPaused;
        };

        $ionicPlatform.onHardwareBackButton(function () {
            $ionicLoading.hide();
        });

    }
]);