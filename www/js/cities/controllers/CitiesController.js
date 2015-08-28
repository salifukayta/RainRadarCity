/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', '$localstorage', 'citiesService', 'cityPassService', function ($scope, $state, $localstorage, citiesService, cityPassService) {
    var _this = this;
    this.cities = [];
    this.error = null;
    this.cityToSearch = " ";

    this.goTo = function (city) {
        cityPassService.set(city);
        $state.go('app.radar', ({'useGeoloc': false}));
    }

    this.search = function() {
        _this.error = null;
        if (this.cityToSearch == "") {
            this.cities = [];
        } else {
            //console.log("city to search");
            //console.log(this.cityToSearch);
            citiesService.search(this.cityToSearch)
                .then(function(cities){
                    _this.cities = cities;
                    //console.log("results: ");
                    //data.results.forEach(function(city, index, array) {
                    //    console.log(city.name + ", " + city.iso2);
                    //});
                })
                .catch(function(err){
                    _this.error = err;
                    _this.cities = [];
                });
        }
    };

    if ($localstorage.getObject('mostViewedCity') != {}) {
        this.cityToSearch = $localstorage.getObject('mostViewedCity').name;
    }

    this.search();
    this.cityToSearch = "";

}]);
