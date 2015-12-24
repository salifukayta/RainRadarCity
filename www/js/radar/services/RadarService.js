/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('radarService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_GET_RADAR', 'TIME_OUT', function ($q, $http, gettextCatalog, BASE_URL_GET_RADAR, TIME_OUT) {

    function prepareImgUrl(imgUrl, radar, indexCountryRadar) {
        if (imgUrl.indexOf("file://") == 0) {
            return "https://" + imgUrl.substr(7, imgUrl.length);
        } else if (radar.country.length != 0) {
            return radar.country[0].substr(0, radar.country[0].length - 5) + indexCountryRadar + ".jpg";
        }
    }

    function scrappingData(data) {
        var radar = {
            country: [],
            city: []
        };
        var CLASS_SELECTOR = ".imageanimator";
        var divImgList = $(data).find(CLASS_SELECTOR).get();
        for (var divIndex in divImgList) {
            if (divImgList.hasOwnProperty(divIndex)) {
                var imgsHtml = divImgList[divIndex].innerHTML;
                var imgList = $(imgsHtml).get();
                var indexCountryRadar = 0;
                for (var imgIndex in imgList) {
                    if (imgList.hasOwnProperty(imgIndex)) {
                        var imgUrl = imgList[imgIndex].src;
                        if (imgUrl != undefined) {
                            if (divIndex == 0) {
                                radar.country.push(prepareImgUrl(imgUrl, radar, indexCountryRadar));
                                indexCountryRadar++;
                            } else if (divIndex == 1) {
                                radar.city.push(imgUrl);
                            }
                        }
                    }
                }
            }
        }
        return radar;
    }

    return {
        getPrecipitationRadar: function (cityUrl) {
            console.log("get Precipitation Radar");
            var deferred = $q.defer();

            $http.get(BASE_URL_GET_RADAR + cityUrl, {timeout: TIME_OUT})
                .success(function (data) {
                    deferred.resolve(scrappingData(data));
                })
                .error(function () {
                    console.log("error get city radar");
                    deferred.reject(gettextCatalog.getString('Check your Internet Connection'));
                });
            return deferred.promise;
        }
    };
}]);