// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// the 2nd parameter is an array of 'requires'

cloudApp = angular.module('cloudPrecipitation', ['ionic', 'ngCordova', 'gettext'])

    .run(function ($ionicPlatform, gettextCatalog) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            //if (window.cordova && window.cordova.plugins.Keyboard) {
            //    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //}
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            // load current language
            if(typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (languageLocation) {
                    var language = languageLocation.value.substring(0,2);
                    gettextCatalog.loadRemote("./languages/" + language + ".json")
                        .then(function(){
                            gettextCatalog.setCurrentLanguage(language);
                        })
                        .catch(function(config) {
                            console.error("lang file not found");
                        });
                });
            } else {
                console.error("navigator.globalization is undefined ");
            }
            gettextCatalog.debug = true;
            // Load the strings automatically during initialization.
//            gettextCatalog.setStrings("fr", {
//                "Hello": "Hallo",
//                "One boat": ["Een boot", "{{$count}} boats"]
//            });
        });
    })

    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="spiral"></ion-spinner>'
    })
    .constant('BASE_URL_SEARCH_CITY', 'http://www.meteoblue.com/en/server/search/query3?query=')
    .constant('BASE_URL_GET_RADAR', 'https://www.meteoblue.com/en/weather/forecast/week/')
    .constant('TIME_OUT', 10000)

    .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
        // Do not work, used for windowsphone ?
//        $compileProvider.imgSrcSanitizationWhitelist('img/');

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
                url: "/radar/:useGeoloc",
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
