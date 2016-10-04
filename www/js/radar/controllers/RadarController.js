/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

rainRadarCityApp.controller('RadarController', ['$scope', '$stateParams', '$interval', '$ionicLoading', '$ionicPlatform', '$localstorage',
    '$ionicPopup', '$cordovaSocialSharing', '$cordovaToast', 'gettextCatalog', 'radarService', 'cityGeolocService',
    'cityPassService', 'moment', 'RAIN_RADAR_CITY_PLAY_STORE_URL',
    function ($scope, $stateParams, $interval, $ionicLoading, $ionicPlatform, $localstorage, $ionicPopup, $cordovaSocialSharing,
              $cordovaToast, gettextCatalog, radarService, cityGeolocService, cityPassService, moment, RAIN_RADAR_CITY_PLAY_STORE_URL) {

        var _this = this;
        var RADAR_PIC_INTERVAL = 2000;
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
        this.choiceRadarToShare = "city";
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
            //50 * 40 = 2000 ms
            _this.stopNextCity = $interval(nextIndexCity, 50, 40);
            $interval.cancel(_this.stopNextCountry);
            _this.stopNextCountry = $interval(nextIndexCountry, 50, 40);

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
                    _this.isNoDataAvailable = _this.radar.country.length == 0;
                    if (!_this.isNoDataAvailable) {
                        initIndex();
                        nexPicture();
                        _this.stopNextPicture = $interval(nexPicture, RADAR_PIC_INTERVAL);
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
                cityGeolocService.getUserLocationOnCityRadar(_this.city, _this.radarImgWidth)
                    .then(function (position) {
                        _this.userPositionInCity = position.onCity;
                        _this.userPositionInCountry = position.onCountry;
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
            _this.isPaused = !_this.isPaused;
            if (_this.isPaused) {
                $interval.cancel(_this.stopNextPicture);
            } else {
                nexPicture();
                _this.stopNextPicture = $interval(nexPicture, 2000);
            }
        };

        function doShareRadarGif(choiceRadarToShare) {
            var space = " ";
            var shareMsg = gettextCatalog.getString("Rain Radar of") + space;
            var radarsToShare;
            if (choiceRadarToShare === "city") {
                shareMsg = shareMsg + _this.city.name + space;
                radarsToShare = _this.radar.city;
            } else {
                shareMsg = shareMsg + _this.city.country + space;
                radarsToShare = _this.radar.country;
            }
            shareMsg = shareMsg + gettextCatalog.getString("on") + space + moment().format('LLLL') + ".";
            console.log("shareMsg: ", shareMsg);
            radarService.createGif(radarsToShare)
                .then(function (radarsGif) {
                    $cordovaSocialSharing.share(shareMsg, shareMsg, radarsGif, RAIN_RADAR_CITY_PLAY_STORE_URL)
                        .then(function (result) {
                            $cordovaToast.showLongBottom(gettextCatalog.getString('Sharing Done'));
                        });
                })
                .catch(function (err) {
                    $cordovaToast.showLongBottom(err);
                });
        }

        this.shareRadar = function () {
            if (_this.radar.city.length == 0) {
                _this.choiceRadarToShare = "country";
                doShareRadarGif(_this.choiceRadarToShare);
            } else {
                var popupShareRadar = $ionicPopup.show({
                    title: gettextCatalog.getString('Which Rain Radar View do you want to share ?'),
                    //subTitle: 'Please use normal things',
                    scope: $scope,
                    templateUrl: 'templates/radar/shareRadarPopup.html',
                    buttons: [
                        {
                            text: gettextCatalog.getString('Cancel'),
                            type: ' button-assertive',
                            onTap: function (e) {
                                return false;
                            }
                        },
                        {
                            text: '<b>' + gettextCatalog.getString('Share') + '</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                return true;
                            }
                        }
                    ]
                });
                popupShareRadar.then(function (result) {
                    if (result === true) {
                        doShareRadarGif(_this.choiceRadarToShare);
                    }
                });
            }
        };

        $ionicPlatform.onHardwareBackButton(function () {
            $ionicLoading.hide();
        });

    },
]);