/**
 * Created by Salifukayta on 23/12/2015.
 */

rainRadarCityApp.directive("radarImgWidth", function() {
    return {
        restrict: "A",
        scope: {
            imgWidth: "=radarImgWidth"
        },
        link: function(scope, element) {
            scope.imgWidth = element[0].width;
            console.log(angular.toJson(element[0]));
        }
    }
});