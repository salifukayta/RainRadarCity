/**
 * Created by Salifukayta on 19/06/2015.
 */
'use strict';

couldApp.controller('RadarCityController', ['$scope', '$stateParams', 'radarService', function($scope, $stateParams, radarService) {
    var _this = this;
    this.cityName = $stateParams.cityName;

    radarService.getPrecipitationRadar(this.cityName)
        .then(function(data){
            console.log(data);
            _this.img = data.cityRadar[0];
            //TODO afficher les images
        })
        .catch(function(err){
            //TODO erreur
            console.log(err);
        });

}])