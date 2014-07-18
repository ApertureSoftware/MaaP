/**
 * File: ControllerColl;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 10/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */
'use strict';

describe('Controller: QueryCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        scope,
        location,
        $httpBackend,
        data = [ [ 'Collection Name', 'Selected fields', 'Score' ],
            [ { _id: '53b5bed9fe9816304863597b', data: [Object] },
                { _id: '53b65af79e533fc815e6b3e8', data: [Object] } ],
            { pages: 1 } ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_,
        location = $location;


        MainCtrl = $controller('QueryCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });

    }));

    it('should initialize data correctly', function () {
        expect(scope.current_page).toBe(0);
        expect(scope.rows.length).toBe(0);
    });

    it('should set  data on the scope when successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        // When
        scope.getData();
        $httpBackend.flush();
        // Then
        expect(scope.pages).toBe(data[2].pages);
        expect(scope.labels[0]).toBe('Collection Name');
        expect(scope.labels[1]).toBe('Selected fields');
        expect(scope.labels[2]).toBe('Score');


    });

    it('should go to 404 when not successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/404.html').respond(200);
        scope.getData();

        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should delete an index correctly', function () {
        // Given
        $httpBackend.whenGET('views/queryCollection.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/queries/list').respond(200);


        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/queries');

    });

    it('should display an error when the delete fails', function () {
        // Given
        $httpBackend.whenGET('views/collection.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/queries/list').respond(400);


        scope.delete_document();
        $httpBackend.flush();


    });


    it('should create an index correctly', function () {
        // Given
        $httpBackend.whenGET('views/queryCollection.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/indexCollection.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(200, data);
        $httpBackend.whenPUT('http://localhost:9000/api/indexes').respond(200);


        scope.createIndex();
        $httpBackend.flush();
        expect(location.path()).toBe('/indexes');


    });

    it('should display an error when the index creation fails', function () {
        // Given
        $httpBackend.whenGET('views/queryCollection.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/indexCollection.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/queries/list?page=0').respond(200, data);
        $httpBackend.whenPUT('http://localhost:9000/api/indexes').respond(400);


        scope.createIndex();
        $httpBackend.flush();


    });


    it('should initialize data correctly', function () {
        expect(scope.current_page).toBe(0);
        expect(scope.rows.length).toBe(0);
    });



    it('should go to the correct page', function () {
        scope.current_page=2;
        scope.toPage(4);
        expect(scope.current_page).toBe(4);

    });

    it('should increase page correctly', function () {
        scope.pages = 3;
        scope.current_page=0;
        scope.nextPage();
        expect(scope.current_page).toBe(1);
        scope.current_page= 2 ;
        scope.nextPage();
        expect(scope.current_page).toBe(scope.pages - 1);
    });
    it('should decrease page correctly', function () {
        scope.pages = 3;
        scope.current_page=0;
        scope.prevPage();
        expect(scope.current_page).toBe(0);
        scope.current_page= scope.pages - 1 ;
        scope.prevPage();
        expect(scope.current_page).toBe(scope.pages - 2);
    });


    it('should calculate the correct range', function () {
        scope.pages = 3;
        var result = scope.range();
        expect(result.length).toBe(3);
        scope.pages = 10;
        result = scope.range();
        expect(result.length).toBe(9);
        scope.pages = 20;
        scope.current_page=8;
        result = scope.range();
        expect(result.length).toBe(9);
        expect(result[0]).toBe(5);
        expect(result[8]).toBe(13);
        scope.current_page=19;
        result = scope.range();
        expect(result.length).toBe(9);
        expect(result[0]).toBe(11);
        expect(result[8]).toBe(19);

    });

    it('should disable prev and next', function () {
        scope.pages = 10;
        scope.current_page = 0;
        expect(scope.DisablePrevPage()).toBe('disabled');
        scope.current_page = 1;
        expect(scope.DisablePrevPage()).toBe('');
        expect(scope.DisableNextPage()).toBe('');
        scope.current_page = scope.pages -1;
        expect(scope.DisableNextPage()).toBe('disabled');
    });



});