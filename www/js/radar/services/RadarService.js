/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('radarService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_GET_RADAR', 'TIME_OUT',
    function ($q, $http, gettextCatalog, BASE_URL_GET_RADAR, TIME_OUT) {

        var HTTPS = "https://";
        var FILE = "file://";
        var JPG = ".jpg";
        var CLASS_SELECTOR = "imageanimator";
        var IMG_TAG = "img";

        function prepareImgUrl(imgUrl, radar, indexCountryRadar) {
            // To work on device or by emulating on navigator
            if (imgUrl.indexOf(FILE) == 0 || radar.country[0] === undefined) {
                return HTTPS + imgUrl.substr(7, imgUrl.length);
            } else {
                return radar.country[0].substr(0, radar.country[0].length - 5) + indexCountryRadar + JPG;
            }
        }

        function scrappingData(data) {
            var radar = {
                country: [],
                city: []
            };
            var allImgTags = angular.element(data).find(IMG_TAG);
            var indexCountryRadar = 0;
            var firstImgParentTag = null;
            for (var indexImgTag in allImgTags) {
                if (allImgTags.hasOwnProperty(indexImgTag)) {
                    var imgParentTag = allImgTags[indexImgTag].parentNode;
                    if (imgParentTag != undefined && imgParentTag.className === CLASS_SELECTOR) {
                        var imgUrl = allImgTags[indexImgTag].src;
                        if (imgUrl != undefined) {
                            if (firstImgParentTag == null) {
                                firstImgParentTag = imgParentTag;
                            }
                            if (firstImgParentTag === imgParentTag) {
                                radar.country.push(prepareImgUrl(imgUrl, radar, indexCountryRadar));
                                indexCountryRadar++;
                            } else {
                                radar.city.push(imgUrl);
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
            },
            createGif: function (radarsImgs) {
                var deferred = $q.defer();
                gifshot.createGIF({
                    'images': radarsImgs,
                    'interval': 1,
                    //'text': "Rain Radar City",
                }, function(result) {
                    if(!result.error) {
                        deferred.resolve(result.image);
                    } else if (radarsImgs.length > 0) {
                        deferred.resolve(radarsImgs);
                    } else {
                        deferred.reject(gettextCatalog.getString('Share Rain Radar failed'));
                    }
                });
                return deferred.promise;
            },
        };
    }
]);
