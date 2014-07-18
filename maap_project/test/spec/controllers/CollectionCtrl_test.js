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

describe('Controller: CollectionCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        scope,
        location,
        $httpBackend;
    var data = [["Nome","Cognome"],[{"_id":"107c35dd8fada716c89d0014","data":{"name":"Walter","surname":"Mazzarri"}}],{"pages":1}]

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new(),
        $httpBackend = _$httpBackend_,
        location = $location;

        routeParams={};
        routeParams.col_id=0;
        routeParams.doc_id=0;

        MainCtrl = $controller('CollectionCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });

    }));

    it('should set  data on the scope when successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/collection/0?page=0').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        // When
        scope.getData();
        $httpBackend.flush();
        // Then
        expect(scope.pages).toBe(data[2].pages);
        expect(scope.labels[0]).toBe('Nome');
        expect(scope.labels[1]).toBe('Cognome');

        expect(scope.data[0]._id).toBe('107c35dd8fada716c89d0014');
        expect(scope.data[0].data).toEqual({"name":"Walter","surname":"Mazzarri"});
        expect(scope.pages).toBe(data[2].pages);

        expect(scope.column_original_name).toEqual(["name","surname"]);
        expect(scope.rows).toEqual([["Walter","Mazzarri"]]);


    });

    it('should display an error when not successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/collection/0?page=0').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/404.html').respond(200);


        // When
        //scope.loadData();
        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should delete a document correctly', function () {
        // Given
        $httpBackend.whenGET('views/collection.html').respond(200);

        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/collection/0?page=0').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/collection/0/edit').respond(200);


        // When
        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/collection/0');


    });

    it('should display an error when the delete fails', function () {
        // Given
        $httpBackend.whenGET('views/collection.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/collection/0?page=0').respond(200, data);
        $httpBackend.whenDELETE('http://localhost:9000/api/collection/0/edit').respond(400);


        // When
        scope.delete_document();
        $httpBackend.flush();
        // Then


    });


    it('should initialize data correctly', function () {
        expect(scope.current_sorted_column).toBe(null);
        expect(scope.current_sort).toBe(null);
        expect(scope.column_original_name.length).toBe(0);
        expect(scope.current_page).toBe(0);
        expect(scope.current_collection).toBe(routeParams.col_id);
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
