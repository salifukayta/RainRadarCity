/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('RootController', ['$scope', '$state', '$ionicHistory', '$localstorage', function ($scope, $state, $ionicHistory, $localstorage) {

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    if ( angular.isUndefined($localstorage.get("initDone"))) {
        $state.go('app.intro');
    } else {
        $state.go('app.cities');
    }

}]);
