/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('IntroController', ['$scope', '$state', '$ionicViewService', '$localstorage', function ($scope, $state, $ionicViewService, $localstorage) {


    //TODO save index slide ??
    this.startApp = function() {
        $ionicViewService.nextViewOptions({
            disableBack: true
        });
        $localstorage.set("initDone", true);
        $state.go('app.cities');
    };

}]);
