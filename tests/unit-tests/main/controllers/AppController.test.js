/**
 * Created by Salifukayta on 02/02/2016.
 */

describe('AppController test', function(){
    var scope;
    var appCtrl;
    var ionicHistoryMock;

    beforeEach(module('rainRadarCityApp'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ionicHistoryMock = jasmine.createSpyObj('$ionicHistory spy',["goBack"]);
        appCtrl = $controller('AppController', {$scope: scope, $ionicHistory: ionicHistoryMock});
    }));

    describe('#goBack', function() {

        it('should have a AppController controller', function() {
            expect(appCtrl).toBeDefined();
        });

        beforeEach(inject(function(_$rootScope_) {
            scope.goBack();
        }));

        it('should call goBack on $ionicHistory', function() {
            expect(ionicHistoryMock.goBack).toHaveBeenCalled();
        });
    });

});