/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

rainRadarCityApp.factory('radarService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_GET_RADAR', 'TIME_OUT',
    function ($q, $http, gettextCatalog, BASE_URL_GET_RADAR, TIME_OUT) {

        var HTTPS = "https:";
        var ABSTRACT_PATH = "//";
        var LOCAL_FILE = "file:";
        var JPG = ".jpg";
        var CLASS_SELECTOR = "slides";
        var IMG_TAG = "img";

        function prepareImgUrl(imgUrl, radar, indexCountryRadar) {
            // To work on device or by emulating on navigator
            if (imgUrl.indexOf(ABSTRACT_PATH) == 0 || radar.country[0] === undefined) {
                return HTTPS + imgUrl;
            } else if (imgUrl.indexOf(LOCAL_FILE) == 0 || radar.country[0] === undefined) {
                return HTTPS + imgUrl.substr(5, imgUrl.length);
            } else {
                return radar.country[0].substr(0, radar.country[0].length - 5) + indexCountryRadar + JPG;
            }
        }

        function prepareImagesUrls(imagesUrls, radar) {
            var imagesUrlsPrepared = [];
            for(var i = 0; i < imagesUrls.length; i++) {
                imagesUrlsPrepared.push(prepareImgUrl(imagesUrls[i], radar, i));
            }
            return imagesUrlsPrepared;
        }

        function scrappingData(data) {
            var radar = {
                country: [],
                city: []
            };
            var allImgTags = angular.element(data).find(IMG_TAG);
            var firstImgParentTag = null;
            for (var indexImgTag in allImgTags) {
                if (allImgTags.hasOwnProperty(indexImgTag)) {
                    var imgParentTag = allImgTags[indexImgTag].parentNode;
                    if (imgParentTag != undefined && imgParentTag.className === CLASS_SELECTOR) {
                        var imagesUrls = angular.fromJson(imgParentTag.parentNode.attributes[4].value, []);
                        if (imagesUrls != undefined) {
                            if (firstImgParentTag === null) {
                                firstImgParentTag = imgParentTag;
                            }
                            if (firstImgParentTag === imgParentTag) {
                                radar.country = prepareImagesUrls(imagesUrls, radar);
                            } else {
                                radar.city = imagesUrls;
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
