/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('radarService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_GET_RADAR', 'TIME_OUT', function ($q, $http, gettextCatalog, BASE_URL_GET_RADAR, TIME_OUT) {

    function prepareImgUrl(imgUrl, radar, indexCountryRadar) {
        if(imgUrl.indexOf("file://") == 0) {
            return "https://" + imgUrl.substr(7, imgUrl .length);
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
            var imgsHtml = divImgList[divIndex].innerHTML;
            var imgList = $(imgsHtml).get();
            var indexCountryRadar = 0;
            for (var imgIndex in imgList) {
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
        return radar;
    }

    var serviceAPI = {
        getPrecipitationRadar: function (cityUrl) {
            console.log("get Precipitation Radar");
            var deferred = $q.defer();

            $http.get(BASE_URL_GET_RADAR + cityUrl, {timeout: TIME_OUT})
                    .success(function(data, status, headers, config) {
                        deferred.resolve(scrappingData(data));
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get city radar");
                        deferred.reject(gettextCatalog.getString('Check your Internet Connection'));
                    });
            return deferred.promise;
        },
        getOnMapGpsPosition: function () {
            console.log("get on Map GPS position");
            var deferred = $q.defer();

            $cordovaGeolocation.getCurrentPosition({timeout: TIME_OUT, enableHighAccuracy: true})
                .then(function (position) {
                    deferred.resolve(scrappingData(data));
                    console.log(angular.toJson(position));
                }, function (err) {
                    console.log(err.message);
                    deferred.reject(gettextCatalog.getString('Check GPS'));
                });
        },
    };
    return serviceAPI;
}]);