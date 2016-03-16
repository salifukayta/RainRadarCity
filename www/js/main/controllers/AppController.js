/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

cloudApp.controller('AppController', ['$scope', '$ionicHistory', function($scope, $ionicHistory) {

    $scope.goBack = function() {
        /*        var showAd = $localstorage.get("showAd");
         if (showAd == null) {
         $localstorage.set("showAd", true);
         } else if (showAd) {
         adbuddiz.showAd();
         }
         */
        $ionicHistory.goBack();

    };

}]);
