/**
 * Created by Salifukayta on 19/12/2015.
 */

cloudApp.directive("placePosition", function () {
    return {
        restrict: "A",
        scope: {
            position: "=placePosition"
        },
        link: function(scope, element) {
            element[0].style.display = "none";
            scope.$watch('position', function (newValue) {
                if (newValue) {
                    element[0].style.left = newValue.x + "px";
                    element[0].style.top = newValue.y + "px";
                    element[0].style.display = "block";
                }
            }, true);
        }
    }
});
