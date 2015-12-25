/**
 * Created by Salifukayta on 26/08/2015.
 */
'use strict';

cloudApp.controller('OptionController', ['$scope', '$localstorage', 'gettextCatalog', function ($scope, $localstorage, gettextCatalog) {

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
        //var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
        //var mostViewedCityStringCoplete = mostViewedCityString + " " + _this.mostViewedCity.name;
        //console.log(mostViewedCityStringCoplete);
        //var widthString = getTextWidth(mostViewedCityStringCoplete, "plaint 12pt arial");
        //console.log(widthString);
        ////if (_this.mostViewedCity.name.length > 15) {
        ////    _this.isBigText = true;
        ////    _this.isMiddleText = false;
        ////} else if (_this.mostViewedCity.name.length > 10) {
        ////    _this.isBigText = false;
        ////    _this.isMiddleText = true;
        ////} else {
        ////    _this.isBigText = false;
        ////    _this.isMiddleText = false;
        ////}
        //if (mostViewedCityStringCoplete.length > 50) {
        //    _this.isBigText = true;
        //    _this.isMiddleText = false;
        //} else if (mostViewedCityStringCoplete.length > 30) {
        //    _this.isBigText = false;
        //    _this.isMiddleText = true;
        //} else {
        //    _this.isBigText = false;
        //    _this.isMiddleText = false;
        //}

    });

    this.changeMostViewedCity = function (city) {
        console.log("changeMostUsedCity");
//        var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
//        var mostViewedCityStringCoplete = mostViewedCityString + " " + _this.mostViewedCity.name;
//        console.log(mostViewedCityStringCoplete);
////        console.log(mostViewedCityStringCoplete.length);
//        //TODO to test this
//        var widthString = getTextWidth(mostViewedCityStringCoplete, "bold 15px arial");
//        console.log(widthString);
//        //if (city.name.length > 15) {
//        //    _this.isBigText = true;
//        //    _this.isMiddleText = false;
//        //} else if (city.name.length > 10) {
//        //    _this.isBigText = false;
//        //    _this.isMiddleText = true;
//        //} else {
//        //    _this.isBigText = false;
//        //    _this.isMiddleText = false;
//        //}
//        if (mostViewedCityStringCoplete.length > 50) {
//            _this.isBigText = true;
//            _this.isMiddleText = false;
//        } else if (mostViewedCityStringCoplete.length > 30) {
//            _this.isBigText = false;
//            _this.isMiddleText = true;
//        } else {
//            _this.isBigText = false;
//            _this.isMiddleText = false;
//        }
        $localstorage.set('mostViewedCity', city);
    };

}]);
