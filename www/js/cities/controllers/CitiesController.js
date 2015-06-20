/** CitiesCtrl **/
'use strict';

couldApp.controller('CitiesController', function ($scope, $ionicModal) {

    this.cities = [
        {name: "tounes"},
        {name: "sfax"},
        {name: "nantes"},
        {name: "paris"},
        {name: "manouba"},
        {name: "denden"},
    ];

    console.log(this.cities);


    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

})
