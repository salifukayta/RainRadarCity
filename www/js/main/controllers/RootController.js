/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('RootController', ['$scope', '$state', '$ionicViewService', '$localstorage', function ($scope, $state, $ionicViewService, $localstorage) {

    $ionicViewService.nextViewOptions({
        disableBack: true
    });

    var testIntro = true;

    if (testIntro || angular.isUndefined($localstorage.get("initDone"))) {
        $state.go('app.intro');
    } else {
        $state.go('app.cities');
    }

}]);
