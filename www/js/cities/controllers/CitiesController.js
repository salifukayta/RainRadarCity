/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', '$localstorage', 'citiesService', function ($scope, $state, $localstorage, citiesService) {
    var _this = this;
    this.cities = [];
    this.error = null;

    this.cityToSearch = $localstorage.get("recentCity");

    this.goTo = function (city) {
        $state.go('app.radar', {'city': angular.toJson(city) });
    }

    this.search = function() {
        _this.error = null;
        if (this.cityToSearch == "") {
            this.cities = [];
        } else {
            citiesService.search(this.cityToSearch)
                .then(function(cities){
                    _this.cities = cities;
                    console.log(cities);
                })
                .catch(function(err){
                    _this.error = err;
                    _this.cities = [];
                });
        }
    };
    this.search();
}]);
