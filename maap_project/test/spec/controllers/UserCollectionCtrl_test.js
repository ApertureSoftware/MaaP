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

describe('Controller: UsersCollectionCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        scope,
        location,
        $httpBackend;
    var data =[ [ 'ID', 'Email', 'Level' ],
        [ { _id: '510c35dd8fada716c89d0013', data: [Object] },
            { _id: '510c35dd8fada716c89d0014', data: [Object] },
            { _id: '510c35dd8fada716c89d0016', data: [Object] },
            { _id: '53b3fb845e8c8684127fa8a1', data: [Object] } ],
        { pages: 1 } ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;

        location = $location;

        MainCtrl = $controller('UsersCollectionCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });

    }));

    it('should set some data on the scope when successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/list').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/users/list?page=0&query=%7B%22method%22:%22GET%22%7D').respond(200, data);

        // When
        scope.getData();
        $httpBackend.flush();
        // Then
        expect(scope.pages).toBe(data[2].pages);
        expect(scope.labels[0]).toBe('ID');
        expect(scope.labels[1]).toBe('Email');
        expect(scope.labels[2]).toBe('Level');

        expect(scope.data[0]._id).toBe('510c35dd8fada716c89d0013');
        expect(scope.pages).toBe(data[2].pages);

    });

    it('should display an error when not successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/list?page=0&query=%7B%22method%22:%22GET%22%7D').respond(400);

        $httpBackend.whenGET('http://localhost:9000/api/users/list').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/404.html').respond(200);

        scope.getData();
        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should delete a document correctly', function () {
        // Given
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/userCollection.html').respond(200);

        $httpBackend.whenGET('http://localhost:9000/api/users/list').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/edit').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/users/list?page=0&query=%7B%22method%22:%22GET%22%7D').respond(200, data);


        // When
        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/users');


    });

    it('should display an error when the delete fails', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/list?page=0&query=%7B%22method%22:%22GET%22%7D').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/userCollection.html').respond(200);

        $httpBackend.whenGET('http://localhost:9000/api/users/list').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/edit').respond(400);


        // When
        scope.delete_document();
        $httpBackend.flush();
        // Then


    });


    it('should initialize data correctly', function () {

        var localcred = {
            email: '',
            pwd1: '',
            pwd2: ''
        };

        expect(scope.credentials).toEqual(localcred);

        expect(scope.current_sorted_column).toBe(null);
        expect(scope.current_sort).toBe(null);
        expect(scope.column_original_name.length).toBe(0);
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
    it('should change sort correctly', function () {
        scope.current_sort = "asc";
        scope.current_sorted_column = 0;

        scope.columnSort(1);
        expect(scope.current_sort).toBe("asc");
        expect(scope.current_sorted_column).toBe(1);
        scope.columnSort(1);
        expect(scope.current_sort).toBe("desc");
        scope.columnSort(1);
        expect(scope.current_sort).toBe("asc");

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
