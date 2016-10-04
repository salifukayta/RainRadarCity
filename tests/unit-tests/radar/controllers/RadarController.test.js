/**
 * Created by Salifukayta on 10/02/2016.
 */

describe('RadarController test', function() {

    var scope;
    var radarCtrl;
    var stateMock;
    var radarServiceMock;
    var localstorageMock;
    var cityGeolocServiceMock;
    var stateParamsMock;
    var intervalMock
    var ionicLoadingMock
    var ionicPlatformMock
    var cityPassServiceMock;
    var citiesServiceDeferred;

    beforeEach(module('rainRadarCityApp'));

    // disable template caching
    beforeEach(module(function($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(inject(function($rootScope, $q, $interval, $controller) {
        scope = $rootScope.$new();
        citiesServiceDeferred = $q.defer();

        radarServiceMock = {
            getPrecipitationRadar: jasmine.createSpy('radarServiceMock spy search')
                .and.returnValue(citiesServiceDeferred.promise),
        }

        localstorageMock = {
            getObject: jasmine.createSpy('$localstorage spy getObject').and.returnValue({paris: {name: "paris"}}),
            get: jasmine.createSpy('$localstorage spy get').and.returnValue({paris: {name: "paris"}}),
            set: jasmine.createSpy('$localstorage spy set'),
        }

        cityGeolocServiceMock = {
            getUserLocationOnRadar: jasmine.createSpy('cityGeolocService spy getUserLocationOnRadar')
                .and.returnValue({longitude: 10, latitude: 20}),
            getGeolocCity: jasmine.createSpy('cityGeolocService spy getGeolocCity')
                .and.returnValue({name: "paris"}),
        };

        stateParamsMock = jasmine.createSpyObj('$stateParams spy', ['useGeoloc']);
        ionicLoadingMock = jasmine.createSpyObj('ionicLoadingMock spy', ['show', 'hide']);
        ionicPlatformMock = jasmine.createSpyObj('ionicPlatformMock spy', ['onHardwareBackButton']);
        cityPassServiceMock = jasmine.createSpyObj('cityPassService spy', ['get']);

        intervalMock = jasmine.createSpy('$interval', $interval).and.callThrough();

        radarCtrl = $controller('RadarController', {
            $scope: scope, $stateParams: stateParamsMock, $interval: intervalMock, $ionicLoading: ionicLoadingMock,
            $ionicPlatform: ionicPlatformMock, $localstorage: localstorageMock, radarService: radarServiceMock,
            cityPassService: cityPassServiceMock, cityGeolocService: cityGeolocServiceMock});
    }));

    describe('#addRemoveFavorite', function() {
        it('should isFavorite === true and cityPassService.set', function () {
            spyOn(radarCtrl, 'isFavorite');
            var cityMock = {name: "paris"};
            radarCtrl.city = {name: "nantes"};
            radarCtrl.addRemoveFavorite();
            expect(radarCtrl.isFavorite).toBeTruthy();
        });
    });

    describe('#pause', function() {
        it('should call $interval.cancel 1 time', function () {
            spyOn(intervalMock, 'cancel');
            radarCtrl.isPaused = false;
            radarCtrl.pause();
            expect(intervalMock.cancel).toHaveBeenCalledTimes(1);
        });
        it('should call $interval.cancel 2 times', function () {
            spyOn(intervalMock, 'cancel');
            radarCtrl.isPaused = true;
            radarCtrl.pause();
            expect(intervalMock.cancel).toHaveBeenCalledTimes(2);
        });
    });

    //describe('#refreshRadar', function() {
    //
    //    it('should call state.go and cityPassService.set', function () {
    //        var cityMock = {name: "paris"};
    //        var hasNoFavoriteCitiesResult = radarCtrl.goTo(cityMock);
    //        expect(cityPassServiceMock.set).toHaveBeenCalledWith(cityMock);
    //        expect(stateMock.go).toHaveBeenCalledWith('app.radar', ({'useGeoloc': false}));
    //    });
    //});


});