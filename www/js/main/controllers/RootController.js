/**
 * Created by Salifukayta on 01/07/2015. IntroController
 */

'use strict';

cloudApp.controller('RootController', ['$scope', '$state', '$ionicViewService', '$localstorage', 'gettextCatalog', function ($scope, $state, $ionicHistory, $localstorage, gettextCatalog) {

    var lang = 'fr';

    //gettextcatalog.loadremote("./languages/" + lang + ".json")
    //    .then(function(){
    //        gettextcatalog.setcurrentlanguage(lang);
    //    })
    //    .catch(function(config) {
    //        console.log("lang file not found");
    //    });
    //gettextcatalog.debug = true;

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    var testIntro = false;

    if (testIntro || angular.isUndefined($localstorage.get("initDone"))) {
        $state.go('app.intro');
    } else {
        $state.go('app.cities');
    }

}]);
