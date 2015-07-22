/**
 * FavoritesController Created by Salifukayta on 21/06/2015.
 */
'use strict';

cloudApp.controller('FavoritesController', ['$scope', '$state', '$localstorage', function ($scope, $state, $localstorage) {
    this.cities = {};
    var _this = this;

    this.hasNoFavoriteCities = function () {
        return angular.equals({}, _this.cities);
    };

    $scope.$on('$ionicView.enter', function() {
        _this.cities = $localstorage.get('favoriteCities');
    });

    this.goTo = function (city) {
        $state.go('app.radar', {'city': angular.toJson(city) });
    };

}]);
