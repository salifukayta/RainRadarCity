/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('radarService', ['$q', '$http', 'BASE_URL_GET_RADAR', function ($q, $http, BASE_URL_GET_RADAR) {

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
        const CLASS_SELECTOR = ".imageanimator";
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

            $http.get(BASE_URL_GET_RADAR + cityUrl)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(scrappingData(data));
                    })
                    .error(function(data, status, headers, config) {
                    console.log("error get city radar");
                        deferred.reject('Please verify you network connection');
                    });

                return deferred.promise;
            },
        };
        return serviceAPI;
    }
]);