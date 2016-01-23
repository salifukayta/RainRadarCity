/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', '$localstorage', 'citiesService', 'cityPassService',
    function ($scope, $state, $localstorage, citiesService, cityPassService) {
        var _this = this;
        this.cities = [];
        this.error = null;
        this.cityToSearch = "";

        this.goTo = function (city) {
            cityPassService.set(city);
            $state.go('app.radar', ({'useGeoloc': false}));
        };

        this.search = function () {
            _this.error = null;
            if (this.cityToSearch === "") {
                this.cities = [];
            } else {
                console.log("city to search");
                console.log(this.cityToSearch);
                citiesService.search(this.cityToSearch)
                    .then(function (cities) {
                        _this.cities = cities;
                    })
                    .catch(function (err) {
                        _this.error = err;
                        _this.cities = [];
                    });
            }
        };

        this.clearSearch = function () {
            console.log(_this.cityToSearch);
            _this.cityToSearch = "";
        };

        function initCitiesList() {
            if ($localstorage.get('mostViewedCity') != null) {
                console.log($localstorage.getObject('mostViewedCity'));
                _this.cityToSearch = $localstorage.getObject('mostViewedCity').name;
            } else {
                _this.cityToSearch = " ";
            }
            _this.search();
            _this.clearSearch();
        };

        this.refreshCitiesList = function () {
            initCitiesList();
        };

        initCitiesList();

    }]);
