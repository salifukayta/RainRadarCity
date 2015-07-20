/**
 * FavoritesController Created by Salifukayta on 21/06/2015.
 */
'use strict';

cloudApp.controller('FavoritesController', ['$scope', '$state', '$localstorage', function ($scope, $state, $localstorage) {
    var _this = this;

    $scope.$on('$ionicView.enter', function() {
        _this.cities = $localstorage.get('favoriteCities');
    });

    this.goTo = function (city) {
        $state.go('app.radar', {'city': angular.toJson(city) });
    };

}]);
