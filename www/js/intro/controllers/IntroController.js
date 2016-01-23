/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('IntroController', ['$scope', '$ionicHistory', '$localstorage', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$location', '$state',
    function ($scope, $ionicHistory, $localstorage, $ionicSlideBoxDelegate, $ionicScrollDelegate, $location, $state) {

        this.startApp = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $localstorage.set("initDone_2.0", true);
            $state.go('app.cities');
        };

        this.goToPage = function (index) {
            $ionicSlideBoxDelegate.slide(index);
        };

        /**
         * To scroll to the start button in landscape view
         */
        this.scrollBottom = function () {
            $location.hash(0);
            $ionicScrollDelegate.anchorScroll(true);
//            $ionicScrollDelegate.scrollBottom(true);
        };

    }
]);
