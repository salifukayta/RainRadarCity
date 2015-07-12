// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in CitiesController.js
cloudApp = angular.module('cloudPrecipitation', ['ionic', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppController as appCtrl'
            })
            .state('app.root', {
                url: "/root",
                views: {
                    'menuContent': {
                        templateUrl: "templates/root.html",
                        controller: 'RootController as rootCtrl'
                    }
                }
            })
            .state('app.intro', {
                url: "/intro",
                views: {
                    'menuContent': {
                        templateUrl: "templates/intro/intro.html",
                        controller: 'IntroController as introCtrl'
                    }
                }
            })
            .state('app.city-geoloc', {
                url: "/city-geoloc",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cities/cityGeoloc.html",
                        controller: 'CityGeolocController as CityGeolocCtrl'
                    }
                }
            })
            .state('app.cities', {
                url: "/cities",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cities/citiesList.html",
                        controller: 'CitiesController as citiesCtrl'
                    }
                }
            })
            .state('app.radar', {
                url: "/radar/:city",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/radar/radarView.html",
                        controller: 'RadarController as radarCtrl',
                    },
                }
            })

            .state('app.favorites', {
                url: "/favorites",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cities/favorites.html",
                        controller: 'FavoritesController as favoritesCtrl'
                    }
                }
            })

            .state('app.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about/about.html",
                        controller: 'AboutController as aboutCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/root');
    });
