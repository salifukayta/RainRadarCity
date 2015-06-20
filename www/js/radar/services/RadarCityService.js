/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

couldApp.factory('radarService', ['$q', '$http', '$state',
    function ($q, $http, $state) {

        var serviceAPI = {
            getPrecipitationRadar: function (cityName) {
                console.log("getPrecipitationRadar");
                var deferred = $q.defer();

                $http.get('http://www.meteoblue.com/en/weather/forecast/week/nantes_france_2990969')
                    .success(function(data, status, headers, config) {
                        var locationRadar = {
                            countryRadar: [],
                            cityRadar: []
                        };
                        var divImgList = $(data).find(".imageanimator").get();
                        for (var divIndex in divImgList) {
                            var imgsHtml = divImgList[divIndex].innerHTML;
                            var imgList = $(imgsHtml).get();
                            for (var imgIndex in imgList) {
                                var imgUrl = imgList[imgIndex].src;
                                if (imgUrl != undefined) {
                                    if (divIndex == 0) {
                                        locationRadar.countryRadar.push(imgUrl);
                                    } else if (divIndex == 1) {
                                        locationRadar.cityRadar.push(imgUrl);
                                    }
                                }
                            }
                        }
                        deferred.resolve(locationRadar);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject('error');
                    });

                return deferred.promise;
            },
        };
        return serviceAPI;
    }
]);