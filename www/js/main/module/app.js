
var cloudApp = angular.module('cloudPrecipitation', ['ionic', 'ngCordova', 'ngAnimate', 'gettext', 'angularMoment'])

    .run(function ($ionicPlatform, gettextCatalog, $localstorage, amMoment) {

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
            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (languageLocation) {
                    var language = languageLocation.value.substring(0, 2);
                    console.info("get lang file " + language);
                    if (language != "en") {
                        gettextCatalog.loadRemote("./languages/" + language + ".json")
                            .then(function () {
                                console.info("lang file " + language + " found");
                                gettextCatalog.setCurrentLanguage(language);
                            })
                            .catch(function () {
                                console.error("lang file not found");
                            });
                        amMoment.changeLocale(language);
                    }
                });
            }
            gettextCatalog.debug = true;

            // load and init the ad API
            if (typeof adbuddiz !== "undefined") {
                adbuddiz.setAndroidPublisherKey("76330e92-f3dc-4982-9040-3e5e196d5b98");
                adbuddiz.cacheAds();

                var showAd = $localstorage.get("showAd");

                // First and second time, no ad. Then alternate ad show
                if (showAd != null) {
                    showAd = !showAd;
                    $localstorage.set("showAd", showAd);
                    if (showAd) {
                        //document.addEventListener("pause", showAdEvent, false);
                        //document.addEventListener("backbutton", showAdEvent, false);
                        document.addEventListener("resume", showAdEvent, false);
                        function showAdEvent() {
                            //console.log("on resume = " + angular.toJson($event));
                            adbuddiz.showAd();
                        }
                        //showAdEvent();
                    }
                }
            }
        });
    })

    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="spiral"></ion-spinner>'
    })
    .constant('TIME_OUT', 5000)
    .constant('GOOGLE_MAP_API_KEY', "AIzaSyCmXRiilXO5F60sFNfXs7M9AKoBc-9hTQc")
    .constant('RAIN_RADAR_CITY_PLAY_STORE_URL', "https://play.google.com/store/apps/details?id=com.ionicframework.radarprecipitation587032")
    .constant('BASE_URL_SEARCH_CITY', 'https://www.meteoblue.com/en/server/search/query3?query=')
    .constant('BASE_URL_GET_RADAR', 'https://www.meteoblue.com/en/weather/forecast/week/')
    // Replace thease commented lines for ionic serve --lab command !
    // .constant('BASE_URL_SEARCH_CITY', 'http://localhost:8100/api/en/server/search/query3?query=')
    //.constant('BASE_URL_GET_RADAR', 'http://localhost:8100/api/en/weather/forecast/week/')

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
                        controller: 'RadarController as radarCtrl'
                    }
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
            .state('app.option', {
                url: "/option",
                views: {
                    'menuContent': {
                        templateUrl: "templates/option/option.html",
                        controller: 'OptionController as optionCtrl'
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
