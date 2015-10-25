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

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     *
     * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    };

    $scope.$on('$ionicView.enter', function() {
        _this.cities = $localstorage.getObject('favoriteCities');
        _this.mostViewedCity = $localstorage.getObject('mostViewedCity');
        var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
        var mostViewedCityStringCoplete = mostViewedCityString + " " + _this.mostViewedCity.name;
        console.log(mostViewedCityStringCoplete);
        var widthString = getTextWidth(mostViewedCityStringCoplete, "plaint 12pt arial");
        console.log(widthString);
        //if (_this.mostViewedCity.name.length > 15) {
        //    _this.isBigText = true;
        //    _this.isMiddleText = false;
        //} else if (_this.mostViewedCity.name.length > 10) {
        //    _this.isBigText = false;
        //    _this.isMiddleText = true;
        //} else {
        //    _this.isBigText = false;
        //    _this.isMiddleText = false;
        //}
        if (mostViewedCityStringCoplete.length > 50) {
            _this.isBigText = true;
            _this.isMiddleText = false;
        } else if (mostViewedCityStringCoplete.length > 30) {
            _this.isBigText = false;
            _this.isMiddleText = true;
        } else {
            _this.isBigText = false;
            _this.isMiddleText = false;
        }

    });

    this.changeMostViewedCity = function (city) {
        console.log("changeMostUsedCity");
        var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
        var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
        var mostViewedCityStringCoplete = mostViewedCityString + " " + _this.mostViewedCity.name;
        console.log(mostViewedCityStringCoplete);
//        console.log(mostViewedCityStringCoplete.length);
        //TODO to test this
        var widthString = getTextWidth(mostViewedCityStringCoplete, "bold 15px arial");
        console.log(widthString);
        //if (city.name.length > 15) {
        //    _this.isBigText = true;
        //    _this.isMiddleText = false;
        //} else if (city.name.length > 10) {
        //    _this.isBigText = false;
        //    _this.isMiddleText = true;
        //} else {
        //    _this.isBigText = false;
        //    _this.isMiddleText = false;
        //}
        if (mostViewedCityStringCoplete.length > 50) {
            _this.isBigText = true;
            _this.isMiddleText = false;
        } else if (mostViewedCityStringCoplete.length > 30) {
            _this.isBigText = false;
            _this.isMiddleText = true;
        } else {
            _this.isBigText = false;
            _this.isMiddleText = false;
        }
        $localstorage.set('mostViewedCity', city);
    };

}]);
