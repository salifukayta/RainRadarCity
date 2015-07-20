/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('citiesService', ['$q', '$http', 'BASE_URL_SEARCH_CITY', function ($q, $http, BASE_URL_SEARCH_CITY) {
        //TODO use can custom this
        var nbCityPerPage = 20;
        var serviceAPI = {
            search: function (cityToSearch) {
                var deferred = $q.defer();
                $http.get(BASE_URL_SEARCH_CITY + cityToSearch)// + '&itemsPerPage=' + nbCityPerPage)
                    .success(function(data, status, headers, config) {
                        // data.results contains a city array
                        deferred.resolve(data.results);
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get cities");
                        deferred.reject('Please verify your network connection');
                    });
                return deferred.promise;
            },
            reverseCoding: function (position) {
                var deferred = $q.defer();
                if (angular.isUndefined(google)) {
                    deferred.reject("Please verify your network connection");
                    return;
                }
                var geocoder = new google.maps.Geocoder();
                var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // get reverse geo-coding for city name
                geocoder.geocode({'latLng': LatLng}, function (results, status) {
                    console.log(status);
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results);
                        var cityToSearch = {};
//                        cityToSearch.name = results[1].address_components[0].long_name;
                        cityToSearch.name = results[1].address_components[1].long_name;
//                        cityToSearch.country = results[1].address_components[3].long_name;
                        cityToSearch.country = results[1].address_components[4].long_name;
                        console.log(cityToSearch);
                        deferred.resolve(cityToSearch);
                    } else if(status == google.maps.GeocoderStatus.ERROR) {
                        deferred.reject("Please verify your network connection");
                    } else {
                        deferred.reject("Please verify your GPS is activated");
                    }
                });
                return deferred.promise;
            },
            searchOne: function (city, country) {
                var deferred = $q.defer();
                console.log("Search by " + city);
                $http.get(BASE_URL_SEARCH_CITY + city) // + '&itemsPerPage=' + nbCityPerPage)
                    .success(function(data, status, headers, config) {
                        console.log("Search city in");
                        console.log(data.results);
                        // data.results contains a city array
                        for (var i=0; i<data.results.length; i++) {
                            if (city == data.results[i].name && country == data.results[i].country) {
                                console.log(data.results[i]);
                                deferred.resolve(data.results[i]);
                                return;
                            }
                        }
                        console.log("City not found");
                        deferred.reject('City not found');
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get cities");
                        deferred.reject('Please verify your network connection');
                    });
                return deferred.promise;
            },
        };
        return serviceAPI;
    }
]);