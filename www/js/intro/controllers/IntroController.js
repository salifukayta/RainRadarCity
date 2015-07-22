/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('IntroController', ['$scope', '$state', '$ionicHistory', '$localstorage', function ($scope, $state, $ionicHistory, $localstorage) {

    this.startApp = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $localstorage.set("initDone", true);
        $state.go('app.cities');
    };

}]);
