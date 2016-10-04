/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

rainRadarCityApp.controller('RootController', ['$scope', '$state', '$ionicHistory', '$localstorage', function ($scope, $state, $ionicHistory, $localstorage) {

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    if ($localstorage.get("initDone_2.0") == null) {
        $state.go('app.intro');
    } else {
        $state.go('app.cities');
    }

}]);
