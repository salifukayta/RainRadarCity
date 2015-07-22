/**
 * Created by Salifukayta on 20/06/2015.
 */
'use strict';

cloudApp.factory('citiesService', ['$q', '$http', 'gettextCatalog', 'BASE_URL_SEARCH_CITY', function ($q, $http, gettextCatalog, BASE_URL_SEARCH_CITY) {
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
                        deferred.reject(gettextCatalog.getString('Please check you internet connection is enabled'));
                    });
                return deferred.promise;
            },
            reverseCoding: function (position) {
                var deferred = $q.defer();
                if (angular.isUndefined(google)) {
                    deferred.reject(gettextCatalog.getString("Please check you internet connection is enabled"));
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
                        deferred.reject(gettextCatalog.getString("Please check you internet connection is enabled"));
                    } else {
                        deferred.reject(gettextCatalog.getString("Please check your GPS is enabled"));
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
                        deferred.reject(gettextCatalog.getString('City not found'));
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get cities");
                        deferred.reject(gettextCatalog.getString('Please check you internet connection is enabled'));
                    });
                return deferred.promise;
            },
        };
        return serviceAPI;
    }
]);