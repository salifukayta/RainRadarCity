/**
 * Created by Salifukayta on 26/08/2015.
 */
'use strict';

cloudApp.controller('OptionController', ['$scope', '$localstorage', function ($scope, $localstorage) {

    this.cities = {};
    this.mostViewedCity = {};
    // boolean for css
    this.isBigText = false;
    this.isMiddleText = false;
    var _this = this;

    this.hasNoFavoriteCities = function () {
        return angular.equals({}, _this.cities);
    };

    this.hasNoMostViewedCity = function () {
        return angular.equals({}, _this.mostViewedCity);
    };

    $scope.$on('$ionicView.enter', function() {
        _this.cities = $localstorage.getObject('favoriteCities');
        _this.mostViewedCity = $localstorage.getObject('mostViewedCity');
        if (city.name.length > 15) {
            _this.isBigText = true;
            _this.isMiddleText = false;
        } else if (city.name.length > 10) {
            _this.isBigText = false;
            _this.isMiddleText = true;
        } else {
            _this.isBigText = false;
            _this.isMiddleText = false;
        }
    });

    this.changeMostViewedCity = function (city) {
        console.log("changeMostUsedCity");
        if (city.name.length > 15) {
            _this.isBigText = true;
            _this.isMiddleText = false;
        } else if (city.name.length > 10) {
            _this.isBigText = false;
            _this.isMiddleText = true;
        } else {
            _this.isBigText = false;
            _this.isMiddleText = false;
        }
        $localstorage.set('mostViewedCity', city);
    };

}]);
