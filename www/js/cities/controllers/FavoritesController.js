/**
 * FavoritesController Created by Salifukayta on 21/06/2015.
 */
'use strict';

rainRadarCityApp.controller('FavoritesController', ['$scope', '$state', '$localstorage', 'cityPassService',
    function ($scope, $state, $localstorage, cityPassService) {
        this.cities = {};
        var _this = this;

        this.hasNoFavoriteCities = function () {
            return angular.equals({}, _this.cities);
        };

        $scope.$on('$ionicView.enter', function () {
            console.log(_this.cities);
            _this.cities = $localstorage.getObject('favoriteCities');
            console.log("Favourit cities");
            console.log(_this.cities);
        });

        this.goTo = function (city) {
            cityPassService.set(city);
            $state.go('app.radar', ({'useGeoloc': false}));
        };

    }
]);
