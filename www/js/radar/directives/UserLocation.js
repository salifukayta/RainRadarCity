/**
 * Created by Salifukayta on 19/12/2015.
 */

rainRadarCityApp.directive("userLocation", function () {
    return {
        restrict: "A",
        scope: {
            location: "=userLocation"
        },
        link: function(scope, element) {
            element[0].style.display = "none";
            scope.$watch('location', function (newValue) {
                if (newValue) {
                    element[0].style.left = newValue.x + "px";
                    element[0].style.top = newValue.y + "px";
                    element[0].style.display = "block";
                }
            }, true);
        }
    }
});
