/**
 * Created by Salifukayta on 02/02/2016.
 */

describe('FavoritesController test', function(){
    var scope;
    var favoritesCtrl;
    var stateMock;
    var cityPassServiceMock;
    var localstorageMock;

    // load the controller's rainRadarCityApp'));
    beforeEach(module('rainRadarCityApp'));

    // disable template caching
    beforeEach(module(function($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    // instantiate the controller and mocks for every test
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();

        localstorageMock = {
            getObject: jasmine.createSpy('$localstorage spy getObject')
                .and.returnValue({paris: {name: "paris"}}),
        };

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        cityPassServiceMock = jasmine.createSpyObj('cityPassService spy', ['set']);

        favoritesCtrl = $controller('FavoritesController', {
            $scope: scope, $state: stateMock, $localstorage: localstorageMock, cityPassService: cityPassServiceMock});
    }));

    describe('#hasNoFavoriteCities has true', function() {

        it('should hasNoFavoriteCities has true', function () {
        console.log("it");
        console.log(favoritesCtrl);
            var hasNoFavoriteCitiesResult = favoritesCtrl.hasNoFavoriteCities();
            expect(hasNoFavoriteCitiesResult).toBeTruthy();
        });
    });

    describe('#hasNoFavoriteCities return false', function() {

        it('should hasNoFavoriteCities return false', function () {
            favoritesCtrl.cities = {nantes: {name: 'nantes'}};
            var hasNoFavoriteCitiesResult = favoritesCtrl.hasNoFavoriteCities();
            expect(hasNoFavoriteCitiesResult).toBeFalsy();
        });
    });

    describe('#goTo', function() {

        it('should call state.go and cityPassService.set', function () {
            var cityMock = {name: "paris"};
            var hasNoFavoriteCitiesResult = favoritesCtrl.goTo(cityMock);

            expect(cityPassServiceMock.set).toHaveBeenCalledWith(cityMock);
            expect(stateMock.go).toHaveBeenCalledWith('app.radar', ({'useGeoloc': false}));
        });
    });

    describe('#ionicViewEnter', function() {
        beforeEach(inject(function($localstorage, $rootScope) {
            $rootScope.$broadcast('$ionicView.enter');
        }));

        it('should set _this.cities to mockCity', function() {
            var cityMock = {paris: {name: "paris"}};
            expect(favoritesCtrl.cities).toEqual(cityMock);
        });
    });
});