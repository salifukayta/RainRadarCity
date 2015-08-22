/**
 * FavoritesController Created by Salifukayta on 21/06/2015.
 */
'use strict';

cloudApp.controller('FavoritesController', ['$scope', '$state', '$localstorage', 'cityPassService', function ($scope, $state, $localstorage, cityPassService) {
    this.cities = {};
    var _this = this;

    this.hasNoFavoriteCities = function () {
        console.log(_this.cities);
        return angular.equals({}, _this.cities);
    };

    $scope.$on('$ionicView.enter', function() {
        _this.cities = $localstorage.getObject('favoriteCities');
    });

    this.goTo = function (city) {
        cityPassService.set(city);
        $state.go('app.radar', false);
    };

}]);
