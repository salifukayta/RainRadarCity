/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('citiesService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_SEARCH_CITY', 'TIME_OUT', function ($q, $http, gettextCatalog, BASE_URL_SEARCH_CITY, TIME_OUT) {
        //TODO use can custom this
        var nbCityPerPage = 20;
        var serviceAPI = {
            search: function (cityToSearch) {
                var deferred = $q.defer();
                $http.get(BASE_URL_SEARCH_CITY + cityToSearch, {timeout: TIME_OUT})// + '&itemsPerPage=' + nbCityPerPage)
                    .success(function(data, status, headers, config) {
                        // data.results contains a city array
                        deferred.resolve(data.results);
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get cities");
                        deferred.reject(gettextCatalog.getString('Check you Internet Connection'));
                    });
                return deferred.promise;
            },
            reverseCoding: function (position) {
                var deferred = $q.defer();
                if (angular.isUndefined(google)) {
                    console.error("google is undefined");
                    deferred.reject(gettextCatalog.getString("Check you Internet Connection"));
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
                        results[1].address_components.forEach(function (address_component) {
                            if(address_component.types[0] === "locality") {
                                cityToSearch.name = address_component.long_name;
                            } else if (address_component.types[0] === "country") {
                                cityToSearch.country = address_component.long_name;
                            }
                        });
                        console.log(cityToSearch);
                        deferred.resolve(cityToSearch);
                    } else if(status == google.maps.GeocoderStatus.ERROR) {
                        deferred.reject(gettextCatalog.getString("Check you Internet Connection"));
                    } else {
                        deferred.reject(gettextCatalog.getString("Check your GPS"));
                    }
                });
                return deferred.promise;
            },
            searchOne: function (city, country, isVerified) {
                var deferred = $q.defer();
                console.log("Search by " + city);
                var searchOneCity = function(city, country, isVerified) {
                    $http.get(BASE_URL_SEARCH_CITY + city, {timeout: TIME_OUT}) // + '&itemsPerPage=' + nbCityPerPage)
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
                            if(!isVerified) {
                                searchOneCity(city, country, true);
                            } else {
                                console.log("City not found");
                                deferred.reject(gettextCatalog.getString('City not Found'));
                            }
                        })
                        .error(function(data, status, headers, config) {
                            console.log("error get cities");
                            deferred.reject(gettextCatalog.getString('Check you Internet Connection'));
                        });
                };
                searchOneCity(city, country, isVerified);

                return deferred.promise;
            },
        };
        return serviceAPI;
    }
]);