/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', 'citiesService', 'cityPassService', function ($scope, $state, citiesService, cityPassService) {
    var _this = this;
    this.cities = [];
    this.error = null;
    this.cityToSearch = " ";

    this.goTo = function (city) {
        cityPassService.set(city);
        $state.go('app.radar', ({useGeoloc: false}));
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
    this.cityToSearch = "";

}]);
