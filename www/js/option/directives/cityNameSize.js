/**
 * Created by Salifukayta on 24/12/2015.
 */

cloudApp.directive("cityNameSize", ["gettextCatalog", function (gettextCatalog) {

    var FONT = "bold 15px arial";

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

    return {
        restrict: "A",
        scope: {
            cityName: "=cityNameSize"
        },
        link: function (scope, element) {
            var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
            var clientWidth = element[0].clientWidth;
            //TODO getTextWidth => recursive getAdaquateFontSize
            element[0].style.fontSize = getTextWidth(mostViewedCityString + scope.cityName, clientWidth);

            console.log(element[0].style.fontSize);

            scope.$watch("cityName", function(newValue, oldValue) {
                if(newValue != oldValue) {
                    var mostViewedCityString = gettextCatalog.getString("The most viewed city is");
                    element[0].style.fontSize = getTextWidth(mostViewedCityString + scope.cityName, FONT);
                }
            }, true);
        }
    };
}]);