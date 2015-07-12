/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', 'citiesService', function ($scope, $state, citiesService) {
    var _this = this;
    this.cities = [];
    this.error = null;

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
}]);
