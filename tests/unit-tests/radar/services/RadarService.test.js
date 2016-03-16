/**
 * Created by Salifukayta on 17/02/2016.
 */


describe('RadarService test', function() {

    var radarService;
    var $q;
    var $http;
    var gettextCatalog;
    var BASE_URL_GET_RADAR = "mockUrl";
    var TIME_OUT = 5;
    var radarsDefered;

    beforeEach(module('cloudPrecipitation'));

    beforeEach(inject(function(_radarService_) {
        radarService = _radarService_;
    }));

    it('can get an instance of radarService factory', function() {
        expect(radarService).toBeDefined();
    });

    beforeEach(inject(function($q, _$httpBackend_, _$rootScope_) {
        $http = _$httpBackend_;
        gettextCatalog = jasmine.createSpyObj('gettextCatalog spy', ['getString']);
        radarsDefered = $q.defer();

        radarService.createGif([])
            .then(function(result) {
                console.log("------------------------\n result= ", result);
            });
    }));

});
