/** CitiesController **/
'use strict';

cloudApp.controller('CitiesController', ['$scope', '$state', '$localstorage', 'citiesService', 'cityPassService', 'gettextCatalog',
    function ($scope, $state, $localstorage, citiesService, cityPassService, gettextCatalog) {
        var _this = this;
        this.cities = [];
        this.error = null;
        this.cityToSearch = "";


        // Due to a problem during the first translation of the header of the first view, we do it manually
        this.searchCityTranslated = gettextCatalog.getString("Search City");


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
                    .then(function (newCities) {
                        _this.cities = newCities;
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
            if ($localstorage.get('mostViewedCity') !== null) {
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
    }
]);
